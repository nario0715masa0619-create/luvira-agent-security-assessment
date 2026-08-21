# Rules of Engagement — ASA v1

This is an engagement-specific operational template, not a general infrastructure-pentest scope or
legal agreement. It is valid only with approved Authorization to Test.

## Scope and testing

Record included/excluded targets, environment, approved action-centric attack families, techniques,
tool invocation limits, prompt-injection/connector/permission tests, and data-access simulations.

## Safety rules

Prefer staging, test tenants, test accounts, dry-runs, and proof-of-action. By default prohibit
destructive writes, deletion, irreversible actions, payments, external-message delivery, account
lockout, broad extraction, credential rotation, and infrastructure mutation. Production/write steps
need separately explicit approval. Third-party systems are permitted only as stated in the
Authorization or must be simulated/excluded.

## Operations

Record test window, request/rate bounds, communication channel, contacts, stop conditions,
rollback owner, evidence capture/minimization, and per-engagement retention plan.
