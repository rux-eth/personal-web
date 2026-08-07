# PR-003: MUI removal

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required. The drawer-parity checklist below must be completed during research.

## Research findings

_To be populated by `PROCEDURE-pr-research.md`._

---

## Scope

Remove `@mui/material`, `@material-ui/core`, `@emotion/react`, `@emotion/styled` and replace each usage on the **current** stack (Next 12 / Tailwind 3 syntax):

- `AppBar` (navbar) → fixed-position styled div (all styling is already custom `sx` → classes/inline).
- `Drawer` (navDrawer) → hand-rolled top panel + backdrop. **Behavior parity checklist**: backdrop click closes; Esc closes; body scroll locked while open; focus moves into panel on open and restores on close; same slide transition timing.
- `Snackbar`/`Alert`/`Slide` (main layout) → hand-rolled toast: top-right, slide-down-in, 3s auto-hide, close button, success styling `#06ff76`/black.
- `Stack` → flex classes (masthead, tldr, navbar, navDrawer, commented).
- `useMediaQuery` (`useMatchesMediaQuery`) → `matchMedia`-based hook reproducing the same breakpoint values (from the Tailwind config as single source).
- `MuiLink` / `link.tsx` → delete file; replace call sites with `next/link` (Next-12 anchor-child form; simplified again in PR-007) + hover classes.
- `theme.tsx` → delete; breakpoint values consumed from one shared constants module until PR-008 makes Tailwind config the single source.
- `_document.tsx` → remove `ServerStyleSheets` (v4 JSS collection; dead — v5 renders via emotion, and after this PR neither exists).
- `hamburger-react` stays (independent, tiny).

## Dependencies

PR-001. (PR-002 recommended first for formatting stability.)

## Architecture section implemented

`docs/ARCHITECTURE.md` § Stack — Styling.

## Verification criteria

- [ ] `yarn test:visual` diffs clean vs baseline on every page/breakpoint/state — including drawer-open and snackbar states
- [ ] Drawer behavior parity checklist verified manually (Esc, backdrop, scroll lock, focus)
- [ ] `grep -r "@mui\|@material-ui\|@emotion" src/` returns nothing; deps removed from package.json
- [ ] Bundle re-measured; ~42 kB gz reduction recorded in PR description

## Research backing

D2 (DESIGN-log): usage inventory [proven — audit]; behaviors enumerated; MUI-consolidation alternative priced and rejected.

## Notes

framer-motion 6 remains in place in this PR (swapped in PR-007). Dead components importing MUI (`header.tsx`) may be deleted here if trivially confirmed unreferenced, else left for PR-010.
