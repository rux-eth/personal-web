# PR-003: MUI removal

**Landed-in:** master via GitHub PR #20, 2026-08-08 (pre-versioning; v0.0 roadmap)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required. The drawer-parity checklist below must be completed during research.

## Research findings

### State Assessment (2026-08-08)

**Current state**:
- 16 MUI/emotion import sites across 14 files, matching the audit plus services-era growth: `gasCutSprintPage.tsx` now consumes `link.tsx` (7 consumers total, up from 6; className-only usage — no `sx`). `sx`-dependent call sites needing Tailwind-hover replacements: `links.tsx`, `works.tsx` (`DefaultLink`), `navbar.tsx`.
- v4 surface unchanged: `theme.tsx` (`createTheme`) + `_document.tsx` (`ServerStyleSheets`).
- `layouts/pages.tsx` still carries dead `Alert`/`SlideTransition` copies — deleted here as part of layout cleanup.
- **New since draft**: `dynamicFontNum` (services-era addition) also routes through `useMatchesMediaQuery` → the `matchMedia` replacement hook must serve both `dynamicFont` and `dynamicFontNum`.
- Drawer/snackbar components untouched since the audit except formatting + an `analytics` commit (known).
- Current snackbar behavior detail observed in code: `onClose` is wired without a clickaway filter → clicking anywhere closes it early. That's a real current behavior to preserve.

**Assumptions at PR draft time**: consumer lists and behavior inventory from the audit — all still hold, modulo the +1 link consumer.

**Stale assumptions**: none premise-changing.

**New constraints** (prior-art from PR-001/002, learned the hard way):
- Import-order changes permute the seeded-random consumption order → rewriting navbar/masthead/layout imports will require regenerating rain-affected baselines (`masthead-scroll-*`, `navbar-shown`). Documented, expected, budgeted into verification — NOT a diff-clean failure.
- Repo formatting is now Biome-enforced; new code must pass `biome check` (rules currently off for old code must not gain new violations).

**Downstream contracts** (from `grep -rl "PR-003"`):
- **PR-007** → hard dependency: zero `@mui|@material-ui|@emotion` imports must remain (grep-verifiable). Satisfiable: yes.
- **PR-008** → expects PR-003 to leave ONE shared constants module (breakpoints/colors) that it later folds into Tailwind CSS config. Satisfiable: yes (in scope).
- **PR-004** → textual-conflict warning only; roadmap order respected.
- Universal PR-001 contract → `test:visual` clean, with the documented rain-regen exception above.

**Path-tier checkpoint**: header Tier-1; ROADMAP concurs. **Phase 1 surfaces one narrow research need** (already flagged in RESEARCH-BACKLOG): the exact behavioral contract of MUI's temporary `Drawer` (Esc/backdrop/scroll-lock/focus trap + restore/aria-hidden) and `Snackbar` (auto-hide semantics, clickaway, transition direction) from MUI's docs — load-bearing because "behavior parity" can't be verified against an unenumerated contract. → Phases 2–5 run on the light path (single Tier-A probe).

### Research Questions

**Must-answer:** 1. What is the complete behavioral contract of MUI temporary `Drawer` and `Snackbar` as configured by this app? — success criteria: an enumerated parity checklist from mui.com primary docs. Tier A.

### Findings (2026-08-08, Tier-A, primary sources: mui.com/material-ui/api/{drawer,snackbar}, react-modal)

**Drawer parity checklist (locked)** — temporary variant inherits Modal, whose behaviors default ON (`disable*` opt-out convention):
1. Esc closes; 2. backdrop click closes; 3. body scroll locked while open; 4. focus moves into panel, is enforced there, restored to trigger on close; 5. renders above all content (MUI uses a portal; equivalent stacking via fixed+z-index is acceptable — invisible if z-order matches); 6. slide-from-top with theme default durations (~225ms enter / ~195ms exit) + backdrop blur styling per current `sx`; 7. any click inside closes (app's own `onClick` on the content Stack).

**Snackbar parity checklist (locked)**:
1. auto-hide 3000ms (`timeout`); 2. clickaway closes (app passes unfiltered `onClose` — preserved quirk); 3. **Esc closes** (also unfiltered — a behavior surfaced only by this probe); 4. timer pauses on window blur (default `disableWindowBlurListener: false`), resumes with delay `autoHideDuration/2` = 1500ms (default `resumeHideDuration`); 5. anchorOrigin top-right, but **on small screens it grows to full width and horizontal alignment is ignored** (rendering behavior to replicate); 6. slide-down transition (app's custom `SlideTransition`); success styling `#06ff76`/black.

*Disconfirming evidence sought:* none contradicting; Modal excerpt didn't explicitly confirm every default — the `disable*` naming convention plus explicit doc statements ("disables scrolling", "keeping focus there until closed") cover the load-bearing items. Status: **proven** for enumerated items 1–4 (drawer) and 1–6 (snackbar); focus-restore target labeled **convention** (verified empirically at implementation).

### Synthesis

**Outcome**: Confirm — scope unchanged; the checklists above are now the parity criteria the implementation is verified against (manual checks + visual states). Two subtle behaviors were only surfaced by research (snackbar Esc-close, small-screen full-width growth, blur-pause) — exactly why the probe ran.

### Gate Check

- Premise still valid: ✓
- No prerequisite PRs surfaced: ✓
- User approved updated spec: pending
- Implementation cleared: pending user approval

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

- [x] `yarn test:visual` diffs clean vs the ORIGINAL pre-refactor baseline — 190/190, two consecutive runs, ZERO baselines regenerated (2026-08-08)
- [x] Behavior parity verified via scripted probe (9/9): drawer scroll-lock/Esc/backdrop/focus-in/focus-restore; snackbar visible/Esc/clickaway/auto-hide
- [x] `grep -r "@mui\|@material-ui\|@emotion" src/` → zero imports (one provenance comment only); 4 packages removed
- [x] Bundle re-measured: `_app` chunk 244 → **198 kB** First-Load (−46 kB), total First Load JS 318 → 272 kB

## Implementation notes (parity iteration record)

The baseline caught four real fidelity gaps in the hand-rolled replacements, each diagnosed from diff images and fixed at root:
1. **Inherited color**: MUI AppBar set `color:#fff` and Drawer paper carried theme white — replacements initially inherited body black (red text/icons across many captures).
2. **Scroll-lock reflow**: MUI's Modal compensates the vanished scrollbar with body `padding-right`; without it, edge-anchored content shifted horizontally.
3. **Snackbar breakpoint**: MUI's "small screen = full width" boundary is `theme.breakpoints.up('sm')` — and the old custom theme's sm was **960**, not MUI's default 600. Offsets are 8px mobile / 24px ≥960.
4. **Drawer z-order semantics**: MUI Drawer sits at zIndex 1200; the navbar's 1201 was a deliberate design putting the brand + hamburger-X ABOVE the open drawer. Also: MUI margin-based Stack spacing is REPLACED by a child's own margin, while flex gap adds — the icons row needed `calc(2rem − 9.6px)`.
Residuals accepted with budget: WebKit renders the panel's bottom edge with ≤1px subpixel rounding (drawer budget 500); works-index thumbnail srcset instability re-measured up to 62.5k → budget 80000 until PR-009's image rework removes the cause.
Notes: snackbar font stack preserved as MUI's `Roboto, Helvetica, Arial` (Roboto not loaded → Helvetica renders, identical to before). MUI Alert icon SVG paths copied verbatim for pixel parity. `header.tsx` (dead, MUI-importing) deleted here as permitted by scope Notes. **Documented deviation**: `link.tsx` was rewritten in place (131 → 33 lines, plain next/link + anchor) instead of deleted-and-inlined — same import surface for all 7 consumers meant a far smaller diff with identical intent; sx-dependent call sites (links.tsx, works.tsx) converted to Tailwind hover classes.

## Research backing

D2 (DESIGN-log): usage inventory [proven — audit]; behaviors enumerated; MUI-consolidation alternative priced and rejected.

## Notes

framer-motion 6 remains in place in this PR (swapped in PR-007). Dead components importing MUI (`header.tsx`) may be deleted here if trivially confirmed unreferenced, else left for PR-010.
