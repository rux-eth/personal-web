# PR-004: Scroll/resize rearchitecture

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required.

## Research findings

_To be populated by `PROCEDURE-pr-research.md`._

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

- [ ] `yarn test:visual` diffs clean: navbar appears/disappears at the same scroll position; commented gutters show identical line counts at each breakpoint; masthead parallax positions identical at fixed scroll offsets
- [ ] React DevTools profiler (or render-count instrumentation): scrolling triggers zero renders outside the masthead subtree
- [ ] Bundle re-measured: crypto/stream/buffer polyfills gone from `_app` chunk (~129 kB gz reduction recorded)

## Research backing

D4 (DESIGN-log): observer support floors [proven — caniuse/WebKit/MDN]; D5 crypto dead-code rationale.

## Notes

The 1-second `setTimeout` initial measure in the old code is an ordering hack; ResizeObserver fires on observe, so it goes away — verify no first-paint gutter flash vs baseline.
