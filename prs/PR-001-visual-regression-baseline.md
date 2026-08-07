# PR-001: Visual-regression baseline

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-2 (light)**: Playwright is a convention choice; capture-determinism strategy needs research before implementation.

## Research findings

### State Assessment (2026-08-07)

**Current state**:
- No test infrastructure of any kind exists or has ever existed (`git log --all` for test/playwright files: empty). Fresh area; no prior-art patterns to carry forward.
- Local Node v24.14.0 (satisfies everything incl. future PR-007's ≥20.9 floor and Playwright requirements).
- Randomness inventory (drives Q1): `utils/chance.ts` uses `Math.random` in `floating`/`integer`; `rain.tsx` builds its 10 `variants` arrays **at module load** (`Array.from(Array(numVars), getSeeds)`), so every page load produces different rain layouts. Masthead passes deterministic `variant={index}`, so the only nondeterminism source is `Math.random` itself → seedable before module execution.
- Other nondeterminism: `/loading` dots animate on a 300ms interval; page-enter transition (framer-motion, 0.4s) must settle before capture; web fonts (3.8 MB OTFs) load slowly — captures must await `document.fonts.ready`.
- Design docs, roadmap, and constraints were written today from a measured audit — zero drift possible yet.

**Assumptions at PR draft time**:
- All 10 work detail pages capturable; breakpoint matrix xs/mb/sm/md minimum; interactive states enumerated (drawer, filter dropdown, snackbar, navbar-shown). All still accurate.

**Stale assumptions**: none (drafted same day as assessment).

**New constraints**:
- Rain randomness is module-load-time, so any seeding must be injected **before app JS executes** (e.g. `addInitScript`-style override), not after mount.
- `/loading`'s animated dots need an explicit settle/mask strategy distinct from CSS-animation disabling (it's a JS interval, not CSS).

**Downstream contracts** (from `grep -rl "PR-001" prs/ docs/` — every refactor PR depends on this one):
- **PR-002, PR-003, PR-005, PR-007, PR-008, PR-010** → contract: `yarn test:visual` exists, is deterministic across consecutive runs, and diffs clean against a committed baseline. **PR-003 additionally** names drawer-open and snackbar states in its criteria → those states MUST be in the baseline. **PR-008** needs the complete breakpoint matrix (its risk is entirely CSS). Satisfiable by current scope: yes.
- **PR-006** → contract: baseline must be *updatable* for its two documented bug-fix deviations (arrow rotation, 404-flash) without invalidating other captures → per-page/per-state granular snapshots required (not full-site composites). Satisfiable by current scope: yes, with granular naming.
- **PR-004** → contract: masthead parallax positions comparable at *fixed scroll offsets*, and commented-gutter line counts visible per breakpoint → baseline must include scrolled-position captures, not just top-of-page. **Scope gap found**: PR-001's scope listed "navbar shown (scrolled past #tldr)" but not explicit fixed-scroll-offset masthead captures. Added to Phase 2 questions.

**Path-tier checkpoint**: header says Tier-2 (light); ROADMAP concurs; no cut-plan exists. Tier-2 confirmed → Phases 2–5 run.

### Research Questions

**Must-answer:**
1. **Deterministic randomness**: What is the correct Playwright mechanism to override `Math.random` with a seeded PRNG *before any app module executes*, given rain variants are built at module load? — success criteria: cited API + a working seeded-override pattern from a reputable source.
2. **Settling strategy**: How to guarantee captures happen after (a) web fonts are loaded, (b) the 0.4s framer-motion enter transition has finished, and what exactly Playwright's `animations: 'disabled'` covers (CSS-only vs JS-driven)? — success criteria: cited semantics of the screenshot options + a concrete wait recipe.
3. **Snapshot config**: `toHaveScreenshot` granularity/naming so a single page/state baseline can be updated in isolation (PR-006 contract); sensible diff threshold defaults; viewport matrix implementation for xs/mb/sm/md; **browser matrix choice** (Chromium-only vs +WebKit — WebKit matters because the site leans on `backdrop-filter` and PR-008 is a CSS-pipeline swap). — success criteria: cited config pattern; explicit browser-matrix recommendation with tradeoffs.
4. **Timer freeze for `/loading`**: mechanism to freeze the 300ms JS interval (candidate: Playwright clock API) — success criteria: cited API confirmed available in current Playwright + usage pattern.

**Dependencies:** none between Q1–Q4 (all independent).

**Research plan (depth tiers):**
- Q1–Q4 — **Tier A** each (probe; official Playwright docs are primary sources and should settle all four); escalation reserved if docs conflict with community-reported behavior on any load-bearing point.
- Q5 — **internal — no web round**: scope amendment adding fixed-scroll-offset masthead captures (from PR-004's downstream contract); resolved in Phase 4 synthesis.
- Rounds: Round 1 = Q1–Q4 parallel Tier-A probes. No Round 2 expected.
- Default tier: A. Escalations above A: none planned.

**Explicitly excluded from this round** (nice-to-have):
- CI integration (no CI exists; not in any PR's scope)
- Cross-platform font-rendering drift between dev machines (single-machine baseline assumed; revisit only if it bites)
- Perf/Lighthouse capture automation (PR-009/PR-010 measure ad hoc)

### Findings (2026-08-07, all Tier-A, primary source: playwright.dev official docs)

**Q1: Deterministic randomness**

*Options considered:*
- **Option A: `addInitScript` seeded-PRNG override** — inject `Math.random = <seeded mulberry32>` via `context.addInitScript`.
  - Sources: playwright.dev/docs/api/class-page (addInitScript runs "after the document was created but before any of its scripts were run"; persists across navigations; settable context-wide via fixture).
  - Pros: makes rain layouts identical every load (module-load-time randomness is covered — script runs pre-module); zero app-code changes; one fixture serves all tests.
  - Cons: overrides randomness page-wide (acceptable: rain is the only consumer).
- **Option B: `mask` the masthead region** — `toHaveScreenshot({ mask: [...] })` overlays the region.
  - Sources: playwright.dev/docs/api/class-pageassertions (mask option, #FF00FF overlay).
  - Pros: no PRNG plumbing.
  - Cons: **excludes the masthead from regression coverage entirely** — the single most visually complex component (rain parallax is PR-004's subject) would be unverified. Defeats the baseline's purpose.

*Disconfirming evidence sought:* searched for addInitScript timing caveats — none found for pre-module-execution guarantee (it is the documented contract).

*Recommendation:* **Option A** — Status: **proven** (documented execution-order contract). Risks accepted: none material.

**Q2: Settling strategy**

*Key finding:* `toHaveScreenshot` **auto-retries until two consecutive screenshots match** before comparing to baseline — a built-in stability wait. `animations: 'disabled'` (default) halts CSS animations/transitions/Web Animations (finite → fast-forwarded to end state), but **explicitly does NOT affect JS timers** (`setInterval`) — and framer-motion drives values via rAF/JS, not CSS. Sources: playwright.dev/docs/api/class-pageassertions.

*Recipe:* rely on the consecutive-match retry to settle the 0.4s enter transition and font swaps [proven — documented retry contract]; add explicit `document.fonts.ready` await as belt-and-braces [convention]; JS-driven perpetual motion (loading dots) needs Q4's mechanism, not `animations: 'disabled'`.

*Disconfirming evidence sought and FOUND:* the naive "animations: 'disabled' handles everything" assumption is false for JS timers — documented explicitly. This is why Q4 exists.

*Recommendation:* consecutive-match retry + fonts.ready + Q4 for `/loading`. Status: **proven** (retry + animations semantics), **convention** (explicit fonts.ready belt-and-braces).

**Q3: Snapshot config**

*Findings:* snapshots stored per test file (`{testFile}-snapshots/`), named `{name}-{project}-{platform}.png`; custom names via `toHaveScreenshot('name.png')` → **one named snapshot per page/state satisfies PR-006's granular-update contract** (update only what a filtered test run regenerates: `--update-snapshots` applies to tests executed in that run [convention — verify at implementation]). Diff knobs: `maxDiffPixels`, `maxDiffPixelRatio`, `threshold` (YIQ, default 0.2). Multi-project config puts the project name in the snapshot filename → per-viewport projects give a clean breakpoint matrix. Sources: playwright.dev/docs/test-snapshots, class-pageassertions.

*Browser matrix options:*
- **Chromium-only** — Pros: fastest, least flake. Cons: `backdrop-filter`/WebKit-prefixed rendering unverified; PR-008 (CSS-pipeline swap) loses its strongest guard on the engine most likely to differ.
- **Chromium + WebKit** — Pros: covers the WebKit-specific risk surface. Cons: 2× captures, WebKit font antialiasing may need looser `maxDiffPixels`.

*Recommendation:* **Chromium + WebKit projects × viewport matrix (xs 350, mb 600, sm 960, md 1280)**, named snapshots per page/state. Status: **proven** (mechanics), **convention** (matrix choice). Risks accepted: 2× baseline size; possible WebKit tolerance tuning.

**Q4: Timer freeze for `/loading`**

*Findings:* `page.clock.install()` (must precede navigation/other clock calls) overrides `Date`, `setTimeout/Interval`, **and rAF**; `pauseAt()` halts timers; `runFor()` advances deterministically. Source: playwright.dev/docs/clock.

*Caveat found:* because clock also freezes rAF, installing it everywhere would freeze framer-motion mid-transition; pattern is `install → goto → runFor(~600ms)` to advance deterministically through enter transition + dot ticks, **scoped to the `/loading` spec only** — other pages use Q2's retry mechanism.

*Alternative:* mask the dots text — Cons: excludes the page's only content from coverage. Rejected.

*Recommendation:* clock API scoped to `/loading`. Status: **proven** (API), **best-guess-given-constraints** (the exact runFor duration — tuned at implementation).

### Group D: MCP Verification (2026-08-07)

**Schema-Integrity Probe:**

| Claim | Identifier | Canonical documenter | Verified? | Notes |
|---|---|---|---|---|
| Q1 | `addInitScript` pre-script execution | playwright.dev/docs/api/class-page (fetched) | yes | documented contract quoted |
| Q2 | `animations: 'disabled'` scope; consecutive-match retry | playwright.dev/docs/api/class-pageassertions (fetched) | yes | JS-timer exclusion explicit |
| Q3 | `maxDiffPixels`/`maxDiffPixelRatio`/`threshold`; snapshot naming | class-pageassertions + test-snapshots (fetched) | yes | — |
| Q4 | `clock.install/pauseAt/runFor`; rAF override | playwright.dev/docs/clock (fetched) | yes | ordering caveat recorded |

**Synthesis-Verification Probe:**

| Claim | Combined elements | Cited working example | Verified? | Notes |
|---|---|---|---|---|
| Full recipe | seeded addInitScript + retry-settle + scoped clock + per-viewport projects | none found using exact combination | no | **labeled BGGC as a combination**; individually proven parts. Mitigation: PR-001's own verification criterion (two consecutive full runs must produce zero diffs) empirically validates the combination before anything depends on it |

**Binding-at-creation:** N/A (no lifecycle registrations).

**Reconciliations:** none — no agent research to reconcile (driver-run Tier-A probes against primary docs).

### Synthesis

**Outcome**: Confirm — findings support the PR's premise; amendments are additive specifics.

**Changes to this PR** from research:
- Scope locked to: Chromium+WebKit × 4-viewport matrix; named per-page/state snapshots; seeded `addInitScript` PRNG; scoped clock for `/loading`; **added fixed-scroll-offset masthead captures (0/50/100%)** resolving the Q5 internal question (PR-004 contract gap from Phase 1).
- Verification criteria upgraded: two-consecutive-runs determinism check (validates the BGGC combination); deliberate-failure canary (No Phantom Implementations).

**Changes to ARCHITECTURE.md**: § Verification updated with browser/viewport matrix specifics (same commit).

**Changes to CONSTRAINTS.md**: none.

**New PRs that must come first**: none.

**Research-backed details now locked in this PR**:
- `addInitScript` for pre-module seeding [proven]; consecutive-match retry as settling mechanism [proven]; `animations:'disabled'` JS-timer exclusion → scoped clock for `/loading` [proven]; granular named snapshots for PR-006's isolated updates [proven mechanics]; Chromium+WebKit matrix [convention, rationale recorded].

### Gate Check

- Premise still valid: ✓
- No prerequisite PRs surfaced: ✓
- User approved updated spec: ✓ (2026-08-07)
- Implementation cleared

---

## Scope

(Amended per research findings, 2026-08-07 — see Synthesis.)

- Add Playwright as a dev dependency; config: **Chromium + WebKit projects × viewport matrix (xs 350 / mb 600 / sm 960 / md 1280)**; `animations: 'disabled'` default; explicit `document.fonts.ready` await; **seeded `Math.random` override via context-wide `addInitScript` fixture** (deterministic rain).
- Capture **named snapshots per page/state** (granular, individually updatable): every page (`/`, `/works`, each of the 10 `/works/[wid]`, `/contact`, `/clients`, `/404`, `/loading`), plus interactive states: nav drawer open, works filter dropdown open, snackbar visible (post-copy), navbar shown (scrolled past `#tldr`), **and masthead captures at fixed scroll offsets (0%, 50%, 100% of masthead height) for parallax comparison** (PR-004 contract).
- `/loading` spec uses the scoped clock pattern (`clock.install → goto → runFor`) to freeze the dots deterministically.
- Commit the baseline images; add a `test:visual` script that diffs against them.
- **No application code changes whatsoever.**

## Dependencies

None. Must land before every other PR (Baseline Before Change constraint).

## Architecture section implemented

`docs/ARCHITECTURE.md` § Verification.

## Verification criteria

- [ ] **Two consecutive full `yarn test:visual` runs produce zero diffs** (empirically validates the BGGC-labeled mechanism combination — see Group D)
- [ ] Every page/breakpoint/state/scroll-offset listed in scope has a committed baseline image in both Chromium and WebKit projects
- [ ] Masthead rain renders identically across runs (seeded PRNG effective at module-load time)
- [ ] A deliberate 1-line CSS change (e.g. temporarily altering `.white-comp` opacity) produces a failing diff, then reverts clean — proves the harness actually catches regressions (No Phantom Implementations constraint)

## Research backing

D8 (`docs/0.0/DESIGN-log.md`). Outstanding topics in `docs/0.0/RESEARCH-BACKLOG.md`: deterministic capture (font loading settle, animation settle, rain randomness), diff thresholds.

## Notes

The baseline is the enforcement mechanism for the Pixel-Identical Invariant. If a later PR intentionally deviates (D9 bug fixes), the deviation is documented in that PR and the baseline updated as part of that PR's review.
