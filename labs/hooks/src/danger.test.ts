// Run with: npm test (after npm run build).
import assert from "node:assert/strict";
import { test } from "node:test";
import { findDanger } from "./danger.js";

test("blocks rm with recursive + force, in any spelling", () => {
  for (const cmd of ["rm -rf build", "rm -fr build", "rm -r -f build", "sudo rm -Rf /tmp/x", "/bin/rm --recursive --force x", "ls && rm -rf x"]) {
    assert.ok(findDanger(cmd), cmd);
  }
});

test("blocks a force push", () => {
  assert.ok(findDanger("git push --force origin main"));
  assert.ok(findDanger("git push -f"));
});

test("lets normal commands through", () => {
  for (const cmd of ["npm test", "rm notes.txt", "rm -r empty-dir", "git push origin main", "git push -u origin main", "grep -rf patterns.txt ."]) {
    assert.equal(findDanger(cmd), null, cmd);
  }
});
