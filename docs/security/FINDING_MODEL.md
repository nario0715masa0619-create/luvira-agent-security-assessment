# LUVIRA-ASA-005 Finding Model Concept — Luvira Agent Security Assessment

Status: Draft（Concept Model、承認済みDecisionを含む）
Baseline: Phase 0 Product Definition（commit `97fbb1d036f3beb5d3d25676e16d1ffe7fa39cdf`）、
Phase 1 Commercial-first Threat Model（commit `029cb451d66e52f12cb0faeb179f9a5dfd807802`）、
Phase 2 Minimal Attack Taxonomy（commit `0ea014b5e87deb8459ffaf51dc2dfa8823d51675`）

凡例: **[Fact]** 検証済み事実 / **[Hypothesis]** 未検証仮説 / **[Decision]** 人間承認済み決定 /
**[Open Question]** 人間の判断待ち

本文書はFinding Conceptの正式化であり、JSON Schema / DB Schema / API / Persistence
Model / Workflow Engine / CVSS互換計算式 / 自動Severity Formulaを定義しない。
それらは後続Phaseで別途設計する（10章参照）。

---

## 1. Purpose and Non-goals

**[Decision]** 本文書は **LUVIRA-ASA-005 Finding Model Concept** として、
Evidence / Finding boundary、両者の関係モデル、Severity/Confidence、
Business Impact参照方法、Authority/Trust Boundary表現、Lifecycle、Retest、
Framework Mapping方針、AI Agent固有の扱い、Router/MCP/Multi-Agent互換性を
概念レベルで確定する。

**[Decision]** 本文書では以下を行わない（Important Boundary）:

- JSON Schema定義
- DB Schema定義
- API定義
- Persistence Model定義
- Workflow Engine設計
- CVSS互換Severity計算式
- 自動Severity Formula / 自動Scoring

これらはすべて、本文書のConcept Modelを入力として後続Phaseで別途設計する。

**[Fact]** 本文書はPRODUCT_DEFINITION.md / THREAT_MODEL.md / ATTACK_TAXONOMY.md の
Decision / Hypothesis / Open Questionと矛盾しないことを前提に作成している。
特にATTACK_TAXONOMY.md 13章「Relationship to Future Evidence / Finding Model」で
明示的に後続Phaseへ委ねられていた設計判断を、本文書で確定する。

---

## 2. Core Finding Definition

**[Decision]** FindingはVulnerabilityと同義ではない。

**[Decision]** Finding とは、Evidenceを根拠に、Agentが実際にどのAuthority /
Trust Boundaryを越えて何をできてしまったか、またはどのような構造上の
Capability Riskを持つかを専門的に評価した結論である。「欠陥の発見」では
なく、**Evidence-backed Action / Capability Assessment** として扱う。

**[Fact]** この定義はPRODUCT_DEFINITION.md 4章の既存Decisionと一致する
（新規決定ではなく、その形式化である）：「Findingは推測ではなく、実行結果に
基づく説明（Evidence-backed Risk Explanation）とし、Promptレベルの反応では
なく実際のAction/権限行使に基づく評価（Action-centric Findings）とする」。

---

## 3. Evidence / Finding Boundary

**[Decision]** EvidenceとFindingは明確に異なる実体である。

- **Evidence**: 実行結果・ログ・出力・証跡そのもの。評価情報を含まない事実
  記録。ATTACK_TAXONOMY.md 5章「Expected Evidence Type」およびTHREAT_MODEL.md
  10章「Evidence capture must avoid unnecessary sensitive data retention」
  「Redact or minimize sensitive values in Evidence」の対象はこのEvidenceで
  ある。
- **Finding**: 1件以上のEvidenceを根拠として構築された、専門的評価の結論
  （2章参照）。

**[Decision]** Evidenceには評価情報（Severity、Confidence、Business Impact
判断等）を混入させない。評価はFinding側にのみ存在する。

**[Decision]** Evidence : Finding の関係は **many-to-many** を許容する。

- 1件のEvidence（例: 1つのTool呼び出しログ）が複数Findingの根拠になりうる
  （例: Tool/Connector Abuse Findingと Data Access Finding の両方を裏付ける
  場合）。
- 1件のFindingが複数Evidenceを必要とする場合がある（例: Draft段階の単一
  実行証跡に加え、Confirmation段階での再現Evidenceが追加される）。

---

## 4. Relationship Model

**[Decision]** Attack Candidate（`ASA-ATK-xxx`）: Finding の関係は **0..N**
である。

- 1つのAttack Candidateが、対象・実行タイミングによって0件、1件、複数件の
  Findingを生むことを許容する。
- Attack Candidateに紐付かないFindingも許容する（7章「structural /
  excessive-agency type」参照）。

**[Decision]** Assessment Method（`ASA-MTH-xxx`）はFinding生成主体ではなく、
**Execution Qualifier**（実行時の安全な検証方式を示す属性）として扱う。

- 例: 「このFindingの根拠となるTestは ASA-MTH-001（proof-of-action）に
  従って安全に実施された」という情報は、Finding本体のExecution
  Qualifier/属性として付与されるものであり、ASA-MTH-001自体が独立した
  Findingを生成するわけではない。
- **[Fact]** これはATTACK_TAXONOMY.md 6章の既存区分（Attack Candidate /
  Assessment Method・Safety Pattern / Commercial Output Requirement）と
  整合する。ASA-MTH-001は同文書304-323行で「Attackではない」と明記されて
  おり、本文書の扱いはこれと矛盾しない。

**[Decision]** Findingは以下2種類を許容する。

- **attack-success type**: 1件以上のAttack Candidate（成功した攻撃検証）に
  紐付くFinding。
- **structural / excessive-agency type**: 特定のAttack Candidateの実行結果
  としてではなく、権限棚卸し等の構造的観察から導かれるFinding（例:
  「Agentが確認ステップなしに破壊的なDB書き込み権限を持つ」）。Attack
  Candidateとの紐付けを必須としない。

---

## 5. Severity / Confidence

**[Decision]** MVPでは Finding Confidence は **定性的（qualitative）** に
限定する。HIGH / MEDIUM / LOW 等の少数段階を候補とする。数式による自動
Scoringは行わない（Deferred、1章Non-goals参照）。

**[Decision]** Severityは、Confirmed Finding化される前（Draft Finding段階）
に暫定値を持つことを許容する。ただし、**Customer Output時にはSeverityが
確定していなければならない**。暫定Severityのまま顧客へ出力してはならない
（8章Lifecycle参照）。

**[Decision]** CVSS互換の計算式、自動Severity Formulaは本文書では定義しない
（1章Non-goals）。

---

## 6. Business Impact

**[Decision]** FindingはCanonical Business Impact Modelを **REFERENCE**
する。Copyしない。独自に生成しない。

**[Fact]** Canonical Business Impact Modelは THREAT_MODEL.md 9章で既に
確定している8カテゴリである：Enterprise deal blocker / Security
Questionnaire failure / Customer data exposure / Unauthorized business
action / Loss of customer trust / Regulatory or contractual concern /
Remediation cost / Incident response burden。

**[Fact]** ATTACK_TAXONOMY.md 8章「Attack-to-Business Impact Mapping」は
既にこの8カテゴリを参照する形でAttack Candidateとの対応表を構築しており、
本文書のFinding Business Impact参照方式はこれと同じ方針の踏襲である
（新たなBusiness Impact分類を作らない）。

**[Decision]** Business Criticality（当該顧客環境における重要度）は
Scoping / Engagement Contextが所有する。Findingは参照のみを行い、所有
しない。

---

## 7. Authority / Trust Boundary

**[Decision]** Findingの技術的核心は以下3フィールドで表現する。専用の
Router / MCP / Multi-Agent固有Category / Fieldは作らない（11章参照）。

- **Root Cause**
- **Trust Boundary violation**（THREAT_MODEL.md 4章の6区分を参照）
- **Authority impact**（THREAT_MODEL.md 7章のAgentic Action Attack Surface:
  Authority / Permission / Tool / Connector / Credential / External Action /
  Data Access / Data Exfiltration / Business Process Manipulationを参照）

**[Decision]** FindingはCanonical Authorityを持たない。

**[Fact]** PRODUCT_DEFINITION.md 7章は既に、Human-readable Reportは
Source of Truthではなく、将来のSource of Truth候補は**Canonical Assessment
Record**（未設計）であると確定している。本文書のFinding Conceptは、その
Canonical Assessment Recordの内部を構成する概念要素の一つであるが、本文書
自体がCanonical Assessment Recordの正式Schemaを定義するものではない
（1章Non-goals）。

---

## 8. Lifecycle

**[Decision]** MVP概念順序を以下に確定する。

```
Draft Finding
  → Internal Review
  → Confirmed Finding
  → Severity Assignment
  → Customer Output
```

- **Confirmation** は再現性（reproducibility）とEvidence品質の確認である。
  Severityの評価そのものではない。
- Severityは Confirmed Finding化される前に暫定値を持つことを許容するが、
  Customer Output時には確定していなければならない（5章参照）。

**[Decision]** Failed / safe attack attempts（失敗した、または安全に留まった
攻撃試行）はFindingを生成しない。Evidence / Test Resultとしてのみ保持する。
MVPでは **"No Issue Found Finding"を作らない**。

**[Decision]** Remediation stateはFinding lifecycleに内包しない。Finding は
**Security Assessment Result**（評価結論）である。Remediation trackingは
Engagement / Workflow側の責務とする。

**[Fact]** これはPRODUCT_DEFINITION.md 7章のDeliverables一覧で
「Findings（発見事項）」と「Remediation Guidance」が別項目として列挙されて
いることと整合する。

---

## 9. Retest

**[Decision]** Retestは元のFindingを上書きしない。Retestは新しいEvidenceを
生成し、そのEvidenceが元のFindingへ **retest relationship** として関連付け
られる。Historical Findingを破壊しない。

**[Fact]** これはPRODUCT_DEFINITION.md 9c「Retest Hypothesis（Tier別）」
（Design Partner: Limited Retestを含む/別見積り、Standard: Retest 1回を
含む場合あり、Complex: 別途スコープ）と矛盾しない。9cはTier別の商業的
取り扱いを定めるものであり、本章はそのRetestが実行された際のFinding/
Evidence構造上の扱いを定めるものである。

**[Fact]** これはTHREAT_MODEL.md 13章 Open Question 4「RetestをPhase 1
Threat Model内でどこまで扱うか（PRODUCT_DEFINITION.md 9c Retest
Hypothesisとの関係整理）」に対する、Finding Model観点からの回答である。
Threat Model自体の記述は変更しない。

---

## 10. Framework Mapping（OWASP / NIST / MITRE）

**[Decision]** OWASP / NIST / MITRE等の外部Frameworkは、Canonical Finding
へ直接埋め込まない。**Crosswalk Layer**（Finding本体とは別のMapping層）
限定で扱う。

**[Fact]** これはATTACK_TAXONOMY.md 3章の設計原則「Not a comprehensive AI
security taxonomy: OWASP LLM Top10やMITRE ATLAS等の網羅的分類体系の代替・
完成版を目指さない」および10章Non-goals「OWASP / MITRE互換分類の完成」を
Finding層へ延長したものであり、既存方針の変更ではない。

---

## 11. AI Agent Specific Handling

**[Decision]** Finding Modelは、評価対象がAI Agentであることに対して専用の
特別なFinding種別を新設しない。7章のRoot Cause / Trust Boundary violation /
Authority impactという3フィールドの枠組み自体が、Agentの行動（Action-centric、
PRODUCT_DEFINITION.md 4章）を評価するために設計されているため、追加の
AI-specific subtypeは不要である。

---

## 12. Router / MCP / Multi-Agent Compatibility

**[Decision]** Router / MCP / Multi-Agentに対して専用のFinding Category /
Fieldを作らない。既存の Root Cause / Trust Boundary violation / Authority
impact（7章）で表現する。

**[Decision]** Router / Gateway scopeは、現時点では一級（first-class）
Assessment Domainへ昇格させない。実案件でRouter起因のFindingが反復して
観測される場合にのみ、THREAT_MODEL.md Scopeの再検討を行う（経験的トリガー
条件であり、投機的な事前設計は行わない）。

**[Fact]** これはTHREAT_MODEL.md 2章のScope Boundary（AI Gateway / Model
RouterをLater/Out of Scopeとする既存Decision）と整合する。本章はFinding
Modelの観点からその境界を維持するものであり、Scope自体を変更しない。

---

## 13. Assumptions

- **[Fact]** Phase 0 / Phase 1 / Phase 2はそれぞれ上記commitとしてbaseline
  化され、origin/mainへpush済みである。
- **[Fact]** 本文書は、PRODUCT_DEFINITION.md / THREAT_MODEL.md /
  ATTACK_TAXONOMY.mdの既存Decision / Hypothesis / Open Questionを変更しない。
  矛盾が生じた場合、本文書の該当箇所を修正するか、STOPして人間へ報告する
  （本文書作成時点では矛盾は検出されていない）。
- **[Decision]** 本文書はFinding Concept Modelであり、正式なID体系
  （例: `ASA-FND-xxx`）、Schema、Persistence方式は定義しない。
- **[Hypothesis]** 5章のConfidence段階数（HIGH/MEDIUM/LOWの3段階が十分か）
  および8章Lifecycleの各段階の詳細な完了基準は、Phase 3以降の実装設計で
  精緻化されうる。

---

## 14. Resolved Open Questions（本文書でMVP Decisionとして確定した事項）

1. Failed / safe attack attemptsはFindingを生成しない。Evidence / Test
   Resultとして保持し、"No Issue Found Finding"はMVPでは作らない（8章）。
2. Finding ConfidenceはMVPでは定性的（HIGH/MEDIUM/LOW候補）。数式・自動
   Scoringは Deferred（5章）。
3. Attack CandidateなしFindingを許容する（structural / excessive-agency
   type）。ただしEvidence必須。Autonomous Behavior Deviation等を無理に
   既存Attack IDへ割り当てない（4章）。
4. Remediation stateはFinding lifecycleに内包しない。Engagement / Workflow
   側の責務とする（8章）。
5. Retestは元Findingを上書きしない。新Evidenceを生成し、元Findingへretest
   relationshipを持たせる（9章）。
6. Review/Confirmation順序: Draft Finding → Internal Review → Confirmed
   Finding → Severity Assignment → Customer Output（8章）。
7. Business CriticalityはScoping / Engagement Contextが所有する。Findingは
   参照のみ（6章）。
8. Router/Gatewayは現時点で一級Assessment Domainへ昇格しない。反復観測時
   のみTHREAT_MODEL Scope再検討（12章）。

**[Fact]** 上記8点に加え、以下の既存Open Questionへ本文書が部分的に回答した：

- ATTACK_TAXONOMY.md 12章 Open Question 5「Finding Severity/Risk Ratingとの
  接続を、どのPhaseで定義するか」→ 本文書（5章・6章）で概念レベルの接続を
  定義した。数式化・自動化は引き続きDeferred。
- THREAT_MODEL.md 13章 Open Question 4「RetestをPhase 1 Threat Model内で
  どこまで扱うか」→ Finding/Evidence構造上の扱いを本文書9章で確定した。

---

## 15. Remaining Deferred Questions

以下は本文書では確定せず、後続Phaseへ委ねる。

1. Finding正式ID体系（例: `ASA-FND-xxx`）の設計。
2. Confidence段階の最終的な語彙・数（HIGH/MEDIUM/LOWで十分か、追加段階が
   必要か）。
3. Crosswalk Layer（OWASP/NIST/MITRE Mapping）の具体的な構造・保守方法。
4. Canonical Assessment Recordの正式Schema設計（PRODUCT_DEFINITION.md 13章
   Open Question 6と同一の未決事項）。
5. ATTACK_TAXONOMY.md 12章 Open Question 1（Attack ID体系の正式化）は本文書
   の対象外のまま。
6. Remediation trackingを担うEngagement / Workflow側の具体的な設計。
7. Router/Gateway Findingの反復観測を判定する具体的な基準・閾値。
8. JSON Schema / DB Schema / API / Persistence Model / Workflow Engine /
   Severity計算式の実装設計（1章Non-goals、すべてPhase 3以降）。
