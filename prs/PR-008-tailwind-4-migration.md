# PR-008: Tailwind 4 migration

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required.

## Research findings

### State Assessment (2026-08-08)

**Current state**:
- Repo: `master` @ `44097cc` (PR-007 merged via #24), clean; no open PRs; no parallel-dev drift. Latest tailwindcss stable: **4.3.3** (checked via npm).
- Styling surface is SMALL and fully inventoried:
  - `tailwind.config.js`: JIT, custom `screens` (default screens spread + our 7 breakpoints overriding + `ha: { raw: '(hover: hover)' }`), `fontFamily` REPLACING defaults (SF_Pro_Display, Menlo), `extend.colors` (paper/primary/secondary/error/fg).
  - Actually-used theme classes: `font-Menlo` ×15, `text-primary-main` ×2, `container auto` ×1. **`font-SF_Pro_Display` and the paper/secondary/error/fg color utilities are referenced by zero classNames** (font stack comes from the body CSS; colors also live in `constants.ts` for JS use).
  - Default-palette classes in use: `text-blue-300` ×3, `text-red-500` ×2, and 1 each of `bg-blue-500`/`bg-red-500`/`bg-gray-900`/`border-gray-700`/`text-blue-500`/`text-gray-400`.
  - v4-rename surface: `shadow` ×1, `outline-none` ×1, `rounded-[0.5ch]` (arbitrary — unaffected). **`border-1` ×1 in rain.tsx is INERT in v3** (no such utility → no CSS); v4's dynamic utilities would likely ACTIVATE it (1px border on slot images = pixel change) — delete the inert class, don't migrate it.
  - `global.css`: three `@tailwind` directives + `.container.auto` + body + `.white-comp` + summary-marker rules. No `@apply` anywhere.
  - `src/styles/constants.ts`: TS breakpoints (consumed by `useMatchesMediaQuery`/`getCurrentBreakpoint`/`dynamicFont`) + colors (consumed once: `navbar.tsx:116` passes `colors.primaryMain` to the Hamburger `color` prop).
  - `postcss.config.js`: tailwindcss + autoprefixer.
- Harness: 8 projects × xs/mb/sm/md. **The lg/xl/2xl breakpoints (1920/2560/3840) are outside the viewport matrix** — pre-existing harness scope (PR-001), not a new gap, but this PR's breakpoint edits at those sizes are suite-blind; the values are copied verbatim, so risk is confined to transcription.

**Tier-A probe (upgrade guide, tailwindcss.com/docs/upgrade-guide)** — confirms and extends D2:
- Renames [proven]: `shadow`→`shadow-sm`, `outline-none`→`outline-hidden`, `rounded`→`rounded-sm`, `ring`→`ring-3` (our surface: the one `shadow`, the one `outline-none`).
- **Preflight changes** [proven]: button cursor `pointer`→`default`, default border-color `gray-200`→`currentColor`, placeholder color change. The button-cursor change is a *functional/visual* regression for this site's many buttons (invisible to screenshots — cursors aren't captured) → restore v3 behavior via the guide's documented base-layer snippet.
- Theme values are emitted as CSS variables on `:root`, **readable at runtime via `getComputedStyle`** [proven] — this is the mechanism that lets the breakpoint hook read the single CSS source (SSR path needs a fallback, same as the current matchMedia-absent behavior).
- PostCSS setup: single `@tailwindcss/postcss` plugin (replaces tailwindcss+autoprefixer; autoprefixer dep dies).
- Raw-screen (`ha`) handling by the upgrade tool: **undocumented** — expected landing is a `@custom-variant ha (@media (hover: hover))`; resolve empirically when the tool runs (the PR's Notes already prescribe hand-migration if mangled).
- Default palette is oklch in v4; exact sRGB-rendered deltas vs v3 hexes **unconfirmed** — empirical via the suite; if the 10 default-palette usages diff, pin the v3 hex values in `@theme` (they'd then be part of the single source, not hardcodes).

**Assumptions at PR draft time**: upgrade tool runs on our config; `ha` may need hand-migration; JIT arbitrary values fine in v4; single theme source achievable. **All hold**; refinements above (inert `border-1`, preflight cursor snippet, palette-delta watch).

**New constraints**:
- Zero-baseline-regen bar (no D9 items); any visual diff is a regression to fix, incl. sub-pixel image-phase shifts (PR-007's lesson: watch layout fractions).
- v3 `fontFamily`/`screens` REPLACED defaults — the v4 `@theme` must do the same (`--breakpoint-*: initial` + ours; `--font-*: initial` + Menlo/SF) so no default utilities re-appear... (only load-bearing for `container`, which derives max-widths from `--breakpoint-*`).
- The `colors` single-source criterion touches `navbar.tsx:116` (Hamburger `color` prop) — needs a CSS-derived value (e.g. `currentColor` via wrapper, or a runtime var read), not a TS duplicate.

**Downstream contracts** (grep sweep: PR-001, PR-003, ROADMAP, RESEARCH-BACKLOG; PR-009/010 read):
- **PR-001** → complete breakpoint matrix contract ("PR-008 needs the complete breakpoint matrix — its risk is entirely CSS"): the matrix exists (8 projects); lg+ blindness noted above. Satisfied within its design.
- **PR-003** (delivered) → hand-rolled components' classes all survive (drawer/snackbar use plain classes + inline styles; inventoried above).
- **PR-009/PR-010** → no specific contracts on this PR beyond "single styling system" end-state; PR-010 re-measures. Satisfiable: yes.
- **RESEARCH-BACKLOG** → the one outstanding topic (tool behavior with `ha` + custom breakpoints) is empirically resolvable only by running the tool — carried as the first implementation step, with hand-migration as the documented fallback.

**Path-tier checkpoint**: Tier-1 confirmed (header/ROADMAP/backlog agree; design 1 day old). Phase 1 clean — the open items (tool-vs-`ha`, oklch palette deltas) are empirical implementation-time checks with documented fallbacks, not researchable-in-advance questions. **Cleared after Phase 1; Phases 2–4 skipped.**

### Gate Check

- Premise still valid: ✓
- No prerequisite PRs surfaced: ✓
- User approved updated spec: ✓ (2026-08-08, in chat)
- Implementation cleared

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

- [x] `yarn test:visual` 190/190 ×2 (explicit exit 0 both, 2026-08-08) — **zero baseline changes** across the full 8-project matrix. Filter probe 5/5.
- [x] Hover: preview-card hover measured 0.75→1 on hover-capable Chromium; all 5 `hover:` utilities in the built CSS sit inside `@media (hover:hover)` (raw-CSS verified); touch emulation reports `(hover: hover)` false. (`ha` preserved as `@custom-variant`; note it has zero class consumers in current code, and v4 gates the plain `hover:` variant by capability natively — the design's intent is now framework-default.)
- [x] Single definition: colors exist only in `global.css` (grep-verified). Breakpoints exist in `global.css` plus two **documented mirrors**: the SSR seed in `breakpoints.ts` (pre-hydration renders consume only the smallest breakpoint; loud must-match comment) and the pre-existing Playwright viewport matrix (test infra, comment updated to point at the CSS source).
- [x] `biome check` exit 0 (3 known img warnings); `tsc --noEmit` clean; `yarn build` green.

## Implementation notes (2026-08-08, delegated to completion)

- **Upgrade tool** (`@tailwindcss/upgrade` 4.3.3): bumped deps (tailwindcss 4.3.3, +@tailwindcss/postcss, −autoprefixer), swapped the PostCSS config, converted `@tailwind` directives to `@import 'tailwindcss'`, renamed classes across 10 files (opacity-[N%]→opacity-N, bg-gradient-to-r→bg-linear-to-r, shadow→shadow-sm, outline-none→outline-hidden, negative-margin forms — all CSS-equivalent, hand-reviewed). **It punted on our config** (left `@config` pointing at the JS file — the backlog question answered: raw screens + spread are beyond it) → config hand-migrated to `@theme` per the Notes fallback.
- **Tool override 1**: it "fixed" rain.tsx's inert `border-1` (no such v3 utility → zero CSS) to `border`, which would have activated a never-rendered 1px border. Class deleted instead.
- **Tool override 2**: reverted its `space-y-px` rename to `space-y-[1px]` (kept the arbitrary form our space-* override handles uniformly).
- **`@theme static`** (not plain `@theme`): v4 tree-shakes theme variables not referenced by emitted CSS — with plain `@theme`, only `--breakpoint-xs` and `--color-primary-main` were emitted and the runtime hook read empty strings. `static` forces full emission (runtime-verified: all 7 breakpoints + 9 colors present on `:root`).
- **space-x/y semantics restored to v3** via `@utility` overrides: v4 switched from "margin-top/left on every sibling after the first" to "margin-bottom/right on all but the last" — with the site's `ch`-unit spacing the margin resolves against a *different element's* font size wherever siblings differ, which shifted 120 of 190 captures (contact cards, works pages, drawer, snackbar, 404, loading …). The custom utility neutralizes the v4 core rule (both are emitted; the override wins) and applies the v3 selector/side. Runtime-verified margins: followers carry margin-top in their own font's ch, zero margin-bottom anywhere.
- **Default-palette pins**: v4's oklch palette renders visibly differently — the suite caught `bg-red-500` (Reset button) shifting. All 7 used default-palette colors pinned to their v3 hexes inside `@theme` (red-500, blue-300, blue-500, gray-400/500/700/900) — part of the single source. Runtime-verified: `rgb(239,68,68)` / `rgb(59,130,246)` restored.
- **Omitted the tool's default-border-color compat layer**: every border-width utility in src/ carries an explicit border color (grep-verified) — the layer was dead weight.
- **Preflight cursor restore** (base layer): v4 sets button cursors to `default`; the site's v3 `pointer` behavior is restored (screenshot-invisible, functionally real).
- **Single-source plumbing**: `tailwind.config.js` + `src/styles/constants.ts` deleted; new `src/utils/hooks/breakpoints.ts` reads `--breakpoint-*` via `getComputedStyle` (cached; SSR/first-render path uses the documented xs seed, preserving the exact pre-hydration behavior). `useMatchesMediaQuery`/`getCurrentBreakpoint` rewired; navbar's Hamburger color is now `currentColor` (inherits the header's `#fff` — the one former TS color consumer).
- **Biome**: enabled `css.parser.tailwindDirectives` (Biome's own suggestion) so `@theme`/`@custom-variant` parse; `next-env.d.ts` added to the ignore list (Next 16 regenerates it in a style Biome would rewrite — **this also fixes a latent lint failure shipped in PR-007**, whose final lint check misread truncated output; tsconfig.json reformatted likewise after Next 16's rewrite).
- Behavior note (framework-inherent, suite-invisible): v4 gates `hover:` variants behind `(hover: hover)` — on touch devices, tap no longer triggers hover styling. This matches the site's own `ha` design intent.

## Research backing

D2 (DESIGN-log): Tailwind 4 browser floor = Next 16 floor [proven]; upgrade tool [proven]. Backlog: tool behavior with custom `ha` screen.

## Notes

If the v4 upgrade tool mangles the `ha` raw query or `ch`-unit arbitrary values, hand-migrate those and document.
