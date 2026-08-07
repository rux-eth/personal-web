# PR-002: Tooling hygiene

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required.

## Research findings

_To be populated by `PROCEDURE-pr-research.md`._

---

## Scope

- Add Biome at the repo root, configured to the style in `src/prettier.config.js` (single quotes, no semicolons, avoid arrow parens, LF, 2-space); delete `src/prettier.config.js`.
- Format the entire repo once with Biome (mechanical, behavior-neutral).
- tsconfig: remove the 6 nonexistent `include` entries (`reducers`, `hoc/wrapper`, `grid.js`, `stuff.js` ×2, `scripts`, `api/index.jsx`), modernize (`moduleResolution` appropriate to current stack — stays `node` until PR-007, revisited there), keep `strict`.
- next.config: remove `MONGO_URL`/`MASTER_ADMIN`/`NEXT_ENV` env injection and the `dotenv` require + dependency (Next loads `.env` natively). Note: `NEXT_ENV` is referenced only by the dead `url.tsx` (never imported).
- package.json: normalize scripts (`build` = `next build`; analyzer via env var only; `start` no longer rebuilds); remove unused dev deps `@types/chance` and unused runtime dep `js-sha3`.
- Add `lint` / `format` scripts.

## Dependencies

PR-001.

## Architecture section implemented

`docs/ARCHITECTURE.md` § Stack (tooling), § Utilities (dotenv/js-sha3 removal).

## Verification criteria

- [ ] `yarn build` succeeds; `yarn test:visual` diffs clean vs baseline
- [ ] `biome check` passes repo-wide
- [ ] No references to removed env vars remain outside dead files scheduled for PR-010
- [ ] Type-check (`tsc --noEmit`) passes

## Research backing

D8: Next 16 removed `next lint`, officially names Biome or ESLint [proven]; Biome v2 Prettier-compatible formatting [convention]. See DESIGN-log D8.

## Notes

Pure-formatting commit should be separated from functional config changes within the PR for reviewability (two commits, one PR).
