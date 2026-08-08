# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Active refactor (read first)

This repo is mid-refactor under a designed plan (design session 2026-08-07). Before changing code:

- **`docs/CONSTRAINTS.md`** — non-negotiables, including the **Pixel-Identical Invariant** (the rendered site must not change; sole exception: documented bug fixes) and the **Per-Phase Approval Gate**. These bind all work in this repo.
- **`docs/ARCHITECTURE.md`** — the *target* architecture. The "Architecture" section below describes the *current* (pre-refactor) code, which is migration source, not spec.
- **`docs/0.0/ROADMAP.md`** — the ordered PR sequence (PR-001…PR-010 in `prs/`). One PR, one thing; PR-001's visual baseline must exist before any refactor PR lands.
- **`docs/0.0/DESIGN-log.md`** — all decisions (D1–D9) with research trails.
- No PR is implemented before running `PROCEDURE-pr-research.md` from `~/templates/vibe-rails/` and filling the PR file's Research findings section.

## Commands

Uses yarn (yarn.lock is committed).

- `yarn dev` — start the dev server (Next.js 12)
- `yarn build` — production build
- `yarn build:analyze` — build with `@next/bundle-analyzer` enabled (toggled via the `ANALYZE` env var)
- `yarn start` — build then serve production

There are no lint or test scripts. Type checking is the only verification: `yarn tsc --noEmit`.

`next.config.js` loads `.env` via dotenv and inlines `MONGO_URL`, `MASTER_ADMIN`, and `NEXT_ENV`.

## Architecture

Personal portfolio site (rux.eth / Maxwell Rux) on Next.js 12 **Pages Router** with React 17 and TypeScript. Path alias: `@src/*` → `src/*`.

### Rendering/layout chain

`src/pages/_app.tsx` wraps every page in, outermost first:

1. `src/utils/resize-observer.tsx` — a React context (`ResizeContext`) that listens to window resize/scroll and provides `scrollY`, `showNavbar` (true once the `#tldr` element scrolls past the top), and `numLines` — per-element line counts for `.commented` blocks (see below).
2. MUI `ThemeProvider` with the theme from `src/styles/theme.tsx`.
3. `src/components/layouts/main.tsx` — global `<Head>`, `Navbar`, `Masthead` (home route only), `Footer`, `NavDrawer`, global MUI `Snackbar`, and Vercel Analytics.
4. framer-motion `AnimatePresence` for page enter/exit transitions.

### Works content is typed code

`src/data/works.ts` is the single source of portfolio content: it exports `works: WorkInfo[]` plus pure helpers (`getWork`, `compileTags`, `tagCounts`). The classification fields (`status`/`role`/`languages`/`stack`) are literal-union types derived from the grouped vocabulary in `src/components/category.tsx` — an unknown tag is a compile error; there is no runtime validation. `src/components/works.tsx` holds the presentational components (`WorkPreviews`, `WorksPage`, `WorkPage`). `/works` uses `getStaticProps` and `/works/[wid]` uses `getStaticPaths` (`fallback: false`) + `getStaticProps`, so every work page is fully pre-rendered and unknown ids are real 404s. Adding a work means editing `works.ts` (thumbnails live in `public/thumbnails/`).

### "Commented" text styling

Site copy is rendered to look like code comments via `src/components/commented.tsx`, which keeps a module-level `refs` registry of rendered blocks. `resize-observer.tsx` reads that registry to compute how many `//` line prefixes each block needs. These two files are coupled — changes to one usually affect the other.

### Styling: two parallel theme systems

- Tailwind (JIT) with custom breakpoints (`xs/mb/sm/md/lg/xl/2xl` plus `ha`, a `(hover: hover)` media-query breakpoint used to disable hover animations on touch devices).
- Both MUI v5 (`@mui/material`, used by components) and legacy Material-UI v4 (`@material-ui/core`, whose `createTheme` builds the theme) are installed.
- The `themeConstants` object (colors + breakpoints) is **duplicated** in `tailwind.config.js` and `src/styles/theme.tsx` and must be kept in sync by hand when changing either.

### State

Global state is jotai: `src/store/jotai.tsx` holds the snackbar atom (default export, consumed by the main layout) and `navDrawerAtom`.

## Git

The default working branch is `staging`; PRs target `master`.
