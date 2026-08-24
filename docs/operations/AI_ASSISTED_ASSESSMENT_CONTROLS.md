# AI-assisted Assessment Controls

## Purpose

Luvira ASA may use AI internally to assist assessment work. AI output is never treated as final
assessment truth: it is Candidate/Draft material only, and it becomes a customer-facing Finding only
after Evidence check, Human Review, and QA.

## Scope

Applies to AI used internally by Luvira during: intake analysis, risk hypothesis generation, test
planning assistance, execution note organization, Finding draft preparation, report drafting, and
remediation guidance drafting. It does not govern the AI Agent under assessment (the customer's
system), which is covered by the Threat Model, Attack Taxonomy, and Test Case Library.

## Core Rule

AI-generated output is **Finding Candidate / Draft Finding** material, not a Canonical Finding. It
must not become a customer-facing Finding, Severity, conclusion, or assurance without Evidence and
Human Review. Where this document says "Candidate," it means the same pre-Finding stage already
defined in [Finding QA](FINDING_QA_CHECKLIST.md) and the
[Execution Record Template](assessment-procedures/EXECUTION_RECORD_TEMPLATE.md)
("Execution Record → Evidence → Finding Candidate → Human Review → QA → Canonical Finding") — no new
or conflicting term is introduced.

## Allowed AI Uses

AI may assist with:
- summarizing customer-provided intake information
- organizing architecture / tool / connector descriptions
- suggesting risk hypotheses
- suggesting assessment questions
- suggesting test case selection candidates
- drafting execution notes
- drafting Finding language
- drafting remediation guidance language
- drafting report sections

These are assistance functions only; none of them produces a final, customer-facing artifact by
itself.

## Prohibited AI Uses

AI must not:
- make the final Finding decision
- make the final Severity decision
- make the final Confidence decision
- declare a system safe
- claim complete risk discovery
- approve execution against customer environments
- decide production-impacting activity
- authorize use of credentials/secrets
- create or retain raw customer secrets
- create unsupported customer-facing claims
- finalize report delivery without Human QA

## Required Review Flow

1. AI-assisted draft or hypothesis
2. Evidence check
3. Human assessment review
4. Finding / No Finding / Unknown decision
5. QA before delivery ([Finding QA Checklist](FINDING_QA_CHECKLIST.md))
6. Customer-facing report generation ([Customer Report Template](CUSTOMER_REPORT_TEMPLATE.md))

No Evidence means no Finding. Not tested is marked Unknown/Not Tested, matching the existing
`NOT_EXECUTED`/`INCONCLUSIVE` outcomes. Ambiguous evidence must not be overstated. An observed failure
that is not risk-significant does not get forced into a Finding — this mirrors the existing rule that
`FAILURE_OBSERVED` is not a confirmed Finding. A Human reviewer may use AI assistance for wording but
remains responsible for the final content.

## Evidence Requirements

Any customer-facing Finding, whether AI-assisted or not, must be backed by adequate Evidence per
[Evidence Quality Rules](assessment-procedures/EVIDENCE_QUALITY_RULES.md): observed behavior, an
Execution Record, and supporting material (screenshot/log/configuration excerpt/trace/customer-
confirmed fact) as appropriate to the claim, within the agreed scope, with limitations stated where
needed. No single evidence type is mandatory in every case; the evidence must be sufficient for the
specific claim made.

## Hallucination Controls

- AI-generated statements are checked against source materials before use.
- AI must not invent customer architecture, tool access, permissions, credentials, logs, or incidents.
- Information not established by Evidence remains Unknown.
- AI-generated remediation guidance is reviewed for feasibility and scope before inclusion.
- Customer-facing text is reviewed against [Sales Claims and Boundaries](../commercial/SALES_CLAIMS_AND_BOUNDARIES.md)
  for prohibited claims.
- Evidence references are cited in reports where applicable, consistent with the
  [Customer Report Template](CUSTOMER_REPORT_TEMPLATE.md).

## Customer Disclosure

Customer-safe language: "Luvira may use AI tools to assist with organization, drafting, and analysis,
but final assessment judgments and customer-facing Findings are reviewed and approved by a human
assessor." This document does not claim the assessment is AI-free, does not claim AI output can never
be wrong, and does not claim hallucination is impossible.

## Relation to Existing Documents

This document adds an AI-use boundary on top of the existing review chain; it does not replace or
narrow it. Aligned with:
- [Evidence Quality Rules](assessment-procedures/EVIDENCE_QUALITY_RULES.md)
- [Finding QA Checklist](FINDING_QA_CHECKLIST.md)
- [Customer Report Template](CUSTOMER_REPORT_TEMPLATE.md)
- [Assessment Delivery Checklist](ASSESSMENT_DELIVERY_CHECKLIST.md)
- [Sales Claims and Boundaries](../commercial/SALES_CLAIMS_AND_BOUNDARIES.md)

## Non-goals

This document does not define a fully automated scanner, autonomous assessment execution, runtime
monitoring, an AI Gateway, customer environment modification, managed remediation, or a certification
guarantee.
