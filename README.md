# Luvira Agent Security Assessment

## Project Name

Luvira Agent Security Assessment（社内コード: LUVIRA-ASA）

## Purpose

株式会社ルヴィラ（Luvira Inc.）のAI Security事業における最初の商用プロジェクト。
「AIが何を言うかだけでなく、AIが何をできてしまうか」を検証する
Agentic Action Security Assessment / Pentestサービスを構築する。

v1の主対象は、AI Agent / RAG / MCP / Tool Calling / Connector / Credential /
Permission / External Actionである。Memory / Multi-Agent / Cross-Agent Manipulation /
Continuous Security等はOptional/Laterとして扱い、v1の主対象ではない
（詳細は [docs/product/PRODUCT_DEFINITION.md](docs/product/PRODUCT_DEFINITION.md) 5章参照）。
ただし、長期的なSecurity Intelligence構想（本Repositoryの現Scope外）への
接続可能性は残す。

商用上の存在意義は、単体のAI Security診断ではなく、
**Enterprise商談・Security Questionnaire対応・大企業導入審査
（SOC2/ISMS等のProcurementプロセスを含む）を前に進めるために、
AI Agentが実際に何をできてしまうかをEvidence付きで検証すること**である。

最優先目標は、巨大なAI Security Platformを今作ることではなく、
**販売可能なAssessment v1を最短で作り、最初の有償顧客に提供し、
実際の診断から学習すること**である。

## Current Phase

**Phase 0 — Product Definition: 完了・baseline化済み**
（commit `97fbb1d036f3beb5d3d25676e16d1ffe7fa39cdf`、origin/mainへpush済み）

**Phase 1 — Commercial-first Threat Model Definition: 完了・baseline化済み**
（commit `029cb451d66e52f12cb0faeb179f9a5dfd807802`、origin/mainへpush済み）

**Phase 2 — Minimal Attack Taxonomy: 進行中**

Evidence Schema / Finding Schema / MVP Architecture / 実装には未着手。
Phase 2ではAssessment v1で実施・記録・説明しやすい最小限のAttack分類
（網羅的Taxonomyではない）を作成している。

## Core Product Hypothesis

- Genericな「LLM脆弱性診断」「Prompt Injection診断」「OWASPチェックリスト診断」ではなく、
  AIのAuthority / Permission / Tool / Credential / Connector / External Actionまでを
  Attack Pathとして評価する **Agentic Action Security Assessment** を提供する（Hypothesis）。
- 初期のDesign Partner候補は、従業員20〜100名規模でEnterprise顧客に販売中/販売予定の
  B2B AI SaaS企業のうち、Security Questionnaireや第三者Security Evidenceの提出を
  求められている企業を想定する（Hypothesis、詳細はProduct Definition参照）。
- v1のAssessment Scopeを **Core Scope Candidate** と **Optional/Later** に分離する
  方針そのものはDecision。Core Scope Candidateの具体項目（Agent Authority/
  Permission/Tool/Connector inventory・Tool misuse・Indirect Prompt Injectionによる
  誘導検証等）は、Design Partnerとの検証前のHypothesisであり、最初の有償Assessmentで
  実行可能であることを優先して調整する。
- 詳細は [docs/product/PRODUCT_DEFINITION.md](docs/product/PRODUCT_DEFINITION.md) を参照。

## Non-goals（このRepositoryの現Phaseで行わないこと）

- Application / Attack Runner / Scanner / Pentest automationの実装
- Dashboard / SaaS / Authentication / Databaseの実装
- AI Gateway / Model Router / Cost Optimizationの実装
- Mem0 / Omni等の外部システム統合
- Continuous Monitoring / Security Intelligenceの実装
- 正式なThreat Model / Attack Taxonomy / Evidence Schema / Finding Schemaの確定
- Multi-Agent security実装、Infrastructure Pentest実装、Generic Web Pentest実装
- 必要性が確認されていない依存パッケージの追加

## Document Map

| Document | 内容 |
|---|---|
| [CLAUDE.md](CLAUDE.md) | このRepositoryで作業する際の原則・制約 |
| [docs/product/PRODUCT_DEFINITION.md](docs/product/PRODUCT_DEFINITION.md) | Phase 0 Product Definition（顧客・提供価値・スコープ・商用仮説） |
| [docs/security/THREAT_MODEL.md](docs/security/THREAT_MODEL.md) | Phase 1 Commercial-first Threat Model（資産・脅威主体・Attack Surface・v1 Core Threat Scenario Candidate） |
| [docs/security/ATTACK_TAXONOMY.md](docs/security/ATTACK_TAXONOMY.md) | Phase 2 Minimal Attack Taxonomy（v1 Attack Candidate・Threat Scenario/Business Impact Mapping） |

## Status

Phase 0（Repository Foundation & Product Definition）完了・baseline commit済み。
Phase 1（Commercial-first Threat Model Definition）完了・baseline commit済み。
Phase 2（Minimal Attack Taxonomy）進行中。
Fact / Hypothesis / Decision / Open Questionの区別、および人間承認プロセスは
[docs/product/PRODUCT_DEFINITION.md](docs/product/PRODUCT_DEFINITION.md)、
[docs/security/THREAT_MODEL.md](docs/security/THREAT_MODEL.md) および
[docs/security/ATTACK_TAXONOMY.md](docs/security/ATTACK_TAXONOMY.md) を参照。
