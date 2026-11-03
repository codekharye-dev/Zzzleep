import { randomUUID } from "node:crypto";
import { hashPassword } from "./auth.mjs";
import { getDb, closeDb } from "./db.mjs";
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
try {
  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !password ||
    password.length < 12
  )
    throw Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in your server environment.",
    );
  const db = await getDb();
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
  const result = await db
    .collection("users")
    .updateOne(
      { email },
      {
        $setOnInsert: {
          id: randomUUID(),
          email,
          name: process.env.ADMIN_NAME || "Zzzlep Admin",
          role: "admin",
          passwordHash: await hashPassword(password),
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
  console.log(
    result.upsertedCount
      ? "Admin created."
      : "Admin already exists; credentials unchanged.",
  );
} catch (error) {
  console.error(
    error.message.startsWith("Set ")
      ? error.message
      : "Admin setup failed. Check server database configuration.",
  );
  process.exitCode = 1;
} finally {
  await closeDb();
}
