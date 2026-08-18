# LUVIRA-ASA-008 Canonical Assessment Record Schema — Luvira Agent Security Assessment

Status: Draft（Concept / Logical Schema Specification、承認済みDecisionを含む）
Baseline: Phase 0 Product Definition（commit `97fbb1d036f3beb5d3d25676e16d1ffe7fa39cdf`）、
Phase 1 Commercial-first Threat Model（commit `029cb451d66e52f12cb0faeb179f9a5dfd807802`）、
Phase 2 Minimal Attack Taxonomy（commit `0ea014b5e87deb8459ffaf51dc2dfa8823d51675`）、
LUVIRA-ASA-005 Finding Model Concept（commit `e8c439980e91a3a7279e653baac9446df039e414`）、
LUVIRA-ASA-006 Assessment Output Model Concept（commit `8990051f138d9f5c0bea99d1b946980652e58701`）、
LUVIRA-ASA-007 Canonical Assessment Record Concept（commit `ef2c47c42ea476d0911bea2c9f15dd9b88249653`）

凡例: **[Fact]** 検証済み事実 / **[Hypothesis]** 未検証仮説 / **[Decision]** 人間承認済み決定 /
**[Open Question]** 人間の判断待ち

本文書はCanonical Assessment RecordのEntity semantics / relationships / identity /
cardinality / constraints / snapshot model / traceabilityを定義する
**Conceptual / Logical Schema Specification** である。JSON Schema / TypeScript
type / Python model / Database schema / ORM / API / Persistence実装ではない。
それらは後続Phaseで別途設計する（19章参照）。

---

## 1. Purpose

**[Decision]** 本文書は **LUVIRA-ASA-008 Canonical Assessment Record Schema**
として、007で確定したAggregate Conceptを、実装可能なSchemaへ落とし込む前段階の
意味論（Entity/Value Object/Reference/Relationship/Cardinality/Identity/
Version/Constraint）を確定する。

**[Fact]** 本文書はCLAUDE.md / PRODUCT_DEFINITION.md / THREAT_MODEL.md /
ATTACK_TAXONOMY.md / FINDING_MODEL.md / ASSESSMENT_OUTPUT_MODEL.md /
CANONICAL_ASSESSMENT_RECORD.md の既存Decisionを変更しない。

---

## 2. Existing Decisions

**[Fact]** 007までの全Decision（A〜X、26項目）はそのまま維持される。本文書は
それらをSchema semanticsへ具体化するものであり、再定義ではない。主要な
再確認事項は各章で個別に参照する。

---

## 3. Entity Model

**[Decision]** Canonical Assessment Record = Logical Aggregate。

| 分類 | 対象 |
|---|---|
| 主要Entity（Assessment Aggregate内） | Assessment / Execution / Evidence / Finding |
| 独立Aggregate | Retest Execution Set |
| Value Object | Scope Snapshot（Assessment所有）、Retest Scope Snapshot（Retest Execution Set所有） |
| Reference | Engagement Context / Attack Candidate / Assessment Method / Business Impact / Crosswalk / Canonical Source / Actor |

---

## 4. Identity（Revised Decision）

**[Decision（修正済み）]** MVPでは以下すべてを **opaque + globally unique
machine identity** とする:

- Assessment
- Execution
- Evidence
- Finding
- Retest Execution Set

**[Fact]** 前回Design Reviewの「Execution = Assessment-local ID」案は撤回する。
理由: composite reference回避、Retestからの参照簡潔化、Persistence方式非依存、
将来のmachine-readable export容易化、実装コスト差がほぼないため。

**[Decision]** IDへ以下を埋め込まない: customer name / date / severity /
project name / environment / その他semantic meaning。

**[Decision]** Human-readable identifier / labelが必要な場合は、machine
identityとは別のValue Objectとして持つ（relationshipには使わない）。

**[Decision]** 具体的なUUID / ULID等の形式は本文書では確定しない（NEXT）。

---

## 5. Aggregate Structure

**[Decision]** Logical Structure（Serialization Structureとは区別する）:

```
Assessment
  identity
  display label / description（任意）
  lifecycle state
  as-executed scope（Value Object）
  engagement context reference（versioned）
  canonical source references（versioned）
  optional crosswalk reference（versioned）
  executions
  evidence
  findings
  actor traceability
  created_at / finalized_at
  finalization snapshot identity/reference

Retest Execution Set（独立Aggregate Root）
  retest identity
  original Assessment reference（非所有）
  target Finding references
  retest as-executed scope（Value Object）
  executions
  evidence
  per-Finding technical status
  retested_at
  actor traceability
```

**[Fact]** これは巨大nested JSONを意味しない。Logical ownershipを示すのみ。

---

## 6. Scope

### 6a. Scope Semantics

**[Decision]** Scopeは二層。

- **Agreed Scope**: Engagement Context側のCanonical。AssessmentはREFERENCE
  （versioned）のみを持つ。
- **As-executed Scope**: AssessmentがOWNするValue Object。

**[Decision]** As-executed Scopeの最低限概念: target / environment /
components / trust boundaries / tools / connectors / permission・credential
surfaceの**記述**（実値は絶対に含めない） / selected Attack Candidates /
exclusions / execution constraints。

### 6b. Scope Snapshot Identity

**[Decision]** Scope SnapshotはMVPでは独立Entity化しない。Assessment-owned
Value Objectであり、独立identityを持たない。Versionは Assessment
Finalization Snapshot（15章）により固定される。

---

## 7. Execution

**[Decision]** Executionはglobally unique identityを持つEntity。

**[Decision]** 最低限意味論: execution identity / parent Assessment
reference / Attack Candidate reference / optional Assessment Method
reference / target・context / execution outcome（8章） / `executed_at` /
actor reference / safety constraint context / Evidence relationships。

**[Fact]** ExecutionはFindingではない。

---

## 8. Execution Outcome

**[Decision]** Execution Outcome概念を正式採用する。MVP候補:

| 値 | 意味 |
|---|---|
| `COMPLETED` | 計画したAssessment actionが必要な観測点まで実施された |
| `BLOCKED` | Target またはSafety Control等により計画したActionが成立・進行しなかった。**注意: BLOCKED＝安全を自動的に意味しない** |
| `ERRORED` | 技術エラーによりAssessmentとして必要な実行が完了しなかった |
| `INCONCLUSIVE_EXECUTION` | 実行は行われたが、Evidence不足等で結果を明確に分類できない |

**[Decision]** Security Findingの有無とは完全に別軸として扱う。

---

## 9. Evidence

**[Decision]** Evidenceはglobally unique identityを持つCanonical Entity
（事実の記録）。

**[Decision]** 最低限意味論: evidence identity / source Execution / 
`observed_at` / evidence type（10章） / normalized・minimized content /
provenance / capture actor / redaction・minimization metadata / optional
integrity metadata（11章）。

**[Decision]** 絶対に含めない: Severity / Risk / Root Cause judgment /
Business Impact judgment / Remediation judgment。

### 9a. Evidence Type

**[Decision]** MVPでは小さなcontrolled vocabularyを持つ: `TEXT` /
`STRUCTURED_DATA` / `REQUEST` / `RESPONSE` / `TOOL_CALL` / `TOOL_RESULT` /
`LOG` / `SCREENSHOT` / `OTHER`。

**[Decision]** Evidence Typeから Security meaningを推測してはならない。
`OTHER`を許容し、将来の新Evidence形式でSchema全体を壊さない設計とする。
正式名称の微調整は実装Phaseで可能。

### 9b. Evidence Integrity

**[Decision]** Evidence integrity metadataは **SHOULD HAVE**（Must Have
にしない）。理由: structured EvidenceのCanonical serializationがまだ
確定していないため。

**[Decision]** Hashを導入する場合はalgorithmとdigestを区別できる概念が
必要。Canonical serializationを決めずにhashだけを必須化しない。Secretの
代替保存手段としてhashを使わない。

### 9c. Evidence Safety

**[Decision]** Persistent raw-secret Evidence layerは禁止。Canonical
Evidence自体がnormalized・minimized・Safety Constraints準拠であることを
前提とする。API key / credential / token / password /不要なcustomer
confidential data / 不要なPIIの実値保存を前提にしない。

**[Fact]** Schema単体でDLPを保証するとは主張しない（THREAT_MODEL.md 10章
Safety Constraintsという運用プロセスに依存する）。

---

## 10. Finding

**[Decision]** Findingはglobally unique identityを持つCanonical Entity。
必ず発生元AssessmentへOWNされ、別Assessmentへ再利用しない。

**[Decision]** 最低限意味論: finding identity / Assessment reference /
finding nature（10a章） / Evidence references / optional Attack Candidate
relationships / Root Cause / Trust Boundary violation / Authority impact /
Severity / Confidence / optional Likelihood / optional Exposure /
Business Impact references / Remediation Recommendation / lifecycle・
review state / author・reviewer traceability / created_at・confirmed_at。

### 10a. Finding Nature

**[Decision（Critical Decision）]** 明示的discriminatorを採用する。MVP値:
`ATTACK_SUCCESS` / `STRUCTURAL_CAPABILITY`。

**[Fact]** 理由: FINDING_MODEL.md（005）で既に存在する2つのFinding性質を
Machine-readableに明示するため。Attack Candidate referenceの有無から
暗黙的に推測しない。

### 10b. Finding Confirmation Human Authority

**[Decision]** Finding authorはAIでもよい。**Finding reviewer / confirmer
はHuman Actorを要求する**方向を正式採用する。AI-onlyの評価をConfirmed
Findingへ自動昇格させない。具体Actor SchemaはNEXT。

### 10c. Finding Lifecycle History

**[Decision]** MVPでは完全なlifecycle transition historyをMust Haveに
しない。必要なもの: current lifecycle・review state / `created_at` /
`confirmed_at` / author / human reviewer・confirmer。

**[Decision]** Confirmed後の意味変更はsilent overwrite禁止。Amendment /
Revision semanticsを別途記録できる設計余地を残す。詳細履歴モデルは
SHOULD HAVE / NEXT。

### 10d. Likelihood / Exposure

**[Decision（既存維持）]** optional。今回requiredにしない。語彙・計算方法は
未確定。Severityへ勝手に統合しない。

---

## 11. Execution / Evidence Cardinality

**[Decision]** Execution : Evidence = **1 : 0..N**（Evidence 0件を許容）。

**[Fact]** 理由: ERRORED、実行前Safety block、Evidence capture不能等が
あり得るため。

**[Decision]** ただしEvidence 0件のExecutionからEvidence-backed Finding
を生成してはならない。

**[Decision]** Finding : Evidence = **1..N必須**（Evidence 0件のFinding
は禁止）。Evidence ↔ Finding = many-to-many（既存Decision維持）。

---

## 12. Positive / Safe Results

**[Decision]** 新Canonical Test Result Entityは禁止。

**[Decision]** 以下から再構成する:

```
Attack Candidate + Execution + Execution Outcome + Evidence + Finding relationship有無
```

これにより attempted / completed / blocked / technically errored /
inconclusive / no Finding generated をmachine-readableに表現する。

**[Fact]** "No Issue Found Finding"は作らない（既存Decision維持）。

---

## 13. Actor Reference

**[Decision]** ActorはMVPでは独立Entity化しない。軽量Reference。

**[Decision]** 最低限概念: actor identifier / **actor kind** / optional
display label。

**[Decision]** actor kind候補: `HUMAN` / `AI_AGENT` / `SYSTEM`。

**[Fact]** `HUMAN`というkindを持つことで、Finding confirmationとAssessment
finalizationにおけるHuman requirementをSchema / domain validationで確認
可能にする（14章・10b章）。

**[Decision]** Role / Authority full modelは作らない（既存Decision X維持）。

---

## 14. Assessment Lifecycle / Finalization Human Authority

**[Decision]** 正式MVP語彙: `DRAFT` / `ACTIVE` / `UNDER_REVIEW` /
`FINALIZED` / `ARCHIVED`。

**[Decision]** Assessment lifecycleはcurrent stateを保持。MVPでは全
transition historyを必須にしない。ただしFINALIZED後のCanonical stateを
silent mutationしてはならない。

**[Decision（重要）]** Assessment Finalizationは **Human Actorを必須**
とする。AI Agentはexecution actor / evidence capture actor / finding
authorにはなり得るが、AIのみでAssessmentがFINALIZEDへ遷移したという
Canonical事実を成立させてはならない。

**[Decision]** Schema semantics上、`finalized_by` はHuman Actor Reference
であることを要求する方向を正式化する。具体Actor Schemaは今回作らない
（NEXT）。

---

## 15. Retest

**[Decision]** Retest Execution Setは、globally unique identityを持つ
**独立Aggregate Root**。元Assessmentの子Entityにしない。元Assessmentへは
REFERENCEのみ（15章、既存007を精緻化）。

**[Decision]** 最低限意味論: retest identity / original Assessment
reference / target Finding references / retest as-executed scope（15a章） /
executions / evidence / per-Finding technical status（15b章） /
`retested_at` / actor traceability。

### 15a. Retest Scope（New Clarification）

**[Decision]** Retest Execution Set自身もas-executed scope snapshotを
OWNする。

**[Fact]** 理由: Retest実施時点ではenvironment / deployed version /
permission / tool configuration / connector state等が元Assessment時点
と異なり得るため。

**[Decision]** 元Assessment Scopeは変更しない。Retest Scope SnapshotもValue
Object。独立identityはMVPでは不要。

### 15b. Retest Per-Finding Status

**[Decision]** StatusはRetest Set全体ではなく **Retest Execution Set ×
Finding relationshipごと** に持つ。

**[Decision]** 概念語彙: `RESOLVED` / `STILL_PRESENT` / `CHANGED` /
`INCONCLUSIVE`。

**[Fact]** 1つのRetestで複数Findingを扱い、Finding A = RESOLVED、
Finding B = STILL_PRESENT等を許容する。

### 15c. CHANGED Semantics（MVP Decision）

**[Decision]** CHANGEDは、元Findingと同じ問題領域だが manifestation /
exploit path / observed behavior / impact detail等に変化がある場合を指す。

**[Decision]** ただしRetestで以下が発見された場合、元Findingを変形させず
**新Findingとして扱う**:

- materially different Root Cause
- different Trust Boundary issue
- different Authority problem
- independently actionable security issue

**[Decision]** 新Findingは適切なAssessment contextへ帰属させる。元
Assessmentへ直接追加することは禁止する（元AssessmentがFINALIZEDなら
immutableのため）。

**[Open Question]** どのAssessmentへ新Findingを帰属させるかの具体フロー
（新規Assessmentを都度作るか、Retest Execution Set自体がFinding所有権を
持つ特例を設けるか等）は、Schema実装Phaseで確認する。

---

## 16. Version / Snapshot Model

**[Decision（Critical Decision）]** **Finalization-time Immutable
Snapshot** をMVP方式として正式採用する。Event Sourcingは導入しない。

**[Decision]** AssessmentがFINALIZEDになる時点で、Customer OutputのSource
となるCanonical stateを不変Snapshotとして固定できる設計を要求する。

**[Fact]** 目的: Historical Report Reproducibility / accidental overwrite
resistance / auditability / simple MVP implementation。

### 16a. Snapshot Identity

**[Decision]** Finalization Snapshotは後から一意に参照可能である必要が
ある。Assessment IDだけでは不十分。

**[Decision]** 最低限概念: Assessment identity + Snapshot identity・
revision reference + `finalized_at`。具体ID形式は本文書では未決（NEXT）。

### 16b. Current State vs Snapshot

**[Decision]** `DRAFT` / `ACTIVE` / `UNDER_REVIEW` = working canonical
state、`FINALIZED` = immutable canonical snapshot、という概念を区別する。

**[Decision]** FINALIZED Snapshotは後続Retestで変更されない。`ARCHIVED`
になってもSnapshotは残る。

---

## 17. Report Reproducibility

**[Decision]** Canonical側が持つべき情報: Assessment ID / Finalization
Snapshot reference / `finalized_at` / Engagement Context versioned
reference / applicable Canonical Source references / applicable
Crosswalk reference。

**[Decision]** Derived Report側が持つべき情報（Canonicalへは混ぜない）:
generator version / report template version / `generated_at` / audience・
projection type。

---

## 18. External Canonical References

**[Decision]** Reference semanticsは canonical asset identifier + opaque
version referenceを基本とする。

**[Decision]** 実務上のversion referenceとしてGit commit hashを利用可能
とする。ただしDomain Modelへ「Git SHA」という特定実装をhard-codeしない
（Git管理外Assetへも対応可能にする）。

### 18a. Engagement Context Reference

**[Decision]** AssessmentはEngagement Context内容をコピーしない。保持
するのはidentity・reference + version referenceのみ。Historical
Projectionで「当時参照したEngagement Context」を特定可能にする。

### 18b. Business Impact Reference

**[Decision（既存維持）]** Business Impact CategoryはTHREAT_MODEL側
Canonical。FindingはReferenceのみ。Customer-specific Business Impact
ExplanationはDerived。Business CriticalityはEngagement Context側。

### 18c. Crosswalk Reference

**[Decision]** AssessmentがFramework mappingを使用した場合、Crosswalk
canonical asset + version・referenceのみ保持可能とする。Finding-specific
OWASP / NIST / MITRE mapping結果はCanonical Findingへ保存しない。

---

## 19. Time Semantics

**[Decision]** MVP最小Canonical timestamps:

| Entity | Timestamps |
|---|---|
| Assessment | `created_at`, `finalized_at` |
| Execution | `executed_at` |
| Evidence | `observed_at` |
| Finding | `created_at`, `confirmed_at` |
| Retest | `retested_at` |

**[Decision]** 全Canonical timestampはUTC。Customer timezone rendering
はDerived Output層の責務とする。

---

## 20. Ownership / Reference Matrix

| 項目 | 分類 |
|---|---|
| As-executed Scope | OWN |
| Engagement Context | REFERENCE（versioned） |
| Attack Candidate | REFERENCE |
| Assessment Method | REFERENCE |
| Execution | OWN |
| Evidence | OWN |
| Finding | OWN |
| Business Impact | REFERENCE |
| Business Criticality | OUTSIDE |
| Crosswalk | REFERENCE（versioned） |
| Remediation Recommendation | OWN via Finding |
| Remediation Priority | DERIVED / OUTSIDE |
| Remediation Status | OUTSIDE |
| Retest | independent canonical Aggregate, REFERENCE-linked |
| Executive Summary | DERIVED |
| Report | DERIVED |
| Security Questionnaire | DERIVED |

---

## 21. Schema Modularity

**[Decision]** Logical modulesを正式採用する: `assessment` / `scope` /
`execution` / `evidence` / `finding` / `retest` / `references` /
`common`。

**[Decision]** これはlogical moduleである。file structure / package
structure / JSON Schema filesはまだ確定しない（NEXT）。

---

## 22. Machine vs Human Validation

**[Decision]** Schema / Domainで機械的に検証可能なもの:

- identity presence
- enum membership
- references（存在確認）
- cardinality
- required fields
- timestamp format
- Finding evidence >= 1
- human confirmer / finalizer requirement
- immutable-state constraintsの一部

**[Decision]** Human Review必須のもの:

- Evidence sufficiency
- Root Cause correctness
- Severity correctness
- Trust Boundary judgment
- Authority impact judgment
- Business Impact appropriateness
- Remediation quality

**[Fact]** Schema PASS ≠ Assessment Quality PASS であることを明記する。

---

## 23. MVP Must / Should / Deferred

**[Decision]**

**MUST HAVE**: Assessment / Scope / Execution / Execution Outcome /
Evidence / Finding / Finding Nature / Retest Execution Set / Retest
Scope / Per-Finding Retest Status / Actor Reference / External
Versioned References / Finalization Snapshot concept / Canonical
timestamps / relationships・cardinalities。

**SHOULD HAVE**: Evidence integrity metadata / Evidence type controlled
vocabulary / Finding amendment・revision detail / Lifecycle transition
history / relationship metadata。

**DEFERRED**: physical ID implementation / Persistence / Database / API /
full Actor・Role・Authority model / Likelihood・Exposure formal model /
Crosswalk physical model / Machine-readable export format / Continuous
Assessment。

---

## 24. Assumptions

- **[Fact]** Phase 0 / Phase 1 / Phase 2 / LUVIRA-ASA-005〜007はそれぞれ
  本文書冒頭記載のcommitとしてbaseline化され、origin/mainへpush済みである。
- **[Fact]** 本文書は既存Decision / Hypothesis / Open Questionを変更しない。
- **[Decision]** 本文書はConceptual / Logical Schema Specificationであり、
  JSON Schema等の実装物ではない。

---

## 25. Resolved Decisions

1. 全主要Entity identityをopaque + globally uniqueへ統一（Execution含む、
   4章）。
2. Execution Outcome概念（COMPLETED/BLOCKED/ERRORED/
   INCONCLUSIVE_EXECUTION）を確定（8章）。
3. Execution:Evidence = 1:0..N（Evidence 0件許容）を確定（11章）。
4. Evidence Type controlled vocabulary（9候補）を確定（9a章）。
5. Actor Reference にkind概念（HUMAN/AI_AGENT/SYSTEM）を導入（13章）。
6. Assessment FinalizationにHuman Actor必須を正式化（14章）。
7. Finding Confirmer/ReviewerにHuman Actor必須を正式化（10b章）。
8. Finding Nature discriminator（ATTACK_SUCCESS/STRUCTURAL_CAPABILITY）を
   確定（10a章）。
9. Retest Execution Setは独立Aggregate Root、REFERENCE-linkedと確定
   （15章）。
10. Retest自身がas-executed scopeをOWNすることを新規確定（15a章）。
11. Retest Statusはper-Finding relationshipごとと確定（15b章）。
12. CHANGEDの場合、材料的に異なる問題は新Findingとし、FINALIZED元
    Assessmentへは追加しないことを確定（15c章、帰属フローはOpen
    Question）。
13. Version/Snapshot方式としてFinalization-time Immutable Snapshotを
    正式採用（16章）。
14. Evidence integrity metadataをSHOULD HAVE（Must Haveにしない）に
    確定（9b章）。

---

## 26. Deferred Questions

1. CHANGED時の新Findingの具体的な帰属フロー（15c章）。
2. Human Actor要件のSchema/Domain validation実装方法（10b章・14章）。
3. Finalization Snapshotの具体的なID形式（16a章）。
4. Evidence integrity metadataの具体的なhash algorithm選定。
5. Finding lifecycle transition historyの詳細モデル（10c章）。
6. Actor / Role / Authority full modelの具体設計。
7. Likelihood / Exposureの必須化・語彙・計算方法（10d章、既存継続）。
8. Crosswalk物理モデル。
9. Machine-readable export format。
