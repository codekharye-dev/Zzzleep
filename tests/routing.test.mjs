import { test } from "node:test";
import assert from "node:assert/strict";
import { forwardedApiUrl } from "../server/api-routing.mjs";
test("Vercel rewrite preserves auth and nested listing endpoints", () => {
  assert.equal(forwardedApiUrl("/api/index?__zzzlep_route=auth/login"), "/api/auth/login");
  assert.equal(forwardedApiUrl("/api/index?__zzzlep_route=admin/listings/stay-123"), "/api/admin/listings/stay-123");
  assert.equal(forwardedApiUrl("/api/index?__zzzlep_route=health"), "/api/health");
});
test("direct requests and application query parameters remain intact", () => {
  assert.equal(forwardedApiUrl("/api/auth/me"), "/api/auth/me");
  assert.equal(forwardedApiUrl("/api/index?__zzzlep_route=listings&page=2"), "/api/listings?page=2");
  assert.equal(forwardedApiUrl("/api/index?__zzzlep_route=../secret"), "/api/invalid-route");
});
