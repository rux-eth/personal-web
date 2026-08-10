# Design Log — v0.0

## Session 2026-08-07 — Refactor design (Phases 1–4 of PROCEDURE-design-planning.md)

### Goal (Phase 1, confirmed)

Visually and functionally invisible refactor: pixel-identical, behavior-identical. Internals, dependencies, and stack all fair game. LOC reduction is a success metric. Performance work is measurement-first. Scope derived from full-codebase audit.

### Evidence baseline (measured 2026-08-07, pre-refactor)

- First Load JS 318 kB gz; `_app` chunk 238 kB gz of which: **129 kB Node polyfills** (crypto-browserify et al., caused by `createHash('sha1')` in commented.tsx), 32.5 kB framer-motion 6, ~42 kB MUI v5+v4+emotion, 16.5 kB immutable.
- Assets: 7.9 MB blormmy thumbnail (raw `<img>` on detail pages); 3.2 MB SF Pro OTF + 565 kB Menlo OTF, render-blocking, duplicated in `_app` and `_document`, no font-display/woff2; dead PWA files (sw.js/workbox/manifest, never registered); `btc-logo.png~`, wojak.png, JupyterIcon.png, 3 orphan thumbnails unreferenced.
- Runtime: ResizeContext publishes scrollY via context on every unthrottled scroll event → whole-tree re-renders incl. ~175 rain `<img>` elements.
- Structure: `Works` class calls hooks in methods; triple page-transition wrapping; setInterval leak in loadingPage; dead files (connect, account-observer, url, header(s), notClient); tsconfig ghost includes; phantom dep clsx; unused js-sha3/@types/chance; formatting split; no lint/tests.

### D1 — Framework target: DECIDED → Next 16 (latest stable) + React 19 + TS 5.x, Pages Router retained

Research trail (Tier A, primary sources):
- Pages Router supported & documented in Next 16, no deprecation [proven] — nextjs.org/blog/next-16; nextjs.org/docs/pages/guides/upgrading (maintained, v16.3).
- Breaking surface 12→16 for this app [proven] — 12→13: next/link anchor-child removal (new-link codemod), next/image→legacy rename + new default (codemods), React ≥18.2; 16: Node ≥20.9, TS ≥5.1, Turbopack default, `next lint` removed. Async request APIs are App-Router-only. Sources: nextjs.org/docs/pages/guides/upgrading/version-13, /docs/app/guides/upgrading/version-16.
- React 17→19 surface [proven] — FC implicit children removed (@types/react 18; hits resize-observer, headers, layouts; types-react-codemod preset-19), render API internal to Next, defaultProps/string refs unused here. Sources: react.dev React 19 upgrade guide; solverfox.dev/writing/no-implicit-children.
- Next 12 EOL, unpatched [proven] — May 2026 advisory cluster patched only 15.5.18/16.2.6; 2026 CVEs vs EOL lines unpatched. Applicability to static site via live /_next/image endpoint [best-guess]. Sources: vercel.com/changelog/next-js-may-2026-security-release; herodevs.com EOL timeline.
- Rejected App Router: no visitor-visible gain for 8 static pages; exit-animation transitions a known App Router pain [convention — flagged, non-blocking].
- Rejected leaving Next (Astro/Vite): highest risk to pixel-identical; discards next/image pipeline; migration cost visible locally [flagged as not deep-researched, non-blocking].

### D2 — UI library: DECIDED → Drop MUI entirely (v4 + v5 + emotion); Tailwind 3.4 → 4 as sole styling system

themeConstants fold into CSS-first config (kills tailwind/MUI theme duplication). Hand-roll drawer/snackbar/matchMedia behaviors (~60–80 LOC est.); link.tsx and theme.tsx deleted; _document JSS collection deleted. Drawer focus/Esc handling flagged for parity at implementation.

Research trail: Tailwind 4 targets Safari 16.4+/Chrome 111+/FF 128 = exactly Next 16's floor [proven — tailwindcss.com/docs/upgrade-guide, tailwindcss discussion 18270]; official upgrade tool migrates config to CSS-first [proven]. MUI consolidation priced: React 19 supported v5.18+/v6+, current major v9 with codemods [proven — mui.com/blog/react-19-update, upgrade-to-v9], but retains emotion (~35–40 kB gz measured), dual styling systems, theme duplication → rejected. MUI contributes behavior not appearance here (all instances visually overridden) [proven — audit]. Measured saving ≈ 42 kB gz + 4 deps.

### D3 — Animation: DECIDED → `motion` v13 with LazyMotion + `m` + domAnimation; single AnimatePresence (mode="wait") in _app

Delete duplicated motion wrappers/variants in both layouts (fixes triple-wrap). Exit animations preserved exactly.

Research trail: View Transitions API needs Safari 18+ vs our 16.4 floor → silent behavior loss, rejected [proven]. CSS-only cannot express exit-on-unmount → rejected [proven]. LazyMotion reduces initial animation runtime to ~4.6 kB + domAnimation subset vs 34 kB full; React 19 supported in motion v12+ [proven — motion.dev/docs/react-lazy-motion, react-reduce-bundle-size]. exitBeforeEnter → mode="wait" rename [convention, verify at implementation]. Measured current cost 32.5 kB gz → est. 5–20 kB.

### D4 — Scroll/resize architecture: DECIDED → Delete global ResizeContext + resize-observer.tsx + refs registry

IntersectionObserver on #tldr for navbar visibility (navbar-local state); ResizeObserver per CommentedContent for line counts (block-local state); rAF-batched scroll subscription local to masthead subtree for parallax (state-vs-imperative style writes left to implementation). Scroll no longer re-renders anything outside the masthead.

Research trail: IntersectionObserver Safari 12.1+ (Baseline widely available), ResizeObserver Safari 13.1+ — both far below the 16.4 floor [proven — caniuse.com/intersectionobserver, webkit.org/blog/9997, MDN]. rAF universal [research skipped, documented: baseline platform API]. CSS scroll-driven animations excluded (Safari support far above floor). Rejected throttled-context option: keeps whole-tree re-renders + registry coupling + stale-closure landmine.

### D5 — Utility diet: DECIDED → Delete sha1/crypto id entirely; immutable → native structures

Crypto id dead after D4's registry removal; −129 kB gz polyfills; note: block id attributes leave the DOM, non-visual. Immutable −16.5 kB gz. Remove js-sha3 + @types/chance; clsx phantom-dep dissolves with link.tsx (D2). Projected _app chunk after D2/D3/D5: ~50–65 kB gz vs 238 [best-guess arithmetic on measured parts; re-measure after implementation].

Research trail: skipped, documented rationale — native-collection replacement is baseline JS; crypto removal is dead-code elimination following from D4; bundle numbers measured locally from our own analyzer build.

### D6 — Assets: DECIDED → next/font/local subset woff2; next/image everywhere; dead files deleted

**AMENDED 2026-08-10 (PR-009 research, user decision)**: PR-009's Phase-3 findings proved Apple's SF Pro license ("solely for creating mock-ups … running on Apple's iOS, OS X or tvOS"; "You may not embed the Apple Font") and Menlo's macOS-SLA terms prohibit web self-hosting — subsetting them was not license-safe. User chose **licensed lookalike replacement** over status-quo risk: SF Pro Display Bold → **Inter Bold** (OFL; the conventional SF stand-in), Menlo → **DejaVu Sans Mono** (Bitstream-Vera-derived — the same lineage Menlo itself descends from; Vera license permits modification/embedding). Pixel-identity exception 2 added to CONSTRAINTS.md; full baseline regen under the new faces happens in PR-009 with layout-integrity review. font-display: swap confirmed. Research trail: PR-009 `## Research findings` Phase 3 (primary-source citations).

Fonts: single load point, kill duplicated render-blocking font CSS (est. 3.8 MB → ~100–300 kB [best-guess pending subsetting]); font-display swap [convention — user may override to block; flagged nuance: degraded-network failure mode changes from invisible text to fallback flash]. Images: next/image incl. work-detail page and rain icons at true display sizes; compress oversized sources (7.9 MB blormmy → est. <300 kB). Delete verified-dead public files; btc.png/download.jpg/eth-logo-black.png reference-check before deletion at implementation.

Research trail: next/font is the official Pages Router path since v13 [proven — nextjs.org/docs/pages/guides/upgrading/version-13]. Subsetting/compression tooling = implementation detail [research skipped, documented].

### D7 — Works content architecture: DECIDED → Content-as-typed-code + SSG

Initially scoped as "SSG vs client-side"; **expanded at user request** to a purpose→usage→alternatives exploration (user dislikes JSON-in-public structure). Analysis: 10 entries, 4 read patterns (grid+filter, tag counts, recent-3, by-id), all build-derivable; closed vocabularies validated at runtime on every visitor; no write path (Mongo env vars are vestiges).

Decision: `src/data/works.ts` exporting `WorkInfo[]` with literal-union types for status/role/languages/stack shared with the categories definition (compiler-enforced vocabulary; typo = build error). Deletes assertWorkInfo (~75 LOC) and public /works.json exposure. Delivery: getStaticPaths/getStaticProps SSG; Works class dissolved into plain components; 404-flash fixed (per D9). MDX-per-work documented as escalation path if content grows long-form prose. CMS/DB rejected (no write path, negative benefit at 10 entries).

Research trail: comparison grounded in TS language semantics + local usage facts [research skipped, documented rationale].

### D8 — Tooling hygiene: DECIDED → Biome; config cleanup; Playwright visual-regression harness

Biome (single tool, lint + Prettier-compatible format) configured to existing prettier style (single quotes, no semis) applied repo-wide; src/prettier.config.js deleted, config at root. tsconfig: remove 6 ghost includes, moduleResolution bundler, TS 5.x, keep strict. next.config: drop MONGO_URL/MASTER_ADMIN/NEXT_ENV injection + dotenv dep (Next loads .env natively). Scripts normalized. Stay on yarn [unresearched preference, low stakes, flagged]. Playwright baseline screenshots of every page/breakpoint/state captured against CURRENT build before any refactor PR; every PR diffs clean vs baseline; D9 bug fixes are reviewed, documented exceptions.

Research trail: Next 16 removed `next lint`, officially names Biome or ESLint [proven — Next 16 upgrade guide]. Biome v2 single-binary lint+format, React/Next domains; caveat: shallower than eslint-plugin-react-hooks/jsx-a11y [convention — secondary sources; ESLint flip offered, declined by approval]. Playwright choice: convention (dominant visual-regression tool); verification value is structural, not tool-specific.

### D9 — Bug policy: DECIDED (user-initiated) → Bugs are FIXED simultaneously with the refactor

This is the ONLY exception to "maintain the same functionality and visuals." Known bug list at decision time: filter-arrow rotate ternary with identical branches (never animates); loadingPage setInterval never cleaned up; 404-flash on direct /works/[wid] visits; missing React key props; stale-closure in resize-observer handleResize (dies with D4); module-level refs mutation during render (dies with D4); hooks called in Works class methods (dies with D7 refactor).

### Drift addendum (2026-08-07, discovered during PR-002 implementation)

Parallel user development entered master via the PR-018 merge window: `/clients` route replaced by `/services` (new `gasCutSprintPage.tsx`, ~264 LOC marketing page with native `<details>` collapsibles), first work renamed `sapien` → `hospital-in-a-box`, contact info updated, `dynamicFontNum` export added. **Design impact: none** — the new page uses only existing-stack primitives (CommentedContent, Tailwind, next/link wrapper; no MUI, no immutable, no new deps), so D1–D9 hold unchanged; the pixel-identical invariant now covers the services-era site. Harness impact: two baselines were mislabeled 404 captures (`clients`, `work-sapien`) — removed; `/services` page + expanded-section state + `work-hospital-in-a-box` added to coverage (PR-001 amendment, landed inside the PR-002 branch, documented in both PR files). Audit evidence deltas: route list is /, /works, /works/[wid]×10, /services, /contact, /404, /loading; source LOC ~2,800.

### Convergence (Phase 3, confirmed by user)

Full design confirmed 2026-08-07. Projected outcomes [best-guess arithmetic on measured parts]: First Load JS 318 → ~110–130 kB gz; runtime deps 16 → ~7; LOC meaningfully down. Open implementation-time flags (non-blocking): drawer focus/Esc parity checklist; font-display swap-vs-block user preference; btc.png/download.jpg/eth-logo-black.png reference-check; Node ≥ 20.9 verified locally + Vercel at implementation start.
