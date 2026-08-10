# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project governance (read first)

The v0.0 refactor (design session 2026-08-07, PR-001…PR-010) is **complete**. The governing docs remain binding for future work:

- **`docs/CONSTRAINTS.md`** — non-negotiables, including the **Pixel-Identical Invariant** (documented exceptions: D9 bug fixes; PR-009 typeface replacement) and the **Per-Phase Approval Gate**. Visual changes still diff against the Playwright baseline.
- **`docs/ARCHITECTURE.md`** — the as-built architecture (matches the "Architecture" section below).
- **`docs/0.0/ROADMAP.md`** — the completed PR sequence (PR-001…PR-010 in `prs/`); **`docs/0.0/DESIGN-log.md`** — all decisions (D1–D9) with research trails.
- New PRs still run `PROCEDURE-pr-research.md` from `~/templates/vibe-rails/` before implementation.

## Commands

Uses yarn (yarn.lock is committed).

- `yarn dev` — start the dev server
- `yarn build` — production build (Turbopack)
- `yarn start` — serve the production build
- `yarn lint` / `yarn format` — Biome check / write
- `yarn test:visual` — Playwright visual-regression suite (builds and serves on port 4179 itself)

Type checking: `yarn tsc --noEmit`. There is no `next.config.js` — defaults only.

## Architecture

Personal portfolio site (rux.eth / Maxwell Rux) on Next.js 16 **Pages Router** with React 19 and TypeScript 5. Path alias: `@src/*` → `src/*`.

### Rendering/layout chain

`src/pages/_app.tsx` wraps every page in, outermost first:

1. `src/components/layouts/main.tsx` — global `<Head>`, `Navbar`, `Masthead` (home route only), `Footer`, `NavDrawer`, `Snackbar` (hand-rolled), and Vercel Analytics.
2. `LazyMotion` (motion v13, `domAnimation` subset, strict) + `AnimatePresence mode="wait"` + a single `m.article` keyed by route — the one motion wrapper owning page enter/exit transitions (0.4s easeInOut fade/slide). Layout components contain no motion wrappers.

### Works content is typed code

`src/data/works.ts` is the single source of portfolio content: it exports `works: WorkInfo[]` plus pure helpers (`getWork`, `compileTags`, `tagCounts`). The classification fields (`status`/`role`/`languages`/`stack`) are literal-union types derived from the grouped vocabulary in `src/components/category.tsx` — an unknown tag is a compile error; there is no runtime validation. `src/components/works.tsx` holds the presentational components (`WorkPreviews`, `WorksPage`, `WorkPage`). `/works` uses `getStaticProps` and `/works/[wid]` uses `getStaticPaths` (`fallback: false`) + `getStaticProps`, so every work page is fully pre-rendered and unknown ids are real 404s. Adding a work means editing `works.ts` (thumbnails live in `public/thumbnails/`).

### "Commented" text styling

Site copy is rendered to look like code comments via `src/components/commented.tsx`; each `CommentedContent` owns a `ResizeObserver` on its own div and derives its comment-gutter line count locally.

### Styling

Tailwind 4, CSS-first config: `src/styles/global.css` holds the **single theme source** (`@theme static` — custom breakpoints `xs/mb/sm/md/lg/xl/2xl`, fonts, colors incl. v3-pinned default-palette hexes), a `ha` `@custom-variant` for hover capability, a base-layer button-cursor restore, and `@utility` overrides keeping v3 `space-x/y` semantics (margin-top/left on following siblings — load-bearing because the site spaces in `ch` units across mixed font sizes). There is no `tailwind.config.js`. The runtime breakpoint hooks read the same `--breakpoint-*` variables via `src/utils/hooks/breakpoints.ts` (SSR renders use its documented xs seed). No component library — drawer, snackbar, and the breakpoint hook are hand-rolled.

Typefaces come from next/font (`_app.tsx`): Inter Bold (`next/font/google`) and a subset DejaVu Sans Mono woff2 (`next/font/local`, `src/fonts/`) — licensed replacements for SF Pro/Menlo (D6 amendment; CONSTRAINTS.md Exception 2). The `--font-*` theme bridges are re-declared on `.fonts-root` in global.css because custom properties resolve `var()` at the declaring element. Images are static imports from `src/images/` rendered through `next/image`; rain/slot images load eagerly (their pre-conversion behavior) and their source dimensions are load-bearing for rain geometry.

### State

Global state is jotai: `src/store/jotai.tsx` holds the snackbar atom (default export, consumed by the main layout) and `navDrawerAtom`.

## Git

The default working branch is `staging`; PRs target `master`.
