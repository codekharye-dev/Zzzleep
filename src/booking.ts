const DAY_MS = 86_400_000;

/** The user's local calendar day, without converting it to another timezone. */
export function todayISO(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dayNumber(date: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NaN;
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== date
  )
    return NaN;
  return timestamp / DAY_MS;
}

export function addDays(date: string, days: number): string {
  const day = dayNumber(date);
  return Number.isFinite(day)
    ? new Date((day + days) * DAY_MS).toISOString().slice(0, 10)
    : "";
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const nights = dayNumber(checkOut) - dayNumber(checkIn);
  return Number.isFinite(nights) && nights > 0 ? nights : 0;
}

export function bookingPrice(price: number, checkIn: string, checkOut: string) {
  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = Math.round(price * nights * 100) / 100;
  const fee = Math.round(subtotal * 0.05 * 100) / 100;
  return {
    nights,
    subtotal,
    fee,
    total: Math.round((subtotal + fee) * 100) / 100,
  };
}

export type BookingError = "dates" | "past" | "order" | "guests";
export function validateBooking({
  checkIn,
  checkOut,
  guests,
  maxGuests,
  today = todayISO(),
}: {
  checkIn: string;
  checkOut: string;
  guests: number;
  maxGuests: number;
  today?: string;
}): BookingError | null {
  if (
    !Number.isFinite(dayNumber(checkIn)) ||
    !Number.isFinite(dayNumber(checkOut))
  )
    return "dates";
  if (checkIn < today) return "past";
  if (dayNumber(checkOut) <= dayNumber(checkIn)) return "order";
  if (!Number.isInteger(guests) || guests < 1 || guests > maxGuests)
    return "guests";
  return null;
}
