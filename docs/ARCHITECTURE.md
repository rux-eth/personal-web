# Architecture

Architecture of the site as built, decided 2026-08-07 (design session, see `docs/0.0/DESIGN-log.md` for decisions D1–D9 and their research trails) and implemented by the PR sequence in `docs/0.0/ROADMAP.md` (PR-001…PR-010, completed 2026-08-10).

## Overview

A fully static portfolio (rux.eth / Maxwell Rux; 16 prerendered pages across 6 routes) on **Next.js 16 (Pages Router) + React 19 + TypeScript 5**, deployed on Vercel. Every page is pre-rendered at build time. There is no server-side data, no database, and no runtime write path.

## Stack (D1, D2, D3, D5, D8)

- **Framework**: Next 16.x, Pages Router (App Router deliberately not adopted — no benefit for 8 static pages; exit-animation transitions are simpler in Pages Router). Node ≥ 20.9, TS ≥ 5.1, browser floor Chrome 111+/Safari 16.4+.
- **Styling**: Tailwind CSS 4 exclusively, CSS-first config. The single source of theme truth (colors, breakpoints incl. the `ha` hover breakpoint) lives in the Tailwind CSS config. MUI (v4 and v5), emotion, and the hand-synced theme duplication are removed. Formerly-MUI behaviors are hand-rolled: nav drawer (backdrop + Esc close + scroll lock + focus handling), snackbar (top-right slide-in, 3s auto-hide), `matchMedia`-based breakpoint hook.
- **Animation**: `motion` v13 via `LazyMotion` + `m` + `domAnimation` subset. Exactly one `AnimatePresence mode="wait"` + motion wrapper in `_app.tsx` owns page transitions (fade/slide, 0.4s). Layout components contain no motion wrappers.
- **Utilities**: native JS only. No `immutable` (native `Array`/`Set`/`Map`), no `crypto`/hashing (the sha1 block-id system is deleted with the scroll rearchitecture), no `js-sha3`, no `dotenv` (Next loads `.env` natively).

## Scroll/resize architecture (D4)

The global `ResizeContext` is deleted. Three local mechanisms replace it:

1. **Navbar visibility**: a navbar-local rAF-batched scroll/resize check preserving the original expression (`tldr.top <= 0`, pages without `#tldr` always show it); React state changes only when the boolean flips, so steady-state scrolling renders nothing. (Amended from the originally-planned `IntersectionObserver`: an element-bound observer fights AnimatePresence route remounts; render economics are identical. See PR-004 notes.)
2. **Commented-block line counts**: each `CommentedContent` owns a `ResizeObserver` on its own div and derives its `/** * … */` gutter line count locally. No shared registry, no cross-file coupling, no DOM ids.
3. **Masthead parallax**: an rAF-batched scroll subscription local to the masthead subtree. Scroll must never trigger React renders outside the masthead.

## Works content (D7)

Portfolio content is **typed code**: `src/data/works.ts` exports `WorkInfo[]`. Classification fields (`status`, `role`, `languages`, `stack`) are literal-union types shared with the `categories` presentation map, so the data and the tag vocabulary cannot drift — a typo is a compile error. No runtime validation exists (`assertWorkInfo` deleted); the compiler is the validator.

Delivery: `/works` and `/works/[wid]` use `getStaticPaths`/`getStaticProps`; each work page is fully pre-rendered (fixes the former 404-flash on direct visits). The former `Works` class is dissolved into plain functions + presentational components. Content is not publicly served as a data file.

Escalation path (documented, not built): if content grows long-form prose, move to MDX-per-work; do not add a CMS or database.

## Assets (D6)

- **Fonts** (D6 as amended 2026-08-10): **Inter Bold** via `next/font/google` (SF Pro Display replacement) and **DejaVu Sans Mono** subset woff2 via `next/font/local` (Menlo replacement) — the Apple fonts' licenses prohibit web embedding (see CONSTRAINTS.md Exception 2). Single load point, automatic preload, no render-blocking font CSS, no font `<link>`s in `_app`/`_document`. `font-display: swap`. Inter is loaded at weight 700 only — the old SF file was a Bold face serving every weight, so all sans text has always rendered bold.
- **Images**: everything renders through `next/image` sized to true display dimensions — including work-detail images and masthead rain/slot icons. Source assets are compressed to sane sizes (no multi-MB PNGs in `public/`).
- **Public dir**: contains only referenced assets — plus one deliberate exception: `sw.js`, a self-destroying service worker retained **indefinitely** (never delete a once-served SW path; a 404 permanently strands legacy registrations — PR-009 Q3 / PR-010 Q2 research). Workbox/manifest PWA remnants, editor backups, and orphaned images are gone.

## State

jotai for the two genuinely global atoms (snackbar, nav-drawer open). Everything else is component-local.

## Verification (D8)

A Playwright visual-regression harness with baseline screenshots captured from the pre-refactor build: **Chromium + WebKit** projects across the **xs/mb/sm/md viewport matrix (350/600/960/1280)**, named snapshots per page/state (individually updatable), interactive states (drawer, filter dropdown, snackbar, navbar-shown) and fixed-scroll-offset masthead captures. Determinism via seeded `Math.random` (`addInitScript`). Every PR must diff clean against the baseline; deliberate deviations (the D9 bug fixes) are reviewed and documented per PR. This is the enforcement mechanism for the pixel-identical constraint in `docs/CONSTRAINTS.md`.
