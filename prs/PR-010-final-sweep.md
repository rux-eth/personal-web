# PR-010: Final sweep

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: audit-backed; Phase 1 (State Assessment) required — re-verify each file is still dead after all prior PRs.

## Research findings

_To be populated by `PROCEDURE-pr-research.md`._

---

## Scope

- Delete remaining dead code: `connect.tsx`, `account-observer.jsx`, `url.tsx`, `header.tsx`, `headers.tsx` (if unused post-refactor), `notClient.tsx`, `FailedLoad`, commented-out blocks, unused `ComingSoonPage` import in `pages/index.tsx`, vestigial types in `types.tsx`.
- **`/loading` route**: dead standalone route — removal changes the URL surface, needs explicit user sign-off (flagged in RESEARCH-BACKLOG). If kept, fix the setInterval leak (D9); if removed, the leak dies with it.
- Reconcile docs: update `docs/ARCHITECTURE.md`/`CLAUDE.md` to describe the final state; mark roadmap complete.
- **Re-measure everything** against the design projections and record in the PR: First Load JS (target ~110–130 kB gz vs 318), `_app` chunk (~50–65 vs 238), dep count, LOC, work-page transfer, Lighthouse.

## Dependencies

All prior PRs.

## Architecture section implemented

Closes out all sections; verifies § Overview end-state.

## Verification criteria

- [ ] `yarn test:visual` diffs clean vs (bug-fix-updated) baseline
- [ ] `yarn build` output: all pages static, measurements recorded
- [ ] No file in `src/` is unimported (verify with a dead-export check)
- [ ] Design-projection deltas documented — any projection missed by a wide margin gets a written explanation

## Research backing

Audit findings (DESIGN-log evidence baseline); D5/D9.

## Notes

This PR is deliberately last so every "is it dead yet?" question has a settled answer.
