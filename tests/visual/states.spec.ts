import {
  awaitAppReady,
  expect,
  settle,
  settleAfterScroll,
  test
} from './fixtures'

// Interactive states. Downstream contracts: PR-003 names drawer + snackbar
// explicitly; PR-006 needs the filter dropdown.

test('navbar shown after scrolling past tldr', async ({ page }) => {
  await page.goto('/')
  await awaitAppReady(page)
  await page.evaluate(() => {
    const tldr = document.getElementById('tldr')!
    window.scrollTo(0, window.scrollY + tldr.getBoundingClientRect().y + 10)
  })
  await settleAfterScroll(page)
  // Backdrop-blur over rain-image content jitters (measured ~6.3k px once).
  await expect(page).toHaveScreenshot('navbar-shown.png', {
    maxDiffPixels: 8000
  })
})

test('nav drawer open', async ({ page, viewport }) => {
  // Hamburger is hidden at the md breakpoint (1280) and up.
  test.skip(!!viewport && viewport.width >= 1280, 'hamburger hidden ≥ md')
  await page.goto('/contact')
  await awaitAppReady(page)
  await page.locator('.hamburger-react').click()
  await settle(page)
  // WebKit renders the hand-rolled panel's bottom edge with ≤1px subpixel
  // rounding vs the MUI original (measured ~250 px on the boundary line).
  await expect(page).toHaveScreenshot('nav-drawer-open.png', {
    maxDiffPixels: 500
  })
})

test('works filter dropdown open', async ({ page }) => {
  await page.goto('/works')
  await awaitAppReady(page)
  await page.getByText('Filter Tags').click()
  await settle(page)
  // Translucent chip backgrounds in the dropdown jitter (measured ~4.2k px
  // at threshold 0.05).
  await expect(page).toHaveScreenshot('works-filter-open.png', {
    maxDiffPixels: 6000
  })
})

test('services section expanded', async ({ page }) => {
  await page.goto('/services')
  await awaitAppReady(page)
  await page.locator('summary').first().click()
  // Expanding mounts new CommentedContent blocks whose comment-gutter line
  // counts only recompute on the app's scroll/resize handler — nothing fires
  // it after a click. Jiggle the scroll position to force the recompute,
  // then let React flush.
  await page.evaluate(() => {
    window.scrollBy(0, 1)
    window.scrollBy(0, -1)
  })
  await settleAfterScroll(page)
  // The sticky <header> gets stitched at nondeterministic offsets in this
  // fullPage capture (Playwright scrolls to stitch segments; paint timing
  // shifted with PR-009's font/image loading and made it bistable across
  // runs). The navbar has dedicated coverage (navbar-shown + every state
  // capture); mask it here so the expanded-section content stays the signal.
  await expect(page).toHaveScreenshot('services-section-open.png', {
    fullPage: true,
    mask: [page.locator('header')]
  })
})

test('snackbar after copy', async ({ page }) => {
  await page.goto('/contact')
  await awaitAppReady(page)
  // First copy button (FaCopy inside .white-comp button); clipboard write may
  // be permission-denied headlessly — the snackbar fires regardless (state is
  // set synchronously, the promise is not awaited by the app).
  await page.locator('button.white-comp').first().click()
  await settle(page)
  await expect(page).toHaveScreenshot('snackbar-copy.png')
})
