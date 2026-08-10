# PR-009: Assets — fonts, images, dead files

**Landed-in:** (open — GitHub PR #26, awaiting merge)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-2 (partial)**: font subsetting tooling/ranges and compression targets are research-pending; the rest is Tier-1.

## Research findings

### State Assessment (2026-08-09)

**Current state**:
- Repo: `master` @ `443484b` (PR-008 merged via #25), clean; no open PRs; no parallel-dev drift. Stack: Next 16.3 / React 19.2 / Tailwind 4 — `next/font` + modern `next/image` prerequisites all in place.
- **Fonts (public/fonts/)**: `SF-Pro-Display-Bold.otf` **3.2 MB** + `Menlo.otf` 565 kB + orphan `Menlo-Regular.woff` 237 kB + two tiny css files. The css declares families `"SF Pro"` and `"Menlo"`, **no `font-display`, no `font-weight`** (defaults: auto ≈ block-then-swap; weight 400 — the Bold file serves ALL weights, so `font-bold` text gets synthetic bold on top of bold glyphs). Both stylesheets are linked **twice**: `_document.tsx` AND `layouts/main.tsx` Head. Note: body font stack lists `SF Pro Display` (a family that is never declared) before `SF Pro` — the effective body face is the Bold SF file.
- **Images**: raw `<img>` ×3 sites — work-detail thumbnail (works.tsx), rain letters (`/icons/*.png` ×11 pool), slot coins (×4 incl. `btc-logo.png` 377 kB). `next/image` ×2 (navbar logo, works previews — both with PR-007's pinned boxes). Sources: thumbnails 9.9 MB (blormmy 7.9 MB), `eth-logo-white.png` 222 kB (renders ≤ ~20px!), `LinuxIcon` 184 kB, public total **18 MB**.
- **Dead files, reference-checked (grep, zero refs)**: `sw.js`, `workbox-74d02f44.js`, `manifest.json`, `btc.png` (1.9 MB), `download.jpg`, `eth-logo-black.png`, `wojak.png` (235 kB), `JupyterIcon.png` (266 kB), `btc-logo.png~`, `JupyterIcon.png~`, `Menlo-Regular.woff`, orphan thumbnails (`eastern-standard`, `treasure`, `nft-data-miner`). The scope's three "check before deciding" files (btc/download/eth-logo-black) are all **confirmed unreferenced**.
- **No service-worker registration code exists in src** — `sw.js` is a pre-refactor remnant, but returning visitors may still carry a live registration pointing at it (the backlog's stale-registration question — what happens when the script starts 404ing needs a cited answer before deletion).
- **Rendered-glyph inventory** (mechanical scan, source non-ASCII): `© · ’ “ ” … → –` (plus comment-only chars). Any subset must cover these; content in `works.ts` changes over time, so used-glyphs-exact subsetting is fragile vs. range-based subsetting — a research/synthesis decision.
- **Harness coupling**: pages.spec budgets (works-index 80k, work-* 45k) carry explicit "PR-009's image rework is expected to remove the instability — revisit the budget then" notes. Rain/masthead baselines are seeded-random and documented as regen-expected if image handling changes.

**Assumptions at PR draft time**: all hold, with one addition — PR-007 (after drafting) pinned the two `next/image` call-site boxes because modern natural-ratio sizing shifts layout. "True display dimensions" here must mean prop/source correctness, **not** un-pinning rendered geometry (recommendation: boxes stay pinned).

**Premise-level flag (for the gate)**: converting rain/slot/work-detail images to `next/image` and compressing sources **inherently changes served image bytes** — this PR cannot hold the zero-baseline-regen bar for image-content pixels. Expected deviation surface: masthead/home/navbar-shown (rain), work pages (detail image), works-index/previews (recompressed thumbnails). Each regen to be enumerated + reviewed, mirroring the D9 deviation discipline; text/layout must still diff clean.

**Downstream contracts** (grep sweep): **PR-010** → re-measures bundle/transfer vs projections (this PR delivers the big wins: est. 18 MB public → low single-digit MB; work page ~8 MB → <500 kB target) and inherits the budget-revisit notes. **PR-001** → determinism contract; rain regen path documented in fixtures. **RESEARCH-BACKLOG** → lists exactly the questions below. All satisfiable.

**Path-tier checkpoint**: **Tier-2 (partial) confirmed** — header, backlog, and this assessment agree research is required. → **Phase 2 (Scope the Research) next**, not a Phase-1 clear.

**Draft must-answer questions for Phase 2** (from this assessment):
1. Font subsetting pipeline (tool + otf→woff2 flow) — Tier A expected (fonttools/pyftsubset convention).
2. **License-safety of subsetting/self-hosting SF Pro + Menlo** (Apple fonts) — load-bearing; Tier A → escalate if sources conflict.
3. Subset range strategy: exact-used-glyphs vs Latin+punctuation ranges (fragility vs size) — internal + convention, informed by the glyph inventory above.
4. `sw.js` deletion semantics: does a 404'd service-worker script unregister existing registrations on update check? — Tier A (spec/MDN/Chromium docs).
5. `font-display` **swap vs block** — user decision flagged in Notes/D6; to be asked at the gate.
6. Image compression targets/tooling per largest rendered dimension — internal + convention.

**Gate rider (2026-08-09, user-approved with Phase-2 entry)**: `font-display: swap` confirmed (D6 default; failure-mode change accepted). Image-pixel baseline-deviation class approved in principle — each regen still enumerated + reviewed at implementation. PR-007's pinned boxes stay pinned.

### Research Questions (Phase 2, 2026-08-09)

**Must-answer:**
1. **License-safety: may SF Pro and Menlo be subset + self-hosted as woff2 for a personal website?** — success criteria: the actual Apple license terms (SF Pro comes under Apple's Font EULA; Menlo ships with macOS) read from primary sources, with a clear verdict per font: permitted / prohibited / gray-with-risk. If prohibited or gray, enumerate options (ship unsubsetted as today, swap to a licensed lookalike, accept documented risk) — decision escalates to the user in Phase 4.
2. **Subsetting pipeline** — success criteria: named tool + exact invocation producing woff2 from OTF, from cited production usage (not synthesis); handles OTF/CFF input; deterministic output.
3. **`sw.js` deletion semantics for returning visitors** — success criteria: cited spec/browser-doc statement of what happens to an existing registration when the script URL starts returning 404 on update check (unregister? keep serving stale cache?), and whether an explicit unregister shim is warranted.
4. **Subset range strategy** — success criteria: a concrete unicode-range/glyph list that covers all rendered text (incl. `© · ’ “ ” … → –`) with headroom for future works.ts edits, and the measured size at that range. *Internal + convention — no dedicated web round; folded into Q2's tool run at implementation, verified by the glyph audit criterion.*
5. **Image compression targets/tooling** — success criteria: per-image target dimensions (largest rendered size × 2 DPR) and encoder settings; tool choice (sharp is already installed as a Next dependency). *Internal — no web round; resolved in Phase 4 synthesis from measured rendered sizes.*

**Dependencies:** Q1 gates Q2/Q4's usefulness (if subsetting is prohibited, they collapse to "convert/serve as-is or don't touch"). Q3 independent. Q5 independent.

**Research plan (depth tiers):**
- Q1 — **Tier A first** (Apple font EULA / SF license page + one corroborating engineering source); **escalate to Tier B** only if primary terms are ambiguous or sources conflict — this is the one question where a wrong best-guess has legal color, so no silent settling.
- Q2 — **Tier A** (fonttools/pyftsubset official docs + one production example); rationale: standard tooling, low uncertainty.
- Q3 — **Tier A** (Service Worker spec / MDN / web.dev); rationale: specified behavior, primary sources exist.
- Q4, Q5 — **internal — no web round** (Phase 4 synthesis).
- Rounds: Round 1 = Q1–Q3 parallel Tier-A probes (independent). Round 2 = only if Q1 escalates.
- Default tier: A. Escalations above A: none pre-assigned; Q1 carries the explicit escalate-if-uncertain trigger.

**Explicitly excluded from this round** (nice-to-have):
- AVIF/WebP format migration for thumbnails (next/image serves negotiated formats from the optimizer already; source-format work beyond compression is scope creep).
- Font-metric-override fallbacks (adjustable CLS tuning) — not part of pixel-identity; PR-010 could revisit.
- Preload/priority tuning beyond next/font defaults.

### Findings (Phase 3, 2026-08-09 — Tier-A probes, driver-inline; Group D folded in: every identifier below was read from its canonical documenter directly)

**Q1: May SF Pro / Menlo be subset + self-hosted as woff2?** → **NO — not license-safe. [proven]**

*Evidence (primary):* Apple's SF license, quoted from [developer.apple.com/fonts](https://developer.apple.com/fonts/): use is granted *"solely for creating mock-ups of user interfaces to be used in software products running on Apple's iOS, OS X or tvOS operating systems"*, and *"You may not embed the Apple Font in any software programs or other products."* Web self-hosting is outside the grant entirely; subsetting adds derivative modification on top. Menlo ships under the macOS SLA (bundled system font; not licensed for standalone redistribution or `@font-face` embedding — corroborated by [HandWiki/typeface references](https://handwiki.org/wiki/Menlo_(typeface))). Nuance: Menlo's ancestor **Bitstream Vera Sans Mono is permissively licensed** (derivatives + embedding allowed under a different name — [Font Squirrel license text](https://www.fontsquirrel.com/license/bitstream-vera-sans-mono)), which is why licensed near-lookalikes (Meslo, DejaVu Sans Mono) exist.

*Options for Phase 4 (user decision — all change the legal or visual status quo except (a)):*
- **(a) Status-quo risk, minimal PR**: keep serving the existing OTFs; PR shrinks to de-duping the double `<link>`, adding `font-display: swap`, deleting the orphan woff. Perf win on fonts forfeited (3.8 MB stays).
- **(b) Accept documented risk, full plan**: subset + woff2 via next/font as scoped. The site *already* distributes both full fonts publicly today — (b) does not create a new violation class, it modifies within an existing one (smaller glyph set, new container). Exposure is qualitatively similar, quantitatively arguably smaller surface; formally it remains unlicensed embedding + modification.
- **(c) Licensed lookalikes** (Meslo/DejaVu for Menlo; an SF-alike for SF Pro): license-clean but **breaks pixel-identity** — different glyphs at the pixel level across every capture.
- **(d) System-font stack** (rely on local SF/Menlo): license-clean, but non-Apple visitors lose the faces entirely (today they download them) — platform-dependent visual change.

*Disconfirming search:* looked for any Apple provision permitting web embedding for personal use — none found; community threads and the EULA itself consistently prohibit ([Apple Developer forum](https://developer.apple.com/forums/thread/727961), [Apple Community](https://discussions.apple.com/thread/8535378)).

**Q2: Subsetting pipeline** → **fonttools `pyftsubset` [proven]** — accepts *"any TT- or CFF-flavored OpenType (.otf or .ttf)"* input; `--flavor=woff2` output (requires the Brotli Python package); `--unicodes=<ranges>` for coverage; `--layout-features` defaults preserve kern/liga. Source: [fonttools subset docs](https://fonttools.readthedocs.io/en/latest/subset/index.html) (the canonical documenter for every flag named here). fonttools is the foundation of Google Fonts' own production pipeline [convention — widely documented]. Alternative considered: `glyphhanger` (wraps the same fonttools engine, adds page-crawling; unnecessary — our glyph inventory is already derived from source).

**Q3: What happens to existing SW registrations when sw.js starts 404ing?** → **Nothing — the registration persists. [proven]** The current [Service Worker spec](https://w3c.github.io/ServiceWorker/) contains **zero** special-casing of 404/410 in the Update algorithm (grep-verified against the living spec: a failed script fetch = failed update job; the 2017 proposal to unregister on 404/410, [w3c/ServiceWorker#204](https://github.com/w3c/ServiceWorker/issues/204), never landed). Corroborated by [web.dev's lifecycle guide](https://web.dev/articles/service-worker-lifecycle): *"If your new worker has a non-ok status code (for example, 404) … the new worker is thrown away, but the current one remains active."*
→ **Deleting `sw.js` outright does NOT self-heal returning visitors.** Blast-radius check (local read of `public/sw.js`): the legacy worker registers only **NetworkFirst** routes, no precache — so stale-content risk is low, but the dead worker would intercept fetches forever. *Recommendation:* replace `/sw.js` with a **self-destroying service worker** (tiny worker that unregisters itself + clears caches on activate — the documented pattern, e.g. [NekR/self-destroying-service-worker](https://github.com/NekR/self-destroying-service-worker)) [convention — multiple production writeups], keep it for a deprecation window, delete in PR-010.

**Q4 (internal)**: subset ranges = Basic Latin (U+0020–007E) + Latin-1 punctuation/symbols incl. `© ·` + General Punctuation (U+2010–2027 covers `– — ‑ ’ “ ” …`) + `→` (U+2192) + `−` (U+2212) — range-based with headroom, not exact-glyph (fragile to works.ts edits). Resolved in Phase 4 if (b) chosen.

**Q5 (internal)**: compression via the already-installed `sharp`; targets = largest rendered dimension × 2 DPR per image (measured at implementation); resolved in Phase 4.

### Synthesis (Phase 4, 2026-08-10)

**Outcome**: **Amend** — Q1 invalidated the subset-Apple-fonts plan; the user chose **option (c): licensed lookalike faces**, with a documented exception added to the Pixel-Identical Invariant (their words: "we'll just add an exception to the pixel identity constraint").

**Changes to this PR** from research:
- Fonts scope rewritten: **SF Pro Display Bold → Inter Bold** (OFL; the conventional SF stand-in — same UI-face design goals, freely subsettable/self-hostable, available via `next/font/google` which subsets automatically at build). **Menlo → DejaVu Sans Mono** (Bitstream-Vera lineage — the same ancestry Menlo itself has; Vera-class license permits modification + `@font-face` embedding; loaded via `next/font/local` subset woff2 using the Q2 pipeline with Q4's ranges). Apple font files (`SF-Pro-Display-Bold.otf`, `Menlo.otf`, `Menlo-Regular.woff`, both css files) all deleted — this PR *removes* the existing license exposure rather than continuing it.
- `sw.js` handling amended per Q3: **not deleted** — replaced with a self-destroying service worker (unregisters + clears caches on activate); the file itself dies in PR-010 after a deprecation window. `workbox-*.js`/`manifest.json` deleted now.
- Verification amended: pixel-equality is impossible under new typefaces — the bar becomes **full-baseline regeneration with layout-integrity review** (below), plus the unchanged non-font criteria.

**Changes to ARCHITECTURE.md**: § Assets fonts wording (Inter/DejaVu instead of SF/Menlo subsets) — applied with implementation.
**Changes to CONSTRAINTS.md**: Exception 2 added to the Pixel-Identical Invariant (committed in this branch).
**Changes to DESIGN-log**: D6 amendment block (committed in this branch).
**New PRs that must come first**: none.

**Research-backed details now locked**:
- Inter via `next/font/google` (build-time download + automatic subsetting + self-host — no manual pipeline for the sans face); DejaVu Sans Mono via `next/font/local` + `pyftsubset --flavor=woff2 --unicodes=<Q4 ranges>`.
- Self-destroying `/sw.js` (Q3 pattern), `font-display: swap` (gate-confirmed), sharp for image compression (Q5), PR-007's pinned image boxes stay pinned.

### Gate Check

- Premise still valid: ✓ (amended per Phase 4 — user-directed typeface exception)
- No prerequisite PRs surfaced: ✓
- User approved updated spec: ✓ (2026-08-10, in chat — Inter Bold + DejaVu Sans Mono picks approved)
- Implementation cleared

---

## Scope (amended per Phase-4 synthesis, 2026-08-10)

- **Fonts (replaced, not subset-in-place — D6 amendment)**: **Inter Bold** via `next/font/google` replaces SF Pro Display Bold; **DejaVu Sans Mono** (subset woff2 via pyftsubset, Q4 ranges) via `next/font/local` replaces Menlo. `display: 'swap'`. Remove both font `<link>` stylesheets from `_app`/`_document`; delete `public/fonts/` entirely (both Apple otfs, orphan woff, css). Tailwind `--font-*` theme vars re-pointed at the next/font families.
- **Images**: route every remaining raw `<img>` through `next/image` with true display dimensions (work-detail image, rain icons, slot coins); compress/resize oversized sources (blormmy 7.9 MB, btc-logo 377 kB, eth-logo-white 222 kB, etc.) to sizes appropriate for their largest rendered dimension ×2 DPR. PR-007's pinned boxes stay pinned.
- **Service worker**: replace `/sw.js` with a self-destroying worker (Q3 — a 404'd script never unregisters; the legacy NetworkFirst worker would persist forever); delete `workbox-74d02f44.js` + `manifest.json` now; the self-destroyer itself dies in PR-010.
- **Dead files**: delete `btc.png`, `download.jpg`, `eth-logo-black.png` (all reference-checked in Phase 1), `btc-logo.png~`, `wojak.png`, `JupyterIcon.png`, `JupyterIcon.png~`, orphan thumbnails (`eastern-standard`, `treasure`, `nft-data-miner`).

## Dependencies

PR-007 (`next/font` requires ≥13; modern `next/image` semantics).

## Architecture section implemented

`docs/ARCHITECTURE.md` § Assets.

## Verification criteria (amended per Phase-4 synthesis — typeface exception active)

- [x] **Full-baseline regen with layout-integrity review** (2026-08-10): pre-regen review sampled contact / works-index / work-detail / masthead / home — all deltas glyph-shape-only; no overflow, clipping, wrap breaks, or structural shifts (page heights moved ≤3px from text reflow). Tofu audit: `“ ” →` render correctly on the hospital work page, `©` in the footer, ellipsis/`…` in clamps — DejaVu subset cmap verified for all 11 inventoried specials pre-wiring. All 190 baselines regenerated (186 + masked services set); **190/190 ×2, exit 0 both.**
- [x] Non-font pixels reviewed: image deltas confined to the approved class (compressed sources through the optimizer; rain layout permutation is the documented seeded-random import-order effect). One found-bug fixed during review: the default-thumbnail branch compared `StaticImageData` by identity, which the getStaticProps JSON boundary breaks — now compares `.src` (both branches probe-verified).
- [x] Waterfall: zero `/fonts/*.css` links in served HTML; next/font preloads present; `public/fonts/` deleted.
- [x] Self-destroying `/sw.js`: registered in a probe page → registrations = 0 after activate.
- [x] Work-detail transfer: **~437 kB wire** (185 JS gz + 160 webp + 76 woff2 + 11 css/html gz + misc), from ~8+ MB. Lighthouse total-byte-weight concurs: **498 KiB**.
- [x] Lighthouse (mobile, performance): `/` **75 → 84** (LCP 21.8s → 4.6s; 4,274 → 792 KiB); `/works/blormmy` **75 → 94** (LCP 21.8s → 3.1s; 10,506 → 498 KiB).

## Implementation notes (2026-08-10, delegated to completion)

- **Fonts**: Inter Bold via `next/font/google` (latin + latin-ext), DejaVu Sans Mono via `next/font/local` — subset from the official 2.37 release with `pyftsubset --flavor=woff2` to **16.7 kB** (222 glyphs; Basic Latin + Latin-1 + General Punctuation + arrows headroom); `src/fonts/LICENSE` carries the required Bitstream Vera notice. Variable classes live on the main layout `<article>` (`fonts-root`); the `--font-*` theme bridges are **re-declared on `.fonts-root`** because custom properties substitute `var()` at the *declaring* element — at `:root` (where `@theme` emits) the next/font variables don't exist and the bridge computed empty (runtime-diagnosed). Inter is 700-only, reproducing the old always-bold sans behavior. Both font `<link>`s (duplicated across `_document` and the layout) removed; `public/fonts/` (4.0 MB) deleted.
- **Images**: sources compressed with sharp — thumbnails capped at 1280w (blormmy 7,750 → 286 kB), icons palette-compressed at **exact original dimensions** (rain geometry is natural-size-driven via flex basis), navbar logo 217 kB → 1 kB @64w. Thumbnails + icons moved to `src/images/` as static imports (auto dims); `WorkInfo.thumbnail` is now `StaticImageData`. Rain/slot/work-detail `<img>`s → `next/image`; rain/slot get `loading="eager"` — their pre-conversion behavior, and lazy tripped WebKit `loadAllImages` timeouts (29 images × lazy-trigger latency > 30s test budget).
- **Harness amendment**: the services-expanded fullPage capture now masks the sticky `<header>` — Playwright stitches sticky elements at nondeterministic offsets and PR-009's load-timing changes made it bistable across runs (2 consecutive verification runs failed only there, different diff sizes). Navbar keeps dedicated coverage (navbar-shown + non-fullPage states). Documented in states.spec.ts.
- Two additional orphans found and deleted during conversion: `rustIcon.png`, `typescriptIcon.png` (in the icons dir but absent from rain's pool — grep-verified unreferenced).
- `public/` is now 5 files / ~40 kB (favicon, eth-logo-white, sw.js self-destroyer, vercel.svg, robots-adjacent nothing) vs 18 MB before.

## Research backing

D6 (DESIGN-log): next/font since v13 [proven]; sizes measured. Backlog: subsetting tooling + glyph ranges, sw.js stale-registration consideration, root-file reference check.

## Notes

font-display default is `swap` (changes only the degraded-network failure mode vs today's invisible-text blocking); user may request `block` for byte-identical semantics — confirm during research phase.
