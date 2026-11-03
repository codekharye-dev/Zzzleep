import { getDb, closeDb } from "./db.mjs";
import { initializeAdmin } from "./initialize.mjs";
try {
  const { created } = await initializeAdmin(await getDb());
  console.log(
    created ? "Admin created." : "Admin already exists; credentials unchanged.",
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
