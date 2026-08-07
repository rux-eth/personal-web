import { test, expect, awaitAppReady, loadAllImages } from './fixtures'

// Full-page baselines for every route. Work ids mirror public/works.json.
const workIds = [
  'sapien',
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
  ['clients', '/clients'],
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
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      maxDiffPixels: name === 'works-index' ? 45000 : 8000
    })
  })
}
