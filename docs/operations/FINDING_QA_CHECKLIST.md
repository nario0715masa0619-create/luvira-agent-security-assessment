# ASA Finding QA Checklist

`FAILURE_OBSERVED` is not a Canonical Finding. Require: Execution Record → attributable, timestamped,
target-bound and sanitized Evidence → Finding Candidate → Human Review → QA → Canonical Finding.

- [ ] ID, target, Test Case and Execution Record are known
- [ ] Within authorization/RoE; no third-party or prohibited-test overreach
- [ ] Evidence is minimally sufficient, reproducible where possible, sanitized, and contains no secret
- [ ] Claim, observed behavior, conditions, limitations, and uncertainty match the Evidence
- [ ] Root Cause, Trust Boundary, and Authority/Permission impact are reviewed
- [ ] Business impact follows from demonstrated behavior; customer context is not exaggerated
- [ ] Severity and confidence are justified independently of Test Case family
- [ ] Remediation guidance addresses root cause, is bounded, and claims no guarantee/implementation
- [ ] Related/duplicate Findings are considered without discarding distinct Evidence
- [ ] Reviewer identity/time and finalization state are recorded

Outcome: **APPROVED_FOR_REPORT**, **RETURN_FOR_REVISION**, or **REJECTED_AS_FINDING**. Weak,
out-of-scope, unsafe, or unsupported Evidence fails closed. Assessor, Reviewer, and Finalizer actions
must be distinguishable; one person may hold multiple roles without claiming formal independence.
