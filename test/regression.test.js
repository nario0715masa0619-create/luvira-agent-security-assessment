import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateAssessment } from "../src/validate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemasDir = path.join(__dirname, "..", "schemas");

function loadSchema(file) {
  return JSON.parse(readFileSync(path.join(schemasDir, file), "utf8"));
}

describe("regression — schema never re-acquires prohibited fields (LUVIRA-ASA-009 §18, §38)", () => {
  it("Evidence schema has no severity/risk/root_cause/business_impact/remediation/finding_decision property", () => {
    const evidence = loadSchema("evidence.schema.json").$defs.evidence;
    const forbidden = ["severity", "risk", "root_cause", "business_impact", "remediation", "finding_decision"];
    for (const key of forbidden) {
      assert.ok(!(key in evidence.properties), `Evidence schema must not define '${key}'`);
    }
  });

  it("Scope schema has no field for storing an actual credential/token/secret value", () => {
    const scope = loadSchema("scope.schema.json").$defs.asExecutedScope;
    const forbidden = ["credential", "credential_value", "token", "password", "secret", "api_key"];
    for (const key of forbidden) {
      assert.ok(!(key in scope.properties), `Scope schema must not define '${key}'`);
    }
  });

  it("Finding schema has no Framework/OWASP/NIST/MITRE identifier field (existing Decision K)", () => {
    const finding = loadSchema("finding.schema.json").$defs.finding;
    const forbidden = ["owasp_id", "owasp", "nist_id", "mitre_id", "mitre_attack_id", "framework_mapping"];
    for (const key of forbidden) {
      assert.ok(!(key in finding.properties), `Finding schema must not define '${key}'`);
    }
  });

  it("Assessment root has no Report/Executive Summary/Customer-facing prose field (LUVIRA-ASA-009 §45)", () => {
    const assessment = loadSchema("assessment.schema.json");
    const forbidden = ["executive_summary", "report", "customer_explanation", "final_report"];
    for (const key of forbidden) {
      assert.ok(!(key in assessment.properties), `Assessment schema must not define '${key}'`);
    }
  });

  it("Finding Nature discriminator is present and closed to exactly the two documented values", () => {
    const finding = loadSchema("finding.schema.json");
    assert.deepEqual(finding.$defs.findingNature.enum, ["ATTACK_SUCCESS", "STRUCTURAL_CAPABILITY"]);
  });

  it("Execution Outcome is present and closed to exactly the four documented values", () => {
    const execution = loadSchema("execution.schema.json");
    assert.deepEqual(execution.$defs.executionOutcome.enum, ["COMPLETED", "BLOCKED", "ERRORED", "INCONCLUSIVE_EXECUTION"]);
  });

  it("Retest Finding Status is present and closed to exactly the four documented values", () => {
    const retest = loadSchema("retest.schema.json");
    assert.deepEqual(retest.$defs.retestFindingStatus.enum, ["RESOLVED", "STILL_PRESENT", "CHANGED", "INCONCLUSIVE"]);
  });

  it("Severity/Confidence remain a controlled string, not a closed enum (LUVIRA-ASA-009 §24 — do not silently promote the HIGH/MEDIUM/LOW candidate)", () => {
    const qualitativeLevel = loadSchema("finding.schema.json").$defs.qualitativeLevel;
    assert.equal(qualitativeLevel.type, "string");
    assert.equal("enum" in qualitativeLevel, false);
  });

  it("Assessment finalized_by, when present, is structurally constrained to actor_kind=HUMAN", () => {
    const doc = {
      schema_version: "1.0.0",
      assessment_id: "asmt-regression-1",
      lifecycle_state: "FINALIZED",
      created_at: "2026-08-15T08:00:00Z",
      finalized_at: "2026-08-15T09:00:00Z",
      as_executed_scope: { target: "regression check" },
      engagement_context_reference: { asset_id: "engagement-x", version: "v1" },
      canonical_source_references: [{ asset_id: "docs/security/ATTACK_TAXONOMY.md", version: "0ea014b5e87deb8459ffaf51dc2dfa8823d51675" }],
      executions: [],
      evidence: [],
      findings: [],
      actor_traceability: {
        finalized_by: { actor_id: "an-ai", actor_kind: "AI_AGENT" },
      },
      finalization_snapshot: {
        snapshot_id: "snap-1",
        assessment_id: "asmt-regression-1",
        schema_version: "1.0.0",
        finalized_at: "2026-08-15T09:00:00Z",
        engagement_context_reference: { asset_id: "engagement-x", version: "v1" },
        canonical_source_references: [{ asset_id: "docs/security/ATTACK_TAXONOMY.md", version: "0ea014b5e87deb8459ffaf51dc2dfa8823d51675" }],
      },
    };
    const result = validateAssessment(doc);
    assert.equal(result.valid, false, "an AI_AGENT finalized_by must be rejected (LUVIRA-ASA-008 §14)");
  });

  it("a Confirmed Finding (confirmed_at present) without a reviewer_actor_reference is rejected", () => {
    const doc = structuredClone(
      JSON.parse(readFileSync(path.join(__dirname, "..", "fixtures", "valid", "assessment-finalized.json"), "utf8")),
    );
    delete doc.findings[0].reviewer_actor_reference;
    const result = validateAssessment(doc);
    assert.equal(result.valid, false, "confirmed_at without reviewer_actor_reference must be rejected (LUVIRA-ASA-008 §10b)");
  });

  it("a Finding reviewer_actor_reference with actor_kind=AI_AGENT is rejected", () => {
    const doc = structuredClone(
      JSON.parse(readFileSync(path.join(__dirname, "..", "fixtures", "valid", "assessment-finalized.json"), "utf8")),
    );
    doc.findings[0].reviewer_actor_reference = { actor_id: "an-ai", actor_kind: "AI_AGENT" };
    const result = validateAssessment(doc);
    assert.equal(result.valid, false, "an AI_AGENT Finding reviewer must be rejected (LUVIRA-ASA-008 §10b)");
  });

  it("a non-FINALIZED Assessment claiming a finalization_snapshot is rejected", () => {
    const doc = structuredClone(
      JSON.parse(readFileSync(path.join(__dirname, "..", "fixtures", "valid", "assessment-finalized.json"), "utf8")),
    );
    doc.lifecycle_state = "UNDER_REVIEW";
    const result = validateAssessment(doc);
    assert.equal(result.valid, false, "non-FINALIZED Assessments must not carry a finalization_snapshot (LUVIRA-ASA-008 §16b)");
  });

  it("a FINALIZED Assessment containing a DRAFT Finding is rejected (CANONICAL_ASSESSMENT_RECORD.md §10a — no unresolved Draft Finding)", () => {
    const doc = structuredClone(
      JSON.parse(readFileSync(path.join(__dirname, "..", "fixtures", "valid", "assessment-finalized.json"), "utf8")),
    );
    delete doc.findings[1].confirmed_at;
    delete doc.findings[1].reviewer_actor_reference;
    doc.findings[1].lifecycle_state = "DRAFT";
    const result = validateAssessment(doc);
    assert.equal(result.valid, false, "a FINALIZED Assessment must not retain a DRAFT Finding");
  });

  it("a FINALIZED Assessment containing an INTERNAL_REVIEW Finding is rejected (review not yet complete)", () => {
    const doc = structuredClone(
      JSON.parse(readFileSync(path.join(__dirname, "..", "fixtures", "valid", "assessment-finalized.json"), "utf8")),
    );
    delete doc.findings[1].confirmed_at;
    delete doc.findings[1].reviewer_actor_reference;
    doc.findings[1].lifecycle_state = "INTERNAL_REVIEW";
    const result = validateAssessment(doc);
    assert.equal(result.valid, false, "a FINALIZED Assessment must not retain an INTERNAL_REVIEW Finding");
  });

  it("a FINALIZED Assessment without actor_traceability.finalized_by is rejected (Assessment Finalization requires a Human Actor)", () => {
    const doc = structuredClone(
      JSON.parse(readFileSync(path.join(__dirname, "..", "fixtures", "valid", "assessment-finalized.json"), "utf8")),
    );
    delete doc.actor_traceability.finalized_by;
    const result = validateAssessment(doc);
    assert.equal(result.valid, false, "a FINALIZED Assessment must record a Human finalizer");
  });

  it("a Finding at CONFIRMED lifecycle stage without confirmed_at is rejected", () => {
    const doc = structuredClone(
      JSON.parse(readFileSync(path.join(__dirname, "..", "fixtures", "valid", "assessment-finalized.json"), "utf8")),
    );
    delete doc.findings[0].confirmed_at;
    const result = validateAssessment(doc);
    assert.equal(result.valid, false, "a CONFIRMED (or later) Finding must record confirmed_at");
  });

  it("a Finding at DRAFT lifecycle stage carrying confirmed_at is rejected (semantic contradiction)", () => {
    const doc = structuredClone(
      JSON.parse(readFileSync(path.join(__dirname, "..", "fixtures", "valid", "assessment-draft.json"), "utf8")),
    );
    doc.findings = [
      {
        finding_id: "find-regression-draft-1",
        assessment_id: doc.assessment_id,
        finding_nature: "STRUCTURAL_CAPABILITY",
        evidence_ids: ["ev-regression-1"],
        root_cause: "regression fixture",
        trust_boundary_violations: ["Tool / Connector -> SaaS / DB / API"],
        authority_impact: ["Permission"],
        severity: "LOW",
        confidence: "LOW",
        remediation_recommendation: "n/a (regression fixture)",
        lifecycle_state: "DRAFT",
        created_at: "2026-08-04T13:00:00Z",
        confirmed_at: "2026-08-04T13:05:00Z",
        author_actor_reference: { actor_id: "operator-1", actor_kind: "AI_AGENT" },
      },
    ];
    const result = validateAssessment(doc);
    assert.equal(result.valid, false, "a DRAFT Finding must not carry confirmed_at");
  });
});
