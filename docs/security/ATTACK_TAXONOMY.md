# Phase 2 Minimal Attack Taxonomy — Luvira Agent Security Assessment

Status: Draft（Phase 2）
Baseline: Phase 1 Commercial-first Threat Model
（commit `029cb451d66e52f12cb0faeb179f9a5dfd807802`）

凡例: **[Fact]** 検証済み事実 / **[Hypothesis]** 未検証仮説 / **[Decision]** 人間承認済み決定 /
**[Open Question]** 人間の判断待ち

本文書はMinimal Attack Taxonomyであり、網羅的なAcademic / Comprehensive Attack
Taxonomyではない。Evidence Schema / Finding Schema / MVP Architecture /
Implementationも定義しない。それらは後続Phaseで別途設計する（13章参照）。

---

## 1. Purpose

**[Decision]** 本文書は **Commercial-first Minimal Attack Taxonomy** である。
目的は攻撃知識の網羅ではなく、Design Partner向けAssessment v1で
**実施・記録・説明しやすい最小分類**を作ることである。

具体的には、以下を定義する：

- Assessment v1で扱う最小限のAttack Category
- 各Attackの最小限の記述フォーマット
- Phase 1 Threat ModelのCore Threat Scenario CandidateとAttackの対応
- Business Impactとの対応
- v1 Core / Optional / Later Treatment

**[Fact]** 本文書は
[docs/security/THREAT_MODEL.md](THREAT_MODEL.md) および
[docs/product/PRODUCT_DEFINITION.md](../product/PRODUCT_DEFINITION.md) の
Decision / Hypothesis / Open Questionと矛盾しないことを前提に作成している。

---

## 2. Scope Boundary

**[Decision]** 本文書は THREAT_MODEL.md 8章のCore Threat Scenario
Candidate（8.1〜8.7）を入力として使用する。

**[Decision]** THREAT_MODEL.md 8.8（Commercial Assessment Requirement）は
技術的Attackではないため、本文書のAttack Listには直接含めない。8.8は
6章「初期Attack候補」内で **Commercial Output Requirement** として明示的に
区別して扱い、7章Mapping・8章Business Impact Mappingではattackではなく
Output Requirementとして接続する。

**[Decision]** Scope Boundary自体は THREAT_MODEL.md 2章 / PRODUCT_DEFINITION.md
5a/5b/6章と同一のCore/Optional/Later境界を継承する。新たなScope拡張は
行わない。

---

## 3. Taxonomy Design Principles

**[Decision]** 本Taxonomyは以下の設計原則に従う。

- **Action-centric**: Promptの内容そのものではなく、Agentが実際に行うAction
  （Tool呼び出し・データアクセス・外部システムへの操作）を分類の中心に置く。
- **Evidence-oriented**: 各Attackは、実行結果として何らかのEvidence
  （ログ・出力・証跡）が取得可能であることを前提に定義する。
- **Minimal for v1**: カテゴリ数・Attack数を最小限に絞り、網羅性より
  実施可能性を優先する。
- **Commercially explainable**: 各AttackはEnterprise Sales/Security Reviewの
  文脈で顧客に説明可能な形で記述する。
- **Safe to execute or prove through proof-of-action**: 各Attackは、
  THREAT_MODEL.md 10章Safety Constraintsに従い、実行またはProof-of-actionで
  安全に証跡化できることを前提とする。
- **Not a comprehensive AI security taxonomy**: OWASP LLM Top10やMITRE
  ATLAS等の網羅的分類体系の代替・完成版を目指さない。
- **Not an implementation plan**: Attack実行ツール・手順書・自動化の
  実装計画ではない。

---

## 4. Attack Category Model

**[Decision]** v1では以下6カテゴリに絞る。カテゴリ数は今後も
必要最小限に抑える方針とする。

1. **Prompt / Instruction Manipulation**
   （Prompt/指示操作によりAgentの挙動・目的を誘導する）
2. **Tool / Connector Abuse**
   （付与された権限の範囲内外でTool/Connectorを濫用する）
3. **Data Access / Exfiltration**
   （権限を超えたデータへのアクセス・持ち出し）
4. **Credential / Secret Exposure**
   （認証情報・トークン等の露出）
5. **Unauthorized External Action**
   （外部SaaS/API/DBに対する不正・意図しない操作）
6. **Business Workflow Manipulation**
   （複数Actionの連鎖による業務プロセスの誤誘導）

**[Fact]** 上記はTHREAT_MODEL.md 7章（Agentic Action Attack Surface: Authority
/ Permission / Tool / Connector / Credential / External Action / Data Access
/ Data Exfiltration / Business Process Manipulation）を、Attack分類として
再構成したものである。

---

## 5. Attack Entry Format

**[Decision]** 各Attackは以下フォーマットで記述する。

- **Attack ID**（軽量ID。例: `ASA-ATK-001`。正式なID体系設計には
  深入りしない）
- **Name**
- **Category**（4章のいずれか）
- **Description**
- **Primary Threat Scenario**（THREAT_MODEL.md 8.x章との対応）
- **Target Asset**
- **Entry Point**
- **Trust Boundary**
- **Preconditions**
- **Expected Evidence Type**（種類の例示のみ。Evidence Schemaではない）
- **Potential Business Impact**
- **Safety Notes**（THREAT_MODEL.md 10章Safety Constraintsとの対応）
- **v1 Treatment**: Core Candidate / Optional / Later
- **Status**: Hypothesis / Decision / Open Question

**[Fact]** 上記はAttack Candidate用のフォーマットである。Assessment
Method / Safety Pattern（`ASA-MTH-xxx`）は攻撃ではないため、縮小した
フィールド集合（ID / Name / Type / Related Attack / Category / Description
/ Expected Evidence Type / Safety Notes / Status）を用いる（6章
ASA-MTH-001参照）。

---

## 6. Minimal Attack List for v1

**[Hypothesis]** 以下はv1 Assessmentで扱う **Attack Candidate** である。
Formal Coverage定義ではなく、Design PartnerごとのScopingで削減・調整される
候補として扱う（9章参照）。

**[Decision]** 本章では以下3種類のEntryを明確に区別する。

- **Attack Candidate**（`ASA-ATK-xxx`）: 技術的な攻撃分類。5章のAttack Entry
  Formatをそのまま適用する。
- **Assessment Method / Safety Pattern**（`ASA-MTH-xxx`）: 攻撃そのものでは
  なく、特定のAttack Candidateを安全に検証するための実施方式。Attack
  Categoryには属さない。
- **Commercial Output Requirement**（`ASA-OUT-xxx`）: 技術的な攻撃ではなく、
  Assessment成果物側の要件。THREAT_MODEL.md 8.8と同一の位置づけ。

### ASA-ATK-001: Indirect Prompt Injection causing tool call

- **Category**: Prompt / Instruction Manipulation
- **Description**: 外部コンテンツ（文書・Webページ・メール等）に埋め込まれた
  指示によりAgentが誘導され、意図しないTool呼び出しを行う。
- **Primary Threat Scenario**: THREAT_MODEL.md 8.1
- **Target Asset**: Agent Tool Permissions, Connector Authorization
- **Entry Point**: Retrieved documents, Web pages, Emails/tickets, RAG sources
- **Trust Boundary**: User/External Content → LLM/Agent、
  LLM/Agent → MCP/Tool Calling
- **Preconditions**: Agentが外部コンテンツを読み込みTool呼び出し判断に
  利用する構成であること
- **Expected Evidence Type**: 誘導元コンテンツのキャプチャ、Tool呼び出し
  ログ、実行前後の状態差分
- **Potential Business Impact**: Enterprise deal blocker, Security
  Questionnaire failure
- **Safety Notes**: 可能な限りTest tenant/test accountで実施し、
  Proof-of-actionを優先する
- **v1 Treatment**: Core Candidate
- **Status**: Hypothesis

### ASA-ATK-002: Goal Hijacking causing external action

- **Category**: Prompt / Instruction Manipulation
- **Description**: Agentの目的・タスクが外部入力によって書き換えられ、
  本来意図しない外部Actionを実行してしまう。
- **Primary Threat Scenario**: THREAT_MODEL.md 8.2
- **Target Asset**: External Action Channels, Internal Business Data
- **Entry Point**: Chat input, Retrieved documents, Tool parameters
- **Trust Boundary**: User/External Content → LLM/Agent、
  LLM/Agent → MCP/Tool Calling → Tool/Connector → SaaS/DB/API
- **Preconditions**: Agentが外部Actionを実行できる権限を持つこと
- **Expected Evidence Type**: 目的書き換えの入力例、実行されたAction記録
- **Potential Business Impact**: Unauthorized business action, Enterprise
  deal blocker
- **Safety Notes**: 実Actionではなくdry-run/Proof-of-actionを優先する
  （10章参照）
- **v1 Treatment**: Core Candidate
- **Status**: Hypothesis

### ASA-ATK-003: Over-permissioned tool execution

- **Category**: Tool / Connector Abuse
- **Description**: Agentに付与されたTool権限が業務上必要な範囲を超えており、
  正規のフローの中でも過剰な操作が可能になっている。
- **Primary Threat Scenario**: THREAT_MODEL.md 8.3
- **Target Asset**: Agent Tool Permissions, Connector Authorization,
  Internal Business Data
- **Entry Point**: Tool parameters, Chat input
- **Trust Boundary**: LLM/Agent → MCP/Tool Calling、
  Tool/Connector → SaaS/DB/API
- **Preconditions**: Tool権限の棚卸し情報が取得できること（THREAT_MODEL.md
  PRODUCT_DEFINITION.md 5a権限棚卸しと連動）
- **Expected Evidence Type**: 権限一覧と実行可能操作の対応表、過剰権限の
  実行ログ
- **Potential Business Impact**: Unauthorized business action, Regulatory /
  contractual concern
- **Safety Notes**: 破壊的操作は行わず、権限が及ぶ範囲の確認に留める
- **v1 Treatment**: Core Candidate
- **Status**: Hypothesis

### ASA-ATK-004: Unauthorized data retrieval via connector

- **Category**: Data Access / Exfiltration
- **Description**: Connector経由で、アクセス権限を超えたデータが取得できて
  しまう。
- **Primary Threat Scenario**: THREAT_MODEL.md 8.4
- **Target Asset**: Customer Data, Enterprise SaaS Data
- **Entry Point**: Connector outputs, API responses
- **Trust Boundary**: Tool/Connector → SaaS/DB/API
- **Preconditions**: Connectorがテナント/ユーザー境界を跨いだデータに
  到達しうる構成であること
- **Expected Evidence Type**: 取得できたデータの種別（内容そのものは
  最小化・redact）、アクセス経路のログ
- **Potential Business Impact**: Customer data exposure, Regulatory /
  contractual concern
- **Safety Notes**: 実データの持ち出しは行わず、アクセス可否の証跡に
  留める（No uncontrolled data exfiltration）
- **v1 Treatment**: Core Candidate
- **Status**: Hypothesis

### ASA-ATK-005: RAG-mediated sensitive data exposure

- **Category**: Data Access / Exfiltration
- **Description**: RAG検索結果を通じて、アクセス権限を超えた機密情報が
  Agentの応答に露出する。
- **Primary Threat Scenario**: THREAT_MODEL.md 8.4
- **Target Asset**: Customer Data, Retrieval / RAG Sources
- **Entry Point**: RAG sources
- **Trust Boundary**: LLM/Agent → RAG/Memory
- **Preconditions**: RAGソースに機密度の異なる情報が混在していること
- **Expected Evidence Type**: 応答内に露出した情報の種別、検索クエリと
  結果の対応記録
- **Potential Business Impact**: Customer data exposure, Loss of customer
  trust
- **Safety Notes**: Evidence内の機密値はredact/最小化する
- **v1 Treatment**: Core Candidate
- **Status**: Hypothesis

### ASA-ATK-006: Credential or token exposure in agent/tool output

- **Category**: Credential / Secret Exposure
- **Description**: Agentの応答やTool出力の中に、Credential/Token/API Keyが
  意図せず含まれ、露出する。
- **Primary Threat Scenario**: THREAT_MODEL.md 8.5
- **Target Asset**: Credentials / Tokens / API Keys
- **Entry Point**: Tool parameters, MCP server responses, Connector outputs
- **Trust Boundary**: Agent Runtime → Credential/Permission Store、
  LLM/Agent → MCP/Tool Calling
- **Preconditions**: Tool/Connectorの出力にCredentialが混入しうる構成
  であること
- **Expected Evidence Type**: 露出箇所の特定情報（値自体はEvidenceとして
  保持せずマスクする）
- **Potential Business Impact**: Regulatory / contractual concern, Incident
  response burden
- **Safety Notes**: 実際のCredential値はEvidenceとして保存せず、露出した
  事実のみを記録する（Credential handling restrictions）
- **v1 Treatment**: Core Candidate
- **Status**: Hypothesis

### ASA-ATK-007: Unauthorized SaaS/API/DB modification

- **Category**: Unauthorized External Action
- **Description**: Agentが接続先SaaS/API/DBに対し、権限を持つが本来意図
  しない更新・削除操作を実行する。
- **Primary Threat Scenario**: THREAT_MODEL.md 8.6
- **Target Asset**: Enterprise SaaS Data, Internal Business Data
- **Entry Point**: Tool parameters, Connector outputs
- **Trust Boundary**: Tool/Connector → SaaS/DB/API
- **Preconditions**: Test tenant/test accountが用意できること、または
  顧客承認済みの限定範囲があること
- **Expected Evidence Type**: 操作前後の状態差分、実行ログ
- **Potential Business Impact**: Unauthorized business action, Remediation
  cost
- **Safety Notes**: No destructive action without explicit approval /
  Customer-approved rollback or stop condition
- **v1 Treatment**: Core Candidate
- **Status**: Hypothesis

### ASA-ATK-008: Business workflow manipulation through action chaining

- **Category**: Business Workflow Manipulation
- **Description**: 個々のAction自体は権限内だが、複数Actionの組み合わせ・
  順序操作によって業務ワークフロー全体が意図しない結果に誘導される。
- **Primary Threat Scenario**: THREAT_MODEL.md 8.7
- **Target Asset**: Internal Business Data, Customer Trust / Enterprise
  Deal Progress
- **Entry Point**: Chat input, Retrieved documents, Tool parameters
- **Trust Boundary**: LLM/Agent → MCP/Tool Calling → Tool/Connector →
  SaaS/DB/API（複数境界の連鎖）
- **Preconditions**: Agentが複数Toolを連続実行できる構成であること
- **Expected Evidence Type**: Action連鎖のログ、意図しない最終状態の記録
- **Potential Business Impact**: Unauthorized business action, Loss of
  customer trust
- **Safety Notes**: 連鎖実行前に停止条件を記録する（Record stop conditions
  before executing tool-based tests）
- **v1 Treatment**: Core Candidate
- **Status**: Hypothesis

### ASA-MTH-001: Destructive action proof-of-action（Attackではない）

**[Fact]** これはAttackではなく、**Assessment Method / Safety Pattern** で
ある。ASA-ATK-007（Unauthorized SaaS/API/DB modification）等、破壊的操作を
伴いうるAttack Candidateを安全に検証するための実施方式であり、4章の
Attack Categoryには属さない。

- **ID**: ASA-MTH-001
- **Name**: Destructive action proof-of-action
- **Type**: Assessment Method / Safety Pattern
- **Related Attack**: ASA-ATK-007
- **Category**: N/A（Attack Categoryには属さない）
- **Description**: 破壊的操作（削除・不可逆な更新等）が技術的に実行可能で
  あることを、実際の破壊的実行ではなく、dry-run / 権限確認 / APIレスポンス
  / test tenant validation等で示す検証方式。
- **Expected Evidence Type**: 実行可能性の証跡（dry-run結果、権限確認、
  APIレスポンス、test tenantでの再現等。実破壊は行わない）
- **Safety Notes**: Use proof-of-action instead of destructive execution
  where possible（本Methodの中心方針そのもの）
- **Status**: Hypothesis

### ASA-OUT-001: Security review evidence gap mapping（Attackではない）

**[Fact]** これはAttackではなく、**Commercial Output Requirement** である。
4章のAttack Categoryにも属さない。

- **Category**: N/A（Commercial Output Requirement）
- **Description**: ASA-ATK-001〜008（および該当する場合はASA-MTH-001）で
  得られた技術的Findingを、顧客のSecurity Questionnaire / Enterprise
  Reviewで使えるEvidenceへ変換できるかというAssessment成果物側の要件。
  THREAT_MODEL.md 8.8と同一の位置づけ。
- **Primary Threat Scenario**: THREAT_MODEL.md 8.8（Commercial Assessment
  Requirement）
- **Target Asset**: Customer Trust / Enterprise Deal Progress
- **Entry Point**: N/A
- **Trust Boundary**: N/A
- **Preconditions**: ASA-ATK-001〜008のうち最低1件以上のFindingが存在する
  こと
- **Expected Evidence Type**: N/A（Evidence自体の生成物ではなく、既存
  Evidenceの構成要件）
- **Potential Business Impact**: Enterprise deal blocker, Security
  Questionnaire failure
- **Safety Notes**: N/A
- **v1 Treatment**: Commercial Requirement / Core Output Requirement
  （Core Candidateの技術Attackとは扱いを分ける）
- **Status**: Hypothesis

---

## 7. Attack-to-Threat Scenario Mapping

**[Fact]** THREAT_MODEL.md 8.1〜8.7（技術的Threat Scenario Candidate）との
対応は以下の通り。8.8はAttackではなくOutput Requirementとして別扱いする。
8.6にはAttack Candidateに加え、Assessment Method（ASA-MTH-001）も接続する。

| Threat Model Scenario | 対応Entry |
|---|---|
| 8.1 Indirect Prompt Injection leading to unauthorized tool use | ASA-ATK-001 |
| 8.2 Goal Hijacking leading to unintended external action | ASA-ATK-002 |
| 8.3 Tool misuse / Tool abuse through over-permissioned Agent | ASA-ATK-003 |
| 8.4 Data access or exfiltration via RAG / Connector / Tool | ASA-ATK-004, ASA-ATK-005 |
| 8.5 Credential or token exposure through Agent behavior or tool output | ASA-ATK-006 |
| 8.6 Unauthorized modification or deletion through connected SaaS/API/DB | ASA-ATK-007（Attack Candidate）, ASA-MTH-001（Assessment Method） |
| 8.7 Business workflow manipulation through Agent-executed actions | ASA-ATK-008 |
| 8.8 Commercial Assessment Requirement（Attackではない） | ASA-OUT-001 |

---

## 8. Attack-to-Business Impact Mapping

**[Hypothesis]** THREAT_MODEL.md 9章Business Impact Modelとの対応。
1件のAttackが複数Impactに対応する場合がある。ASA-MTH-001はAttackではない
ため本表には含めない（下記Method Notes参照）。

| Attack ID | Enterprise deal blocker | Security Questionnaire failure | Customer data exposure | Unauthorized business action | Loss of customer trust | Regulatory / contractual concern | Remediation cost | Incident response burden |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| ASA-ATK-001 | ● | ● | | | | | | |
| ASA-ATK-002 | ● | | | ● | | | | |
| ASA-ATK-003 | | | | ● | | ● | | |
| ASA-ATK-004 | | | ● | | | ● | | |
| ASA-ATK-005 | | | ● | | ● | | | |
| ASA-ATK-006 | | | | | | ● | | ● |
| ASA-ATK-007 | | | | ● | | | ● | |
| ASA-ATK-008 | | | | ● | ● | | | |
| ASA-OUT-001 | ● | ● | | | | | | |

**[Hypothesis]** Method Notes（ASA-MTH-001）: ASA-MTH-001はAttackとしての
Business Impactを持たない。ASA-ATK-007のBusiness Impact（Unauthorized
business action, Remediation cost）を、破壊的実行を伴わずに安全に証跡化
するための手段として位置づける。

---

## 9. v1 Core / Optional / Later Treatment

**[Decision]** Phase 0 (PRODUCT_DEFINITION.md 5a) / Phase 1
(THREAT_MODEL.md 8章) と同様の原則を継承する：

- ASA-ATK-001〜008は **Core Candidate**、ASA-MTH-001は **Assessment
  Method / Safety Pattern**、ASA-OUT-001は **Commercial Requirement** と
  して提示するが、「初回Assessmentで必ず全件実施する」ものではない。
- 実際にどのAttackをDesign Partnerごとの初回Assessmentで実施するかは、
  Scoping段階で確定する（PRODUCT_DEFINITION.md 13章 Open Question 10、
  THREAT_MODEL.md 13章と同一の未決事項の延長）。
- Multi-Agent攻撃、Cross-Agent Manipulation、Sandbox Escape、Memory
  Poisoning、RAG Poisoning等、THREAT_MODEL.md 2章でLater/Out of Scopeと
  された領域に対応するAttackは、本文書でも定義しない（Optional/Later）。

---

## 10. Explicit Non-goals

**[Decision]** 本文書では以下を行わない。

- 網羅的AI Security Taxonomyの構築
- OWASP / MITRE互換分類の完成
- Evidence Schemaの定義
- Finding Schemaの定義
- Attack実行手順の詳細化
- Tool / Runner / Scanner実装
- Continuous Monitoring設計
- AI Gateway / Model Routerへの接続設計

---

## 11. Assumptions

- **[Fact]** Phase 0 Repository Foundation & Product Definitionはcommit
  `97fbb1d036f3beb5d3d25676e16d1ffe7fa39cdf`、Phase 1 Commercial-first
  Threat Modelはcommit `029cb451d66e52f12cb0faeb179f9a5dfd807802`として
  baseline化され、origin/mainへpush済みである。
- **[Fact]** 本Taxonomyは、THREAT_MODEL.md / PRODUCT_DEFINITION.mdの
  Decision/Hypothesis/Open Questionと矛盾しない範囲で作成している。
- **[Decision]** 本文書は網羅的Attack Taxonomyではない。Coverage定義・
  正式なID体系はPhase 2の対象外とし、必要になった場合は別途設計する。
- **[Decision]** 本Phaseでは、Evidence Schema / Finding Schema /
  MVP Architecture / Implementationへは進まない。
- **[Hypothesis]** Attack Coverage（このリストで十分か）、Attack ID体系の
  正式化要否、Evidence Type、実施体制は、PRODUCT_DEFINITION.md /
  THREAT_MODEL.mdと同様にHypothesisまたはOpen Questionのままとし、
  本文書では確定しない。
- **[Hypothesis]** 6章のAttack Candidateは、実際のDesign Partner環境で
  全件が有効/実施可能とは限らない。

---

## 12. Open Questions

人間が判断すべき未決事項。Claudeが独断で埋めない。

1. v1でAttack ID体系（`ASA-ATK-xxx`）をどこまで正式化するか。
2. Design PartnerごとにAttack List（6章）をどう削るか（判断基準・
   プロセス）。
3. Proof-of-actionで十分なAttack（例: ASA-ATK-007とASA-MTH-001の関係）と、
   実Actionが必要なAttackの判断基準。
4. Expected Evidence Type（5章フォーマット項目）の正式分類を、どのPhaseで
   定義するか。
5. Finding Severity / Risk Ratingとの接続を、どのPhaseで定義するか。
6. 法務・契約上、どのAttackを本番環境で実施可能にするか（THREAT_MODEL.md
   13章Open Question 1・7との関連）。
7. Security Questionnaire向け出力への変換ルール（ASA-OUT-001の具体化）を
   どのPhaseで定義するか。
8. ASA-MTH-001のようなAssessment Method / Safety Patternを、正式な
   Method分類（ID体系・他Attackとの関連付けルールを含む）としてPhase 3
   以降でどう扱うか。

---

## 13. Relationship to Future Evidence / Finding Model

**[Decision]** 本文書はEvidence SchemaでもFinding Schemaでもない。

**[Decision]** Phase 3以降でEvidence / Finding Data Modelを設計する場合、
本文書6章の以下3種類のEntryを**入力（Input）**として使用する。ただし、
Phase 3以降の設計では、この3種類を区別して扱う必要があることを明記する：

- **Attack Candidate**（ASA-ATK-001〜008）: 技術的な攻撃としてのFinding化
- **Assessment Method / Safety Pattern**（ASA-MTH-001）: 特定のAttack
  Candidate（ASA-ATK-007）を安全に検証した際の実施記録・証跡としての
  Finding化（Attackそのものとしては扱わない）
- **Commercial Output Requirement**（ASA-OUT-001）: 技術的FindingをEvidence
  として構成できるかというAssessment成果物側の要件としての扱い

ただし、以下は本文書では確定せず、すべてPhase 3以降で別途設計する：

- Evidenceのフィールド定義・保存形式
- Findingのフィールド定義・保存形式
- Severity / Risk計算ロジック
- Report生成ロジック・テンプレート
- Canonical Assessment Record（PRODUCT_DEFINITION.md 7章参照）との
  具体的なマッピング

本文書のAttack Candidateは、あくまで「v1 Assessmentで実施・記録・説明
しやすい最小分類」であり、Evidence/Findingの正式データモデルとして
直接転記されることを保証するものではない。
