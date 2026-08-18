# Phase 0 Product Definition — Luvira Agent Security Assessment

Status: Draft（Phase 0 — Commercial Tightening後）
凡例: **[Fact]** 検証済み事実 / **[Hypothesis]** 未検証仮説 / **[Decision]** 人間承認済み決定 /
**[Open Question]** 人間の判断待ち

本文書はThreat Model / Attack Taxonomy / Evidence Schema / Finding Schema /
MVP Architectureを定義するものではない。それらは後続Phaseで別途設計する。

---

## 1. Product Purpose

**[Decision]** 本プロダクトは、LLM/AI Agentが「何を言うか」ではなく、
権限・Tool・Credential・Connectorを介して「何をできてしまうか」を検証する
**Agentic Action Security Assessment** を提供する。

**[Decision]** 本プロダクトの商用上の存在意義は、単体のAI Security診断ではなく、
**Enterprise商談・Security Questionnaire対応・大企業導入審査（SOC2/ISMS等の
Procurementプロセスを含む）を前に進めるために、AI Agentが実際に何をできてしまうかを
Evidence付きで検証すること** である。

**[Decision]** Generic Prompt Injection診断／OWASP LLM Top10チェックリスト診断のみの
商品にはしない。Promptレイヤーの検証は行うが、それ単体を最終成果物としない。

**[Hypothesis]** 最終ゴールは、顧客が本番運用しているAI Agent/システムが、
攻撃を受けた場合に現実のビジネスインパクトへ到達しうる経路（Attack Path）を
具体的なEvidenceとともに提示し、Remediation及びEnterprise Sales/Security Review
での説明材料につなげることである。

---

## 2. Customer Problem

**[Hypothesis]** AI Agent/RAG/MCPを本番導入し、Enterprise顧客への販売を進めている企業は、
以下のような商業的に切実な課題を抱えている：

- Enterprise商談の場で、AI Agentの安全性を具体的に説明できない
  （「安全です」以上の説明材料がない）。
- Tool / Connector / Permission / Credentialに関するリスクを、証跡（Evidence）付きで
  示す手段がない。
- Security Questionnaireに対して、AI固有リスク（Prompt Injection, Tool Abuse,
  Excessive Agency等）に関する回答材料が不足している。
- 顧客データや外部SaaS（Slack, Google Workspace, CRM, DB等）に接続するAgentについて、
  事故発生時の説明責任・影響範囲が事前に整理されていない。
- Prompt Injection対策の有無は説明できても、それが実際の業務影響
  （データ漏洩、誤操作、外部システムへの不正なAction等）にどうつながるかを
  説明できない。

**[Open Question]** 上記課題のうち、実際にどれが最も強い購買動機になるかは
最初の顧客ヒアリング・Design Partner対話で検証する必要がある。現時点では未検証。

---

## 3. Initial ICP

### 3a. General ICP Hypothesis

**[Hypothesis]**（Explicit承認されるまでDecisionに昇格させない）

- **Target characteristics**: AI Agent/RAGを本番利用、MCP/Tool Callingを利用、
  顧客データにアクセスするシステムを持つ、Slack/Google Workspace/Salesforce/DB/SaaS等へ
  接続しているB2B AI SaaS/AI Agent開発企業。
- **Likely buyer**: CTO、VP Engineering、Head of Security（専任Security担当がいない
  規模の企業では経営層が兼務するケースを想定）。
- **Likely technical stakeholder**: AI/Agent機能を実装しているエンジニアリングリード。

### 3b. Initial Design Partner Candidate Profile（絞り込み版）

**[Hypothesis]** 最初のDesign Partner候補は、General ICPの中でも以下をすべて満たす
より狭いプロファイルとする：

- 従業員規模 **20〜100名**（前バージョンの20〜200名より絞り込み）のB2B AI SaaS /
  AI Agent企業
- **Enterprise顧客に販売中、または販売予定**である
- AI Agent / RAG / Copilotが顧客データ、社内SaaS、Slack、Google Workspace、CRM、DB、
  または業務APIに接続している
- Security Questionnaire、AIリスク説明、または第三者Security Evidenceの提出を
  すでに求められている、または近い将来求められる見込みがある
- SOC2 / ISMS / Enterprise Procurementの文脈でAI固有リスクの説明が必要になっている

**[Hypothesis]**
- **Trigger events**: Enterprise商談・Security Review対応が必要になった、
  SOC2/ISMS取得・更新プロセスの中でAI固有リスクの扱いを問われた、新しいAI Agent機能を
  リリースする直前、過去にPrompt Injection関連のインシデント/報告を受けた。
- **Buying motivation**: Enterprise商談を前に進めるための第三者Evidenceの必要性、
  Security Questionnaire回答材料の確保、実際のインシデント回避。
- **Disqualifiers**: AI Agent/RAG/MCPを本番利用していない、社内実験段階のみ、
  Enterprise顧客への販売動機がない、Security予算が確保できない、
  一般的なInfrastructure/Web Pentestのみを求めている。

**[Open Question]** 上記の絞り込みプロファイルの妥当性は最初の数件の商談・
Design Partner候補との対話で検証する。現時点で確定していない。

---

## 4. Product Promise

**[Decision]** 顧客へ約束するのは以下に限定する（過剰な保証は行わない）。

- 定義されたScope内のAI Agent/システムに対し、Agentic Action Security Assessmentの
  手法に基づき、実行可能な攻撃検証を行い、再現可能なEvidenceに基づくFindingを提示する。
- Findingごとにビジネスインパクトの観点でのRisk評価とRemediation Guidanceを提供する
  （**Remediation-ready Output**）。
- 成果物は、顧客がEnterprise商談・Security Questionnaire対応に活用できる形で提供する
  （**Enterprise Sales Enablement** / **Third-party Security Evidence**）。
- Findingは推測ではなく、実行結果に基づく説明（**Evidence-backed Risk Explanation**）とし、
  Promptレベルの反応ではなく実際のAction/権限行使に基づく評価
  （**Action-centric Findings**）とする。

**[Decision]** 以下は約束しない（禁止表現として明示）:

- 「安全を保証する」
- 「すべての脆弱性を発見する」
- 「SOC2/ISMS等の認証取得を保証する」「Security Questionnaireの合格を保証する」
- その他、網羅性・完全性・審査結果を保証する表現全般

**[Fact]** 上記のEnterprise Sales Enablement等は成果物の性質・用途に関する約束であり、
商談成立・審査通過そのものを保証するものではない。

---

## 5. Assessment Scope

**[Decision]** v1について、以下を方針として決定する（Hypothesisではない）：

- v1のAssessment Scopeを Core / Optional / Later に分離する
- v1ではPlatform化、Continuous Monitoring化、Multi-Agent高度攻撃、
  AI Gateway / Model Router開発へは進まない
- v1ではAction-centricなAssessmentに絞る

### 5a. v1 Core Scope Candidate（初回Assessmentの中心候補）

**[Hypothesis]** 以下はv1 Core Scopeの具体項目候補である。「初回Assessmentで必ず実施する」
項目ではなく、Design Partnerの環境・商談上の課題・安全制約・価格に応じて
削減・調整されうる候補として扱う。

- Agent Authority / Permission / Tool / Connector inventory（権限・接続の棚卸し）
- Tool misuse / Tool abuse risk assessment
- Indirect Prompt Injection / Goal HijackingによるAction誘導検証
- Data access / data exfiltration risk検証
- Unauthorized or unintended external action検証
- Evidence-backed Findings
- Remediation recommendations

**[Hypothesis]** Limited Retest optionは、Core Scope Candidateの必須実施項目ではなく、
9章Commercial Hypothesis（9c Tier別Retest Hypothesis）に従う候補として扱う。

**[Open Question]** Design Partnerごとに、Core Scope Candidateのどの項目を必須にし、
どの項目を削るかはScoping段階で確定する。現時点では確定していない。

### 5b. Optional / Later（v1 Coreには含めない）

- Memory Poisoning
- RAG Poisoning
- Multi-Agent攻撃
- Cross-Agent Manipulation
- Sandbox Escape
- CI/CD automated testing
- Continuous Monitoring
- Security Intelligence Platform
- AI Gateway / Model Router

**[Fact]** 上記はAttack Taxonomyの正式版ではない。Core Scope Candidate内の個別Attack手法・
分類体系は後続Phase（Formal Attack Taxonomy設計）で確定する。

---

## 6. Explicit Out of Scope

**[Decision]** v1では以下を対象としない（5bのOptional/Laterとは別に、
そもそもこのProductの対象外とする領域）。

- Generic Infrastructure Pentest（OS/Network層の一般的な脆弱性診断）
- Comprehensive Web Pentest（AIコンポーネントと無関係な一般Webアプリ診断）
- 組織全体のSecurity Audit（AI以外の全社セキュリティ体制評価）
- Compliance認証の発行（ISO27001, SOC2等の認証取得支援・保証ではない）
- 24/7 Continuous Monitoring
- セキュリティの保証（Product Promiseと同様、完全性・審査通過は約束しない）

---

## 7. Deliverables

**[Hypothesis]** v1納品物候補（正式Data Modelは未設計）:

- Executive Summary
- Assessment Scope（実施範囲の記録）
- Findings（発見事項）
- Evidence（実行結果・再現手順に基づく証跡）
- Attack Paths（攻撃経路の記述）
- Risk / Impact評価
- Remediation Guidance
- Retest Result（実施した場合、範囲は9章参照）
- Human-readable Report（上記を人間向けに整理した文書。Enterprise Sales/Security Review
  での利用を想定した体裁とする）

**[Decision]** Human-readable Report（PDF/Markdown/Executive Summary含む）は
**Human-readable Projection** であり、Source of Truthとしない。

**[Decision]** 将来のSource of Truth候補を **Canonical Assessment Record** と呼称する。
Human-readable Reportは、将来的にこのCanonical Assessment Recordから生成される
投影物として位置づける。

**[Fact]** Phase 0では、Canonical Assessment Recordの正式スキーマ設計には進まない。
名称と位置づけのみを本文書で確定する。

---

## 8. Assessment Workflow

**[Hypothesis]** 概念レベルのフロー（実装Workflowではない）:

```
Scoping
  → Environment Understanding
  → Threat-oriented Test Planning
  → Assessment Execution
  → Evidence Capture
  → Finding Review
  → Remediation Guidance
  → Report
  → Retest
```

---

## 9. Commercial Hypothesis

すべて **[Hypothesis]**（価格・期間はExplicit承認されるまでDecisionに昇格させない）。

### 9a. Pricing

- **Design Partner pricing**: 約498,000円〜798,000円
- **Standard Assessment pricing**: 約1,000,000円〜2,000,000円以上
- **複雑なAgent/Multi-Agent/MCP/External System構成**: 2,000,000円〜5,000,000円以上
- **Duration hypothesis**: 未確定。Scopingの結果に依存する想定。
- **Scope assumptions**: 対象Agent数、接続Connector数、Tool数が価格変動要因になる想定。
- **価格を上げる要因**: 対象Agent/Tool/Connector数の増加、Multi-Agent構成、
  外部システムへの実接続を伴う検証範囲の拡大。
- **価格を下げる要因**: 単一Agent・限定的なTool Calling・接続先が少ない構成、
  Design Partnerとしての先行協力。

### 9b. Design Partner価格の根拠仮説

- Enterprise商談支援（成果物が商談を前に進める材料になる）
- Security Questionnaire回答材料の提供
- AI Agent固有のRisk Evidence取得
- Findingを踏まえたRemediation Backlog化の支援
- Initial Retestの有無（範囲は9c参照）

### 9c. Retest Hypothesis（Tier別）

- **Design Partner**: Limited Retestを含む、または別途見積り（Included or separately quoted）
- **Standard Assessment**: Retest 1回を含む場合がある（One retest may be included）
- **Complex Assessment**: Retestは別途スコープ・見積り（Retest separately scoped）

**[Decision]** 最初の有償顧客（Design Partner）獲得を、価格の精緻化より優先する。

---

## 10. Differentiation Hypothesis

**[Hypothesis]** 差別化は「攻撃パターン数の多さ」ではなく、以下による：

1. **Action-centric**: Promptだけでなく、Authority/Permission/Tool/Credential/Connector/
   External ActionまでをAttack Pathとして評価する。
2. **Evidence-native**: Findingを文章のみで保存せず、攻撃実行とEvidenceに基づいて構築する。
3. **Reproducible**: 同一条件下で可能な限り再実行・再検証できることを目指す。
4. **Machine-readable**: 将来的にPentest結果を構造化データ（Canonical Assessment Record）
   として保存する方向性を持つ（v1で正式スキーマは設計しない）。
5. **Enterprise-ready output**: 成果物がGeneric診断レポートではなく、
   Enterprise Sales/Security Reviewの文脈でそのまま活用できることを目指す。

**[Open Question]** 上記差別化仮説が実際の商談で顧客に評価されるかは未検証。

---

## 11. Success Criteria

**[Decision]** Success Criteriaは Commercial-first とする。MVP完成や技術実装の完成度を
最上位に置かない。最上位から順に以下とする：

1. 30日以内にDesign Partner候補との商談を作る
2. 有償Design Partner 1社を獲得する
3. 実際のAI Agent / AI Systemに対してAssessmentを実施する
4. Evidence-backed Findingを最低3件以上作成する
5. 顧客がEnterprise Sales / Security Reviewに使える成果物を得る

**[Hypothesis]** 上記1の「30日以内」は保証された期限ではなくBusiness Goalとして記載する。

**[Open Question]** Technical Success Criteria（Evidence再現率、Finding品質基準等）は
後続Phaseで定義する。現時点で確定していない。

---

## 12. Failure Conditions

**[Hypothesis]** 以下をFailure Conditionの候補として認識する:

- 顧客がAssessmentに対価を支払わない（価値が伝わらない）
- Generic LLM Pentestとの差別化が商談上成立しない／曖昧である
- Evidenceが再現不能で、Findingの信頼性が担保できない
- Assessment実施コストが提示価格に対して過大で、事業として成立しない
- 顧客の本番環境に対する安全な実施方法（影響範囲の制御、Rollback等）を構築できない
- 技術文書としては良いが、顧客が支払う理由（商業的価値）が弱い
- ICPが広すぎて営業対象が定まらない
- v1 Scopeが広すぎて初回Assessmentが実行できない
- PDF Report作成そのものが目的化し、Evidence-nativeの思想が形骸化する
- Security Intelligence構想（長期構想）に寄りすぎて、初回売上獲得が遅れる
- Phase 0の段階でFormal Threat Model / Attack Taxonomy / Evidence Schema /
  Finding Schema / Architectureへ越境してしまう

---

## 13. Open Questions

人間が判断すべき未決事項。Claudeが独断で埋めない。

1. 絞り込んだDesign Partner Candidate Profile（3b）は最初の何件の商談で検証するか。
2. Design Partner候補企業の当てはあるか、それとも新規開拓から始めるか。
3. 価格帯（498k〜798k等）は初回商談前に固定するか、商談を通じて調整するか。
4. Assessment実施における顧客環境への影響範囲・安全策の合意プロセスをどう設計するか
   （契約・免責事項を含む）。
5. Retest（9c）のTier別扱いをいつまでに確定するか。
6. Canonical Assessment Recordの正式設計にいつ着手するか（Phase 1のスコープに含めるか）。
7. Formal（網羅的）Attack Taxonomyの設計着手タイミング（v1 Core Scope 5a
   との対応）。なお、Commercial-first Threat Model（非Formal版）はPhase 1
   として[docs/security/THREAT_MODEL.md](../security/THREAT_MODEL.md)で、
   Commercial-first Minimal Attack Taxonomy（同じく非Formal版）はPhase 2
   として[docs/security/ATTACK_TAXONOMY.md](../security/ATTACK_TAXONOMY.md)
   で、それぞれ着手済み。
8. 診断実施者（誰が実際にAssessmentを行うか）の体制は現時点でどうなっているか。
9. Evidence-backed Finding「最低3件以上」（Success Criteria 4）は、初回Assessmentの
   Scope次第で現実的か、事前に検証が必要か。
10. Design Partnerごとに、v1 Core Scope Candidate（5a）のどの項目を必須にし、
    どの項目を削るか（Scopingでの確定方法・基準）。

---

## Decision Log Summary

**[Decision]** として本文書内で確定した事項：

- Agentic Action Security Assessmentという商品コンセプトで進める
- 商用上の存在意義を「Enterprise商談・Security Questionnaire対応・大企業導入審査を
  前に進めるためのEvidence付き検証」と定義する
- Generic Prompt Injection診断のみの商品にしない
- Evidence / Traceabilityを重視する
- Product PromiseにEnterprise Sales Enablement / Third-party Security Evidence /
  Evidence-backed Risk Explanation / Action-centric Findings / Remediation-ready Output
  を含める（ただし審査通過・認証取得の保証はしない）
- v1 Assessment ScopeをCore/Optional/Laterに分離する方針を決定する。ただしCore Scope
  Candidate（5a）の具体項目自体はHypothesisであり、Design Partner検証前に
  Decisionへ昇格させない
- v1ではPlatform化、Continuous Monitoring化、Multi-Agent高度攻撃、
  AI Gateway/Model Router開発へ進まない
- PDF/Markdown/Executive SummaryをHuman-readable Projectionとし、Source of Truthにしない
- 将来のSource of Truth候補を「Canonical Assessment Record」と呼称する
  （Phase 0ではスキーマ設計しない）
- Success CriteriaをCommercial-first（商談・Design Partner獲得・実施・Finding数・
  顧客成果物）とし、MVP完成/技術実装を最上位に置かない
- 最初から巨大Platformを作らない
- 最初の有償顧客獲得を優先する
- 「安全を保証する」「すべての脆弱性を発見する」「認証取得を保証する」等の表現は使用しない

上記以外（ICP詳細の最終確定、価格、期間、Attack Coverage、SLA、Report format、Tooling、
Architecture）はすべてHypothesisまたはOpen Questionであり、明示承認までDecisionに
昇格しない。
