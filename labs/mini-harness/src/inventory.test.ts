// Run with: npm test (after npm run build). No API call.
import assert from "node:assert/strict";
import { test } from "node:test";
import { lookupService } from "./inventory.js";

test("finds a service by name", () => {
  assert.deepEqual(lookupService("search"), { name: "search", status: "healthy", version: "1.9.0" });
});

test("returns undefined for an unknown service", () => {
  assert.equal(lookupService("billing"), undefined);
});
