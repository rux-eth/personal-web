import { useEffect, useState } from 'react'

// rAF-batched window scroll position. Subscribed only where scroll actually
// drives rendering (the masthead parallax) — scroll must never re-render
// anything outside that subtree (docs/ARCHITECTURE.md § Scroll/resize).
export default function useScrollY(): number {
  const [y, setY] = useState(0)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          setY(window.scrollY)
        })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return y
}
