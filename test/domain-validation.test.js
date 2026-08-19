import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { domainValidateAssessment, domainValidateRetest } from "../src/domain-validate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "..", "fixtures");

function loadFixture(...segments) {
  return JSON.parse(readFileSync(path.join(fixturesDir, ...segments), "utf8"));
}

describe("domain validation — cross-record invariants JSON Schema cannot express (LUVIRA-ASA-009 §38)", () => {
  it("accepts a valid, internally-consistent Assessment", () => {
    const doc = loadFixture("valid", "assessment-finalized.json");
    assert.deepEqual(domainValidateAssessment(doc), []);
  });

  it("accepts a valid Retest against its real original Assessment", () => {
    const assessment = loadFixture("valid", "assessment-finalized.json");
    const retest = loadFixture("valid", "retest-execution-set.json");
    assert.deepEqual(domainValidateRetest(retest, assessment), []);
  });

  it("rejects Evidence whose source_execution_id does not exist in the Assessment", () => {
    const doc = structuredClone(loadFixture("valid", "assessment-finalized.json"));
    doc.evidence[0].source_execution_id = "exec-does-not-exist";
    const errors = domainValidateAssessment(doc);
    assert.ok(errors.some((e) => e.includes("exec-does-not-exist")));
  });

  it("rejects a Finding referencing an evidence_id that does not exist in the Assessment", () => {
    const doc = structuredClone(loadFixture("valid", "assessment-finalized.json"));
    doc.findings[0].evidence_ids.push("ev-does-not-exist");
    const errors = domainValidateAssessment(doc);
    assert.ok(errors.some((e) => e.includes("ev-does-not-exist")));
  });

  it("rejects a Finding whose assessment_id does not match its owning Assessment (existing Decision E)", () => {
    const doc = structuredClone(loadFixture("valid", "assessment-finalized.json"));
    doc.findings[0].assessment_id = "asmt-some-other-assessment";
    const errors = domainValidateAssessment(doc);
    assert.ok(errors.some((e) => e.includes("does not match")));
  });

  it("rejects a Retest whose original_assessment_id does not match the provided Assessment", () => {
    const assessment = loadFixture("valid", "assessment-finalized.json");
    const retest = structuredClone(loadFixture("valid", "retest-execution-set.json"));
    retest.original_assessment_id = "asmt-wrong";
    const errors = domainValidateRetest(retest, assessment);
    assert.ok(errors.some((e) => e.includes("does not match")));
  });

  it("rejects a Retest targeting a Finding that does not exist in the original Assessment", () => {
    const assessment = loadFixture("valid", "assessment-finalized.json");
    const retest = structuredClone(loadFixture("valid", "retest-execution-set.json"));
    retest.target_finding_ids.push("find-does-not-exist");
    retest.finding_statuses.push({ finding_id: "find-does-not-exist", status: "INCONCLUSIVE" });
    const errors = domainValidateRetest(retest, assessment);
    assert.ok(errors.some((e) => e.includes("find-does-not-exist")));
  });

  it("rejects Retest Evidence pointing at an Execution outside the Retest's own executions[] (Retest owns its own records, LUVIRA-ASA-008 §15a)", () => {
    const assessment = loadFixture("valid", "assessment-finalized.json");
    const retest = structuredClone(loadFixture("valid", "retest-execution-set.json"));
    retest.evidence[0].source_execution_id = "exec-0001"; // belongs to the original Assessment, not this Retest
    const errors = domainValidateRetest(retest, assessment);
    assert.ok(errors.some((e) => e.includes("own executions")));
  });
});
