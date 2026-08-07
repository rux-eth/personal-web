# PR-005: Utility diet (immutable → native)

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: design-time research skip documented (baseline JS); Phase 1 (State Assessment) required.

## Research findings

_To be populated by `PROCEDURE-pr-research.md`._

---

## Scope

- Remove the `immutable` dependency. Replace: `WorkInfo.languages/stack` `Set` → `readonly string[]` (typed further in PR-006); works `List` → array; tag-count `Map` → plain object/`Map`; filter-state `Set` in `useState` → native `Set` with copy-on-write updates (or array — whichever diffs clean and is fewer lines).
- No behavior or ordering changes: tag ordering, filter semantics (OR across selected tags), and counts must be identical.

## Dependencies

PR-004 (the other immutable consumers — resize-observer registry — die there first).

## Architecture section implemented

`docs/ARCHITECTURE.md` § Stack — Utilities.

## Verification criteria

- [ ] `yarn test:visual` diffs clean (works grid, filter dropdown incl. counts, filtered states)
- [ ] Manual: multi-tag filter selection/deselection/reset behaves identically
- [ ] `immutable` gone from package.json; bundle re-measured (~16.5 kB gz reduction recorded)

## Research backing

D5 (DESIGN-log): documented research skip — native-collection replacement is baseline JS; costs measured locally.

## Notes

If PR-006 lands first in practice, much of this PR's surface is rewritten there anyway; roadmap order (005 before 006) keeps diffs reviewable but the two may be resequenced with a roadmap update.
