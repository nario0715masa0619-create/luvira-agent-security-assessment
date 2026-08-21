# Customer Access and Secret Provisioning

## Approved Customer #1 access model

Prefer, in order: customer-controlled test account/temporary access; customer-controlled
operator-assisted session; or a separately approved local secret backend. Long-lived shared
credentials are avoided. This repository has no approved secret backend or CLI implementation;
Windows Credential Manager is **not used or approved by this document**. Direct-secret testing stays
NOT READY until a separately approved mechanism exists.

## Non-secret access record

Record engagement ID, access handle/reference, account/service type, target, privilege description,
allowed use, expiry/revocation expectation, customer owner, approval date, status
ACTIVE/REVOKED/EXPIRED, and non-secret backend reference name. Never record the secret.

## Provisioning and use

Customer creates temporary, revocable, least-privilege access and transfers it only through an
engagement-agreed secure channel; never email/plain chat, Git, `.env`, repository files, reports,
Evidence, Findings, logs, or screenshots. Confirm target, purpose, tenant/role, write authority,
expiry, and third-party implications. Privilege exceeding the Test Plan is STOP. Production admin,
billing, irreversible-write, broad-tenant, external-message, and credential-management access are
high risk and require explicit Safety Precheck restrictions and customer approval.

Possession does not authorize an action: Authorization, RoE, Test Plan, third-party boundary, and
Safety Precheck still govern. Retrieve/use access only when needed; never print, log, digest,
serialize, or include it in error/provenance output. Missing, revoked, mismatched, unauthorized, or
unsupported access fails closed and the affected test is NOT READY.

## Closure and incident

At closure customer revokes/rotates temporary access, Luvira verifies removal where possible, and the
metadata record becomes REVOKED/EXPIRED. Failure to verify is an incident. Exposure requires STOP,
containment, customer notice, revocation/rotation, removal of exposed copies, incident record, and
required reauthorization before reuse. Legal/privacy obligations remain external review matters.
