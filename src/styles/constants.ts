// Single shared source for theme values formerly duplicated between
// tailwind.config.js and the (deleted) MUI theme. PR-008 folds these into the
// Tailwind CSS-first config as the final single source; until then this module
// is the one place breakpoints/colors live in TS.
// THESE VALUES MUST MATCH tailwind.config.js.

export const breakpoints = {
  xs: 350,
  mb: 600,
  sm: 960,
  md: 1280,
  lg: 1920,
  xl: 2560,
  '2xl': 3840
} as const

export type Breakpoint = keyof typeof breakpoints

export const colors = {
  primaryMain: '#ffffff',
  primaryDark: '#3f3f3f',
  paper: '#F9F9F9',
  errorMain: '#b22222',
  errorDark: '#8b0000'
} as const
