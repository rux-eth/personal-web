# PR-005: Utility diet (immutable → native)

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: design-time research skip documented (baseline JS); Phase 1 (State Assessment) required.

## Research findings

### State Assessment (2026-08-08)

**Current state**: exactly as PR-004's downstream contract left it — 3 consumers (`types.tsx`: `Set` for WorkInfo fields + `Set.isSet` in validation; `works.tsx`: `List`/`IMap`/`Set` for works list, tag counts, filters; `tldr.tsx`: `Set(['Completed'])` filter arg), ~35 API touch points total. No user drift since the PR-004 merge.

**Behavior-preservation notes**:
- Tag-count aggregation (`getTags`) iterates works in list order and `updateIn`-counts — a plain object-of-objects with insertion-ordered keys reproduces the dropdown's category/tag ORDER exactly (JS object key order = insertion order for string keys).
- Filter state: immutable `Set` in `useState` with `.add`/`.remove` copy-on-write → native `Set` with copy-on-write (`new Set(prev)` + add/delete). OR-across-tags semantics unchanged.
- `assertWorkInfo` accepts `Set.isSet(x) || Array.isArray(x)` and normalizes arrays → Sets; with immutable gone, fields stay plain arrays and validation accepts arrays only (works.json provides arrays — the Set branch is unreachable at runtime today). `WorkInfo.languages/stack` become `string[]` — `.toArray()` call sites drop away.

**Stale assumptions**: none. **New constraints**: PR-006 rewrites most of works.tsx anyway (roadmap note already allows resequencing) — this PR stays mechanical and minimal to keep the PR-006 diff reviewable.

**Downstream contracts**: PR-006 consumes the de-immutabled types (`string[]` fields align with its literal-union typing plan). Universal visual-diff-clean contract applies; zero-regen bar carried from PR-003/004.

**Path-tier checkpoint**: Tier-1 (design-time research skip documented in D5 — baseline JS semantics). Phase 1 CLEAN → **cleared to Gate Check.**

### Gate Check

- Premise still valid: ✓
- No prerequisite PRs surfaced: ✓
- User approved updated spec: ✓ (2026-08-08)
- Implementation cleared

---

## Scope

- Remove the `immutable` dependency. Replace: `WorkInfo.languages/stack` `Set` → `readonly string[]` (typed further in PR-006); works `List` → array; tag-count `Map` → plain object/`Map`; filter-state `Set` in `useState` → native `Set` with copy-on-write updates (or array — whichever diffs clean and is fewer lines).
- No behavior or ordering changes: tag ordering, filter semantics (OR across selected tags), and counts must be identical.

## Dependencies

PR-004 (the other immutable consumers — resize-observer registry — die there first).

## Architecture section implemented

`docs/ARCHITECTURE.md` § Stack — Utilities.

## Verification criteria

- [x] `yarn test:visual` 190/190 ×2 — with the ONE user-approved deviation below (8 dropdown baselines regenerated) (2026-08-08)
- [x] Scripted probe 5/5: all-works grid, Completed narrows to 7, OR semantics (Completed+Building = 8), deselect restores, reset shows all
- [x] `immutable` gone from package.json; savings live in the works page chunks (its `_app` presence already died with PR-004); works pages 135 kB First Load

## Approved deviation (2026-08-08)

The filter dropdown's sub-tag ordering was an artifact of immutable Map's hash-trie iteration (arbitrary, undesigned). The native replacement iterates in data order (tag first-appearance across works.json). User approved accepting data-derived order over freezing the old hash order as a hardcoded constant; the 8 `works-filter-open` baselines regenerated accordingly. Category order (Status/Stack/Language/Other) and all counts unchanged. Filter-chip row order also changes from immutable-hash to click order (not baseline-covered; strictly more sensible).

## Research backing

D5 (DESIGN-log): documented research skip — native-collection replacement is baseline JS; costs measured locally.

## Notes

If PR-006 lands first in practice, much of this PR's surface is rewritten there anyway; roadmap order (005 before 006) keeps diffs reviewable but the two may be resequenced with a roadmap update.
