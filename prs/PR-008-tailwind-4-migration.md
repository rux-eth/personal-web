# PR-008: Tailwind 4 migration

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required.

## Research findings

_To be populated by `PROCEDURE-pr-research.md`._

---

## Scope

- Run the official Tailwind v4 upgrade tool; migrate `tailwind.config.js` to CSS-first config in `global.css`.
- Fold the former `themeConstants` (colors, breakpoints incl. `ha` raw hover query) into the CSS config as the **single** theme source; delete the shared constants module left by PR-003; the breakpoint hook reads from the same source.
- Verify custom pieces the tool may not handle: `ha` raw media-query screen, custom font families, JIT arbitrary values used heavily in components (`text-[1.4ch]` etc.).

## Dependencies

PR-007 (new build pipeline).

## Architecture section implemented

`docs/ARCHITECTURE.md` § Stack — Styling (single theme source).

## Verification criteria

- [ ] `yarn test:visual` diffs clean at every breakpoint — this PR's entire risk is CSS, so the breakpoint matrix must be complete
- [ ] Hover states verified on a hover-capable env and absent on touch emulation (`ha` breakpoint preserved)
- [ ] Exactly one definition of colors/breakpoints exists in the repo (grep-verifiable)

## Research backing

D2 (DESIGN-log): Tailwind 4 browser floor = Next 16 floor [proven]; upgrade tool [proven]. Backlog: tool behavior with custom `ha` screen.

## Notes

If the v4 upgrade tool mangles the `ha` raw query or `ch`-unit arbitrary values, hand-migrate those and document.
