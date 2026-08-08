# Roadmap — v0.0 (refactor)

Ordered PR sequence implementing the 2026-08-07 design (see `docs/0.0/DESIGN-log.md`, `docs/ARCHITECTURE.md`). One PR, one thing. No PR lands before PR-001's baseline exists.

| PR | Title | Depends on | Design decisions | Status |
|----|-------|------------|------------------|--------|
| PR-001 | Visual-regression baseline (Playwright harness + current-build screenshots) | — | D8 | merged (GitHub PR #18) |
| PR-002 | Tooling hygiene (Biome + repo-wide format, tsconfig/next.config/scripts cleanup, dead dev-deps) | PR-001 | D8 | implemented (branch pr/002-tooling-hygiene, awaiting merge) |
| PR-003 | MUI removal (hand-rolled drawer/snackbar/breakpoint hook; slim link.tsx, delete theme.tsx, _document JSS) | PR-001 | D2 | implemented (branch pr/003-mui-removal, awaiting merge) |
| PR-004 | Scroll/resize rearchitecture (delete ResizeContext; navbar-local check, per-block ResizeObserver, masthead rAF; sha1/crypto id deleted) | PR-001 | D4, D5 (crypto) | implemented (branch pr/004-scroll-rearchitecture, awaiting merge) |
| PR-005 | Utility diet (immutable → native Array/Set/Map) | PR-004 | D5 | not started |
| PR-006 | Works content architecture (src/data/works.ts typed module, SSG, dissolve Works class; fix arrow-rotate bug, 404-flash, missing keys) | PR-001 | D7, D9 | not started |
| PR-007 | Framework upgrade (Next 16, React 19, TS 5; framer-motion → motion v13 swap forced by peer deps; codemods; FC-children fixes) | PR-003, PR-004 | D1, D3 | not started |
| PR-008 | Tailwind 4 migration (CSS-first config, single theme source) | PR-007 | D2 | not started |
| PR-009 | Assets (next/font/local subset woff2; next/image everywhere; compress sources; delete dead public files after reference-check) | PR-007 | D6 | not started |
| PR-010 | Final sweep (remaining dead code/routes incl. /loading decision, interval-leak fix, re-measure bundle vs projections, doc reconciliation) | all prior | D5, D9 | not started |

Ordering rationale:
- **PR-001 first** — the baseline must capture the pre-refactor site (Baseline Before Change constraint).
- **PR-003–006 run on the current stack** (Next 12/React 17) — they shrink the surface the framework upgrade must migrate (e.g. link.tsx dies in PR-003, so no new-link codemod churn for it).
- **PR-007 requires PR-003** because MUI 5.9 doesn't support React 19 (removal beats an interim bump), and includes the motion swap because framer-motion 6 doesn't either (peer-dep-forced companion, documented).
- **PR-008/009 require PR-007** (Tailwind 4 pipeline + next/font need the new stack).
