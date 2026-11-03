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

test("five country collections preserve 40 stays and add 12 modeled demo homes", async () => {
  const { catalog, countries } = await import("../src/countries.ts");
  assert.equal(countries.length, 5);
  assert.equal(catalog.length, 52);
  assert.equal(new Set(catalog.map((l) => l.id)).size, 52);
  for (const country of countries) {
    assert.equal(
      catalog.filter((l) => l.country === country.code).length,
      country.code === "AZ" ? 28 : ["TR", "US"].includes(country.code) ? 8 : 4,
    );
    assert.ok(
      existsSync(new URL(`../public${country.image}`, import.meta.url)),
    );
  }
  for (const l of catalog) {
    for (const lang of ["az", "en", "ru"]) assert.ok(l.title[lang]);
  }
});

test("review-backed ratings are consistent and include excellent and average homes", async () => {
  const { catalog } = await import("../src/countries.ts");
  const { getListingReviews, analyzeReviews } =
    await import("../src/reviews.ts");
  const authors = new Set();
  for (const listing of catalog) {
    const reviews = getListingReviews(listing.id);
    const summary = analyzeReviews(reviews);
    assert.equal(summary.count, listing.reviews);
    assert.equal(summary.average, listing.rating);
    assert.equal(new Set(reviews.map((r) => r.author)).size, reviews.length);
    assert.equal(new Set(reviews.map((r) => r.text.az)).size, reviews.length);
    assert.equal(typeof listing.host, "string");
    for (const r of reviews) {
      authors.add(r.author);
      assert.ok(r.rating >= 1 && r.rating <= 5);
      for (const lang of ["az", "en", "ru"]) assert.ok(r.text[lang]);
    }
  }
  assert.ok(authors.size >= 16);
  assert.ok(catalog.some((l) => l.rating < 3.5));
  assert.ok(catalog.some((l) => l.rating >= 4.7));
});
test("review summary counts and citations only use actual source reviews", async () => {
  const { getListingReviews, analyzeReviews } =
    await import("../src/reviews.ts");
  const { summarizeReviews } = await import("../src/reviewSummary.ts");
  const reviews = getListingReviews("quba-01"),
    summary = analyzeReviews(reviews);
  assert.equal(summary.criticalCount, 4);
  assert.equal(summary.average, 3.17);
  assert.equal(
    summary.distribution.reduce((sum, row) => sum + row.count, 0),
    reviews.length,
  );
  for (const bucket of ["positive", "negative"])
    for (const topic of summary[bucket]) {
      assert.equal(topic.count, topic.reviewIds.length);
      for (const id of topic.reviewIds)
        assert.ok(
          reviews
            .find((r) => r.id === id)
            .mentions.some(
              (m) => m.topic === topic.topic && m.sentiment === bucket,
            ),
        );
    }
  for (const lang of ["az", "en", "ru"])
    for (const mode of ["summary", "liked", "concerns", "reasons", "fit"]) {
      const reply = summarizeReviews(reviews, lang, mode);
      assert.ok(reply.text);
      for (const id of reply.evidenceIds)
        assert.ok(reviews.some((r) => r.id === id));
    }
  assert.equal(
    summarizeReviews(reviews, "az", "summary", "Marsda hava necədir?")
      .evidenceIds.length,
    0,
  );
});

test("experience data has localized activities, valid menus and exact USD totals", async () => {
  const {
    experiences,
    experienceCountries,
    experienceTotal,
    validateExperienceSelection,
  } = await import("../src/experiences.ts");
  assert.equal(experiences.length, 8);
  assert.equal(experienceCountries.length, 6);
  assert.equal(new Set(experiences.map((e) => e.id)).size, 8);
  for (const e of experiences) {
    assert.ok(existsSync(new URL(`../public${e.hero}`, import.meta.url)));
    assert.equal(
      e.steps.reduce((sum, s) => sum + s.minutes, 0),
      e.duration,
    );
    assert.ok(e.maxGuests >= 2);
    assert.ok(e.price > 0);
    for (const lang of ["az", "en", "ru"]) {
      assert.ok(e.title[lang]);
      assert.ok(e.description[lang]);
    }
    for (const d of e.menu || []) {
      assert.ok(existsSync(new URL(`../public${d.image}`, import.meta.url)));
      for (const lang of ["az", "en", "ru"]) {
        assert.ok(d.name[lang]);
        assert.ok(d.description[lang]);
      }
    }
  }
  const china = experiences.find((e) => e.id === "beijing-wok"),
    sheki = experiences.find((e) => e.id === "sheki-cable");
  assert.equal(china.price, 200);
  assert.equal(experienceTotal(china, 3), 600);
  assert.equal(sheki.price, 23);
  assert.equal(sheki.concept, true);
  assert.equal(experienceTotal(sheki, 2), 46);
  const selection = {
    date: "2027-05-10",
    time: "14:00",
    people: 2,
    today: "2027-05-01",
    nowMinutes: 600,
  };
  assert.equal(validateExperienceSelection(china, selection), null);
  assert.equal(
    validateExperienceSelection(china, { ...selection, date: "2027-02-30" }),
    "dateError",
  );
  assert.equal(
    validateExperienceSelection(china, { ...selection, date: "2020-01-01" }),
    "dateError",
  );
  assert.equal(
    validateExperienceSelection(china, { ...selection, time: "99:99" }),
    "timeError",
  );
  assert.equal(
    validateExperienceSelection(china, { ...selection, people: 9 }),
    "peopleError",
  );
  assert.equal(
    validateExperienceSelection(china, {
      ...selection,
      date: "2027-05-01",
      time: "10:00",
      nowMinutes: 660,
    }),
    "sameDayError",
  );
});
