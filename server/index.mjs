import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.mjs";
import { getDb, closeDb } from "./db.mjs";
const app = createApp({ getDb });
if (process.env.NODE_ENV === "production") {
  const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../dist",
  );
  app.use(express.static(root));
  app.get("/{*path}", (_req, res) =>
    res.sendFile(path.join(root, "index.html")),
  );
}
const server = app.listen(Number(process.env.PORT || 3001), "0.0.0.0", () =>
  console.log("Zzzlep API ready"),
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () =>
    server.close(async () => {
      await closeDb();
      process.exit(0);
    }),
  );
