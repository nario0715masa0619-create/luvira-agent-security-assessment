import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateAssessment, validateRetest } from "../src/validate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "..", "fixtures");

function loadFixture(...segments) {
  return JSON.parse(readFileSync(path.join(fixturesDir, ...segments), "utf8"));
}

const RETEST_FIXTURES = new Set(["retest-execution-set.json", "invalid-retest-status.json"]);

function validate(doc, filename) {
  return RETEST_FIXTURES.has(filename) ? validateRetest(doc) : validateAssessment(doc);
}

describe("schema validation — valid fixtures (LUVIRA-ASA-009 §37 A-E)", () => {
  const dir = path.join(fixturesDir, "valid");
  for (const filename of readdirSync(dir)) {
    it(`${filename} passes schema validation`, () => {
      const doc = loadFixture("valid", filename);
      const result = validate(doc, filename);
      assert.equal(result.valid, true, JSON.stringify(result.errors, null, 2));
    });
  }

  it("assessment-finalized.json demonstrates many-to-many Evidence<->Finding (§37 D)", () => {
    const doc = loadFixture("valid", "assessment-finalized.json");
    const sharedEvidenceId = "ev-0002";
    const findingsReferencingIt = doc.findings.filter((f) => f.evidence_ids.includes(sharedEvidenceId));
    assert.ok(findingsReferencingIt.length >= 2, "expected at least 2 Findings to share one Evidence item");
  });

  it("assessment-finalized.json includes both ATTACK_SUCCESS and STRUCTURAL_CAPABILITY findings", () => {
    const doc = loadFixture("valid", "assessment-finalized.json");
    const natures = new Set(doc.findings.map((f) => f.finding_nature));
    assert.ok(natures.has("ATTACK_SUCCESS"));
    assert.ok(natures.has("STRUCTURAL_CAPABILITY"));
  });

  it("assessment-finalized.json: every Finding is finalization-compatible (CONFIRMED, with confirmed_at and a HUMAN reviewer)", () => {
    const doc = loadFixture("valid", "assessment-finalized.json");
    for (const finding of doc.findings) {
      assert.ok(["CONFIRMED", "SEVERITY_ASSIGNED", "CUSTOMER_OUTPUT"].includes(finding.lifecycle_state));
      assert.ok(finding.confirmed_at);
      assert.equal(finding.reviewer_actor_reference.actor_kind, "HUMAN");
    }
  });

  it("assessment-finalized.json: the Assessment itself records a HUMAN finalizer", () => {
    const doc = loadFixture("valid", "assessment-finalized.json");
    assert.equal(doc.actor_traceability.finalized_by.actor_kind, "HUMAN");
  });

  it("assessment-zero-findings.json is FINALIZED with zero Findings but recorded Coverage (§37 C, §41)", () => {
    const doc = loadFixture("valid", "assessment-zero-findings.json");
    assert.equal(doc.lifecycle_state, "FINALIZED");
    assert.equal(doc.findings.length, 0);
    assert.ok(doc.executions.length > 0, "expected at least one recorded Execution as Coverage evidence");
  });

  it("retest-execution-set.json expresses different per-Finding status within one retest (§37 E, §42)", () => {
    const doc = loadFixture("valid", "retest-execution-set.json");
    const statuses = new Set(doc.finding_statuses.map((s) => s.status));
    assert.ok(statuses.size >= 2, "expected differing statuses across target Findings");
  });
});

describe("schema validation — invalid fixtures (LUVIRA-ASA-009 §37 F-M)", () => {
  const dir = path.join(fixturesDir, "invalid");
  for (const filename of readdirSync(dir)) {
    it(`${filename} fails schema validation`, () => {
      const doc = loadFixture("invalid", filename);
      const result = validate(doc, filename);
      assert.equal(result.valid, false, `expected ${filename} to be rejected but it validated successfully`);
      assert.ok(result.errors.length > 0);
    });
  }
});
