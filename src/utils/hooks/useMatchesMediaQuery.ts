import { Breakpoint, breakpoints } from '@src/styles/constants'
import { useEffect, useState } from 'react'

export type MatchQueryType = 'up' | 'down' | 'between'

// matchMedia replacement for MUI's useMediaQuery + theme.breakpoints.
// Query shapes mirror MUI v5: up(x) = min-width x; down(x) = max-width x−0.05;
// between(a,b) = both. Like MUI's default (noSsr: false), the first render
// returns false and the real match applies after hydration.
const toPx = (v: Breakpoint | number): number =>
  typeof v === 'number' ? v : breakpoints[v]

const buildQuery = (
  query: MatchQueryType,
  option: Breakpoint | number,
  additionalOption?: Breakpoint | number
): string => {
  switch (query) {
    case 'up':
      return `(min-width:${toPx(option)}px)`
    case 'down':
      return `(max-width:${toPx(option) - 0.05}px)`
    case 'between':
      return `(min-width:${toPx(option)}px) and (max-width:${
        toPx(additionalOption ?? 0) - 0.05
      }px)`
  }
}

const useMatchesMediaQuery = (
  query: MatchQueryType,
  option: Breakpoint | number,
  additionalOption?: Breakpoint | number
): boolean => {
  const mq = buildQuery(query, option, additionalOption)
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(mq)
    setMatches(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [mq])
  return matches
}

export default useMatchesMediaQuery
