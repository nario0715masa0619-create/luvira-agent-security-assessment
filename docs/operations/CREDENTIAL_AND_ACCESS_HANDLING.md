# Customer Credential and Access Handling

Accept only access strictly required by the agreed scope. Prefer customer-created, temporary,
least-privilege, revocable test accounts. Agree secure transfer, approved storage, access owner,
logging/redaction, use boundaries, rotation/revocation, deletion, and exposure escalation per
engagement.

Never store secrets in Git, `.env`, ordinary documentation, reports, Findings, canonical Evidence,
logs, or debug output. Redact/minimize Evidence. This repository has no approved customer-secret
store; any credential-requiring engagement is **NOT READY** until an approved mechanism is selected
and recorded in the access plan.
