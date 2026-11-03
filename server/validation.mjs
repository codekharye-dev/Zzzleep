const countries = ["AZ", "TR", "US", "IT", "JP"];
const types = ["cabin", "villa", "apartment", "cottage", "tiny"];
const amenities = [
  "wifi",
  "parking",
  "pool",
  "kitchen",
  "ac",
  "fireplace",
  "bbq",
  "desk",
];
const models = [
  "baku",
  "gabala",
  "sheki",
  "ganja",
  "istanbul",
  "antalya",
  "izmir",
  "bursa",
  "austin",
  "san-diego",
  "chicago",
  "orlando",
];
function text(value, max = 200) {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new Error("VALIDATION");
  return value.trim();
}
function integer(value, min, max) {
  if (!Number.isInteger(value) || value < min || value > max)
    throw new Error("VALIDATION");
  return value;
}
function localized(value, max) {
  return Object.fromEntries(
    ["az", "en", "ru"].map((lang) => [lang, text(value?.[lang], max)]),
  );
}
export function validateListing(body) {
  if (
    !body ||
    !countries.includes(body.country) ||
    !types.includes(body.type) ||
    !["draft", "published"].includes(body.status)
  )
    throw new Error("VALIDATION");
  if (
    typeof body.price !== "number" ||
    !Number.isFinite(body.price) ||
    body.price < 1 ||
    body.price > 100000
  )
    throw new Error("VALIDATION");
  if (
    !Array.isArray(body.images) ||
    body.images.length < 1 ||
    body.images.length > 12
  )
    throw new Error("VALIDATION");
  const images = body.images.map((value) => {
    const url = text(value, 2000);
    if (!/^https:\/\//.test(url) && !/^\/images\/[a-zA-Z0-9_.-]+$/.test(url))
      throw new Error("VALIDATION");
    return url;
  });
  if (
    !Array.isArray(body.amenities) ||
    body.amenities.some((value) => !amenities.includes(value))
  )
    throw new Error("VALIDATION");
  if (!["AZN", "USD"].includes(body.currency)) throw new Error("VALIDATION");
  if (body.modelId && !models.includes(body.modelId))
    throw new Error("VALIDATION");
  return {
    title: localized(body.title, 180),
    description: localized(body.description, 5000),
    country: body.country,
    city: text(body.city),
    area: text(body.area),
    type: body.type,
    price: body.price,
    currency: body.currency,
    guests: integer(body.guests, 1, 50),
    bedrooms: integer(body.bedrooms, 0, 30),
    beds: integer(body.beds, 1, 50),
    amenities: [...new Set(body.amenities)],
    images,
    status: body.status,
    ...(body.modelId ? { modelId: body.modelId } : {}),
  };
}
export function validateProfile(body) {
  const name = text(body.name, 100);
  return { name };
}
