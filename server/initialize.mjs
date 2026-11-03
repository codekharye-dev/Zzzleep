import { randomUUID } from "node:crypto";
import { hashPassword } from "./auth.mjs";

export async function initializeAdmin(db, env = process.env) {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = env.ADMIN_PASSWORD;
  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !password ||
    password.length < 12
  ) {
    throw Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in your server environment.",
    );
  }
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("users").createIndex({ id: 1 }, { unique: true });
  await db
    .collection("sessions")
    .createIndex({ tokenHash: 1 }, { unique: true });
  await db
    .collection("sessions")
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection("listings").createIndex({ id: 1 }, { unique: true });
  await db.collection("listings").createIndex({ status: 1, createdAt: -1 });
  // Bootstrap only from server environment. Existing users/passwords/roles are never overwritten.
  const existing = await db.collection("users").findOne({ email });
  if (existing) return { created: false };
  const result = await db.collection("users").updateOne(
    { email },
    {
      $setOnInsert: {
        id: randomUUID(),
        email,
        name: env.ADMIN_NAME || "Zzzlep Admin",
        role: "admin",
        passwordHash: await hashPassword(password),
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );
  return { created: !!result.upsertedCount };
}
