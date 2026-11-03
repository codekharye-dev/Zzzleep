import { MongoClient } from "mongodb";
let client;
let connection;
export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri || /<db_username>|<db_password>/.test(uri))
    throw new Error("DATABASE_NOT_CONFIGURED");
  // One long-running API process reuses one driver pool; retain driver defaults until workload is measured.
  if (!connection) {
    client = new MongoClient(uri);
    connection = client.connect().catch(async (error) => {
      await client.close().catch(() => {});
      connection = undefined;
      throw error;
    });
  }
  return (await connection).db(process.env.MONGODB_DB || "zzzlep");
}
export async function closeDb() {
  if (client) await client.close();
}
