/**
 * Domain (cross-record) validation for the Canonical Assessment Record.
 *
 * This module checks invariants pure JSON Schema cannot express — mainly
 * "does this ID actually point at a record that exists in this document /
 * the document it targets". It does NOT re-check anything the JSON Schema
 * in schemas/ already enforces (required fields, enums, the human-reviewer
 * structural constraint, etc.) — the split between "structural validity"
 * (schemas/validate.js) and "cross-record validity" (this file) is
 * deliberate (docs/security/CANONICAL_ASSESSMENT_SCHEMA.md §22,
 * LUVIRA-ASA-009 §38-§39). Neither one performs Security Assessment
 * quality review (Root Cause correctness, Severity appropriateness, ...) —
 * that remains Human Review.
 */

/** @returns {string[]} error messages, empty when valid */
export function domainValidateAssessment(assessment) {
  const errors = [];
  const executionIds = new Set((assessment.executions ?? []).map((e) => e.execution_id));
  const evidenceIds = new Set((assessment.evidence ?? []).map((e) => e.evidence_id));

  for (const evidence of assessment.evidence ?? []) {
    if (!executionIds.has(evidence.source_execution_id)) {
      errors.push(
        `evidence '${evidence.evidence_id}' references source_execution_id '${evidence.source_execution_id}' which does not exist in this Assessment's executions[]`,
      );
    }
  }

  for (const finding of assessment.findings ?? []) {
    for (const evidenceId of finding.evidence_ids ?? []) {
      if (!evidenceIds.has(evidenceId)) {
        errors.push(
          `finding '${finding.finding_id}' references evidence_id '${evidenceId}' which does not exist in this Assessment's evidence[]`,
        );
      }
    }
    if (finding.assessment_id !== assessment.assessment_id) {
      errors.push(
        `finding '${finding.finding_id}' has assessment_id '${finding.assessment_id}' which does not match this Assessment's assessment_id '${assessment.assessment_id}' (existing Decision E: a Finding is owned by exactly one Assessment)`,
      );
    }
  }

  return errors;
}

/**
 * Cross-document check: does this Retest Execution Set correctly target an
 * existing Assessment and existing Findings within it? Requires both
 * documents since a Retest is its own Aggregate, reference-linked rather
 * than embedded (LUVIRA-ASA-008 §15).
 * @returns {string[]} error messages, empty when valid
 */
export function domainValidateRetest(retest, originalAssessment) {
  const errors = [];

  if (retest.original_assessment_id !== originalAssessment.assessment_id) {
    errors.push(
      `retest '${retest.retest_id}' original_assessment_id '${retest.original_assessment_id}' does not match the provided Assessment's assessment_id '${originalAssessment.assessment_id}'`,
    );
    return errors; // further checks would be meaningless against the wrong Assessment
  }

  const findingIds = new Set((originalAssessment.findings ?? []).map((f) => f.finding_id));
  for (const findingId of retest.target_finding_ids ?? []) {
    if (!findingIds.has(findingId)) {
      errors.push(
        `retest '${retest.retest_id}' target_finding_ids includes '${findingId}' which does not exist in the original Assessment's findings[]`,
      );
    }
  }

  const statusFindingIds = new Set((retest.finding_statuses ?? []).map((s) => s.finding_id));
  for (const findingId of retest.target_finding_ids ?? []) {
    if (!statusFindingIds.has(findingId)) {
      errors.push(
        `retest '${retest.retest_id}' target_finding_ids includes '${findingId}' but finding_statuses has no outcome recorded for it`,
      );
    }
  }

  const executionIds = new Set((retest.executions ?? []).map((e) => e.execution_id));
  for (const evidence of retest.evidence ?? []) {
    if (!executionIds.has(evidence.source_execution_id)) {
      errors.push(
        `retest '${retest.retest_id}' evidence '${evidence.evidence_id}' references source_execution_id '${evidence.source_execution_id}' which does not exist in this Retest Execution Set's own executions[] (Retest owns its own Executions/Evidence — LUVIRA-ASA-008 §15a, LUVIRA-ASA-009 §29)`,
      );
    }
  }

  return errors;
}
