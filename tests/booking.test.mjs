import test from "node:test";
import assert from "node:assert/strict";
import {
  bookingPrice,
  validateBooking,
  nightsBetween,
  addDays,
} from "../src/booking.ts";
import { listings, cities } from "../src/data.ts";
import { translations } from "../src/i18n.ts";
import { existsSync } from "node:fs";
const trip = {
  checkIn: "2027-05-10",
  checkOut: "2027-05-13",
  guests: 4,
  maxGuests: 4,
  today: "2027-05-01",
};
test("3-night stay includes exactly 5% service charge", () =>
  assert.deepEqual(bookingPrice(145, trip.checkIn, trip.checkOut), {
    nights: 3,
    subtotal: 435,
    fee: 21.75,
    total: 456.75,
  }));
test("dates handle leap years and midnight without timezone drift", () => {
  assert.equal(addDays("2028-02-28", 1), "2028-02-29");
  assert.equal(nightsBetween("2028-02-28", "2028-03-01"), 2);
});
test("rejects missing, malformed, past and reversed dates", () => {
  for (const value of ["", "2027-02-30", "bad-date"])
    assert.equal(validateBooking({ ...trip, checkIn: value }), "dates");
  assert.equal(validateBooking({ ...trip, checkIn: "2027-04-30" }), "past");
  assert.equal(validateBooking({ ...trip, checkOut: trip.checkIn }), "order");
  assert.equal(validateBooking({ ...trip, checkOut: "2027-05-09" }), "order");
});
test("guest count cannot exceed property capacity or be non-positive/fractional", () => {
  for (const guests of [0, -1, 1.5, 5])
    assert.equal(validateBooking({ ...trip, guests }), "guests");
  assert.equal(validateBooking(trip), null);
});
test("24 unique stays, 4 per destination, local photographs exist", () => {
  assert.equal(listings.length, 24);
  assert.equal(new Set(listings.map((l) => l.id)).size, 24);
  for (const city of cities)
    assert.equal(listings.filter((l) => l.city === city).length, 4);
  for (const l of listings) {
    assert.ok(l.images.length >= 3);
    for (const image of l.images)
      assert.ok(existsSync(new URL(`../public${image}`, import.meta.url)));
    for (const lang of ["az", "en", "ru"]) {
      assert.ok(l.title[lang]);
      assert.ok(l.description[lang]);
    }
  }
});
test("all interface translations have key parity", () => {
  for (const lang of ["en", "ru"])
    assert.deepEqual(
      Object.keys(translations[lang]).sort(),
      Object.keys(translations.az).sort(),
    );
});

test("five country collections contain 40 unique, localized stays", async () => {
  const { catalog, countries } = await import("../src/countries.ts");
  assert.equal(countries.length, 5);
  assert.equal(catalog.length, 40);
  assert.equal(new Set(catalog.map((l) => l.id)).size, 40);
  for (const country of countries) {
    assert.equal(
      catalog.filter((l) => l.country === country.code).length,
      country.code === "AZ" ? 24 : 4,
    );
    assert.ok(
      existsSync(new URL(`../public${country.image}`, import.meta.url)),
    );
  }
  for (const l of catalog) {
    for (const lang of ["az", "en", "ru"]) assert.ok(l.title[lang]);
  }
});
