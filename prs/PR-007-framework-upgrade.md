# PR-007: Framework upgrade (Next 16 / React 19 / TS 5 / motion v13)

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required — verify current Next/React/motion latest stables and re-check upgrade guides for changes since 2026-08-07.

## Research findings

_To be populated by `PROCEDURE-pr-research.md`._

---

## Scope

- Upgrade: `next@16.x`, `react@19.x`, `react-dom@19.x`, `typescript@5.x`, `@types/react`/`@types/react-dom` latest. Node ≥ 20.9 verified locally and on Vercel before starting.
- Run official codemods as applicable: `@next/codemod upgrade`, `new-link` (for any remaining anchor-child links), image codemods (prefer landing directly on modern `next/image` semantics — fix the string-px `width={'1980px'}` props), `types-react-codemod preset-19` (FC implicit children — resize-observer is already deleted; remaining: `headers.tsx` if still present, layout components).
- Swap `framer-motion@6` → `motion@13` (peer-dep-forced companion, documented): `LazyMotion` + `m` + `domAnimation`, single `AnimatePresence mode="wait"` wrapper in `_app`; delete the duplicated variants/motion wrappers in `layouts/main.tsx` and `layouts/pages.tsx` (fixes triple-wrap; transition timing/curve preserved exactly: 0.4s easeInOut, y±20 fade).
- Turbopack default: no custom webpack config exists; bundle-analyzer integration revisited (works with webpack builds only — keep `--webpack` analyze path or drop analyzer; decide at implementation, note in PR).
- tsconfig: `moduleResolution: "bundler"`, target modernization (deferred from PR-002).

## Dependencies

PR-003 (MUI 5.9 is React-19-incompatible; must be gone), PR-004 (resize-observer FC-children surface gone; navbar stabilized).

## Architecture section implemented

`docs/ARCHITECTURE.md` § Stack — Framework, Animation.

## Verification criteria

- [ ] `yarn build` (Turbopack) succeeds; all 8 pages static; `tsc --noEmit` clean
- [ ] `yarn test:visual` diffs clean vs baseline — explicitly including page-transition behavior (enter AND exit animations present, same duration/curve)
- [ ] Prod smoke test on Vercel preview deploy: all routes, drawer, filter, copy-snackbar
- [ ] Bundle re-measured post-upgrade; motion cost recorded (expect ~5–20 kB gz vs 32.5)

## Research backing

D1 (DESIGN-log): Next 12→16 breaking surface, React 19 surface, EOL/security [proven, cited]. D3: LazyMotion sizes, mode="wait" [proven/convention].

## Notes

Largest-risk PR; keep it mechanical (codemods + forced swaps only — no opportunistic refactors). Any surprise discovered mid-upgrade that requires a design choice pauses for a mini design session per procedure.
