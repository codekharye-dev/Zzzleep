import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../server/app.mjs";
import { initializeAdmin } from "../server/initialize.mjs";
import { hashPassword, verifyPassword } from "../server/auth.mjs";
import { validateListing } from "../server/validation.mjs";
const origin = "http://localhost:5173";
const sample = {
  title: { az: "Sınaq evi", en: "Test home", ru: "Дом" },
  description: { az: "Təsvir", en: "Description", ru: "Описание" },
  country: "AZ",
  city: "Bakı",
  area: "Mərkəz",
  type: "apartment",
  price: 100,
  currency: "AZN",
  guests: 2,
  bedrooms: 1,
  beds: 1,
  amenities: ["wifi"],
  images: ["/images/interior-1.jpg"],
  status: "draft",
};
function memoryDb() {
  const tables = new Map();
  const matches = (item, query) =>
    Object.entries(query).every(([k, v]) =>
      v?.$gt ? item[k] > v.$gt : item[k] === v,
    );
  return {
    tables,
    collection(name) {
      if (!tables.has(name)) tables.set(name, []);
      const rows = tables.get(name);
      return {
        async createIndex() { return "test-index"; },
        async findOne(q) {
          return rows.find((r) => matches(r, q));
        },
        async insertOne(item) {
          rows.push(structuredClone(item));
          return { insertedId: item.id };
        },
        async deleteOne(q) {
          const i = rows.findIndex((r) => matches(r, q));
          if (i < 0) return { deletedCount: 0 };
          rows.splice(i, 1);
          return { deletedCount: 1 };
        },
        async updateOne(q, update, options = {}) {
          const item = rows.find((r) => matches(r, q));
          if (!item && options.upsert) { rows.push({...q,...update.$setOnInsert}); return {upsertedCount:1}; }
          if (item) Object.assign(item, update.$set);
          return { modifiedCount: item ? 1 : 0 };
        },
        async findOneAndUpdate(q, update) {
          const item = rows.find((r) => matches(r, q));
          if (!item) return null;
          Object.assign(item, update.$set);
          for (const key of Object.keys(update.$unset || {})) delete item[key];
          return structuredClone(item);
        },
        find(q) {
          const result = rows.filter((r) => matches(r, q));
          return {
            sort() {
              return this;
            },
            limit() {
              return this;
            },
            async toArray() {
              return structuredClone(result);
            },
          };
        },
      };
    },
  };
}
test("admin session, permissions, draft visibility, publish, profile and logout", async (t) => {
  const db = memoryDb();
  await db
    .collection("users")
    .insertOne({
      id: "admin",
      email: "admin@example.com",
      name: "Admin",
      role: "admin",
      passwordHash: await hashPassword("test-password-123"),
    });
  const app = createApp({ getDb: async () => db, origin, production: true });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = "";
  const request = (path, method = "GET", data, extra = {}) =>
    fetch(base + "/api" + path, {
      method,
      headers: { origin, "Content-Type": "application/json", cookie, ...extra },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  assert.equal((await request("/admin/listings", "POST", sample)).status, 401);
  assert.equal(
    (
      await request("/auth/login", "POST", {
        email: "admin@example.com",
        password: "wrong",
      })
    ).status,
    401,
  );
  const login = await request("/auth/login", "POST", {
    email: "admin@example.com",
    password: "test-password-123",
  });
  assert.equal(login.status, 200);
  assert.match(
    login.headers.get("set-cookie"),
    /HttpOnly.*SameSite=Strict.*Secure/,
  );
  cookie = login.headers.get("set-cookie").split(";")[0];
  assert.equal(
    (
      await request("/admin/listings", "POST", sample, {
        origin: "https://evil.example",
      })
    ).status,
    403,
  );
  assert.equal(
    (await request("/admin/listings", "POST", { ...sample, price: -10 }))
      .status,
    400,
  );
  const created = await request("/admin/listings", "POST", {
    ...sample,
    ownerId: "attacker",
    role: "admin",
  });
  assert.equal(created.status, 201);
  const { listing } = await created.json();
  assert.equal(listing.ownerId, "admin");
  assert.equal(listing.role, undefined);
  assert.equal((await (await request("/listings")).json()).listings.length, 0);
  assert.equal(
    (
      await request("/admin/listings/" + listing.id, "PUT", {
        ...sample,
        status: "published",
      })
    ).status,
    200,
  );
  const published = (await (await request("/listings")).json()).listings;
  assert.equal(published.length, 1);
  assert.equal(published[0].ownerId, undefined);
  assert.equal(
    (await request("/admin/profile", "PATCH", { name: "Updated" })).status,
    200,
  );
  assert.equal((await (await request("/auth/me")).json()).user.name, "Updated");
  assert.equal(
    (await request("/admin/listings/" + listing.id, "DELETE")).status,
    200,
  );
  assert.equal((await (await request("/listings")).json()).listings.length, 0);
  assert.equal((await request("/auth/logout", "POST")).status, 200);
  assert.equal((await request("/auth/me")).status, 401);
});
test("offline database gives a bounded error without leaking credentials", async (t) => {
  const app = createApp({
    getDb: async () => {
      throw Error("mongodb+srv://private:secret@example");
    },
    origin,
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const response = await fetch(
    `http://127.0.0.1:${server.address().port}/api/listings`,
  );
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "SERVICE_UNAVAILABLE" });
});
test("validation rejects executable image URLs, unknown models and malformed localized text", () => {
  for (const invalid of [
    { images: ["javascript:alert(1)"] },
    { modelId: "missing" },
    { title: { az: "Only one language" } },
    { guests: 1.5 },
  ])
    assert.throws(() => validateListing({ ...sample, ...invalid }));
});

test('cold-start admin initialization is repeatable and preserves existing credentials and roles',async()=>{
 const db=memoryDb();
 const env={ADMIN_EMAIL:'Admin@Example.com',ADMIN_PASSWORD:'initial-password-123',ADMIN_NAME:'Owner'};
 assert.deepEqual(await initializeAdmin(db,env),{created:true});
 const original=await db.collection('users').findOne({email:'admin@example.com'});
 assert.equal(original.role,'admin');assert.equal(await verifyPassword(env.ADMIN_PASSWORD,original.passwordHash),true);
 assert.deepEqual(await initializeAdmin(db,{...env,ADMIN_PASSWORD:'changed-password-123'}),{created:false});
 assert.equal(db.tables.get('users').length,1);
 assert.equal(await verifyPassword(env.ADMIN_PASSWORD,original.passwordHash),true);
 await db.collection('users').insertOne({email:'member@example.com',role:'member',passwordHash:'unchanged'});
 await initializeAdmin(db,{...env,ADMIN_EMAIL:'member@example.com'});
 assert.equal((await db.collection('users').findOne({email:'member@example.com'})).role,'member');
 await assert.rejects(initializeAdmin(db,{...env,ADMIN_PASSWORD:'short'}));
});
