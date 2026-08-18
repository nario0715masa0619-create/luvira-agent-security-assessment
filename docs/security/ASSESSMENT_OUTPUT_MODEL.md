# LUVIRA-ASA-006 Assessment Output Model Concept — Luvira Agent Security Assessment

Status: Draft（Concept Model、承認済みDecisionを含む）
Baseline: Phase 0 Product Definition（commit `97fbb1d036f3beb5d3d25676e16d1ffe7fa39cdf`）、
Phase 1 Commercial-first Threat Model（commit `029cb451d66e52f12cb0faeb179f9a5dfd807802`）、
Phase 2 Minimal Attack Taxonomy（commit `0ea014b5e87deb8459ffaf51dc2dfa8823d51675`）、
LUVIRA-ASA-005 Finding Model Concept（commit `e8c439980e91a3a7279e653baac9446df039e414`）

凡例: **[Fact]** 検証済み事実 / **[Hypothesis]** 未検証仮説 / **[Decision]** 人間承認済み決定 /
**[Open Question]** 人間の判断待ち

本文書はAssessment Output Conceptの正式化であり、JSON Schema / DB Schema / API /
PDF生成 / Report Template実装 / UI / Workflow Engine / Severity Formula /
Priority Formula / Crosswalk実装 / Output Generator実装を定義しない。それらは
後続Phaseで別途設計する（16章参照）。

---

## 1. Purpose

**[Decision]** 本文書は **LUVIRA-ASA-006 Assessment Output Model Concept** として、
Canonical Assessment RecordとDerived Output（Projection）の境界、Audience別の
Projection方式、Technical-to-Business Translationの責務、Evidence Traceability、
Business Impact / Remediation / Retest / Positive-Safe Results / Framework Mapping
それぞれのOutput上の扱い、AI生成Output Safety、MVP Outputの範囲を概念レベルで
確定する。

**[Fact]** 本文書はPRODUCT_DEFINITION.md / THREAT_MODEL.md / ATTACK_TAXONOMY.md /
FINDING_MODEL.md の既存Decision / Hypothesis / Open Questionと矛盾しないことを
前提に作成している。特にCLAUDE.md および PRODUCT_DEFINITION.md 7章で既に
確定している「Report = Canonical Assessment Recordからの投影物であり、
Source of Truthではない」という原則を、Output Model全体の設計原理として
明文化・拡張する。

---

## 2. Existing Decisions（本文書が前提とする既存確定事項）

**[Fact]** 以下は本文書が新たに決定したものではなく、既存文書で既に確定して
いる事項である。本文書はこれらを変更しない。

| 既存Decision | 出典 |
|---|---|
| Human-readable ReportはProjectionであり、Source of Truthではない | CLAUDE.md、PRODUCT_DEFINITION.md 7章 |
| 将来のSource of Truth候補名は「Canonical Assessment Record」（正式Schema未設計） | PRODUCT_DEFINITION.md 7章 |
| Canonical Business Impact ModelはTHREAT_MODEL.md 9章の8カテゴリ、Findingは参照のみ | FINDING_MODEL.md 6章 |
| Business CriticalityはScoping / Engagement Context所有 | FINDING_MODEL.md 6章 |
| OWASP / NIST / MITREはCrosswalk Layer限定 | FINDING_MODEL.md 10章、ATTACK_TAXONOMY.md 3章・10章 |
| Remediation state / trackingはFinding lifecycle外、Engagement / Workflow責務 | FINDING_MODEL.md 8章 |
| Retestは元Findingを上書きしない、新Evidence + retest relationship | FINDING_MODEL.md 9章 |
| Failed / safe attemptsはFinding化しない、"No Issue Found Finding"は作らない | FINDING_MODEL.md 8章 |
| Router / MCP / Multi-Agent専用Finding taxonomyは作らない | FINDING_MODEL.md 12章 |
| 「安全を保証する」等の表現は禁止 | PRODUCT_DEFINITION.md 4章 |

---

## 3. Output Model Definition

**[Decision]** Assessment Outputを直線的変換チェーンとしては扱わない。

不採用（Rejected Hypothesis）:

```
Finding → Technical Assessment Result → Customer Finding
        → Executive Summary → Final Report
```

**[Decision]** 採用する構造:

```
Canonical Assessment Record
        ↓
Canonical Evidence / Findings / References / Context
        ↓
Projection Layer
        ├─ Technical Detail
        ├─ Executive Explanation
        ├─ Customer-facing Finding
        ├─ Coverage Summary
        ├─ Evidence Appendix
        ├─ Remediation Guidance
        └─ future Crosswalk / Questionnaire / Retest Output
```

**[Decision]** Reportはいかなる形態であってもSource of Truthではない。すべて
Projectionである。

---

## 4. Canonical Assessment Record Boundary

**[Decision]** Technical Assessment Resultを独立Canonical実体として新設しない。

**[Fact]** Finding（FINDING_MODEL.md 2章）は既に「Evidence-backed technical
assessment conclusion」を表しており、これに加えて第二のCanonical評価Record
を追加すると二重管理になる。必要なTechnical OutputはCanonical Finding の
Projectionとして生成する。

**[Decision]** Canonical Assessment Recordは、単一の新しい原子的Recordでは
なく、Assessmentに属するCanonical情報の集合体（Aggregate）として扱う。正式
Schemaは本文書では設計しない。

**[Decision]** 概念上、Canonical Assessment Recordは少なくとも以下を含む:

- Assessment Scope / Engagement Contextへの参照
- Evidence
- Finding
- Finding ↔ Evidence relationship
- Attack Candidate / Execution / Assessment Method relationship
- Canonical Business Impact Modelへの参照
- Retest relationships
- 必要なCanonical references（Crosswalk Mapping Table等、将来正式化された場合）

**[Decision]** Report本文そのものは含まない。AI生成Customer文章もCanonicalに
しない。

---

## 5. Canonical vs Derived

**[Decision]** 以下をCanonicalとする:

- Evidence
- Finding
- Assessment / Engagement ContextのCanonical情報
- Canonical Business Impact Model（THREAT_MODEL.md、既存）
- Crosswalk Mapping Table（Crosswalk Layerが将来正式化された場合）

**[Decision]** 以下をDerived / Projectionとする:

- Customer-facing Finding
- Technical Report presentation
- Executive Summary
- Final Report
- Evidence Appendixの整形済みpresentation
- Customer-specific Business Impact Explanation
- Security Questionnaire response
- Retest Report
- Finding-specific OWASP / NIST / MITRE表示
- AI生成説明文章

**[Decision]** 同じ意味情報を複数のCanonical Recordとして持たない
（Single Source of Truth）。

---

## 6. Audience Projection

**[Decision]** Audienceごとに別Findingを作らない。1つのCanonical Finding
からAudience-specific Projectionを生成する。

**[Decision]** 想定Audience: Security Engineer / AI・Platform Engineer /
CTO・CIO / CISO / Business Owner / Executive・Management / Procurement /
Compliance・Audit。

**[Decision]** Audienceによって変えてよいもの: Detail level / terminology /
ordering / explanation depth / evidence visibility。

**[Decision]** 変えてはいけないもの: underlying facts / Severity / Root
Cause / Authority impact / Trust Boundary assessment / Evidence basis。

---

## 7. Technical-to-Business Translation

**[Decision]** 責務はOutput Layer。Finding自体へ商業文章を埋め込まない。

**[Decision]** Output Layerは、Finding + Evidence + Canonical Business
Impact reference + Engagement Contextから Customer Explanationを生成する。

**[Decision]** 禁止事項: Evidenceにない事実追加 / Severity変更 / Impact
誇張 / Unsupported Claim / Canonical Finding書き換え。

---

## 8. Evidence Traceability

**[Decision]** 全重要Output Claimは内部的に以下まで追跡可能であること:

```
Output Claim → Finding → Evidence → Execution → Attack Candidate / Method
```

**[Decision]** Executive Summaryのような集約文章であっても内部traceability
は必須。ただしCustomer向けReport/UI上でEvidence ID等を表示するかは
Audience Projection次第で選択可能（表示を省略してよいのは表示層のみ、
内部保持は省略しない）。

---

## 9. Business Impact

**[Decision]** Canonical Business Impact CategoryはTHREAT_MODEL.mdをReference
する。Finding / Output側で複製・再定義しない。

**[Decision]** Customer-specific Business Impact ExplanationはDerived
Outputとして許容する。これは Canonical Impact Category + Finding +
Engagement Contextから生成する。

### 9a. Business Criticality

**[Decision]** Business CriticalityはScoping / Engagement Context所有。
Findingへ移さない。Output LayerはRisk / Remediation Priority等の判断材料
として参照してよい（所有はしない）。

### 9b. Likelihood / Exposure

**[Decision]** Likelihood / ExposureはFinding評価属性として概念上維持して
よい。ただし本文書（LUVIRA-ASA-006）では以下を確定しない: 必須化するか、
最終語彙、計算方法、Severity Formulaへの統合可否。将来のFinding Schema
設計時に再検討する **[Open Question]**。

---

## 10. Remediation Boundary

**[Decision]** Remediation Recommendation → Finding責務。

**[Decision]** Remediation Priority → Derived / Engagement-aware判断。

**[Decision]** Owner / Status / Due Date / Accepted Risk / Workflow
tracking → Engagement / Customer Workflow責務。Finding lifecycleへ混ぜない。

### 10a. Remediation Priority

**[Decision]** 概念として、Remediation PriorityはSeverity + Business
Criticality + 必要なEngagement Contextから Derivedされる。

**[Decision]** 「単純なSeverity × Business Criticalityの数式」とはまだ
決めない。本文書では具体的計算ロジックを定義しない **[Open Question]**。

---

## 11. Retest Output

**[Fact]** FINDING_MODEL.md 9章の既存Decisionを維持する: 元Findingを上書き
しない。Retestは元Finding + 新Evidence + retest relationshipを保持する。

**[Decision]** Retest Current Statusについて: 技術的なCurrent Status判定
（例: Resolved / Still Present / Changed）はEvidence-backed assessmentとして
技術評価側（Finding / Evidence層）が担う。

**[Decision]** ただし語彙・Schemaは本文書では確定しない **[Open Question]**。

**[Decision]** Engagement側は、この技術判定をWorkflow Statusとして利用して
よい（技術判定そのものの所有権はEngagement側に移らない）。

**[Decision]** Retest Report自体はDerived Projectionである。

---

## 12. Positive / Safe Results

**[Fact]** FINDING_MODEL.md 8章の既存Decisionを維持する: "No Issue Found
Finding"は禁止。Failed / Safe TestはFinding化しない。

**[Decision]** Customer Outputでは、**Coverage / Test Result Summary**
というDerived Output概念で示す。

**[Decision]** 入力: Assessment Scope / Attack Candidate・Method /
Execution Result / Evidence / Finding発生有無。

**[Decision]** 新しいCanonical Recordは追加しない
（既存のEvidence / Execution記録から構成される）。

---

## 13. Framework Projection

**[Fact]** FINDING_MODEL.md 10章の既存Decisionを維持する: OWASP / NIST /
MITREはCrosswalk Layer限定。Canonical Findingへ埋め込まない。

**[Decision]** Crosswalk Tableは独立Canonical mapping assetとして将来
管理可能とする（将来正式化された場合）。

**[Decision]** Finding-specific mapping（「このFindingはOWASP LLM01に
該当する」等の個別表示）は Output生成時のDerived Projectionとする。Finding
本体には保存しない。

**[Decision]** AIがFramework Mappingを推測してはならない
（Crosswalk Tableに基づく適用のみ許容）。

---

## 14. AI-generated Output Safety

**[Decision]** AI生成Outputは常にDerived。Canonical Authorityを持たない。

**[Decision]** Allowed inputs: Canonical Finding / Evidence reference /
Canonical Business Impact reference / Engagement Context / approved
Crosswalk mapping。

**[Decision]** 禁止事項: Hallucinated fact / Severity変更 / unsupported
business consequence / fabricated evidence / invented compliance
mapping / Finding mutation。

---

## 15. MVP Output

**[Decision]** 最初の有償Assessmentでは成果物を乱立させない。

**[Decision]** MVP構成: **1つの統合Assessment Report + Evidence Appendix**。

**[Decision]** Report内構成:

- A. Executive Summary
- B. Assessment Scope / Coverage
- C. Findings Overview
- D. Finding Detail
- E. Business Impact Explanation
- F. Root Cause / Authority / Trust Boundary
- G. Remediation Guidance
- H. Retest Recommendation
- I. Positive / Safe Test Coverage Summary

**[Decision]** Evidence Appendix: 必要なEvidenceをCustomer-safeにredact /
formatしたProjection。

---

## 16. NOW / NEXT / LATER

**[Decision]**

**NOW**:
- Integrated Technical Assessment Report
- Executive section
- Finding Detail
- Evidence Appendix
- Remediation Guidance
- Coverage / Test Result Summary

**NEXT**:
- Retest Report
- Security Questionnaire Support
- Compliance / Framework Crosswalk customer output

**LATER**:
- Machine-readable Assessment Export

**[Decision]** Security Questionnaire / CrosswalkはMVP NOWへ引き上げない。

**[Decision]** 本文書ではJSON Schema / DB Schema / API / PDF生成 / Report
Template実装 / UI / Workflow Engine / Severity Formula / Priority
Formula / Crosswalk実装 / Output Generator実装を行わない（1章Non-goals）。

---

## 17. 004A / 004B Handling

**[Fact]** 本Repository内で「004A」「004B」という独立成果物を確認できな
かった。これらをFactとして推測しない。

**[Fact]** 本文書は、実際に存在するCanonical documents（PRODUCT_DEFINITION.md /
THREAT_MODEL.md / ATTACK_TAXONOMY.md / FINDING_MODEL.md / CLAUDE.md）
のみを根拠として作成した。将来「004A」「004B」に相当する別成果物が見つかった
場合、その時点で本文書との整合を確認する **[Open Question]**。

---

## 18. Assumptions

- **[Fact]** Phase 0 / Phase 1 / Phase 2 / LUVIRA-ASA-005はそれぞれ本文書
  冒頭記載のcommitとしてbaseline化され、origin/mainへpush済みである。
- **[Fact]** 本文書は、PRODUCT_DEFINITION.md / THREAT_MODEL.md /
  ATTACK_TAXONOMY.md / FINDING_MODEL.md の既存Decision / Hypothesis /
  Open Questionを変更しない。
- **[Decision]** 本文書はAssessment Output Concept Modelであり、正式な
  Schema、Persistence方式、Report Template実装は定義しない。

---

## 19. Resolved Decisions（本文書でMVP Decisionとして確定した事項）

1. Assessment Outputは直線的変換チェーンではなく、Canonical Hub + Projection
   Layer構造とする（3章）。
2. Technical Assessment Resultは独立Canonical実体として新設しない（4章）。
3. Canonical Assessment RecordはAggregate概念として扱う。正式Schemaは
   未設計（4章）。
4. Canonical / Derivedの明確な区分を確定した（5章）。
5. Audienceごとに別Findingを作らず、単一Canonical Findingからの
   Projectionとする（6章）。
6. Technical-to-Business TranslationはOutput Layerの責務とする（7章）。
7. Business Impact CategoryはReferenceのみ、Customer-specific Explanationは
   Derivedとして許容する（9章）。
8. Remediation Recommendation = Finding責務、Priority = Derived、
   Owner/Status/Due Date等 = Engagement責務、と明確に分離した（10章）。
9. Retest Current Status判定は技術評価側が担うが、語彙・Schemaは未確定
   （11章）。
10. Positive/Safe ResultsはCoverage/Test Result Summaryという新Derived
    概念で表現し、"No Issue Found Finding"は作らない（12章）。
11. Framework MappingはCrosswalk Layer限定を維持し、Finding-specific
    mappingはOutput生成時のDerived Projectionとする（13章）。
12. AI生成OutputはDerivedに限定し、許容Inputと禁止事項を確定した（14章）。
13. MVP Outputを1つの統合Report + Evidence Appendixに限定した（15章）。
14. NOW/NEXT/LATER分類を確定し、Security Questionnaire/CrosswalkをMVPへ
    引き上げないことを確定した（16章）。

---

## 20. Deferred Questions

1. Likelihood / Exposureの必須化要否、最終語彙、計算方法（9b章）。
2. Remediation Priorityの具体的な計算ロジック（10a章）。
3. Retest Current Statusの正式語彙・Schema（11章）。
4. Crosswalk Mapping Tableの正式な管理方法・保守プロセス（13章、将来
   Crosswalk Layer正式化時）。
5. 「004A」「004B」が本Repository外の何を指すか（17章）。
6. Canonical Assessment Recordの正式Schema設計（PRODUCT_DEFINITION.md 13章
   Open Question 6、ATTACK_TAXONOMY.md 13章と同一の未決事項、本文書でも
   未解決のまま）。
7. Security Questionnaire Support / Compliance Crosswalkの具体的な
   実装アプローチ（NEXT Phaseで検討）。
8. Machine-readable Assessment Exportの正式スキーマ（LATER Phase）。
