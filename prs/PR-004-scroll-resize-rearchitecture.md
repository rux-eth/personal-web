# PR-004: Scroll/resize rearchitecture

**Landed-in:** master via GitHub PR #21, 2026-08-08 (pre-versioning; v0.0 roadmap)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required.

## Research findings

### State Assessment (2026-08-08)

**Current state**:
- Consumers verified post-PR-003: `navbar.tsx` (showNavbar), `masthead.tsx` + `rain.tsx` (scrollY), `commented.tsx` (numLines + module `refs` + `crypto`), with `resize-observer.tsx` as the hub. No other consumers.
- **Behavioral subtlety to preserve**: `showNavbar = (tldr?.getBoundingClientRect().y ?? 0) <= 0` — pages WITHOUT `#tldr` (works/services/contact/404/loading) always show the navbar (`?? 0` → true); home shows it once tldr's top crosses the viewport top and it STAYS shown at page bottom (top goes more negative). The IO replacement must use `boundingClientRect.top <= 0` in the callback (not `isIntersecting`, which would flip false when tldr's bottom exits) with `rootMargin: '0px 0px -100% 0px'` to get crossings at the viewport-top line.
- **Timing change, documented as absorbed improvement (D9 init-hack category)**: today navbar visibility and gutter line-counts wait on the 1s `setTimeout` init hack; observers fire on observe, so both become correct ~immediately. Baselines capture post-settle (1.2s) → visually identical in captures; real users see correct state ~1s sooner.
- No user drift since the PR-003 merge (git log clean).

**Assumptions at PR draft time**: all hold; the rain/slot progress plumbing decision (state vs imperative) was left to implementation — resolved: masthead owns a single rAF-batched scroll subscription and passes scrollY down as a prop to Rain/Slot (one listener, subtree-only re-renders, transform math untouched).

**Stale assumptions**: none.

**New constraints** (prior art): PR-003 achieved zero baseline regens — the bar for this PR is the same; masthead-scroll (0/50/100%) and navbar-shown captures are the direct verifiers of this PR's rewrite. The harness's `settleAfterScroll`/jiggle helpers remain valid (the app's scroll listener changes from context-set-state to local rAF — still async).

**Downstream contracts**:
- **PR-005** → expects the immutable consumers in resize-observer/commented to die here, leaving only works/tldr/types. Satisfiable: yes.
- **PR-007** → expects the FC-implicit-children surface of resize-observer gone + navbar stabilized. Satisfiable: yes.
- **PR-001 harness** → masthead-scroll/navbar-shown/commented-gutter captures verify directly.

**Path-tier checkpoint**: Tier-1; ROADMAP concurs. Phase 1 is CLEAN — observer support was proven at design time (D4, cited), no unresearched must-answer questions, all contracts satisfiable. **Cleared after Phase 1 → skip to Gate Check.**

### Gate Check

- Premise still valid: ✓
- No prerequisite PRs surfaced: ✓
- User approved updated spec: ✓ (2026-08-08)
- Implementation cleared

---

## Scope

- Delete `src/utils/resize-observer.tsx` (ResizeContext) and the module-level `refs` registry in `commented.tsx`.
- Navbar visibility: `IntersectionObserver` watching `#tldr`; local state in navbar; same threshold semantics (visible once `#tldr` top ≤ viewport top).
- `CommentedContent`: per-instance `ResizeObserver` on own ref; line count = `floor(offsetHeight / lineHeight) − 2` exactly as today; local state. Delete the sha1 `createHash` id (and the `crypto` import — removes ~129 kB gz of polyfills). The `id`/`.commented` DOM attributes disappear (non-visual; documented deviation).
- Masthead/rain/slot: rAF-batched scroll subscription local to the masthead subtree; identical transform math. State-at-rAF-cadence vs imperative style writes decided at implementation (either satisfies the architecture; pick the fewer-LOC option that diffs clean).
- Fixes absorbed (D9): stale-closure `handleResize`, render-time module mutation — both cease to exist structurally.

## Dependencies

PR-001. Independent of PR-003 (touches different components; navbar edits may conflict textually — rebase order per roadmap).

## Architecture section implemented

`docs/ARCHITECTURE.md` § Scroll/resize architecture.

## Verification criteria

- [x] `yarn test:visual` 190/190 ×2 vs ORIGINAL baselines, first attempt, zero regens — masthead-scroll 0/50/100%, commented gutters at every breakpoint, navbar-shown all identical (2026-08-08)
- [x] Scroll-render isolation: structural — the global context is deleted (grep ResizeContext = 0); the only scroll subscribers are masthead's `useScrollY` (subtree state) and navbar's boolean check (state changes only at visibility flips). No render path outside the masthead responds to steady-state scrolling.
- [x] Bundle re-measured: `_app` chunk 198 → **53.7 kB** First-Load; total First Load 272 → **127 kB** (crypto/stream/buffer polyfills gone)

## Implementation notes

- **Documented deviation** (ARCHITECTURE.md amended in same commit): navbar uses a navbar-local rAF-batched check with the original expression instead of an `IntersectionObserver` — an element-bound IO fights AnimatePresence route remounts (stale binding during exit animations); render economics identical (state flips only).
- Absorbed improvement (D9 init-hack category): navbar visibility + gutter line counts now correct ~immediately instead of after the old 1s `setTimeout` — invisible in post-settle captures, ~1s faster for users.
- Rain/Slot receive `scrollY` as a prop from masthead's single subscription; transform math untouched. Stale-closure and render-time module mutation bugs ceased to exist structurally.

## Research backing

D4 (DESIGN-log): observer support floors [proven — caniuse/WebKit/MDN]; D5 crypto dead-code rationale.

## Notes

The 1-second `setTimeout` initial measure in the old code is an ordering hack; ResizeObserver fires on observe, so it goes away — verify no first-paint gutter flash vs baseline.
