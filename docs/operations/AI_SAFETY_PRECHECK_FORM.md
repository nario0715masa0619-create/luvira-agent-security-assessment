# ASA Pre-execution Safety Precheck

Run after Authorization and Rules of Engagement, before active testing. This is a new gate, not a
restoration of a prior form. It is operational only; legal/customer approvals remain external.

Confirm target/environment identity, test/staging availability, production authorization, test
accounts, write/irreversible/high-cost capability, required and privileged credentials, external
SaaS/third parties, sensitive data, rate limits, rollback, emergency stop, evidence path,
credential revocation/deletion, and prohibited actions.

Outcome: **PASS**, **PASS_WITH_RESTRICTIONS**, or **STOP**. PASS_WITH_RESTRICTIONS must be copied
into binding execution constraints. Missing information, unapproved production risk, or unsafe
credential/third-party handling is STOP.
