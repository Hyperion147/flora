import assert from "node:assert/strict";
import test from "node:test";
import { createFallbackPid, isUniqueViolation, normalizePid } from "./pid.ts";

test("createFallbackPid creates a collision-resistant public PID", () => {
  assert.match(createFallbackPid(), /^P[A-F0-9]{12}$/);
});

test("normalizePid accepts non-empty string and number values", () => {
  assert.equal(normalizePid(1001), "1001");
  assert.equal(normalizePid(" FLR-123 "), "FLR-123");
  assert.equal(normalizePid(""), null);
  assert.equal(normalizePid(null), null);
});

test("isUniqueViolation detects postgres unique constraint errors", () => {
  assert.equal(isUniqueViolation({ code: "23505" }), true);
  assert.equal(isUniqueViolation({ code: "PGRST116" }), false);
  assert.equal(isUniqueViolation(null), false);
});

