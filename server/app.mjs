import express from "express";
import { randomBytes, randomUUID } from "node:crypto";
import {
  verifyPassword,
  tokenHash,
  sessionCookie,
  readSession,
} from "./auth.mjs";
import { validateListing, validateProfile } from "./validation.mjs";
const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});
const publicListing = (item) => {
  const { _id, ownerId, createdAt, updatedAt, status, ...listing } = item;
  return listing;
};
export function createApp({
  getDb,
  production = process.env.NODE_ENV === "production",
  origin = process.env.APP_ORIGIN || "http://localhost:5173",
}) {
  const app = express();
  app.disable("x-powered-by");
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    res.set("X-Content-Type-Options", "nosniff");
    next();
  });
  app.use("/api", (req, res, next) => {
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      req.get("origin") !== origin
    )
      return res.status(403).json({ error: "ORIGIN_REJECTED" });
    next();
  });
  app.use(express.json({ limit: "64kb" }));
  const attempts = new Map();
  const cleanup = setInterval(() => {
    for (const [key, value] of attempts)
      if (value.reset < Date.now()) attempts.delete(key);
  }, 60000);
  cleanup.unref();
  async function requireAdmin(req, res, next) {
    const token = readSession(req);
    if (!/^[a-f0-9]{64}$/.test(token))
      return res.status(401).json({ error: "UNAUTHORIZED" });
    const db = await getDb();
    const session = await db
      .collection("sessions")
      .findOne({ tokenHash: tokenHash(token), expiresAt: { $gt: new Date() } });
    const user =
      session &&
      (await db
        .collection("users")
        .findOne({ id: session.userId, role: "admin" }));
    if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });
    req.admin = user;
    req.db = db;
    next();
  }
  app.get("/api/health", async (_req, res) => {
    await (await getDb()).command({ ping: 1 });
    res.json({ ok: true });
  });
  app.post("/api/auth/login", async (req, res) => {
    const key = req.ip;
    const now = Date.now();
    let attempt = attempts.get(key);
    if (!attempt || attempt.reset < now) {
      attempt = { count: 0, reset: now + 15 * 60000 };
      attempts.set(key, attempt);
    }
    if (attempt.count >= 10)
      return res.status(429).json({ error: "TOO_MANY_ATTEMPTS" });
    attempt.count++;
    const { email, password } = req.body || {};
    if (
      typeof email !== "string" ||
      email.length > 254 ||
      typeof password !== "string" ||
      password.length > 1024
    )
      return res.status(400).json({ error: "VALIDATION" });
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ email: email.trim().toLowerCase(), role: "admin" });
    // A fixed dummy hash keeps the password work comparable for unknown accounts.
    const valid = await verifyPassword(
      password,
      user?.passwordHash ||
        "00000000000000000000000000000000:" + "00".repeat(64),
    );
    if (!user || !valid)
      return res.status(401).json({ error: "INVALID_LOGIN" });
    attempts.delete(key);
    const old = readSession(req);
    if (old)
      await db.collection("sessions").deleteOne({ tokenHash: tokenHash(old) });
    const token = randomBytes(32).toString("hex");
    await db
      .collection("sessions")
      .insertOne({
        tokenHash: tokenHash(token),
        userId: user.id,
        expiresAt: new Date(now + 8 * 3600000),
      });
    res.set("Set-Cookie", sessionCookie(token, production));
    res.json({ user: publicUser(user) });
  });
  app.post("/api/auth/logout", async (req, res) => {
    const token = readSession(req);
    if (token)
      await (
        await getDb()
      )
        .collection("sessions")
        .deleteOne({ tokenHash: tokenHash(token) });
    res.set("Set-Cookie", sessionCookie("", production, true));
    res.json({ ok: true });
  });
  app.get("/api/auth/me", requireAdmin, (req, res) =>
    res.json({ user: publicUser(req.admin) }),
  );
  app.patch("/api/admin/profile", requireAdmin, async (req, res) => {
    const profile = validateProfile(req.body);
    await req.db
      .collection("users")
      .updateOne({ id: req.admin.id }, { $set: profile });
    res.json({ user: publicUser({ ...req.admin, ...profile }) });
  });
  app.get("/api/listings", async (_req, res) => {
    const items = await (
      await getDb()
    )
      .collection("listings")
      .find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();
    res.json({ listings: items.map(publicListing) });
  });
  app.get("/api/admin/listings", requireAdmin, async (req, res) => {
    const items = await req.db
      .collection("listings")
      .find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();
    res.json({ listings: items.map(({ _id, ...item }) => item) });
  });
  app.post("/api/admin/listings", requireAdmin, async (req, res) => {
    const data = validateListing(req.body);
    const now = new Date();
    const listing = {
      ...data,
      id: `stay-${randomUUID()}`,
      host: req.admin.name,
      ownerId: req.admin.id,
      rating: 0,
      reviews: 0,
      createdAt: now,
      updatedAt: now,
    };
    await req.db.collection("listings").insertOne(listing);
    const { _id, ...item } = listing;
    res.status(201).json({ listing: item });
  });
  app.put("/api/admin/listings/:id", requireAdmin, async (req, res) => {
    const data = validateListing(req.body);
    const result = await req.db
      .collection("listings")
      .findOneAndUpdate(
        { id: req.params.id },
        {
          $set: { ...data, updatedAt: new Date() },
          ...(!data.modelId ? { $unset: { modelId: "" } } : {}),
        },
        { returnDocument: "after" },
      );
    if (!result) return res.status(404).json({ error: "NOT_FOUND" });
    const { _id, ...listing } = result;
    res.json({ listing });
  });
  app.delete("/api/admin/listings/:id", requireAdmin, async (req, res) => {
    const result = await req.db
      .collection("listings")
      .deleteOne({ id: req.params.id });
    if (!result.deletedCount)
      return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ ok: true });
  });
  app.use("/api", (_req, res) => res.status(404).json({ error: "NOT_FOUND" }));
  app.use((error, _req, res, _next) => {
    if (error.message === "VALIDATION" || error instanceof SyntaxError)
      return res.status(400).json({ error: "VALIDATION" });
    if (error.type === "entity.too.large")
      return res.status(413).json({ error: "PAYLOAD_TOO_LARGE" });
    // Do not send driver errors or connection strings to the browser or logs.
    res.status(503).json({ error: "SERVICE_UNAVAILABLE" });
  });
  return app;
}
