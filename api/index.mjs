import { forwardedApiUrl } from "../server/api-routing.mjs";
import { createApp } from "../server/app.mjs";
import { getDb } from "../server/db.mjs";
import { initializeAdmin } from "../server/initialize.mjs";
let initialization;
async function readyDb() {
  const db = await getDb();
  // Share initialization across concurrent requests in this function instance.
  if (!initialization)
    initialization = initializeAdmin(db).catch((error) => {
      initialization = undefined;
      throw error;
    });
  await initialization;
  return db;
}
const origin =
  process.env.APP_ORIGIN ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:5173");
const app = createApp({
  getDb: readyDb,
  origin,
  production:
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production",
});

export default function handler(req, res) {
  req.url = forwardedApiUrl(req.url || "/");
  const path = new URL(req.url, "http://localhost").pathname;
  res.once("finish", () => console.info("API request", {method:req.method,path,status:res.statusCode}));
  return app(req, res);
}
