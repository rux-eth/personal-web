import { awaitAppReady, expect, settleAfterScroll, test } from './fixtures'

// Fixed-scroll-offset captures of the masthead parallax (PR-004 contract:
// transform positions must be comparable at exact scroll offsets).
// Masthead height is 100vh (scale=1), so offsets are viewport-height fractions.
const offsets: Array<[name: string, fraction: number]> = [
  ['masthead-scroll-0', 0],
  ['masthead-scroll-50', 0.5],
  ['masthead-scroll-100', 1]
]

for (const [name, fraction] of offsets) {
  test(name, async ({ page }) => {
    await page.goto('/')
    await awaitAppReady(page)
    await page.evaluate(f => {
      window.scrollTo(0, Math.round(window.innerHeight * f))
    }, fraction)
    await settleAfterScroll(page)
    // The rain is ~175 scaled/rotated PNGs at fractional-pixel positions —
    // the highest raster-jitter surface in the site (measured ≤3.9k px at the
    // mid-scroll offset). Explicit maxDiffPixels overrides the strict config
    // default (per-call options merge, they don't replace). A parallax-formula
    // regression displaces icon clusters wholesale, far beyond this.
    await expect(page).toHaveScreenshot(`${name}.png`, {
      maxDiffPixels: 9000
    })
  })
}
