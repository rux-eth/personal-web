import {
  type Breakpoint,
  breakpoints as getBreakpoints
} from '@src/utils/hooks/breakpoints'
import useMatchesMediaQuery from './useMatchesMediaQuery'

const getCurrentBreakpoint = (): [string, number] => {
  const breakpoints: Array<[string, number]> = Object.entries(getBreakpoints())
  let res: [string, number] = breakpoints[0]
  for (let i = 1; i < breakpoints.length; i++) {
    const curr = breakpoints[i]
    // biome-ignore lint/correctness/useHookAtTopLevel: constant-trip-count loop over the static breakpoint list — call order is identical every render; a single-hook rewrite would churn a load-bearing utility for no behavior change
    if (useMatchesMediaQuery('up', breakpoints[i][0] as Breakpoint)) {
      res = curr
    }
  }
  return res
}
export default getCurrentBreakpoint
export const dynamicFont = (scale: number = 100, onlyWidth = false): string => {
  return `${
    getCurrentBreakpoint()[1] ** (onlyWidth ? 1 : 0.5) * (scale / 100)
  }px`
}
export const dynamicFontNum = (
  scale: number = 100,
  onlyWidth = false
): number => {
  return getCurrentBreakpoint()[1] ** (onlyWidth ? 1 : 0.5) * (scale / 100)
}
