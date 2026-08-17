# CLAUDE.md

このRepositoryで作業するAI（Claude含む）が従うべき原則。

## Authority & Truth

- **Approved documentation is authoritative.** 承認済みの `docs/` 配下の文書が正。
  チャット履歴や記憶（memory）は補助情報であり、承認済み文書と矛盾する場合は文書を優先する。
- **Do not silently invent requirements.** 明記されていない要件を勝手に補完しない。
  不明点は Open Question として記録し、人間の判断を待つ。
- **Separate Fact / Hypothesis / Decision / Open Question.** すべての文書でこの4区分を明示する。
  - Fact: 検証済みの事実
  - Hypothesis: 未検証の仮説
  - Decision: 人間が明示的に承認した決定
  - Open Question: 人間の判断が必要な未決事項
- **Do not promote Hypothesis to Decision without explicit approval.** 仮説を勝手に決定として扱わない。

## Scope Discipline

- **Do not implement outside the approved phase.** 現Phaseで承認されていない実装（Attack Runner,
  Dashboard, SaaS, AI Gateway等）に着手しない。
- **Prefer minimal scope.** 必要最小限のファイル・構造のみを作成する。空のplaceholderは作らない。
- **Do not add dependencies without need.** 必要性が確認されていない依存パッケージを追加しない。
- **Future platform scope must not leak into MVP without approval.** 長期構想（Security Intelligence,
  Policy Engine, AI Security Control Plane等）をv1の設計・文書に混入させない。
- **Commercial value over technical completeness in Phase 0.** Success Criteriaは
  Commercial-first（Design Partner獲得・実施・Evidence-backed Finding）を優先し、
  MVP完成度やReport作成そのものを目的化しない。

## Security & Evidence

- **Security-critical assumptions must be explicit.** 権限・認証・スコープ境界に関する前提は
  文書上に明示する。
- **Reports are projections, not canonical assessment records.** PDF / Markdown Reportは
  将来のCanonical Assessment Recordからの投影物として扱い、Source of Truthにしない。

## Process

- **Human approval is required for material product/security decisions.** 価格・ICP・Assessment
  Scope・Attack Coverage等、商用・セキュリティ上重要な決定は人間の承認を経る。
- **Preserve auditability and traceability.** 変更・決定の経緯が追えるようにする
  （commit粒度、文書内のDecision記録等）。
