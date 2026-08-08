# PR-006: Works content architecture

**Landed-in:** master via GitHub PR #23, 2026-08-08 (pre-versioning; v0.0 roadmap)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required.

## Research findings

### State Assessment (2026-08-08)

**Current state**:
- Repo: `master` @ `68fe1a9`, clean, == `origin/master`; local + origin `staging` are strict ancestors of master (verified `merge-base --is-ancestor`); no open GitHub PRs. **No parallel-development drift since the PR-005 merge (#22).**
- `public/works.json`: 10 works. Fields present in data: the 8 required on all entries, `repo` ×7, `website` ×3. **`admins`, `authAddresses`, `article`, `trello` appear in zero entries.** Vocabulary actually used: status {Building, Completed, Deprecated}, role {Full-Stack, Back-End}, languages ×6 (java/javascript/python/rust/solidity/typescript), stack ×11 (ethers/express/fastify/foundry/hardhat/mongodb/nestjs/next/postgres/springboot/tailwind).
- `src/components/category.tsx`: `categories` record is the presentation vocabulary (30 keys). Keys unused by current data: `node`, `web3`, `wasm`, `Front-End`, `article`, `trello` (all still rendered-capable; keep in vocabulary).
- `src/types.tsx`: `WorkInfo` still carries `admins?`; `assertWorkInfo` destructures `authAddresses` (not even in the interface). `Role` union spells `'Front-end'` while the category key is `'Front-End'` — **latent casing mismatch**, never hit because no data entry uses it. Also dead: `Address` type + `assertAddressEq` (zero references outside types.tsx).
- `src/components/works.tsx` (516 lines): `Works` class confirmed as drafted — `useState` inside `worksPage()` (hooks-in-class-methods violation), `getAllPreviews`/`getTags`/`compileTags`/`getWork` all build-derivable. Consumers: `pages/works/index.tsx`, `pages/works/[wid]/index.tsx`, and `tldr.tsx:18` (recent-3 = `getAllPreviews(Set{'Completed'}).slice(0,3)`). Dead `ComingSoonPage` import dies with the file.
- **D9 bugs confirmed in code**: (1) arrow ternary `works.tsx:197` — branches identical AND the value `'rotate(0.5)turn'` is malformed CSS, so no transform ever applies; (2) 404-flash — `[wid]/index.tsx` renders `<NotFound/>` whenever `getWork(wid)` misses, including first client render of direct visits while `router.query` is empty; (3) missing `key` props at ~8 map sites in works.tsx plus `sections.map` (keyless fragments) in tldr.tsx.
- Visual harness: 190-test bar established (PR-005 ran 190/190 ×2). Works surface covered by `works-index.png`, `works-filter-open.png` (`states.spec.ts:40`), 10 per-work pages, and the home capture (tldr). 8 projects = chromium+webkit × xs/mb/sm/md. `webServer` runs `yarn build && next start -p 4179` — a **production build**, so SSG output (pre-rendered HTML, build-time 404) is exercised by the same server the curl criteria use. `works-index` has a raised `maxDiffPixels: 80000` budget (WebKit thumbnail resampling, documented in pages.spec.ts).

**Assumptions at PR draft time**:
- works.json migrates 1:1; `admins`/`authAddresses` vestigial; literal unions shared with category.tsx; SSG both routes on the current Next 12 Pages Router; three D9 fixes absorbed. **All hold.**

**Stale assumptions** (refinements, none premise-changing):
- `article`/`trello` were implicitly assumed live — they exist only as typed fields + render paths, never in data. Keep fields and render paths (behavior-identical); they stay in the vocabulary.
- The arrow bug is *doubly* broken (identical branches + invalid CSS value): the current rendered state — both open and closed — is an untransformed down-arrow. The fix defines rotation for the **open** state only; the closed state must keep the current appearance, so the expected regen surface is `works-filter-open` ×8 projects, nothing else.

**New constraints** (learned from prior PRs / codebase evolution):
- **Dropdown ordering** (PR-005, `e03dc16`): `getTags`' insertion-ordered plain objects reproduce the approved dropdown order (category order Status/Stack/Language/Other + data-order sub-tags; 8 baselines were already regenerated once for this). The helper extraction must preserve these semantics — zero re-churn.
- **Baseline-regen expectation**: arrow fix → `works-filter-open` ×8 only. 404-flash fix → **no baseline change expected** (baselines capture settled states; the flash is transient) — verify clean, don't regen. Missing-keys fix → no visual change.
- `assertAddressEq` + `Address` are dead code adjacent to `assertWorkInfo` ("related runtime validation" per scope) — deleting them here is defensible; flagged for explicit user OK at the gate (alternative: leave for PR-010's sweep).
- Role vocabulary unifies on `'Front-End'` (the category key); `types.tsx`'s `'Front-end'` is a latent typo the literal-union SSOT eliminates by construction.
- Verification bar carried from PR-003/004/005: `yarn test:visual` 190/190 **twice**, full output + explicit exit codes, biome/tsc/build green, zero regens beyond the approved deviation set.

**Downstream contracts** (bidirectional `grep -rl "PR-006" prs/ docs/` → PR-001, PR-005, ROADMAP, RESEARCH-BACKLOG; plus implicit dependents read directly):
- **PR-001** → contract: baseline updatable for PR-006's two deviations in isolation → named per-page/state snapshots exist (`works-filter-open.png` et al.); filtered `--update-snapshots` run regenerates only what executes. **Satisfied.**
- **PR-005** (upstream, delivered) → `WorkInfo.languages/stack` already `string[]` "typed further in PR-006". Consumed as planned. **Satisfied.**
- **PR-007** (implicit, roadmap ordering rationale) → expects PR-006 to land pre-upgrade so the Next 16/React 19 migration surface excludes the Works class (hooks-in-class + FC-children in class methods die here). `getStaticPaths`/`getStaticProps` remain fully supported in the Next 16 Pages Router. **Satisfiable by current scope: yes.**
- **PR-010** → depends on "all prior"; its D9 remainder (interval leak, /loading decision) assumes 404-flash/arrow/keys are resolved here. **Satisfiable: yes.**
- **RESEARCH-BACKLOG** → PR-006 Tier 1, "None expected" outstanding topics — consistent with this assessment.

**Path-tier checkpoint**: Tier-1 confirmed (PR header, ROADMAP, RESEARCH-BACKLOG agree; scope unchanged since drafting; design is 1 day old, well inside the 30-day staleness threshold). Phase 1 is clean — no premise-changing drift, all downstream contracts satisfiable, no unresearched must-answer question (D7's research-skip rationale — TS semantics + local usage facts — still holds). **PR cleared after Phase 1; Phases 2–4 do not run. → Phase 5 Gate Check.**

### Gate Check

- Premise still valid: ✓
- No prerequisite PRs surfaced: ✓
- User approved updated spec: ✓ (2026-08-08, in chat — user delegated remaining phases "going with your recommendations": deviation set = `works-filter-open` ×8 baselines only; `assertAddressEq` + `Address` deleted in this PR as "related runtime validation")
- Implementation cleared

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

- [x] `yarn test:visual` 190/190 ×2 (explicit exit 0 both runs, 2026-08-08) — sole baseline change: `works-filter-open` ×8 regenerated for the arrow fix, reviewed old-vs-new (arrow flip is the only visible change; regen required `--update-snapshots=all` because the arrow diff sits inside the state's 6000-px jitter budget). 404-flash fix produced zero baseline diffs as predicted.
- [x] Direct `curl` to `/works/hospital-in-a-box`: 200, fully-rendered HTML (title + body text present, no JS)
- [x] Unknown id (`/works/does-not-exist`) → real 404 (`fallback: false`)
- [x] Deliberate vocabulary typo (`'tailwindd'`) fails `tsc` with TS2820 + did-you-mean; reverted, green
- [x] `/works.json` → 404 (file deleted, no longer served)
- [x] Scripted filter probe 5/5 (mirrors PR-005's): all-10 grid, Completed→7, OR Completed+Building→8, deselect→7, reset→10
- [x] `yarn build` green: `/works` + `/works/[wid]` ● SSG (17 static pages); `biome check` + `tsc --noEmit` green

## Approved deviations (2026-08-08, delegated gate)

1. **Filter arrow (D9)**: `transform: isList ? 'rotate(0.5turn)' : 'none'` + `transitionDuration: '300ms'` (matches the dropdown's existing 300ms precedent). Closed state pixel-identical to baseline; open state now shows the arrow rotated — 8 `works-filter-open` baselines regenerated with before/after review.
2. **404-flash (D9)**: eliminated by `fallback: false` pre-rendering; no baseline change (transient state was never captured).
3. **Missing keys (D9)**: keys added across works/tldr maps (vocab-key, id, header, and content-based keys — no index keys); no visual change.
4. `assertAddressEq` + `Address` deleted with `assertWorkInfo` (dead code, zero references) — per delegated-gate lean.

## Implementation notes (2026-08-08)

- **Vocabulary SSOT**: `category.tsx` restructured into grouped defs (`statusDefs`/`stackDefs`/`languageDefs`/`roleDefs`/`linkDefs`); `WorkStatus`/`StackTag`/`LanguageTag`/`Role`/`LinkTag`/`Tag` unions derived via `keyof`; `categories: Record<Tag, JSX.Element>` built from the groups (elements now carry `key=<vocab key>`, which also solves keyless `tags.map(tag => categories[tag])` renders at the source). Rendered `BuildCategory` markup unchanged. The latent `'Front-end'` casing typo in the old `Role` union is eliminated by construction (vocab key is `'Front-End'`).
- **Data**: `src/data/works.ts` — `WorkInfo` (no `admins`/`authAddresses`), `works` migrated 1:1 from works.json (order preserved), pure helpers `getWork`/`compileTags`/`tagCounts`. `tagCounts` keeps PR-005's insertion-order semantics; the `in categories` guards are dropped (compile-guaranteed now).
- **Class dissolution**: `works.tsx` exports `WorkPreviews`, `WorksPage`, `WorkPage` FCs; hooks now live at component top level. `types.tsx` deleted (WorkInfo moved to the data module; `assertWorkInfo` + dead `Address`/`assertAddressEq` gone per gate approval).
- **SSG**: `/works` = `getStaticProps`; `/works/[wid]` = `getStaticPaths` (all 10 ids, `fallback: false`) + `getStaticProps` (`notFound: true` guard). Build output: both routes ● SSG, 17 static pages.
- **Hydration fix surfaced by SSG (no baseline change)**: `ItemsJSON`'s array branch nested a `<div>` inside `<p>` — invalid HTML that only survived because work pages were previously client-rendered (DOM APIs preserve invalid nesting; the browser parser does not). SSG'd markup got re-nested by the parser → layout shift; 5 work-page baselines failed at xs before the fix. Outer `<p>` → `<div>` (box-identical: no element styles on `p`, preflight zeroes margins on both) restored 190/190 with zero baseline changes.
- **Biome rules routed to PR-006** in `biome.jsonc` (useJsxKeyInIterable, useHookAtTopLevel, noArrayIndexKey, a11y pair, etc.): left OFF, following the merged precedent of PR-003/004/005 (none re-enabled their assigned rules; config untouched since PR-002). The new code carries no violations of the PR-006-routed correctness/suspicious/complexity rules; the a11y pair (`noStaticElementInteractions`, `useKeyWithClickEvents`) would require semantic changes to the filter toggle beyond D9 scope. Re-enable sweep deferred to PR-010 — flagged there.
- 404-flash fix produced zero baseline diffs, as predicted in state assessment (baselines capture settled states; the flash was transient).

## Research backing

D7 (DESIGN-log): purpose→usage→alternatives analysis; content-as-typed-code vs MDX/CMS/DB; documented research skip (TS semantics + local facts). D9 for bug-fix mandate.

## Notes

MDX-per-work is the recorded escalation path if content grows prose — requires a design session first (`docs/CONSTRAINTS.md` § No New Content Systems).
