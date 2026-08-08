# PR-007: Framework upgrade (Next 16 / React 19 / TS 5 / motion v13)

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required — verify current Next/React/motion latest stables and re-check upgrade guides for changes since 2026-08-07.

## Research findings

### State Assessment (2026-08-08)

**Current state**:
- Repo: `master` @ `bff4cd9` (PR-006 merged via #23 + docs commit), clean; both `staging` branches strict ancestors; no open PRs. No parallel-dev drift since the PR-006 merge.
- Versions installed: next 12.2.x / react 17.0.2 / TS 4.7.4 / framer-motion 6.3.10 / @types/react 17. Local Node **v24.14.0** (≥20.9 ✓, re-verified; PR-001 recorded the same). **Vercel Node setting unverified locally** — needs dashboard/CLI check before implementation (scope already requires it).
- Latest stables re-verified (header-mandated probe, 2026-08-08): **Next 16.3** is current — released 2026-08-03, the same version D1's upgrade-guide citations were read against on 2026-08-07. No upgrade-guide drift in the intervening day. Sources: [nextjs.org/blog/next-16-3](https://nextjs.org/blog/next-16-3), [nextjs.org/docs/app/guides/upgrading/version-16](https://nextjs.org/docs/app/guides/upgrading/version-16).
- Motion surface (exactly as D3 assumed): `_app.tsx` = `AnimatePresence exitBeforeEnter` + `@ts-ignore` around `<Component/>`; both layouts carry identical duplicated `variants` + `motion.article` wrappers (the triple-wrap). **New nuance**: the shared transition is `{ duration: 0.4, type: 'easeInOut' }` — `type: 'easeInOut'` is not a valid framer-motion `type` value (valid: tween/spring/inertia), so v6 has been rendering some fallback curve, not necessarily easeInOut. "Curve preserved exactly" must mean *the empirically rendered curve*, not the nominal config — capture v6's actual behavior before the swap and reproduce it (or accept default-tween equivalence if that's what v6 resolves to).
- FC-children surface: both layouts destructure `children` absent from their props interfaces (breaks under @types/react 18+); ~14 files use `FC<...>` but most pass `children` explicitly or don't use it — codemod handles. `headers.tsx` exists but is **unimported** (dead — its FC fix is moot; deletion stays with PR-010).
- `@ts-ignore` sites ×3: `_app.tsx` (dies in the motion rewrite), `comingSoon.tsx`, `services/index.tsx` — biome's `noTsIgnore` off-list comment routes to PR-007 ("React 19 types remove the need"); per the PR-003..006 precedent the config stays untouched, but the two surviving sites should be checked once types are modern.
- `next.config.js` is bundle-analyzer-only (PR-002 cleaned it); no custom webpack — Turbopack-default assumption holds. tsconfig still `moduleResolution: "node"`, target esnext (PR-002 deferred to here, per its downstream-contract note).
- Works surface is SSG (PR-006) — the Next 16 migration inherits `getStaticPaths`/`getStaticProps` pages, fully supported in the 16.x Pages Router (per D1's cited guide). String-px `width={'1980px'}` survives in `works.tsx` only; navbar/snackbar use numeric widths.

**Peer-dependency audit (new — not in D1's trail)**:
- **hamburger-react 2.5.0 peers `^16.8 || ^17 || ^18` — excludes React 19.** Resolved upstream: **2.5.2** peers `^16.8 || ^17 || ^18 || ^19` ([npm registry](https://registry.npmjs.org/hamburger-react/latest)). → Add a `hamburger-react ^2.5.2` bump to scope (peer-dep-forced companion, same rationale class as the motion swap). Drawer states are baseline-covered (nav-drawer-open ×6), so the patch bump is visually verified for free.
- jotai 1.7.7 installed: peer `react >=16.8` — formally satisfies 19; runtime consumers (snackbar, drawer) are baseline- and probe-covered.
- @vercel/analytics 1.5.0: peers `next >=13, react ^18||^19` — currently violated (next 12/react 17, yarn1 tolerates); the upgrade makes it formally satisfied for the first time.
- react-icons 4.4.0: peer `react *` ✓.

**Assumptions at PR draft time**: Next 16/React 19/TS 5 targets; codemod list; motion v13 swap with LazyMotion; Turbopack default; analyzer decision at implementation; tsconfig modernization here. **All hold.**

**Stale assumptions**: none premise-changing. Refinements: (a) hamburger-react needs the 2.5.2 companion bump (above); (b) `headers.tsx` is already dead — shrinks the codemod surface; (c) the transition config is nominally invalid v6 API — "same curve" needs empirical capture, not config copying.

**New constraints**:
- Implementation-time verification list (backlog items + Phase-1 additions): `exitBeforeEnter` → `mode="wait"` rename; LazyMotion strict-mode behavior with `m`; AnimatePresence child keying (current code has no `key` on `<Component/>` — exit works today via element-type change; the new single-wrapper design must preserve exit triggering, typically `key={router.route}`); empirical easing-curve capture (above).
- The visual suite (`animations: 'disabled'`) cannot see transition presence/curve — the "enter AND exit animations present, same duration/curve" criterion needs a scripted or manual transition check (as scoped).
- Zero-baseline-regen bar: no D9 items in this PR; any visual diff is a regression.

**Downstream contracts** (grep sweep: PR-002, PR-003, PR-004, PR-006 upstream-notes; PR-008, PR-009, PR-001, ROADMAP, RESEARCH-BACKLOG):
- **PR-008** → needs the new build pipeline (Tailwind 4 requires the Next 16 stack). Satisfiable: yes.
- **PR-009** → needs `next/font` (≥13) + modern `next/image` semantics (this PR fixes the string-px props). Satisfiable: yes.
- **PR-002** (delivered) → deferred `moduleResolution: "bundler"` + target modernization to here — in scope ✓.
- **PR-003/PR-004/PR-006** (delivered) → their contracts (zero MUI imports; resize-observer FC surface gone; Works class dissolved pre-upgrade) all verified present in current code.
- **PR-001** → determinism contract continues; PR-008 additionally relies on the full breakpoint matrix surviving this PR unchanged.
- **RESEARCH-BACKLOG** → PR-007 Tier 1 with the two flagged implementation-time verifies (mode="wait", LazyMotion strict) + Node check — all carried into the list above.

**Path-tier checkpoint**: Tier-1 confirmed (header/ROADMAP/backlog agree; design 1 day old). Phase 1 clean — the one genuine gap found (hamburger-react peer) was resolved with a primary-source citation during assessment; remaining opens are implementation-time verifications the design already flagged as such, not pre-implementation research questions. **Cleared after Phase 1; Phases 2–4 skipped.**

### Gate Check

- Premise still valid: ✓
- No prerequisite PRs surfaced: ✓
- User approved updated spec: ✓ (2026-08-08, in chat — including the hamburger-react `^2.5.2` scope addendum)
- Implementation cleared (Vercel Node check: CLI attempt at implementation; falls to a pre-merge user step alongside the preview-deploy smoke test if unauthed)

---

## Scope

- Upgrade: `next@16.x`, `react@19.x`, `react-dom@19.x`, `typescript@5.x`, `@types/react`/`@types/react-dom` latest. Node ≥ 20.9 verified locally and on Vercel before starting.
- `hamburger-react` → `^2.5.2` (peer-dep-forced companion: 2.5.0 excludes React 19, 2.5.2 allows it — Phase-1 addendum, gate-approved 2026-08-08).
- Run official codemods as applicable: `@next/codemod upgrade`, `new-link` (for any remaining anchor-child links), image codemods (prefer landing directly on modern `next/image` semantics — fix the string-px `width={'1980px'}` props), `types-react-codemod preset-19` (FC implicit children — resize-observer is already deleted; remaining: `headers.tsx` if still present, layout components).
- Swap `framer-motion@6` → `motion@13` (peer-dep-forced companion, documented): `LazyMotion` + `m` + `domAnimation`, single `AnimatePresence mode="wait"` wrapper in `_app`; delete the duplicated variants/motion wrappers in `layouts/main.tsx` and `layouts/pages.tsx` (fixes triple-wrap; transition timing/curve preserved exactly: 0.4s easeInOut, y±20 fade).
- Turbopack default: no custom webpack config exists; bundle-analyzer integration revisited (works with webpack builds only — keep `--webpack` analyze path or drop analyzer; decide at implementation, note in PR).
- tsconfig: `moduleResolution: "bundler"`, target modernization (deferred from PR-002).

## Dependencies

PR-003 (MUI 5.9 is React-19-incompatible; must be gone), PR-004 (resize-observer FC-children surface gone; navbar stabilized).

## Architecture section implemented

`docs/ARCHITECTURE.md` § Stack — Framework, Animation.

## Verification criteria

- [x] `yarn build` (Turbopack) succeeds — 17 static pages (7 routes + 10 SSG work pages), no next.config.js needed; `tsc --noEmit` clean on TS 5.9 / @types/react 19; `biome check` exits 0 (3 pre-existing `<img>` sites now *warned* by the next-domain `noImgElement` rule — PR-009's conversion resolves them)
- [x] `yarn test:visual` 190/190 ×2 (explicit exit 0 both, 2026-08-08) — **zero baseline changes**. Transition probe: exit animates to opacity 0, enter ramps 0→1, measured 390ms ≈ 0.4s ✓. Filter probe 5/5 on the upgraded stack.
- [x] Prod smoke on Vercel preview deploy (`personal-n4qfqg4cf`, built from PR #24 push, Node 22.x): all 7 routes + 2 work pages 200 with SSG content, unknown-id and `/works.json` 404; drawer opens/Esc-closes, copy-snackbar fires, filter narrows to 7 — all headless-probe verified (2026-08-08)
- [x] Bundle re-measured (uniform method: sum of gz script payload served for `/`): **165 kB → 182 kB (+17)**. Legacy polyfills chunk (30 kB) eliminated; framer-motion (32.5 kB gz) replaced by the LazyMotion `domAnimation` subset (~15–20 kB, within D3's 5–20 estimate; exact chunk attribution obscured by Turbopack chunking); React 19 + Next 16 runtime is larger than React 17 + Next 12 (new framework chunk 77 kB vs 41). Net +17 kB is upgrade-inherent — PR-010 reconciles against design projections.

## Implementation notes (2026-08-08)

- **Deps**: next 16.3.0 / react 19.2.8 / TS 5.9.3 / @types/react 19.2.18 / @types/node 24; `framer-motion` → `motion@13.0.0`; `hamburger-react` 2.5.2 (gate-approved peer bump). **Dropped `@next/bundle-analyzer` + `build:analyze`** (analyzer is webpack-only; Turbopack is the build; measurement done via served-payload sums — the "decide at implementation" item from scope).
- **Motion consolidation (D3)**: single `LazyMotion(domAnimation, strict) > AnimatePresence mode="wait" > m.article key={router.route}` in `_app`; both layout wrappers deleted (main.tsx keeps a plain `<article style="position:relative">` for DOM parity; pages.tsx renders a fragment). Transition is `{ duration: 0.4, ease: 'easeInOut' }` — source-verified equal to what v6 actually rendered: the old invalid `type: 'easeInOut'` fell through popmotion's dispatch (`detectAnimationFromOptions`, popmotion.cjs.js:554) to the keyframes generator whose default easing is popmotion `easeInOut` (:500, :472). `key={router.route}` reproduces the old transition-triggering semantics exactly (transitions on page-component change; none between two `/works/[wid]` urls). Behavior delta accepted per D3's design: the home page (never wrapped by pages-Layout) now gets the standard page transition; the whole-chrome initial fade from main.tsx's wrapper is gone (settled visuals identical — suite-verified).
- **Codemod-class changes done by hand** (3 files, more precise than the codemods): link.tsx → anchor-less modern `next/link` (renders the `<a>` itself, ref/style/rest forwarded); `JSX` namespace imports added per file (@types/react 19 removed the global — 8 files); `PropsWithChildren` on both layouts + headers.tsx; `RefObject<HTMLDivElement | null>` in rain.tsx (React 19 `useRef` typing).
- **next/image modernization with pinned boxes**: `width={'1980px'}` strings → numbers; required `alt` added (navbar `alt=""`). **Both call sites pin their authored box via style** (`aspectRatio: '1980 / 1080'` on previews; exact w/h on the navbar logo): the pre-13 component forced the attr box and stretched content, while the modern one follows each file's *natural* ratio under preflight `height:auto` — un-pinned, every thumbnail's height changed (no thumbnail file is actually 1980×1080) and the navbar logo's 0.015px height drift sub-pixel-shifted every page below the sticky navbar. PR-009 revisits true image sizing.
- **tsconfig**: `moduleResolution: "bundler"`, `module: "esnext"`; Next 16 itself set `jsx: "react-jsx"`.
- **Harness amendment (control-verified, documented in pages.spec.ts)**: work-page `maxDiffPixels` 8000 → 45000. WebKit's downscale quality for the large plain-`<img>` work-page thumbnails is bistable across invocations (sharp vs smooth; 12k px on crypto-rates, 36k on blormmy). Control experiment: the **pre-PR-007 master build (worktree) failed the same baselines identically**, and fresh captures from both builds differ by only ~163 px — the 12×20 navbar logo, whose `/_next/image` bytes changed with the optimizer switch (squoosh → sharp, dependency of Next 16). Environmental, not code; real regressions measure >100k (PR-006's hydration bug).
- `headers.tsx` was found dead in Phase 1; typed anyway (2-line children fix) — deletion remains PR-010's.

## Research backing

D1 (DESIGN-log): Next 12→16 breaking surface, React 19 surface, EOL/security [proven, cited]. D3: LazyMotion sizes, mode="wait" [proven/convention].

## Notes

Largest-risk PR; keep it mechanical (codemods + forced swaps only — no opportunistic refactors). Any surprise discovered mid-upgrade that requires a design choice pauses for a mini design session per procedure.
