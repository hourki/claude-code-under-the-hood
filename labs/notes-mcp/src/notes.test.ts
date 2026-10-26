// Run with: npm test (after npm run build). Uses its own file, so your real notes are never touched.
import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { hasValidToken } from "./auth.js";
import { loadNotes, saveNotes } from "./notes.js";
import { isPinned } from "./pinned.js";

const testFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "notes.test.json");

test("a missing file means no notes", () => {
  rmSync(testFile, { force: true });
  assert.deepEqual(loadNotes(testFile), []);
});

test("notes survive a save and a load", () => {
  saveNotes([{ title: "groceries", text: "milk" }], testFile);
  assert.deepEqual(loadNotes(testFile), [{ title: "groceries", text: "milk" }]);
  rmSync(testFile);
});

test("only the exact bearer token passes", () => {
  assert.ok(hasValidToken("Bearer s3cret", "s3cret"));
  assert.ok(!hasValidToken("Bearer wrong!", "s3cret"));
  assert.ok(!hasValidToken("s3cret", "s3cret"));
  assert.ok(!hasValidToken(null, "s3cret"));
});

test("pinned notes are recognized by their title", () => {
  assert.ok(isPinned("pinned: wifi password"));
  assert.ok(isPinned("  Pinned groceries"));
  assert.ok(!isPinned("groceries (pinned)"));
});
