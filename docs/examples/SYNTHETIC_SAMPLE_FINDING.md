# SYNTHETIC SAMPLE — FOR ILLUSTRATION ONLY

## ASA-FND-SAMPLE-001: Untrusted content could steer a write-capable tool without confirmation

**Synthetic scenario:** a harmless test document attempted to redirect an agent from a trusted task to
a sandbox write-capable connector. **Synthetic Evidence:** an approved dry-run record showed the tool
selection changed while no confirmation boundary appeared. No customer system, credential, or real
data was used.

**Severity:** MEDIUM (synthetic illustrative value only; based on an unintended external-action path
demonstrated in a sandbox dry-run, not a confirmed data or tenant impact; final severity requires
human review against the actual engagement context). **Confidence:** MEDIUM (synthetic illustrative
value only; based on a single dry-run observation described above, not yet independently reproduced;
final confidence requires evidence review and human QA per
[Finding QA Checklist](../operations/FINDING_QA_CHECKLIST.md)). Neither value is determined by AI
alone; no AI assistance is assumed in drafting this synthetic sample.

**Root Cause candidate:** untrusted-content instructions were not isolated from tool-selection policy.
**Trust Boundary:** external content → agent → tool. **Authority impact:** unintended External Action.
**Business impact hypothesis:** if reproduced in a customer-authorized environment, a user-controlled
or retrieved document could influence an action beyond intended workflow. This is not evidence of
full tenant compromise.

**Remediation guidance:** separate trusted instructions from retrieved content, constrain tool
selection, and require confirmation for write-capable actions. **Limitations:** synthetic example;
severity, confidence, and customer applicability require human review. **Retest:** new, separately
scoped execution/evidence; do not overwrite this historical Finding.
