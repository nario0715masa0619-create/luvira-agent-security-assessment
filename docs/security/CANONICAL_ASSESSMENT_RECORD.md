# LUVIRA-ASA-007 Canonical Assessment Record Concept — Luvira Agent Security Assessment

Status: Draft（Concept Model、承認済みDecisionを含む）
Baseline: Phase 0 Product Definition（commit `97fbb1d036f3beb5d3d25676e16d1ffe7fa39cdf`）、
Phase 1 Commercial-first Threat Model（commit `029cb451d66e52f12cb0faeb179f9a5dfd807802`）、
Phase 2 Minimal Attack Taxonomy（commit `0ea014b5e87deb8459ffaf51dc2dfa8823d51675`）、
LUVIRA-ASA-005 Finding Model Concept（commit `e8c439980e91a3a7279e653baac9446df039e414`）、
LUVIRA-ASA-006 Assessment Output Model Concept（commit `8990051f138d9f5c0bea99d1b946980652e58701`）

凡例: **[Fact]** 検証済み事実 / **[Hypothesis]** 未検証仮説 / **[Decision]** 人間承認済み決定 /
**[Open Question]** 人間の判断待ち

本文書はCanonical Assessment Record Conceptの正式化であり、JSON Schema / DB Schema /
API / Persistence / ORM / UI / PDF / Report Template / Workflow Engine /
Versioning実装 / Snapshot実装 / ID format / Lifecycle Engine / Migration / Codeを
定義しない。それらは後続Phaseで別途設計する（19章参照）。

---

## 1. Purpose

**[Decision]** 本文書は **LUVIRA-ASA-007 Canonical Assessment Record Concept**
として、1回のAssessmentが保持すべきCanonical情報の境界・Aggregate構造・
Ownership/Reference境界・Retest Model・Lifecycle・Finalization条件・
History/Immutability原則を確定する。

**[Fact]** 本文書はPRODUCT_DEFINITION.md / THREAT_MODEL.md / ATTACK_TAXONOMY.md /
FINDING_MODEL.md / ASSESSMENT_OUTPUT_MODEL.md の既存Decisionと矛盾しないことを
前提に作成している。特にASSESSMENT_OUTPUT_MODEL.md 4章で既に確定している
「Canonical Assessment Record = 単一原子的Recordではなく Aggregate」という
原則を、本文書で詳細化する。

---

## 2. Existing Decisions（本文書が前提とする既存確定事項）

**[Fact]** 以下は既存文書で確定済みであり、本文書は変更しない。

| 既存Decision | 出典 |
|---|---|
| Canonical Assessment Record = Aggregate、単一原子的Recordではない | ASSESSMENT_OUTPUT_MODEL.md 4章 |
| Report = Projection、Canonicalではない | CLAUDE.md、PRODUCT_DEFINITION.md 7章 |
| Evidence:Finding = many-to-many、Evidenceへ評価情報混入禁止 | FINDING_MODEL.md 3章 |
| Attack Candidate:Finding = 0..N、Assessment Method = Execution Qualifier | FINDING_MODEL.md 4章 |
| Finding lifecycle: Draft→Internal Review→Confirmed→Severity Assignment→Customer Output | FINDING_MODEL.md 8章 |
| Failed/safe attemptsはFinding化しない | FINDING_MODEL.md 8章 |
| Retest: 元Finding非上書き、新Evidence + retest relationship | FINDING_MODEL.md 9章 |
| Business Criticality: Scoping/Engagement Context所有 | FINDING_MODEL.md 6章 |
| Crosswalk: Table=独立Canonical asset（将来）、mapping結果=Derived | FINDING_MODEL.md 10章、ASSESSMENT_OUTPUT_MODEL.md 13章 |

---

## 3. Definition

**[Decision]** Canonical Assessment Recordは単一の巨大な原子的Recordではない。
1回の境界付けられたAssessmentについて、以下を束ねる **Aggregate** である:

- Assessment identity
- as-executed Scope
- Execution
- Evidence
- Finding
- 上記間のrelationships
- Retest relationships
- lifecycle / review state
- canonical external references（Business Impact Model、Crosswalk、Engagement Context等）

**[Decision]** Report本文、AI生成Customer proseは含めない。

---

## 4. Aggregate Boundary

**[Fact]** 006の整理（Scope/Engagement Context参照、Evidence、Finding、
Finding↔Evidence relationship、Attack/Execution/Method relationship、
Business Impact Model参照、Retest relationships、Crosswalk参照）を継承し、
本文書で以下を精緻化する。

**[Decision]** Aggregateが含む要素:

- Assessment identity（5章）
- As-executed Scope（OWN）+ Agreed Scopeへの参照（6章）
- Execution instances（OWN）
- Evidence（Aggregateに帰属、13章）
- Finding（OWN、12章）
- Finding↔Evidence、Execution↔Evidence、Attack Candidate↔Execution の各relationship
- Retest relationships（7章）
- Lifecycle / Review state（9章・10章）
- Canonical Business Impact Model、Crosswalk Table、Engagement Contextへの
  versioned reference（14章・15章）

---

## 5. Assessment Identity

**[Decision]** Assessment identityは概念上必要である。Evidence/Execution/
Finding/relationshipsをこのAssessmentへ束ねるための前提となる。

**[Decision]** Assessment identity / Finding identity / Evidence identityを
混同しない。それぞれ独立したidentity scopeを持つ。

**[Decision]** ID体系そのものは本文書で設計しない（NEXT）。

---

## 6. Scope Model

**[Decision]** Assessment Scopeは二層で扱う。

- **Agreed Scope**: Engagement Context側のCanonical情報。Assessment Record
  はこれをREFERENCEするのみで、内容をコピーしない。
- **As-Executed Scope**: 実際に何をAssessmentしたかの記録。Canonical
  Assessment RecordがOWNする。

**[Decision]** 両者を混同しない。

### 6a. Scope Change Rule（MVP Decision）

**[Decision]** 同一Assessment内で許容する変更:

- typo / clarification
- 実行前の軽微なscope refinement
- 元の合意Scopeの意味を変えない限定的な絞り込み

**[Decision]** 新Assessmentを必要とする変更:

- Target Agent変更
- Environment変更
- 新しい重要Tool / Connector / Credential追加
- Assessment objective変更
- Trust Boundaryの重要な追加
- 既にFinalizedされたAssessmentへのscope expansion

**[Decision]** 原則: Finalized後にAssessment boundaryを実質的に広げる場合は
新Assessmentとする。Retestはこの「新Assessment」とは別概念である（7章）。

---

## 7. Execution / Evidence / Finding Relationships

**[Decision]** 以下の関係を採用する（既存Decisionと整合）:

```
Assessment
 ├─ As-executed Scope
 ├─ Attack Candidates in scope（reference）
 ├─ Executions（1..N）
 │    ├─ references Attack Candidate
 │    ├─ references Assessment Method（qualifier）
 │    └─ produces Evidence（0..N）
 ├─ Evidence（many-to-many linkable to Findings）
 ├─ Findings（0..N）
 │    └─ links to Evidence（1..N each）
 └─ Retest relationships
```

**[Fact]** Findingが0件でもAssessmentは完全に成立する（10章参照）。

---

## 8. Retest Model

**[Decision（Critical Decision 1、承認済み）]** Retestは:

- 元AssessmentそのもののContinuationではない
- 完全に独立した新Assessmentでもない
- **元Assessmentへlinkedされた独立Execution Set**

として扱う。

**[Decision]** Retest Execution Setは独自に以下を持つ:

- Execution
- Evidence
- timestamp
- technical status judgment

**[Decision]** 必ず維持する事項:

- 元Findingを上書きしない
- 元Evidenceを変更しない
- 元Assessmentのfinalized stateを変更しない
- 新Evidenceを追加する
- 元Findingとのrelationshipを保持する
- Historical traceabilityを維持する

### 8a. Retest Current Status（MVP Decision）

**[Decision]** 技術判定として最低限以下の概念を許容する（Schema/enumとして
実装はしない）:

- **RESOLVED**: 新Evidenceで元Findingの成立条件が再現されないことを確認
- **STILL_PRESENT**: 再現継続
- **CHANGED**: 同一問題領域だがBehavior / Impact / Causeが変化
- **INCONCLUSIVE**: Evidence不足等で判断不能

**[Decision]** Engagement Workflow status（Remediation Status等）とは別概念
である。

---

## 9. Lifecycle

**[Decision（MVP概念語彙）]** Assessment Record自体に以下のLifecycle概念を
採用する（State Machineは今回実装しない）:

- **DRAFT** — Scope・準備段階
- **ACTIVE** — Assessment実行中
- **UNDER_REVIEW** — Execution完了後のEvidence / Finding / Aggregate review
- **FINALIZED** — Projection Readiness条件を満たしたCanonical state
- **ARCHIVED** — 運用上非アクティブだがHistorical Recordとして保持

**[Decision]** SUPERSEDED等の追加状態はMVPでは導入しない。

**[Fact]** Luvira OS / Project GenesisのLifecycle語彙をこのRepositoryへ
輸入したものではなく、本タスクで独自にMVP語彙として確定したものである。

---

## 10. Review and Finalization

**[Decision（Critical Decision 3、承認済み）]** Finding ReviewとAssessment
Finalizationは別概念である。

- **Finding Review**: 個別Findingの品質・Evidence・評価確認
  （FINDING_MODEL.md 8章の既存Lifecycle）。
- **Assessment Finalization**: Aggregate全体が顧客Output生成可能かを確認する
  行為。

### 10a. Finalization Conditions（MVP Decision）

**[Decision]** AssessmentをFINALIZED可能とする最低条件:

- Scope defined
- As-executed Scope recorded
- Planned / performed Executions recorded
- Evidence captured
- Safe / failed executions recorded
- Finding↔Evidence traceability complete
- Customer Output対象FindingがConfirmed
- Customer Output対象FindingのSeverity finalized
- unresolved Draft Findingが残っていない
- Required human review complete

**[Decision]** Findingが0件でもFinalized可能。その場合もCoverage / safe
result記録が必要である。

---

## 11. Completeness / Projection Readiness

**[Decision]** CompletenessとProjection Readinessは同じgateとして扱う。

**[Decision]** FINALIZEDになったCanonical Assessment Recordのみを正式
Customer Output生成のSourceとして使用する。DRAFT / ACTIVE / UNDER_REVIEW
状態から正式Final Reportを生成してはならない。

**[Decision]** 内部Previewは可能だが、Derived Draft扱いとする（正式Customer
Outputとは区別する）。

---

## 12. Finding Ownership

**[Decision]** Assessmentは0..N FindingsをOWNする。

**[Decision]** Findingは必ず発生元Assessmentへ帰属する。Assessment外に
浮いたFindingは作らない。Findingを別Assessmentへ再利用しない。

**[Decision]** Retestは元Findingへrelationshipを追加するのみであり、
Finding所有権は移らない。

---

## 13. Evidence Ownership

**[Decision]** EvidenceはCanonical Assessment Record Aggregateに（概念上）
帰属する。

**[Decision]** AggregateでOWNすることと、Storage上でインライン保存する
ことは同義ではない。Conceptually OWNとし、Physical persistence方式は
本文書では設計しない（NEXT）。

---

## 14. Engagement Context Reference

**[Decision]** Assessment RecordはEngagement Context内容をコピーしない。

**[Decision（Critical Decision、精緻化）]** ただしHistorical Reproducibility
のため、当時参照したEngagement Contextの **stable / versioned reference**
を保持できる設計が必要である。概念例: Engagement Context identity +
referenced version / snapshot identity。

**[Decision]** 具体Schemaは本文書では設計しない（NEXT）。理由: Business
Criticality等が後日変更された場合でも、当時のReportが参照したContextを
特定できる必要があるため。

**[Fact]** Single Source of Truth原則は維持される（Engagement Context自体の
Canonical状態はEngagement側にあり、Assessment側はversioned referenceを
持つのみで内容を複製しない）。

---

## 15. Crosswalk Reference

**[Decision]** Crosswalkも同じ原則を適用する。Canonical FindingへFramework
mapping結果を保存しない。

**[Decision]** Assessment Recordが必要なら保持するのは、Crosswalk canonical
asset + version/referenceのみである。Finding-specific mapping結果は
Derivedのままとする（既存Decision、変更なし）。

**[Decision]** 過去Report再現時に「どのCrosswalk versionを使用したか」を
特定可能にする。

---

## 16. History / Immutability

**[Decision]** 以下を正式原則とする:

- **Evidence**: append-only。captured Evidenceをsilent rewriteしない。
- **Finding**: Draft中は編集可能。Confirmed後、意味を変えるsilent
  overwriteは禁止。変更する場合は履歴追跡可能であること。
- **Severity**: Finalization前の暫定変更は許容。Finalization後の変更は
  履歴追跡必須。
- **Scope**: Finalization後はimmutable。
- **Retest**: 新規Execution / Evidence / relationshipを追加するのみ。

### 16a. Historical Report Reproducibility（Critical Decision 4、承認済み）

**[Decision]** Reportはポイントインタイムのcanonical stateから生成された
Projectionである。過去Report再現性を必須要件とする。

**[Decision]** ただしVersioning / Snapshot実装はNEXT。

### 16b. Snapshot / Versioning Requirement

**[Decision]** 具体機構はNEXTだが、Requirementは本文書で確定する:

- FinalizedされたCanonical stateを特定可能であること
- Reportがどのcanonical stateから生成されたかを特定可能であること
- 後日のmutation発生後でも、過去Reportの根拠を再現可能であること

**[Decision]** JSON snapshot / version number / immutable event等、実装
方式は本文書では決定しない。

---

## 17. Time Semantics

**[Decision]** 以下の概念粒度を正式採用する:

- **Assessment-level**: created / finalized
- **Execution-level**: executed
- **Evidence-level**: observed
- **Retest-level**: retested

**[Decision]** 正式field名・追加timestamp（started_at, reviewed_at等）の
要否はSchema Phaseで判断する。

---

## 18. Actor / Authority Traceability

**[Decision]** 概念として必要である。ただし新しい大規模Actor / Role Model
は本文書では作らない。

**[Decision]** MVP Conceptでは、誰が以下を行ったかを追跡可能にする要件
のみを定義する:

- Scopeをapprove
- Executionをperform
- Evidenceをcapture
- Findingをauthor
- Findingをreview
- Assessmentをfinalize

**[Decision]** ID / Role / Authority SchemaはNEXT。

**[Fact]** Luvira OSのAgent / Authority / Role / Authority Grantモデルは、
このRepositoryの既存Authorityが採用していない。無断輸入しない。

---

## 19. Positive / Safe Coverage

**[Decision]** 新しいCanonical Test Result型は作らない。

**[Decision]** 以下から再構成する:

```
Attack Candidate → Execution → Evidence → Finding発生有無
```

これにより tested / failed / safely rejected / no Finding generated を
表現する。

**[Fact]** Coverage / Test Result SummaryはDerived Projectionである
（既存Decision、ASSESSMENT_OUTPUT_MODEL.md 12章）。

---

## 20. Evidence / Redaction Boundary

**[Decision（MVP Decision）]** Persistentな「完全非redact Raw Secret
Evidence階層」は作らない。

**[Decision]** Canonical Evidence自体が、THREAT_MODEL.md 10章のSafety
Constraintsに従い、必要最小限・normalized/minimizedされた状態であること
とする。

**[Decision]** Operator確認用に一時的なraw observationが必要になる場合
でも、それを永続Canonical layerとして自動保存する設計は採用しない。

**[Decision]** 詳細Redaction PolicyはNEXT。

---

## 21. Cross-system Boundary

**[Decision]** Canonical Assessment Recordを以下へ変質させない:

- CRM
- Billing record
- Customer Success record
- Project Management record
- Remediation Tracker

**[Decision]** 以下はOUTSIDE（Assessment Recordが保持しない）:

- Contract
- Billing
- Customer owner
- Customer due date
- Accepted Risk workflow
- Sales notes
- Remediation workflow state

**[Decision]** 必要な場合もCanonical referenceのみを持つ。

---

## 22. Machine-readable Compatibility

**[Decision]** Canonical Assessment Recordはstructured conceptsのみで
構成する。

**[Decision]** 以下をCanonical stateへ混ぜない:

- Executive prose
- Customer explanation prose
- Report paragraph
- PDF layout
- Presentation text

**[Fact]** これにより将来のMachine-readable Exportに人間文章依存を作り込ま
ない（既存方針、ASSESSMENT_OUTPUT_MODEL.md 24章と整合）。

---

## 23. Likelihood / Exposure（Deferred / Non-blocking）

**[Decision]** Finding評価属性として概念上残す。

**[Decision]** 本文書では以下を行わない: 必須化、語彙確定、計算方法定義、
Severityへの統合。将来のFinding Schema設計時に再検討する。

---

## 24. Assumptions

- **[Fact]** Phase 0 / Phase 1 / Phase 2 / LUVIRA-ASA-005 / LUVIRA-ASA-006
  はそれぞれ本文書冒頭記載のcommitとしてbaseline化され、origin/mainへ
  push済みである。
- **[Fact]** 本文書は既存Decision / Hypothesis / Open Questionを変更しない。
- **[Decision]** 本文書はCanonical Assessment Record Concept Modelであり、
  正式Schema、Persistence方式、Report Template実装は定義しない。

---

## 25. Resolved Decisions

1. Canonical Assessment RecordはAggregateであり、単一原子的Recordではない
   （3章・4章）。
2. Retestは元Assessmentへlinkedされた独立Execution Setとして扱う（8章）。
3. Scopeは Agreed Scope（Reference）と As-executed Scope（OWN）の二層と
   する（6章）。
4. Scope変更の同一/新Assessment判定ルールを確定した（6a章）。
5. Finding ReviewとAssessment Finalizationを別概念として分離した（10章）。
6. Finalization条件を確定した（10a章）。
7. Assessment Lifecycle語彙（DRAFT/ACTIVE/UNDER_REVIEW/FINALIZED/ARCHIVED）
   をMVPとして確定した（9章）。
8. FINALIZED状態のみがCustomer Output生成のSourceとなることを確定した
   （11章）。
9. Historical Report Reproducibilityを必須要件として確定した（16a章）。
10. Engagement Context / Crosswalkの versioned reference保持要件を確定した
    （14章・15章）。
11. Retest Current Statusの概念語彙（RESOLVED/STILL_PRESENT/CHANGED/
    INCONCLUSIVE）をMVPとして確定した（8a章）。
12. History / Mutation原則（append-only Evidence、Confirmed Finding非
    silent-overwrite等）を確定した（16章）。
13. Persistent raw-secret Evidence階層を作らないことを確定した（20章）。

---

## 26. Deferred Questions

1. Assessment / Finding / Evidence ID体系の正式設計（5章）。
2. Assessment Record / Evidence の物理Persistence方式（13章）。
3. Engagement Context / Crosswalk versioned referenceの具体Schema（14章・
   15章）。
4. Snapshot / Versioning機構の具体実装（16b章）。
5. 正式timestamp field名・粒度（17章）。
6. Actor / Role / Authority Schemaの具体設計（18章）。
7. 詳細Redaction Policy（20章）。
8. Likelihood / Exposureの必須化・語彙・計算方法（23章）。
9. Retest Current Statusの正式enum / Schema化（8a章）。
