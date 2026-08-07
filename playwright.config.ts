import { defineConfig } from '@playwright/test'

// Viewport matrix mirrors the site's Tailwind/MUI breakpoints (see tailwind.config.js):
// xs 350 · mb 600 · sm 960 · md 1280
const viewports = {
  xs: { width: 350, height: 700 },
  mb: { width: 600, height: 960 },
  sm: { width: 960, height: 720 },
  md: { width: 1280, height: 800 }
} as const

const browsers = ['chromium', 'webkit'] as const

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  // Determinism is a PR-001 verification criterion — no retries masking flake.
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4179'
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      // threshold (per-pixel YIQ color distance) is STRICT: the canary showed
      // 0.3 — and even the 0.2 default — swallows real subtle changes (a 10%
      // opacity shift). AA/raster jitter is absorbed by maxDiffPixels budgets
      // instead (jitter pixels are few; their per-pixel delta is large, so
      // threshold never filtered them anyway).
      threshold: 0.05,
      maxDiffPixels: 200
    }
  },
  projects: browsers.flatMap(browserName =>
    (Object.keys(viewports) as Array<keyof typeof viewports>).map(bp => ({
      name: `${browserName}-${bp}`,
      use: { browserName, viewport: viewports[bp] }
    }))
  ),
  webServer: {
    command: 'yarn -s build && yarn -s next start -p 4179',
    port: 4179,
    reuseExistingServer: false,
    timeout: 180_000
  }
})
