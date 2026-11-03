import { getDb, closeDb } from "./db.mjs";
import { initializeAdmin } from "./initialize.mjs";
import { verifyPassword } from "./auth.mjs";
import { createServer } from "node:http";

if (process.env.VERCEL_ENV !== "production") {
  console.log("Database preflight skipped outside production.");
} else {
  let server;
  let createdId;
  let db;
  try {
    db = await getDb();
    await db.command({ping:1});
    await initializeAdmin(db);
    const user = await db.collection("users").findOne({email:process.env.ADMIN_EMAIL.trim().toLowerCase(),role:"admin"});
    if (!user || !await verifyPassword(process.env.ADMIN_PASSWORD,user.passwordHash)) throw Object.assign(new Error(),{code:"ADMIN_CREDENTIALS_MISMATCH"});
    const {default:handler} = await import("../api/index.mjs");
    server = createServer(handler);
    await new Promise((resolve,reject) => {server.once("error",reject);server.listen(0,"127.0.0.1",resolve);});
    const base = "http://127.0.0.1:" + server.address().port + "/api/index?__zzzlep_route=";
    const origin=process.env.APP_ORIGIN;
    const login=await fetch(base+"auth/login",{method:"POST",headers:{"Content-Type":"application/json",origin},body:JSON.stringify({email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD})});
    if(login.status!==200) throw Object.assign(new Error(),{code:"ROUTED_LOGIN_"+login.status});
    const cookie=login.headers.get("set-cookie")?.split(";")[0];
    if(!cookie) throw Object.assign(new Error(),{code:"SESSION_COOKIE_MISSING"});
    const request=(path,method="GET",data) => fetch(base+path,{method,headers:{"Content-Type":"application/json",origin,cookie},body:data ? JSON.stringify(data) : undefined});
    const me=await request("auth/me");
    if(me.status!==200 || (await me.json()).user?.role!=="admin") throw Object.assign(new Error(),{code:"SESSION_PROFILE_FAILED"});
    const label={az:"Sistem yoxlaması",en:"System check",ru:"Проверка системы"};
    const draft={title:label,description:label,country:"AZ",city:"Bakı",area:"System check",type:"apartment",price:100,currency:"AZN",guests:2,bedrooms:1,beds:1,amenities:["wifi"],images:["/images/interior-1.jpg"],status:"draft"};
    const created=await request("admin/listings","POST",draft);
    if(created.status!==201) throw Object.assign(new Error(),{code:"DRAFT_CREATE_"+created.status});
    createdId=(await created.json()).listing.id;
    const listed=await request("admin/listings");
    if(listed.status!==200 || !(await listed.json()).listings.some(item=>item.id===createdId)) throw Object.assign(new Error(),{code:"DRAFT_READBACK_FAILED"});
    const publicResponse=await request("listings");
    if(publicResponse.status!==200) throw Object.assign(new Error(),{code:"PUBLIC_LISTINGS_FAILED"});
    const publicItems=(await publicResponse.json()).listings;
    if(publicItems.some(item=>item.id===createdId)) throw Object.assign(new Error(),{code:"DRAFT_WAS_PUBLIC"});
    const expectedPublished=await db.collection("listings").find({status:"published"}).sort({createdAt:-1}).limit(500).toArray();
    if(expectedPublished.some(item=>!publicItems.some(published=>published.id===item.id))) throw Object.assign(new Error(),{code:"PUBLISHED_LISTING_MISSING"});
    const deleted=await request("admin/listings/"+createdId,"DELETE");
    if(deleted.status!==200) throw Object.assign(new Error(),{code:"DRAFT_DELETE_"+deleted.status});
    createdId=undefined;
    await request("auth/logout","POST");
    console.log("Production admin login, draft privacy, published catalog readback and draft CRUD passed.");
  } catch(error) {
    const category=/bad auth|authentication failed|scram/i.test(error?.message || "") ? "DATABASE_CREDENTIALS_REJECTED" : "PRODUCTION_CHECK_FAILED";
    console.error("Production preflight failed.",{category,name:error?.name,code:error?.code});
    process.exitCode=1;
  } finally {
    if(createdId && db) await db.collection("listings").deleteOne({id:createdId}).catch(()=>{});
    if(server) await new Promise(resolve=>server.close(resolve));
    await closeDb();
  }
}
