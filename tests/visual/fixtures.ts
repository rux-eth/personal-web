import { test as base, expect, Page } from '@playwright/test'

// Seeded PRNG override, injected before any page module executes (addInitScript
// contract: "after the document was created but before any of its scripts were
// run"). rain.tsx builds its random variants at module load, so this MUST run
// pre-module. mulberry32 — tiny, deterministic.
const SEED = 0xc0ffee

export const test = base.extend<{ page: Page }>({
  context: async ({ context }, use) => {
    await context.addInitScript(seed => {
      let a = seed >>> 0
      Math.random = () => {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }
    }, SEED)
    await use(context)
  }
})

// Fonts + two rAF ticks. The consecutive-match retry inside toHaveScreenshot
// remains the primary stability mechanism; these helpers narrow its window.
export async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise(r =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    )
  })
}

// The app schedules setTimeout(handleResize, 1000) on mount; when it fires,
// commented-gutter line counts update and layout shifts ~1px. Captures must
// happen strictly after it. Uses real time — do NOT combine with page.clock.
export async function awaitAppReady(page: Page) {
  await settle(page)
  await page.waitForTimeout(1200)
  await settle(page)
}

// Programmatic scroll → scroll event → React state → transform re-render is
// async; the consecutive-match retry cannot detect a state that never updates
// ("stable but wrong"). Wait real time for the app's scroll listener to flush,
// then settle. Call after any page.evaluate that scrolls.
export async function settleAfterScroll(page: Page) {
  await page.waitForTimeout(400)
  await settle(page)
}

// For fullPage captures: next/image lazy-loads below-fold images, and capture
// races async decode. Scroll through the document to trigger every loader,
// wait for all images to load + decode, then restore scroll position.
export async function loadAllImages(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise(r => requestAnimationFrame(r))
    }
    window.scrollTo(0, 0)
    const imgs = Array.from(document.images)
    await Promise.all(
      imgs.map(img =>
        img.complete
          ? img.decode().catch(() => {})
          : new Promise<void>(res => {
              img.onload = img.onerror = () => {
                img
                  .decode()
                  .catch(() => {})
                  .finally(res)
              }
            })
      )
    )
    await new Promise(r =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    )
  })
}

export { expect }
