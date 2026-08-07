# PR-006: Works content architecture

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required.

## Research findings

_To be populated by `PROCEDURE-pr-research.md`._

---

## Scope

- Create `src/data/works.ts` exporting `WorkInfo[]`, migrated 1:1 from `public/works.json`. Type `status`/`role`/`languages`/`stack` as literal unions derived from a single categories vocabulary shared with `category.tsx` (typo = compile error). Drop vestigial `admins`/`authAddresses` fields.
- Delete `public/works.json` and `assertWorkInfo`/related runtime validation in `types.tsx`.
- Dissolve the `Works` class: pure helpers (`compileTags`, tag counts, `getWork`) + presentational components; hooks live in components only (fixes the hooks-in-class-methods violation).
- `/works`: `getStaticProps`. `/works/[wid]`: `getStaticPaths` (all ids, `fallback: false`) + `getStaticProps` — each work fully pre-rendered.
- Bug fixes absorbed (D9, documented baseline deviations): 404-flash on direct work-URL visits (now pre-rendered); filter-arrow rotate ternary (make it actually rotate on open); missing React `key` props across works/tldr maps.

## Dependencies

PR-001. (PR-005 per roadmap order; resequencing allowed with roadmap update.)

## Architecture section implemented

`docs/ARCHITECTURE.md` § Works content.

## Verification criteria

- [ ] `yarn test:visual` diffs clean except the two documented deviations (arrow now rotates; no 404 frame on direct work-page loads) — baseline updated for both with review
- [ ] Direct request to `/works/<id>` returns fully-rendered work HTML (curl, no JS)
- [ ] Unknown id → real 404 (build-time `fallback: false` behavior verified)
- [ ] Introducing a deliberate vocabulary typo in `works.ts` fails `tsc` (spot-check, then revert)
- [ ] `/works.json` no longer publicly served

## Research backing

D7 (DESIGN-log): purpose→usage→alternatives analysis; content-as-typed-code vs MDX/CMS/DB; documented research skip (TS semantics + local facts). D9 for bug-fix mandate.

## Notes

MDX-per-work is the recorded escalation path if content grows prose — requires a design session first (`docs/CONSTRAINTS.md` § No New Content Systems).
