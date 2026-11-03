import { getDb, closeDb } from './db.mjs';
import { initializeAdmin } from './initialize.mjs';
import { verifyPassword } from './auth.mjs';
// Production preflight checks the actual database without sharing the protected website.
if (process.env.VERCEL_ENV !== 'production') {
 console.log('Database preflight skipped outside production.');
} else {
 try {
  const db=await getDb();
  await db.command({ping:1});
  await initializeAdmin(db);
  const user=await db.collection('users').findOne({email:process.env.ADMIN_EMAIL.trim().toLowerCase(),role:'admin'});
  if (!user || !await verifyPassword(process.env.ADMIN_PASSWORD,user.passwordHash)) throw Object.assign(new Error(),{code:'ADMIN_CREDENTIALS_MISMATCH'});
  console.log('Production database ping, persisted admin and password verification passed.');
 } catch(error) {
  const category = /bad auth|authentication failed|scram/i.test(error?.message || '') ? 'DATABASE_CREDENTIALS_REJECTED' : /not authorized/i.test(error?.message || '') ? 'DATABASE_PERMISSIONS_REJECTED' : 'DATABASE_CONNECTION_FAILED';
  console.error('Production database preflight failed.',{category,name:error?.name,code:error?.code});
  process.exitCode=1;
 } finally {await closeDb();}
}
