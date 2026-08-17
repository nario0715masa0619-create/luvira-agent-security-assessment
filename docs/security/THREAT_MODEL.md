# Phase 1 Threat Model — Luvira Agent Security Assessment

Status: Draft（Phase 1）
Baseline: Phase 0 Repository Foundation & Product Definition
（commit `97fbb1d036f3beb5d3d25676e16d1ffe7fa39cdf`）

凡例: **[Fact]** 検証済み事実 / **[Hypothesis]** 未検証仮説 / **[Decision]** 人間承認済み決定 /
**[Open Question]** 人間の判断待ち

本文書はThreat Modelであり、Formal Attack Taxonomyではない。
Evidence Schema / Finding Schema / MVP Architecture / Implementationも定義しない。
それらは後続Phaseで別途設計する（14章参照）。

---

## 1. Purpose

**[Decision]** 本文書は **Commercial-first Threat Model** である。目的は、
網羅的な研究分類（Academic/Comprehensive Attack Taxonomy）を作ることではなく、
Design Partner向けAssessment v1の**実施範囲と優先順位**を決めることである。

具体的には、以下を定義する：

- 何を守るのか（Assets to Protect）
- 誰・何が攻撃者/脅威主体になりうるのか（Threat Actors / Threat Sources）
- どのAttack Surfaceを対象にするのか（Agentic Action Attack Surface）
- どのBusiness Impactを重視するのか（Business Impact Model）
- v1 AssessmentでどのThreatをCore Candidateとして扱うのか
- どのThreatをOptional / Laterへ送るのか

**[Fact]** 本文書は
[docs/product/PRODUCT_DEFINITION.md](../product/PRODUCT_DEFINITION.md) の
Decision / Hypothesis / Open Questionと矛盾しないことを前提に作成している
（5章「Phase 0との整合性確認」参照はREADME/完了報告側に記載）。

---

## 2. Scope Boundary

**[Decision]** v1 Threat Modelは、PRODUCT_DEFINITION.md 5a/5b/6章のScope決定を
そのまま継承する。以下に絞る：

- AI Agent / RAG / MCP / Tool Calling / Connector / Credential / Permission /
  External Action
- Agentが持つ権限を通じて、現実のSaaS / DB / API / Business Processへ
  影響が出る経路
- Enterprise Sales / Security Reviewで説明価値が高いThreat

**[Decision]** 以下はLaterまたはOut of Scopeとして扱う（PRODUCT_DEFINITION.md
5b/6章と同一）：

- Multi-Agent高度攻撃
- Cross-Agent Manipulation
- Sandbox Escape
- CI/CD automated testing
- Continuous Monitoring
- AI Gateway / Model Router
- Generic Infrastructure Pentest
- Comprehensive Web Pentest

---

## 3. Assets to Protect

**[Hypothesis]** v1 Threat Modelが対象とする資産候補。実際にどの資産が
当該Design Partnerにとって重要かはEngagementごとのScopingで確定する。

- Customer Data（顧客企業が保有する、その先の顧客のデータ）
- Enterprise SaaS Data（Slack / Google Workspace / Salesforce等の接続先データ）
- Internal Business Data（社内DB・業務データ）
- Credentials / Tokens / API Keys
- Agent Tool Permissions（Agentに付与されたTool実行権限）
- Connector Authorization（Connector経由の認可状態）
- Retrieval / RAG Sources（RAGが参照する情報源）
- Memory Records, if applicable（Agentが永続Memoryを持つ場合のみ。Memory
  Poisoning攻撃手法自体の深掘りは5b/Optional・Laterだが、Memory Recordsに
  Credential/個人情報が混入するリスクは資産として認識する）
- External Action Channels（Agentが外部へActionを実行する経路そのもの）
- Customer Trust / Enterprise Deal Progress（技術的資産ではないが、
  商談進行・顧客信頼そのものを守るべき資産として扱う）

**[Open Question]** Design Partnerごとの資産優先順位付けは、本文書ではなく
Scoping段階で確定する。

---

## 4. Trust Boundaries

**[Decision]** v1 Threat Modelでは、以下を分析観点・基本カテゴリとして採用する。

1. **User / External Content → LLM / Agent**
   （ユーザー入力および外部コンテンツがAgentに渡る境界）
2. **LLM / Agent → RAG / Memory**
   （Agentが検索・記憶情報を取得/書き込みする境界）
3. **LLM / Agent → MCP / Tool Calling**
   （AgentがTool/MCP経由で行動を実行する境界）
4. **Tool / Connector → SaaS / DB / API**
   （Tool/Connectorが実際の外部システムへ到達する境界）
5. **Agent Runtime → Credential / Permission Store**
   （Agent実行環境が認証情報・権限ストアにアクセスする境界）
6. **Assessment Operator → Customer Environment**
   （診断実施者が顧客環境に対して操作を行う境界。10章Safety Constraints対象）

**[Hypothesis / Candidate]** 実際に該当するTrust Boundary、および各境界における
具体的なリスクの有無は、Design PartnerごとのScopingで確定する。上記一覧は
固定チェックリストではなく、初回Assessmentの候補カテゴリである。

---

## 5. Threat Actors / Threat Sources

**[Decision]** v1 Threat Modelでは、以下を分析観点・基本カテゴリとして採用する。

- Malicious external user（外部の悪意あるユーザー）
- Malicious tenant / customer user（マルチテナント環境下の悪意ある利用者）
- Compromised legitimate user（乗っ取られた正規ユーザー）
- External content controlled by attacker（攻撃者が制御する外部コンテンツ）
- Prompt injection embedded in documents, tickets, emails, webpages, or RAG
  sources（文書・チケット・メール・Webページ・RAGソースへの埋め込み型攻撃）
- Over-permissive internal operator or admin（過剰権限を持つ社内運用者/管理者）
- Misconfigured Agent / Tool / Connector（設定ミスによる意図しない権限付与）
- Non-malicious user causing unintended action（悪意なくAgentに意図しない
  Actionを実行させてしまう一般ユーザー）

**[Hypothesis / Candidate]** 実際に該当するThreat Actor、および各カテゴリの
発生可能性・深刻度は、Design PartnerごとのScopingで確定する。上記一覧は
固定チェックリストではなく、初回Assessmentの候補カテゴリである。

---

## 6. Entry Points

**[Decision]** v1 Threat Modelでは、以下を分析観点・基本カテゴリとして採用する。

- Chat input
- Uploaded files
- Retrieved documents
- Web pages
- Emails / tickets / Slack messages
- RAG sources
- Memory write paths
- Tool parameters
- MCP server responses
- Connector outputs
- API responses

**[Hypothesis / Candidate]** 実際に該当するEntry Pointは、Design Partnerごとの
Agent構成・接続先に依存し、Scopingで確定する。上記一覧は固定チェックリストでは
なく、初回Assessmentの候補カテゴリである。

---

## 7. Agentic Action Attack Surface

**[Decision]** PRODUCT_DEFINITION.md 1章（Product Purpose）および5a章
（v1 Core Scope Candidate）と整合させ、v1 Threat Modelでは以下を分析観点・
基本カテゴリとして採用する。

- Authority
- Permission
- Tool
- Connector
- Credential
- External Action
- Data Access
- Data Exfiltration
- Business Process Manipulation

**[Fact]** これはLUVIRA-ASA-001の概念Attack Surface
（User/External Content → LLM/Agent → RAG/Memory → MCP/Connector → Tool →
Credential/Permission → API/DB/SaaS/Internal System → External Action/
Business Impact）と整合する。

**[Hypothesis / Candidate]** 実際に該当するAttack Surfaceの範囲・深さは、
Design PartnerごとのAgent構成・権限モデルに依存し、Scopingで確定する。
上記一覧は固定チェックリストではなく、初回Assessmentの候補カテゴリである。

---

## 8. Core Threat Scenarios for v1

**[Hypothesis]** 以下は **v1 Core Threat Scenario Candidate** である。
Formal Attack Taxonomyの分類体系ではなく、Design Partner向けAssessmentで
優先的に検証する候補シナリオの記述にとどめる。「Core」ではなく
「Core Candidate」として扱い、最終的な必須/削除判断はScopingで行う
（PRODUCT_DEFINITION.md 5a・13章Open Question 10と整合）。

**[Fact]** 8.1〜8.7は技術的Attack Scenario Candidateである。8.8は技術的
Attack Scenarioではなく、8.1〜8.7のFindingをEnterprise Sales / Security
Reviewで使えるEvidenceへ変換できるかというCommercial Assessment
Requirement（Assessment成果物側の要件）として区別して扱う。

### 8.1 Indirect Prompt Injection leading to unauthorized tool use

- **Description**: 外部コンテンツ（文書・Webページ・メール等）に埋め込まれた
  指示によってAgentが誘導され、意図しないTool呼び出しを行う。
- **Asset at risk**: Agent Tool Permissions, Connector Authorization
- **Entry point**: Retrieved documents, Web pages, Emails/tickets, RAG sources
- **Trust boundary crossed**: User/External Content → LLM/Agent、
  LLM/Agent → MCP/Tool Calling
- **Potential business impact**: 意図しないTool実行による誤操作・データ漏洩
- **Why this matters for Enterprise Sales/Security Review**: Prompt Injection
  は最も一般的に問われるAI固有リスクであり、Evidence付きで説明できないと
  Questionnaireの回答材料が不足する
- **v1 treatment**: Core Candidate

### 8.2 Goal Hijacking leading to unintended external action

- **Description**: Agentの目的・タスクが外部入力によって書き換えられ、
  本来意図しない外部Actionを実行してしまう。
- **Asset at risk**: External Action Channels, Internal Business Data
- **Entry point**: Chat input, Retrieved documents, Tool parameters
- **Trust boundary crossed**: User/External Content → LLM/Agent、
  LLM/Agent → MCP/Tool Calling → Tool/Connector → SaaS/DB/API
- **Potential business impact**: 業務プロセスの誤実行、外部システムへの
  不正なAction
- **Why this matters for Enterprise Sales/Security Review**: 「AIが目的を
  乗っ取られた場合に何が起きるか」を具体的に説明できることが差別化になる
- **v1 treatment**: Core Candidate

### 8.3 Tool misuse / Tool abuse through over-permissioned Agent

- **Description**: Agentに付与されたTool権限が業務上必要な範囲を超えており、
  正規のフローの中でも過剰な操作が可能になっている。
- **Asset at risk**: Agent Tool Permissions, Connector Authorization,
  Internal Business Data
- **Entry point**: Tool parameters, Chat input
- **Trust boundary crossed**: LLM/Agent → MCP/Tool Calling、
  Tool/Connector → SaaS/DB/API
- **Potential business impact**: 権限逸脱による誤操作・想定外のデータ変更
- **Why this matters for Enterprise Sales/Security Review**: Excessive Agency
  はSecurity Questionnaireで頻出する論点であり、権限棚卸し（5a）と直結する
- **v1 treatment**: Core Candidate

### 8.4 Data access or exfiltration via RAG / Connector / Tool

- **Description**: RAG検索結果、Connector経由の取得データ、Tool実行結果を
  通じて、アクセス権限を超えたデータが露出・持ち出される。
- **Asset at risk**: Customer Data, Enterprise SaaS Data, Retrieval/RAG
  Sources
- **Entry point**: RAG sources, Connector outputs, API responses
- **Trust boundary crossed**: LLM/Agent → RAG/Memory、
  Tool/Connector → SaaS/DB/API
- **Potential business impact**: 顧客データ漏洩、契約・規制上の懸念
- **Why this matters for Enterprise Sales/Security Review**: データ漏洩は
  Enterprise商談における最大級のBlockerになりうる
- **v1 treatment**: Core Candidate

### 8.5 Credential or token exposure through Agent behavior or tool output

- **Description**: Agentの応答やTool出力の中に、Credential/Token/API Keyが
  意図せず含まれ、露出する。
- **Asset at risk**: Credentials / Tokens / API Keys
- **Entry point**: Tool parameters, MCP server responses, Connector outputs
- **Trust boundary crossed**: Agent Runtime → Credential/Permission Store、
  LLM/Agent → MCP/Tool Calling
- **Potential business impact**: 認証情報漏洩による二次被害、
  インシデント対応コスト増大
- **Why this matters for Enterprise Sales/Security Review**: Credential
  Exposureは監査・契約上の重大懸念として扱われやすい
- **v1 treatment**: Core Candidate

### 8.6 Unauthorized modification or deletion through connected SaaS / API / DB

- **Description**: Agentが接続先SaaS/API/DBに対し、権限を持つが本来意図しない
  更新・削除操作を実行する。
- **Asset at risk**: Enterprise SaaS Data, Internal Business Data
- **Entry point**: Tool parameters, Connector outputs
- **Trust boundary crossed**: Tool/Connector → SaaS/DB/API
- **Potential business impact**: データ破壊・業務停止、復旧コスト
- **Why this matters for Enterprise Sales/Security Review**: 破壊的操作の
  可能性は顧客が最も懸念する項目の一つであり、10章Safety Constraintsと
  直結する
- **v1 treatment**: Core Candidate

### 8.7 Business workflow manipulation through Agent-executed actions

- **Description**: 個々のAction自体は権限内だが、複数Actionの組み合わせ・
  順序操作によって業務ワークフロー全体が意図しない結果に誘導される。
- **Asset at risk**: Internal Business Data, Customer Trust/Enterprise Deal
  Progress
- **Entry point**: Chat input, Retrieved documents, Tool parameters
- **Trust boundary crossed**: LLM/Agent → MCP/Tool Calling → Tool/Connector
  → SaaS/DB/API（複数境界の連鎖）
- **Potential business impact**: 業務プロセスの誤実行が積み重なることによる
  間接的損害
- **Why this matters for Enterprise Sales/Security Review**: 単発の脆弱性
  ではなく「Agentが業務プロセスに与える影響」という説明軸を提供できる
- **v1 treatment**: Core Candidate

### 8.8 Commercial Assessment Requirement: Security Questionnaire gap

- **Description**: これは技術的Attack Scenarioではない。8.1〜8.7で得られる
  技術的Findingを、Enterprise Sales / Security Reviewの場で使えるEvidenceへ
  変換できるかというAssessment成果物側の要件である。顧客がSecurity
  Questionnaire/Enterprise Reviewの場でAI固有リスクをEvidence付きで
  説明できない、という商業的ギャップに対応する。
- **Asset at risk**: Customer Trust / Enterprise Deal Progress
- **Entry point**: N/A（技術的Entry Pointではなく、商談・審査プロセスが起点）
- **Trust boundary crossed**: N/A（Assessment Operator → Customer
  Environmentの外側、営業/審査プロセス上のGap）
- **Potential business impact**: Enterprise商談の停滞・失注
- **Why this matters for Enterprise Sales/Security Review**: これは本
  Product Purpose（PRODUCT_DEFINITION.md 1章）そのものであり、v1の
  商用存在意義と直結する
- **v1 treatment**: Commercial Requirement / Core Output Requirement
  （技術的Threatではなく、8.1〜8.7のFindingをEnterprise Sales/Security
  Review向けEvidenceとして構成できるかというAssessment成果物要件として扱う）

**[Open Question]** 上記のうち、技術的Threat Scenario Candidate（8.1〜8.7）と
Commercial Assessment Requirement（8.8）を合わせて提示したが、実際に何件・
どのシナリオをDesign Partnerごとの初回Assessmentで実施するかはScopingで
確定する（PRODUCT_DEFINITION.md 13章 Open Question 10と同一の未決事項）。

---

## 9. Business Impact Model

**[Hypothesis]** 技術的深刻度だけでなく、以下の商業影響を評価軸に含める。

- **Enterprise deal blocker**: Findingが商談進行を止めうるか
- **Security Questionnaire failure**: Questionnaire回答に使えない/
  ネガティブに働くか
- **Customer data exposure**: 顧客データ（顧客の顧客データを含む）への影響
- **Unauthorized business action**: 業務プロセスへの誤実行・不正実行
- **Loss of customer trust**: 顧客との信頼関係への影響
- **Regulatory / contractual concern**: 規制・契約上の懸念（SOC2/ISMS等の
  Procurement文脈を含む）
- **Remediation cost**: 是正対応にかかるコスト・工数
- **Incident response burden**: インシデント発生時の対応負荷

**[Fact]** 「安全を保証する」「すべての脆弱性を発見する」という表現は
PRODUCT_DEFINITION.md 4章の禁止表現方針を継承し、本文書のBusiness Impact
Modelにも適用する（Impact評価は可能性の説明であり、保証ではない）。

---

## 10. Safety Constraints for Assessment Execution

**[Decision]** 顧客環境に対するAssessment実施時、以下を安全制約として採用する。

- Written scope agreement before execution（実施前の書面Scope合意）
- No destructive action without explicit approval（明示承認なしの
  破壊的操作は行わない）
- No uncontrolled data exfiltration（制御されないデータ持ち出しは行わない）
- Use test accounts / test tenants where possible（可能な限りテスト
  アカウント/テナントを使用する）
- Limit production impact（本番環境への影響を最小化する）
- Evidence capture must avoid unnecessary sensitive data retention
  （Evidence取得は不必要な機密データ保持を避ける）
- Customer-approved rollback or stop condition（顧客承認済みの
  Rollback/停止条件を事前に定める）
- Credential handling restrictions（Credentialの取り扱い制限）
- Prefer dry-run / simulation / test tenant validation before real external
  action（実Actionの実行前に、dry-run/シミュレーション/テストテナントでの
  検証を優先する）
- Use proof-of-action instead of destructive execution where possible
  （可能な限り、破壊的な実行そのものではなくProof-of-actionを用いる）
- Redact or minimize sensitive values in Evidence（Evidence内の機密値は
  redactまたは最小化する）
- Record stop conditions before executing tool-based tests（Tool実行系の
  テストを開始する前に、停止条件を記録しておく）

**[Open Question]** 上記制約の契約上の位置づけ（免責事項・SLAとの関係）は
13章Open Questionsおよび法務プロセスで別途確定する。

---

## 11. Out of Scope Threats

**[Decision]** PRODUCT_DEFINITION.md 6章（Explicit Out of Scope）と整合し、
以下をOut of ScopeまたはLaterとして扱う。

- Generic network exploitation
- Generic web app vulnerability scanning unrelated to AI component
- Full compliance audit
- 24/7 monitoring
- Advanced multi-agent autonomous attack campaigns
- AI Gateway / Model Router security design
- Formal security certification

---

## 12. Assumptions

- **[Fact]** Phase 0 Repository Foundation & Product Definitionは
  commit `97fbb1d036f3beb5d3d25676e16d1ffe7fa39cdf` としてbaseline化され、
  origin/mainへpush済みである。
- **[Fact]** 本Threat Modelは、PRODUCT_DEFINITION.mdのDecision/Hypothesis/
  Open Questionと矛盾しない範囲で作成している。
- **[Decision]** 本文書はFormal Attack Taxonomyではない。分類体系・ID体系・
  Coverage定義はPhase 2で別途設計する。
- **[Decision]** 本Phaseでは、Evidence Schema / Finding Schema /
  MVP Architecture / Implementationへは進まない。
- **[Hypothesis]** ICP・価格・Attack Coverage・実施体制は、
  PRODUCT_DEFINITION.mdと同様にHypothesisまたはOpen Questionのままとし、
  本Threat Modelでは確定しない。
- **[Hypothesis]** 8章のCore Threat Scenario Candidateは、実際のDesign
  Partner環境で全件が有効/実施可能とは限らない。

---

## 13. Open Questions

人間が判断すべき未決事項。Claudeが独断で埋めない。

1. 初回Design Partnerでは本番環境と検証環境のどちらを対象にするか。
2. 顧客が許可するExternal Actionの範囲（10章Safety Constraintsとの関係）。
3. Evidenceとして保存してよいデータの範囲（機密データ・個人情報の扱いを含む）。
4. RetestをPhase 1 Threat Model内でどこまで扱うか（PRODUCT_DEFINITION.md
   9c Retest Hypothesisとの関係整理）。
5. Threat Scenarioの優先順位（8章Core Candidate群）を商談前に固定するか、
   Scopingで決めるか。
6. Assessment実施者の権限・責任境界（10章 Assessment Operator → Customer
   Environment境界の運用ルール）。
7. 法務・契約・免責事項の設計タイミング（10章Safety Constraintsの契約上の
   位置づけをいつ確定するか）。
8. Proof-of-action（実行の証跡のみを残す方式）と実Action実行（実際に外部へ
   変更を及ぼす方式）を、どのような基準で使い分けるか。
9. Evidenceのredaction/minimization方針を、どのPhaseで正式化するか
   （Evidence Schema設計はPhase 1の対象外であり、本文書では方針の存在のみを
   記録し、詳細は設計しない）。

---

## 14. Relationship to Future Attack Taxonomy

**[Decision]** 本文書はThreat Modelであり、Attack Taxonomyではない。

Phase 2でFormal Attack Taxonomyを設計する場合、本文書8章のCore Threat
Scenario Candidateを**入力（Input）**として使用する。ただし、以下は
本文書では確定せず、すべてPhase 2で別途設計する：

- Attack手法の分類体系（Taxonomy structure）
- 各AttackのID体系（Attack ID Scheme）
- Coverage定義（どこまで網羅したと言えるかの基準）
- 個々のAttack手法の技術的な実行手順

本文書のCore Threat Scenario Candidateは、あくまで「v1 Assessmentで
商業的に優先すべき領域」を示すものであり、Attack Taxonomyの正式な
分類項目として直接転記されることを保証するものではない。
