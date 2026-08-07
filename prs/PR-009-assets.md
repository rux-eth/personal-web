# PR-009: Assets — fonts, images, dead files

**Landed-in:** (not yet landed)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-2 (partial)**: font subsetting tooling/ranges and compression targets are research-pending; the rest is Tier-1.

## Research findings

_To be populated by `PROCEDURE-pr-research.md`._

---

## Scope

- **Fonts**: subset SF Pro Display Bold + Menlo Regular to used glyph ranges, convert to woff2, load via `next/font/local` (`display: 'swap'` per D6 — user may override to `'block'`); remove both font `<link>` stylesheets from `_app` and `_document` and delete `public/fonts/*.css`/`.otf`; keep only the woff2 sources next/font consumes.
- **Images**: route every remaining raw `<img>` through `next/image` with true display dimensions (work-detail image, rain icons, slot coins); compress/resize oversized sources (blormmy 7.9 MB, btc-logo 377 kB, etc.) to sizes appropriate for their largest rendered dimension.
- **Dead files**: delete `sw.js`, `workbox-*.js`, `manifest.json`, `btc-logo.png~`, `wojak.png`, `JupyterIcon.png`, orphan thumbnails (`eastern-standard`, `treasure`, `nft-data-miner`), unused `Menlo-Regular.woff`. Reference-check `btc.png`, `download.jpg`, `eth-logo-black.png` before deciding.

## Dependencies

PR-007 (`next/font` requires ≥13; modern `next/image` semantics).

## Architecture section implemented

`docs/ARCHITECTURE.md` § Assets.

## Verification criteria

- [ ] `yarn test:visual` diffs clean — fonts render identically (subsetting must not drop any used glyph: audit all rendered text incl. `©`, arrows, and works-content characters)
- [ ] Waterfall check: no render-blocking font CSS; fonts preloaded; no `<link rel="stylesheet" href="/fonts/...">` in HTML
- [ ] Work-detail page transfer size reduced from ~8 MB to target (<500 kB total); recorded
- [ ] Lighthouse before/after on `/` and a work page; scores recorded in PR description

## Research backing

D6 (DESIGN-log): next/font since v13 [proven]; sizes measured. Backlog: subsetting tooling + glyph ranges, sw.js stale-registration consideration, root-file reference check.

## Notes

font-display default is `swap` (changes only the degraded-network failure mode vs today's invisible-text blocking); user may request `block` for byte-identical semantics — confirm during research phase.
