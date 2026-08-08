import { test as base, expect, Page } from '@playwright/test'

// Seeded PRNG override, injected before any page module executes (addInitScript
// contract: "after the document was created but before any of its scripts were
// run"). rain.tsx builds its random variants at module load, so this MUST run
// pre-module. mulberry32 — tiny, deterministic.
//
// KNOWN SENSITIVITY: the seed fixes the random SEQUENCE, but module execution
// order decides which draws rain consumes. Any change to import order (e.g.
// biome organizeImports) permutes rain layouts — deterministic, but different
// from prior baselines. After import-order changes, expect rain-dependent
// baselines (home / masthead / navbar-shown) to need regeneration; text and
// layout captures are unaffected and remain the true regression signal.
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

// For fullPage captures: legacy next/image lazy-loads via its own
// IntersectionObserver; a fast scroll-through RACES the observer (measured:
// preview thumbnails stayed placeholders in whole invocations, bistable
// baselines). Force each image individually: scrollIntoView (fires the
// observer deterministically), then wait until it is genuinely loaded
// (naturalWidth > 0) and decoded. Restore scroll position at the end.
export async function loadAllImages(page: Page) {
  await page.evaluate(async () => {
    const waitLoaded = (img: HTMLImageElement) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>(res => {
            const done = () => res()
            img.addEventListener('load', done, { once: true })
            img.addEventListener('error', done, { once: true })
            setTimeout(done, 5000) // never hang a capture on a broken image
          })
    // document.images is live; iterate until no unloaded images remain
    // (scrolling can mount new lazy loaders).
    for (let pass = 0; pass < 3; pass++) {
      for (const img of Array.from(document.images)) {
        img.scrollIntoView({ block: 'center' })
        await new Promise(r => requestAnimationFrame(r))
        await waitLoaded(img)
        await img.decode().catch(() => {})
      }
      if (
        Array.from(document.images).every(i => i.complete && i.naturalWidth > 0)
      )
        break
    }
    window.scrollTo(0, 0)
    await new Promise(r =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    )
  })
  // The scroll-back triggers the app's scroll listener; let React flush.
  await settleAfterScroll(page)
}

export { expect }
