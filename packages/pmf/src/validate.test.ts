import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validate, parse } from "./validate.js";

const fixtures = resolve(import.meta.dirname, "../../../");

function load(rel: string) {
  return JSON.parse(readFileSync(resolve(fixtures, rel), "utf8"));
}

test("valid: minimal", () => {
  assert.deepEqual(validate(load("examples/minimal.pmf")), { valid: true, errors: [] });
});

test("valid: synthwave example", () => {
  assert.deepEqual(validate(load("examples/synthwave-example.pmf")), { valid: true, errors: [] });
});

test("valid: with-harmony", () => {
  assert.deepEqual(validate(load("tests/valid/with-harmony.pmf")), { valid: true, errors: [] });
});

test("invalid: missing summary", () => {
  const result = validate(load("tests/invalid/missing-summary.pmf"));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.message.includes("summary")));
});

test("invalid: missing render_key", () => {
  const result = validate(load("tests/invalid/missing-render-key.pmf"));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.message.includes("render_key")));
});

test("invalid: missing identity fields", () => {
  const result = validate(load("tests/invalid/missing-identity-required.pmf"));
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 3);
});

test("invalid: wrong pmf_version", () => {
  const result = validate(load("tests/invalid/wrong-pmf-version.pmf"));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.message.includes("constant")));
});

test("parse: throws on bad JSON", () => {
  assert.throws(() => parse("not json"), /Invalid JSON/);
});

test("parse: throws on invalid PMF", () => {
  assert.throws(() => parse('{"pmf_version":"1.0"}'), /PMF validation failed/);
});

test("parse: returns typed object for valid input", () => {
  const raw = readFileSync(resolve(fixtures, "examples/minimal.pmf"), "utf8");
  const pmf = parse(raw);
  assert.equal(pmf.pmf_version, "1.0");
  assert.equal(pmf.identity.bpm, 120);
});
