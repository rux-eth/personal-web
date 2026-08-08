import { awaitAppReady, expect, loadAllImages, test } from './fixtures'

// Full-page baselines for every route. Work ids mirror public/works.json.
const workIds = [
  'hospital-in-a-box',
  'personal',
  'zerepy',
  'blormmy',
  'paystand',
  'crypto-rates',
  'rarity-ranker',
  'nft-data-miner-v2',
  'eth-scanner',
  'club-cards'
]

const staticPages: Array<[name: string, path: string]> = [
  ['home', '/'],
  ['works-index', '/works'],
  ['contact', '/contact'],
  ['services', '/services'],
  ['not-found', '/404'],
  ...workIds.map(id => [`work-${id}`, `/works/${id}`] as [string, string])
]

for (const [name, path] of staticPages) {
  test(`page ${name}`, async ({ page }) => {
    await page.goto(path)
    await awaitAppReady(page)
    await loadAllImages(page)
    // Absorbs image-resampling jitter on scaled raster thumbnails (measured
    // at threshold 0.05: works-index up to ~35k px — it renders all 10
    // thumbnails; other pages ≤ ~4k). NOTE: per-call options merge with the
    // config default — an explicit maxDiffPixels is required to override it.
    // Sensitivity note (documented in PR-001): works-index alone only catches
    // changes > its budget; smaller shared-component changes there are
    // cross-covered by the home page (canary-verified) and the filter-state
    // capture, which have far tighter budgets.
    //
    // The home capture masks two regions that are nondeterministic for
    // harness-external reasons AND have dedicated coverage elsewhere:
    // 1. Masthead: rain markup is baked into SSG HTML with UNSEEDED build-time
    //    Math.random (verified: consecutive builds differ only in rain +
    //    buildId) → varies per server build. Covered by masthead.spec's
    //    deterministic post-scroll captures.
    // 2. Recent-works preview grid: WebKit at the 960px breakpoint boundary
    //    resamples thumbnails from differing srcset candidates per invocation
    //    (~20.7k px subpixel ghosting). Covered by works-index, the
    //    works-filter state capture, and all per-work pages.
    // Home's unique content (tl;dr sections, buttons — the canary surface)
    // remains under the strict 8000 budget.
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      maxDiffPixels: name === 'works-index' ? 45000 : 8000,
      mask:
        name === 'home'
          ? [page.locator('.w-screen').first(), page.locator('.grid').first()]
          : []
    })
  })
}
