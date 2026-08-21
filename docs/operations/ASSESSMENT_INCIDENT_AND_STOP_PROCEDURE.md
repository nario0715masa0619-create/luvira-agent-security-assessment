# Assessment Incident and STOP Procedure

STOP immediately for unexpected production change, external side effect, out-of-scope sensitive-data
exposure, credential exposure, unbounded/high-cost action, third-party impact, account lockout,
customer stop request, scope uncertainty, instability, or unsafe evidence handling.

1. Stop active testing; do not continue to confirm.
2. Preserve only minimum necessary, redacted evidence.
3. Notify the named customer contact; record time, step, and observed impact.
4. Determine customer-owned rollback/action under the approved plan.
5. Resume only after required customer authorization and updated constraints.

ASA v1 does not assume managed remediation or customer change-management responsibility.
