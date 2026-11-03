import type { Listing } from "./data.ts";
// Indicative USD/AZN rate for comparing the demo catalog; this is not a live FX quote.
export function priceInAZN(
  listing: Pick<Listing, "price" | "currency">,
): number {
  return listing.currency === "USD" ? listing.price * 1.7 : listing.price;
}
