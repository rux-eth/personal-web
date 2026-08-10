// Runtime access to the theme breakpoints defined in src/styles/global.css
// (@theme --breakpoint-*) — the single source per D2/PR-008. Only the KEY
// list lives here (it names the variables to read); every value comes from
// the CSS.
export const breakpointKeys = [
  'xs',
  'mb',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl'
] as const

export type Breakpoint = (typeof breakpointKeys)[number]

// Pre-hydration seed: on the server (SSG render) and the first client render,
// every media query reports false, so consumers only ever use the SMALLEST
// breakpoint's value there (getCurrentBreakpoint falls back to it). MUST
// equal --breakpoint-xs in global.css — the one sanctioned echo of a theme
// value outside the CSS (documented in PR-008's research findings).
const SSR_XS_PX = 350

let cache: Record<Breakpoint, number> | null = null

export const breakpoints = (): Record<Breakpoint, number> => {
  if (cache) return cache
  if (typeof document === 'undefined') {
    return Object.fromEntries(
      breakpointKeys.map(k => [k, SSR_XS_PX])
    ) as Record<Breakpoint, number>
  }
  const styles = getComputedStyle(document.documentElement)
  cache = Object.fromEntries(
    breakpointKeys.map(k => [
      k,
      parseFloat(styles.getPropertyValue(`--breakpoint-${k}`))
    ])
  ) as Record<Breakpoint, number>
  return cache
}
