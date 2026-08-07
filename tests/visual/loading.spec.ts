import { test, expect, awaitAppReady } from './fixtures'

// /loading animates "loading..." dots on a 300ms setInterval — a JS timer,
// which animations:'disabled' does NOT cover. A fake-clock approach proved
// nondeterministic: hydration occasionally completes mid-advance, shifting the
// interval's registration time and thus the tick count (and hydration signals
// are timer-polled, which the fake clock itself freezes). The animated <p> is
// masked instead — deterministic by construction. Coverage tradeoff (accepted,
// documented in PR-001): the loading text itself is unverified; /loading is a
// dead route and a PR-010 removal candidate.
test('page loading (dots masked)', async ({ page }) => {
  await page.goto('/loading')
  await awaitAppReady(page)
  await expect(page).toHaveScreenshot('loading.png', {
    fullPage: true,
    mask: [page.locator('p', { hasText: 'loading' })]
  })
})
