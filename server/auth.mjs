import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
export const tokenHash = (token) =>
  createHash("sha256").update(token).digest("hex");
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}
export async function verifyPassword(password, stored) {
  if (
    typeof stored !== "string" ||
    typeof password !== "string" ||
    password.length > 1024
  )
    return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = await scrypt(password, salt, 64);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function sessionCookie(token, production, clear = false) {
  return `zzzlep-session=${clear ? "" : token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${clear ? 0 : 28800}${production ? "; Secure" : ""}`;
}
export function readSession(req) {
  return (
    (req.headers.cookie || "")
      .split(";")
      .map((x) => x.trim())
      .find((x) => x.startsWith("zzzlep-session="))
      ?.slice("zzzlep-session=".length) || ""
  );
}
