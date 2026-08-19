import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

/**
 * JSON Schema (draft 2020-12) loader/compiler for the Canonical Assessment
 * Record (docs/security/CANONICAL_ASSESSMENT_SCHEMA.md, LUVIRA-ASA-008).
 * This module only builds structural validators — it never applies
 * cross-record/domain invariants (see domain-validate.js for that; the
 * split is intentional, LUVIRA-ASA-009 §39).
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemasDir = path.join(__dirname, "..", "schemas");

const MODULE_FILES = [
  "common.schema.json",
  "references.schema.json",
  "actor.schema.json",
  "scope.schema.json",
  "execution.schema.json",
  "evidence.schema.json",
  "finding.schema.json",
  "retest.schema.json",
  "assessment.schema.json",
];

function loadJson(file) {
  return JSON.parse(readFileSync(path.join(schemasDir, file), "utf8"));
}

function buildAjv() {
  // strictRequired is relaxed: Ajv's strict mode otherwise flags the
  // idiomatic `if/then: { required: [...] }` conditional-require pattern
  // (finalized_at / finalization_snapshot depend on lifecycle_state) as
  // suspicious purely because those properties are declared on the parent
  // schema, not re-declared inside the `then` branch. All other strict
  // checks (unknown keywords, type coercion, etc.) remain on.
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
  addFormats(ajv);
  for (const file of MODULE_FILES) {
    ajv.addSchema(loadJson(file));
  }
  return ajv;
}

let ajvInstance;
function getAjv() {
  if (!ajvInstance) ajvInstance = buildAjv();
  return ajvInstance;
}

/** Compiles (once, cached) and returns the Assessment root validator. */
export function getAssessmentValidator() {
  const ajv = getAjv();
  return ajv.getSchema("https://luvira.internal/asa/schemas/assessment.schema.json");
}

/** Compiles (once, cached) and returns the Retest Execution Set root validator. */
export function getRetestValidator() {
  const ajv = getAjv();
  return ajv.getSchema(
    "https://luvira.internal/asa/schemas/retest.schema.json#/$defs/retestExecutionSet",
  );
}

/** Validates a document against the Assessment root schema. Returns {valid, errors}. */
export function validateAssessment(doc) {
  const validator = getAssessmentValidator();
  const valid = validator(doc);
  return { valid, errors: valid ? [] : validator.errors };
}

/** Validates a document against the Retest Execution Set schema. Returns {valid, errors}. */
export function validateRetest(doc) {
  const validator = getRetestValidator();
  const valid = validator(doc);
  return { valid, errors: valid ? [] : validator.errors };
}
