# PR-010: Final sweep

**Landed-in:** GitHub PR #27, merged 2026-08-10

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-2** (re-tiered from Tier-1 at the 2026-08-10 gate, user directive): the four gate decisions surfaced by Phase 1 (/loading, sw.js window, a11y pair, comingSoon fate) are answered by research, not by fiat. Full 5-phase path runs. Phase 1 (State Assessment) also re-verifies each file is still dead after all prior PRs.

## Research findings

### State Assessment (2026-08-10)

**Current state**:
- Master clean and up to date with origin (`ab9793b`); no parallel-dev drift since the #26 merge (PR-009, merged 2026-08-10 12:16 — the same day as this assessment).
- **Dead-file re-verification (mechanical importer count across `src/`, post-PR-009)** — zero importers, confirmed dead: `src/components/connect.tsx` (grep hits are `ro.disconnect()` in commented.tsx and prose elsewhere — not imports; also contains the repo's only commented-out code line, its line 1), `src/components/headers.tsx` (typed anyway in PR-007 with deletion explicitly deferred here), `src/components/notClient.tsx`, `src/components/url.tsx` (sole `NEXT_ENV` reference — deleting it completes PR-002's env-var criterion), `src/utils/account-observer.jsx`. All last touched only by mechanical passes (PR-002 format, PR-007 codemods) — nothing resurrected them.
- `FailedLoad` (loadingPage.tsx) is exported, never imported. `LoadingPage` is imported only by `src/pages/loading/index.tsx`; nothing in the site links to `/loading`; its baseline masks the animated text (PR-001 deviation note: "dead route, PR-010 removal candidate"). The setInterval leak (D9) is live at loadingPage.tsx:30 (no cleanup return, stale `interval` local).
- **Unused imports beyond the drafted scope**: `ComingSoonPage` is imported-unused in **both** `pages/index.tsx` AND `pages/services/index.tsx` (spec listed only index). `CommentedHeader` is imported-unused in `services/index.tsx`. Removing them orphans `comingSoon.tsx` entirely (its only two references are these unused imports) — which then fails this PR's "no unimported file" criterion unless it is deleted or deliberately kept.
- **`@ts-ignore` ×2 survive** (`comingSoon.tsx:4`, `services/index.tsx:7`) — PR-007 routed `noTsIgnore` here in effect ("check the two surviving sites once types are modern"; config untouched by 003–009 precedent).
- **biome.jsonc**: full PR-002 off-list intact — 22 rules off across correctness/suspicious/style/a11y/complexity, each annotated "→ PR-00X"; no PR ever re-enabled its routed rules. Four route to PR-010 by name (`noUnusedImports`, `noUnusedVariables`, `useConst`, `noNonNullAssertion`); the rest route to PRs whose fixes have since landed, so most should now be re-enableable — to be verified empirically rule-by-rule.
- **sw.js**: self-destroying worker live in production for **hours, not days** (deployed with #26 today). PR-009's Q3 research (proven): a 404'd script never unregisters; the destroyer must be fetched by a returning visitor's update check to fire.
- **Harness budgets**: `tests/visual/pages.spec.ts` — works-index 80 000 / work-* 45 000 px, with in-code contract "PR-009's image rework (fixed sizes) is expected to remove the instability — revisit the budget then." Also documented there: home capture masks (rain SSG nondeterminism — still real, unseeded build-time Math.random survives PR-009), works-filter 6000, masthead 9000.
- **Measurement baseline for the re-measure**: runtime deps now **8** (projection ~7, from 16); First Load JS was **182 kB gz post-PR-007** (uniform method: sum of gz script payload for `/`; projection 110–130 vs original 318); public/ 36 kB tracked (4 files + untracked .DS_Store); `_app` chunk projection ~50–65 kB gz (D5).

**Assumptions at PR draft time**:
- Scope listed `header.tsx` and `types.tsx`-adjacent items; assumed a single unused `ComingSoonPage` import (index only); assumed the dead-file list from the design-time audit would survive nine PRs unchanged.

**Stale assumptions**:
- `header.tsx` no longer exists — deleted in PR-003 (`4c79228`). Scope item satisfied historically, drop it.
- `types.tsx` (and `assertAddressEq`/`Address`) already deleted whole in PR-006 — confirmed gone from `src/`.
- "Commented-out blocks" reduces to `connect.tsx:1` — dies with the file; no separate sweep needed.
- The unused-import surface is larger than drafted (services/index.tsx ×2) and pulls `comingSoon.tsx`'s fate into scope (see gate decisions).

**New constraints** (from prior PRs / codebase evolution):
- Verification bar carried from PR-003…009: `yarn test:visual` 190/190 **twice**, full output + explicit exit codes (never piped), biome/tsc/build green, zero baseline regens beyond user-approved deviations.
- Budget-tightening is empirical only: re-measure webkit thumbnail jitter under the PR-009 fixed-size images before touching 80k/45k; the home rain mask stays (build-time nondeterminism is untouched by PR-009).
- `--update-snapshots` default only rewrites failing snapshots; in-budget deviations need `=all` on a `-g`-filtered run (should not be needed this PR if /loading is removed — its baseline is simply deleted).
- If `/loading` is removed, `tests/visual/` must drop its capture in the same commit (Documentation Accuracy / harness-reality sync), changing 190 → fewer tests; the "190/190 twice" bar becomes "full-suite ×2 at the new count".

**Downstream contracts** (bidirectional `grep -rl "PR-010" prs/ docs/` → PR-001/002/003/006/007/008/009, ROADMAP, RESEARCH-BACKLOG): **no PR depends on PR-010** — it is terminal; the contract surface is *inherited obligations* flowing in:
- **PR-002** → biome off-list re-enable sweep (config untouched since `d3a0832`); env-var criterion completes via `url.tsx` deletion. Satisfiable: yes.
- **PR-003** → `header.tsx` deletion — already done there; obligation void.
- **PR-006** → D9 remainder: interval leak + /loading decision; a11y pair (`noStaticElementInteractions`, `useKeyWithClickEvents`) needs semantic filter-toggle markup = user sign-off. Satisfiable: yes (gate decisions 1 & 3).
- **PR-007** → `headers.tsx` deletion; `@ts-ignore` ×2 recheck under modern types; 182 kB measurement reconciled against projections. Satisfiable: yes.
- **PR-009** → sw.js deletion after deprecation window (gate decision 2); budget revisit; final measurements. Satisfiable: yes.
- **PR-001** → harness stays deterministic across the sweep; /loading baseline handling per decision 1. Satisfiable: yes.
- **RESEARCH-BACKLOG** → /loading = URL-surface change needing explicit sign-off — surfaced at this gate. Satisfiable: yes.

**Path-tier checkpoint**: Tier-1 per the original header; Phase 1 found no premise-changing drift and initially cleared to the gate. **Re-tiered Tier-1 → Tier-2 at the gate (2026-08-10, user directive)**: the four surfaced decision points (/loading, sw.js window, a11y pair, comingSoon fate) are to be answered by research rather than unresearched user fiat. → **Phase 2 (Scope the Research) next.**

### Research Questions (Phase 2, 2026-08-10)

**Must-answer:**
1. **Q1 — /loading removal**: what does correct removal of a dead, unlinked route look like (plain 404 vs 410 vs redirect), and is there any evidence `/loading` has real traffic or is indexed? — success criteria: a cited convention for dead-route removal on static sites + an empirical traffic/indexing check (Vercel analytics, `site:` probe); a keep-vs-remove recommendation with status label.
2. **Q2 — sw.js deprecation window**: how long do production teams serve a self-destroying service worker before deleting it, and what mechanism bounds the required window (browser update-check triggers, 24 h script-cache cap, return-visit distribution)? — success criteria: ≥2 cited production examples or authoritative lifecycle sources yielding a concrete minimum window (e.g. "N weeks/months"), applied to a destroyer that has been live only since 2026-08-10.
3. **Q3 — a11y filter toggle**: what is the standards-correct semantic markup for the works filter toggle (ARIA APG disclosure pattern — `<button>` + `aria-expanded`?), and can it be applied with zero rendered-pixel change given the existing button-reset styles in global.css? — success criteria: cited APG/WAI pattern + a concrete markup/CSS plan whose pixel-neutrality is verifiable by the harness; unblocks re-enabling `noStaticElementInteractions`/`useKeyWithClickEvents`.
4. **Q4 — comingSoon.tsx fate**: retention convention for orphaned-but-maybe-future components — delete (git history recovers) vs keep. — **internal — no web round** (resolved in Phase 4 synthesis; the deciding facts are local: LOC-direction constraint, git recoverability, user intent).
5. **Q5 — First Load JS floor**: what is the realistic First Load JS floor for a minimal Next 16 Pages Router + React 19 app, and is the design projection (110–130 kB gz) still achievable — or does the framework chunk alone (77 kB post-PR-007) make 182→~150 the honest target? — success criteria: cited baseline measurements (official Next data or reproducible community measurements) grounding the projection-reconciliation write-up this PR owes.

**Dependencies:**
- Q1, Q2, Q3, Q5 independent (parallel Tier-A probes).
- Q4 internal, resolved in Phase 4 after Q1 (if /loading is removed, comingSoon's only structural sibling precedent changes nothing — genuinely independent, sequenced last only for synthesis tidiness).

**Research plan (depth tiers):**
- Q1 — **Tier A**; rationale: primary sources (Google Search Central on 404/410, Next.js docs) + local empirical probes suffice; low ambiguity expected.
- Q2 — **Tier A → B if inconclusive**; rationale: load-bearing (stranded returning visitors are unrecoverable); mechanism already proven in PR-009 Q3, but window-duration convention may be thin — escalate if <2 independent citations surface.
- Q3 — **Tier A**; rationale: ARIA APG is the canonical primary source; pixel-neutrality is verified empirically by our own harness, not by web research.
- Q4 — **internal — no web round**.
- Q5 — **Tier A**; rationale: needs only order-of-magnitude grounding for an explanation the PR file owes; not decision-blocking for code.
- Rounds: Round 1 = Q1/Q2/Q3/Q5 parallel Tier-A probes; Round 2 = only if Q2 escalates to Tier B (`light-research.js`).
- Default tier: A. Escalations above A: none pre-assigned; Q2 flagged as the likely candidate.

**Explicitly excluded from this round** (nice-to-have):
- Font-metric-override fallback tuning (PR-009 leftover flag) — not needed for any PR-010 criterion.
- Lighthouse-in-CI automation (PR-001 exclusion) — measurements stay ad hoc.
- Budget-tightening methodology — purely empirical against our own harness; no web round can answer it.

### Findings (Phase 3, 2026-08-10 — Tier-A probes, driver-inline; Group D folded in where noted)

**Q1: /loading removal — correct mechanics + is it live-referenced?**

*Options considered:*
- **Option A: remove the route, let it 404** — delete `src/pages/loading/` + `loadingPage.tsx`; Next.js serves the existing 404 page.
  - Sources: [Google Search Central, 404 errors](https://support.google.com/webmasters/answer/2445990): "404 errors won't impact your site's search performance"; for permanently deleted content "let the old URL return a 404 or 410"; redirecting to the homepage instead is a "soft 404" anti-pattern. Google "treats 410s (Gone) the same as 404s".
  - Pros: kills the D9 interval leak by deletion (zero fix code); −2 files, LOC-direction; removes the one baseline whose text is already masked-unverified (PR-001 deviation note called it "dead route, PR-010 removal candidate"); no redirect infrastructure needed (Google explicitly advises none).
  - Cons: URL-surface change (the constraint that required this sign-off); any unknown external deep link starts 404ing.
- **Option B: keep the route, fix the leak** — add the missing `clearInterval` cleanup return (D9).
  - Pros: URL surface untouched; ~4-line fix.
  - Cons: retains a route with no purpose, no inbound links, masked baseline coverage; the sweep's "no unimported file" spirit survives on a technicality (page imports it).
- **Empirical probes (2026-08-10)**: zero `src/` references to `/loading` outside its own page; live `https://www.maxrux.dev/loading` returns 200 (route is currently served); `site:maxrux.dev` search surfaces **no indexed pages at all** for the domain — /loading has no search presence to lose; no robots.txt exists (nothing depends on the URL for crawl control). **Gap**: Vercel Analytics page-level traffic not queryable from CLI — dashboard eyeball available to the user; flagged, non-blocking (best-guess: ~zero traffic, consistent with zero inbound links + zero indexing).

*Disconfirming evidence sought:* searched for "removed page needs 301/redirect" guidance — Google's own doc affirms the opposite for permanently-removed content (redirect-to-home = soft 404, "can be problematic"). None found favoring retention of unlinked dead routes.

*Recommendation:* **Option A — remove.** Status: **proven** (Google-official mechanics) + **best-guess** on the zero-traffic assumption (flagged above). Risks accepted: unknown external deep links 404 — mitigated by the domain having no measurable index presence.

**Q2: sw.js deprecation window — how long must the destroyer outlive PR-010?**

*Options considered:*
- **Option A: keep `sw.js` indefinitely (outlives this PR)** — the documented convention.
  - Sources: [vite-pwa unregister guide](https://vite-pwa-org.netlify.app/guide/unregister-service-worker): "remember **not to delete any service worker** from the public directory (you don't know what version the users of your application have installed)"; [NekR/self-destroying-sw Medium writeup](https://medium.com/@nekrtemplar/self-destroying-serviceworker-73d62921d717): destroyer stays deployed, update fetch delayed "not more than 24 hours" by HTTP cache; [Rancourt, How to remove a service worker](https://www.benjaminrancourt.ca/how-to-remove-a-service-worker/): deleting the file means installed workers "would **not** be updated because the file would result in a 404". Mechanism already proven in PR-009 Q3 (SW spec: failed script fetch = failed update; the 2017 unregister-on-404 proposal never landed).
  - Pros: zero stranding risk for any returning visitor, however late they return; the file is 17 lines and inert for visitors without a registration (nothing registers it anymore — grep-verified, zero `serviceWorker` references in `src/`).
  - Cons: one permanent vestigial file in `public/`; the "final sweep" doesn't fully sweep.
- **Option B: delete after a finite window** — no source found endorsing any finite window; every consulted source either says keep indefinitely or is silent. A deleted `sw.js` permanently strands any visitor whose last visit predates the destroyer (their workbox worker intercepts fetches forever, NetworkFirst — low harm but irreversible).
- **Empirical probe (2026-08-10)**: live `https://www.maxrux.dev/sw.js` serves the destroyer with `cache-control: public, max-age=0, must-revalidate` — no HTTP-cache delay; a returning visitor's update check (fires on navigation) fetches it immediately. The destroyer has been in production only since 2026-08-10 12:16 (deployed with #26) — hours.

*Disconfirming evidence sought:* searched for any production writeup deleting a destroyer after N days/weeks — none found; all three independent sources converge on retention.

*Recommendation:* **Option A — sw.js outlives PR-010; keep indefinitely** (revisit only if the user ever wants a tracked decision to delete, accepting stranding of never-returned-since-2026-08-10 visitors). Status: **convention** (3 independent sources) on retention; **proven** on the stranding mechanism (SW spec, PR-009 Q3). Risks accepted: one 17-line vestigial file; ROADMAP/PR text saying "deleted in PR-010" must be amended (Phase 4).

**Q3: a11y filter toggle — standards-correct markup with zero pixel change?**

*Options considered:*
- **Option A: native `<button type="button">` + `aria-expanded`** (APG disclosure pattern).
  - Sources: [W3C APG Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): "The element that shows and hides the content has role button"; `aria-expanded` required (`true`/`false` tracks visibility), `aria-controls` **optional**; Enter/Space activation — native `<button>` provides both for free via click semantics. Pixel-neutrality read from the **canonical documenter, installed** `node_modules/tailwindcss/preflight.css` (Tailwind v4): buttons get `margin:0; padding:0; border:0 solid; font/letter-spacing/color:inherit; border-radius:0; background-color:transparent; appearance:button` — i.e. Preflight strips every UA button style that paints; the toggle's existing classes (`white-comp flex items-center cursor-pointer mt-[1ch]`) apply unchanged (`display:flex` overrides the UA display; global.css already restores `cursor:pointer` on buttons).
  - Pros: First-Rule-of-ARIA-compliant (native element over role bolt-on); keyboard support with zero JS added; satisfies **both** off-listed rules (`noStaticElementInteractions`, `useKeyWithClickEvents`) at the root instead of suppressing them; in-repo working example of the exact combination already ships — the hamburger toggle renders `role="button" aria-expanded` (hamburger-react, observed in live prod HTML 2026-08-10).
  - Cons: keyboard focus gains a visible focus indicator the div never had (browser default focus ring) — a *deliberate* a11y gain, invisible to the harness (captures never focus the toggle), but technically a new interactive state. Residual UA styles Preflight doesn't reset (`text-align:center`, `user-select`) are non-painting here: single-line text in a flex container.
- **Option B: keep `<div>`, add `role="button"` + `tabIndex={0}` + keydown handler**.
  - Pros: zero element-swap risk.
  - Cons: hand-reimplements what `<button>` gives free (Enter+Space each need explicit handling); violates the native-first rule the APG itself teaches; `noStaticElementInteractions` may still flag div-with-role depending on rule semantics — doesn't cleanly unblock the Biome re-enable.

*Disconfirming evidence sought:* searched for pixel-difference reports on div→button swaps under Tailwind Preflight — the reset exists precisely to make form controls unstyled; no counter-reports found. The harness (works-filter-open baseline, 6000-budget; works-index) independently verifies neutrality at implementation — the real arbiter.

*Recommendation:* **Option A** — `<button type="button" aria-expanded={isList}>` (aria-controls optional, omitted; content sibling has no id). Status: **proven** (APG primary source; preflight read at installed version; in-repo combination example). Risks accepted: new focus-visible state (a11y gain, outside baseline coverage).

**Q4: comingSoon.tsx fate** — internal, resolved in Phase 4.

**Q5: First Load JS floor on Next 16 — is 110–130 kB gz still honest?**

- Sources: [Catchmetrics, Next.js 15.5 webpack vs Turbopack](https://www.catchmetrics.io/blog/nextjs-webpack-vs-turbopack-performance-improvements-serious-regression): minimal-ish Pages Router app measures 286 kB (webpack) → 324 kB (Turbopack) median first-load, shared baseline 239→219 kB (build-output figures); i.e. the modern framework baseline dominates small sites and Turbopack does not shrink it. Local prior measurement (PR-007, uniform method = sum of gz script payload for `/`): **182 kB gz**, framework chunk **77 kB gz** (vs 41 on Next 12) — upgrade-inherent, already documented as such.
- Analysis: the 110–130 projection was D5 arithmetic **on the Next 12 runtime**. On Next 16/React 19 the irreducible framework payload alone (~77 kB gz) plus app/page chunks puts the realistic floor at ~**140–170 kB gz** for this site; 110–130 is not reachable by deletion alone on the new stack.
- *Disconfirming evidence sought:* looked for evidence that Next 16 Pages Router sites commonly hit ≤130 kB gz first-load — found none for React-19-based Pages Router apps; community guidance treats ~130 kB as an aspirational threshold predating the React 19 runtime growth.
- *Recommendation:* re-measure at implementation with the uniform method; reconcile the projection with an explicit written explanation (the PR already owes one for any wide miss): **the projection was stack-relative; the miss is upgrade-inherent (documented since PR-007), not un-deleted code.** Status: **convention** (2 independent measurement sets: Catchmetrics + our own PR-007 numbers).

### Group D: MCP Verification (2026-08-10, folded into probes above)

**Schema-Integrity Probe:**

| Claim | Identifier | Canonical documenter | Verified? | Notes |
|---|---|---|---|---|
| Q3 markup | `aria-expanded` on `role=button` trigger; `aria-controls` optional | W3C APG Disclosure pattern page (live spec text) | yes | fetched directly |
| Q3 pixel-neutrality | button reset: `padding:0; border:0; font/color:inherit; background:transparent; border-radius:0` | `node_modules/tailwindcss/preflight.css` (installed v4) lines 11–16, 243–256 | yes | read at installed version, not from docs |
| Q1 mechanics | 404 vs 410 equivalence; no redirect | Google Search Central answer 2445990 | yes | fetched directly |
| Q2 cache bound | destroyer served `max-age=0, must-revalidate` | live `https://www.maxrux.dev/sw.js` response headers | yes | curled 2026-08-10 |

**Synthesis-Verification Probe:**

| Claim | Combined elements | Cited working example | Verified? | Notes |
|---|---|---|---|---|
| Q3 combination | `<button>` + `aria-expanded` toggle + CSS-reset styling | in-repo: hamburger-react nav toggle renders `role="button" aria-expanded` in live prod HTML; APG disclosure example uses the exact button+aria-expanded pair | yes | two independent examples |
| Q2 combination | self-destroyer + retention policy | vite-pwa official guide documents the exact deploy-and-never-delete procedure | yes | plus NekR + Rancourt corroboration |

**Binding-at-creation:** N/A — this PR removes registrations; it introduces none.

**Reconciliations:** Q1's zero-traffic assumption remains **best-guess** (analytics dashboard not CLI-queryable) — flagged, non-blocking; all other load-bearing claims verified against canonical sources.

### Synthesis (Phase 4, 2026-08-10)

**Outcome**: Amend — research reversed one drafted decision (sw.js deletion → retention), resolved the two open decisions (/loading removed; a11y pair fixed at the root, not suppressed), and settled the orphan question (comingSoon deleted). **User approved A1–A4 (2026-08-10).**

**Changes to this PR** from research:
- A1: /loading removed (was pending sign-off) — leak fix item closed as "resolved by removal"; harness loses the one masked-text baseline.
- A2: sw.js retained indefinitely (was "delete after deprecation window") — the destroyer had been live only hours, and no source endorses any finite deletion window.
- A3: a11y toggle semantic fix enters scope as a documented functional deviation; both a11y rules re-enable in the Biome sweep.
- A4: comingSoon.tsx deleted (orphaned by the unused-import sweep; LOC-direction; git recovers).
- Scope/Verification sections above rewritten accordingly; stale draft items (header.tsx, types.tsx) dropped as historically satisfied.

**Changes to ARCHITECTURE.md**: final-state pass happens with implementation (route list loses /loading; no structural sections change from research).
**Changes to CONSTRAINTS.md**: none — A3 rides the documented-deviation discipline; no new constraint.
**Changes to DESIGN-log**: D9 closure note (leak resolved by route removal) with implementation commit.
**Changes to ROADMAP/PR-009**: PR-010 line updated to the decided scope; PR-009's "destroyer dies in PR-010" note annotated as superseded (this commit).
**New PRs that must come first**: none.

**Research-backed details now locked in this PR**:
- /loading end state = plain 404, no redirect (Google Search Central, proven).
- sw.js = permanent retention (convention ×3: vite-pwa, NekR, Rancourt; stranding mechanism proven via SW spec/PR-009 Q3).
- Toggle markup = `<button type="button" aria-expanded={isList}>`, `aria-controls` omitted (APG optional; no target id) — pixel-neutral per installed preflight, harness-arbitrated.
- Bundle reconciliation framing = projection was Next-12-relative; Next 16 floor ~140–170 kB gz (Catchmetrics + PR-007 measurements).

### Gate Check (Phase 5, 2026-08-10)

- Premise still valid: ✓ — final sweep confirmed as the correct terminal PR; research resolved (not invalidated) every open decision
- No prerequisite PRs surfaced: ✓ — all nine dependencies merged (#18–#26); no new PR needed
- Amendments A1–A4 user-approved: ✓ (2026-08-10)
- Non-blocking flags carried into implementation: /loading zero-traffic assumption (best-guess; analytics dashboard check available); sw.js retention is the sweep's one documented exception
- User approved updated spec / implementation start: ✓ (2026-08-10)
- Implementation cleared

---

## Scope

*(Amended 2026-08-10 per Phase 4 synthesis, user-approved A1–A4. Original draft items `header.tsx`/`types.tsx` were already satisfied historically — see State Assessment.)*

- **Dead code deleted**: `connect.tsx`, `account-observer.jsx`, `url.tsx`, `headers.tsx`, `notClient.tsx`; unused imports `ComingSoonPage` (× `pages/index.tsx` AND `pages/services/index.tsx`) + `CommentedHeader` (`services/index.tsx`); **`comingSoon.tsx` deleted** (A4 — orphaned once its unused imports go); surviving `@ts-ignore` in `services/index.tsx` removed. The one commented-out code line (`connect.tsx:1`) dies with its file.
- **`/loading` route removed** (A1, research-backed + user-approved): delete `src/pages/loading/` + `src/components/loadingPage.tsx` (`FailedLoad` dies with it; D9 interval leak resolved by removal). Plain 404 is the correct end state — no redirect (Google-official). Harness: `loading` baseline + test entry deleted in the same commit; the "×2 clean" bar applies at the new full-suite count.
- **Biome off-list sweep**: re-enable every off-listed rule whose violations are gone (verified rule-by-rule empirically); **the a11y pair re-enables too** via A3 — works filter toggle `<div onClick>` → `<button type="button" aria-expanded={isList}>` (APG disclosure pattern; pixel-neutral under the installed v4 preflight reset; documented functional deviation — keyboard focusability is a deliberate a11y gain). Any rule that must stay off gets its comment updated to the real blocker.
- **`public/sw.js` retained indefinitely** (A2, reverses the PR-009 plan): never delete a once-served SW path (convention, 3 sources). Amend the sw.js header comment + PR-009/ROADMAP text; the sweep's documented exception.
- **Harness budget revisit** (inherited from PR-009): re-measure webkit thumbnail jitter under fixed-size images; tighten works-index 80k / work-* 45k budgets to empirically-justified values (or document why not). Home rain mask stays (build-time nondeterminism untouched by PR-009).
- Reconcile docs: update `docs/ARCHITECTURE.md`/`CLAUDE.md` to describe the final state; mark roadmap complete; DESIGN-log D9 closure notes.
- **Re-measure everything** and record in the PR: First Load JS (uniform method: sum of gz script payload for `/`; original projection 110–130 kB gz is stack-stale — honest Next 16 floor ~140–170, miss documented as upgrade-inherent per Q5), `_app` chunk, dep count, LOC, work-page transfer, Lighthouse.

## Dependencies

All prior PRs.

## Architecture section implemented

Closes out all sections; verifies § Overview end-state.

## Verification criteria

- [x] `yarn test:visual` full suite ×2 clean at the new count — **182 passed + 2 by-design skips (drawer test at md), exit 0, both runs**; zero baseline regens (the a11y toggle swap diffed clean — pixel-neutrality confirmed by the harness)
- [x] `biome check` green — **the entire PR-002 off-list is retired; config carries zero rule overrides** (full recommended preset). Violations fixed; the only survivors are 8 per-line `biome-ignore` suppressions each naming its real justification (constant-trip-count hook loop; deliberate `[path]` effect dep; drawer dismiss affordances with Esc/focus-trap keyboard parity; index-in-key on render-static arrays)
- [x] `yarn tsc --noEmit` + `yarn build` green; build output: **16 static pages** (was 17 — `/loading` absent), all ○/●
- [x] No file in `src/` is unimported — mechanical importer sweep in State Assessment; deletions leave zero orphans
- [x] `/loading` returns the 404 page on production (verified 2026-08-10 post-merge: 404 status + NOT FOUND title; `/sw.js` 200 with amended header; all routes 200)
- [x] `public/sw.js` retained; header comment amended to the indefinite-retention decision
- [x] Budget revisit: **works-index 80k / work-* 45k budgets retired** — three consecutive probe runs at `maxDiffPixels: 0` passed 88/88 each (PR-009's fixed-size images removed the WebKit resampling nondeterminism); all full-page captures now share the PR-001-calibrated 8000 budget
- [x] Design-projection deltas documented (see Measurements below)

## Measurements (2026-08-10, final; uniform methods noted)

| Metric | Pre-refactor | Projection | Final | Notes |
|---|---|---|---|---|
| First Load JS `/` (sum of gz script payload) | 318 kB | 110–130 kB | **187.6 kB gz** (13 scripts) | Projection was Next-12-relative arithmetic (D5). The Next 16/React 19 framework+runtime chunks alone are ~127 kB gz (77.5 framework + 45.3 runtime + manifests) vs ~41 kB on Next 12 — upgrade-inherent, documented since PR-007 (182 kB then; +5.6 since = PR-008/009 font/image wiring). App-code share is ~60 kB gz. Miss is explained, not un-deleted code. |
| Runtime deps | 16 | ~7 | **8** | @vercel/analytics, hamburger-react, jotai, motion, next, react, react-dom, react-icons |
| Work-page transfer (blormmy, doc+js+css+images gz) | ~8 MB | <500 kB | **~462 kB** | images 264 kB now dominate; doc 5.2 kB |
| `public/` | 18 MB | — | **36 kB** (4 files + retained sw.js) | delivered by PR-009 |
| `src/` LOC | 2865 (2610 code) | "meaningfully down" | **2879 (2584 code)** | Net-flat, not down: deletions (MUI glue, resize registry, immutable, Works class, dead files, /loading) were offset by internalizing 8 dependencies' behavior (hand-rolled drawer/snackbar/breakpoint hooks), typing works content in-repo, and moving the theme into `global.css`. The honest trade: −8 runtime deps at ±0 LOC. |
| Lighthouse (local prod serve, ad hoc) | — | — | perf 84 / a11y 82 / bp 93 / seo 91; FCP 0.8 s, LCP 4.5 s, TBT 10 ms, CLS 0.002 | LCP driven by masthead rain composite |
| Visual suite | 190 exec | — | **182 exec + 2 by-design skips** | −8 /loading baselines |

## Research backing

Audit findings (DESIGN-log evidence baseline); D5/D9; PR-010 Phase 3 findings above (Q1–Q5, Tier-A, Group D verified).

## Notes

This PR is deliberately last so every "is it dead yet?" question has a settled answer.

## Implementation notes (2026-08-10)

- Deleted: `connect.tsx`, `headers.tsx`, `notClient.tsx`, `url.tsx`, `account-observer.jsx`, `comingSoon.tsx`, `loadingPage.tsx`, `src/pages/loading/`, `tests/visual/loading.spec.ts` + 8 baselines; unused imports in `pages/index.tsx` + `pages/services/index.tsx`; both surviving `@ts-ignore`s.
- **A3 toggle**: `<button type="button" aria-expanded={isList}>`; inner arrow wrapper `div`→`span` (button content model is phrasing content — the PR-006 invalid-nesting lesson applied preemptively; layout-identical, flex items are blockified). Harness-verified pixel-neutral.
- **Biome sweep detail**: safe autofixes (≈30 `useImportType`, `useConst`, `Math.pow`→`**`) + manual fixes: `parseInt` radix ×2 (both parse decimal px strings), `path: any`→`string` (router.asPath), `children: any`→`ReactNode`, `Map<String,…>`→`Map<string,…>`, `type="button"` ×5 (no forms — behavior-neutral), missing key on contact cards (`key={c.title}` — last D9 missing-key instance), test non-null assertion → explicit throw, and `justify: center` deleted from `.white-comp` (not a CSS property; parsed-and-ignored by every browser, so removal is pixel-identical by spec — harness concurs).
- New a11y surface beyond baseline coverage (documented deviation, invisible to captures): toggle is keyboard-focusable/activatable; drawer/backdrop suppressions rest on the Esc + focus-trap parity contract from PR-003.
- sw.js retention: header comment amended; PR-009 scope note annotated as superseded; ARCHITECTURE § Assets records the exception.
