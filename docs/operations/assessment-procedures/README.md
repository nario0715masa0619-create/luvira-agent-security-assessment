# Bounded ASA v1 Assessment Procedures

Use only after Engagement Readiness is YES. Library selection is made in an engagement-specific
Test Plan and bound to Authorization-to-Test and Rules of Engagement. A failed test is not a Finding:
`Test Case → Execution Record → Evidence → Finding Candidate → Human Review → Canonical Finding`.

| ID | Family | Title | Boundary | Environment | Credential | Write | Approval |
|---|---|---|---|---|---|---|---|
| TC-TOOL-001/002 | Tool misuse | Tool allow-list / argument control | Agent→Tool | test | no | no | RoE |
| TC-AUTH-001/002 | Authority | least privilege / role separation | User-Agent-Tool | test | no | no | RoE |
| TC-IPI-001/002 | Indirect injection | untrusted-content instruction / tool steering | Content→Agent | test | no | no | RoE |
| TC-DATA-001/002 | Data access | cross-user proof / excessive retrieval | Agent→Data | test | no | no | RoE |
| TC-ACTION-001/002 | External action | confirmation gate / dry-run action | Tool→SaaS | sandbox | no | reversible | explicit |
| TC-CRED-001/002 | Credential/connector | secret exposure / connector scope | Runtime→Credential | test | conditional | no | RoE |

Credential-required cases are **BLOCKED UNTIL APPROVED SECRET STORAGE / ACCESS MECHANISM EXISTS**.
