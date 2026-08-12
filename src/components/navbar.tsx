import { navDrawerAtom } from '@src/store/jotai'

import transition from '@src/styles/utils'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
import Hamburger from 'hamburger-react'
import { useAtom } from 'jotai'
import { type FC, useEffect, useState } from 'react'
import Link from './link'
import Links from './links'

// Former MUI AppBar, preserved exactly: header element, full-width flex
// column, fixed on home / sticky elsewhere, z-index 1201, glass styling.
const Navbar: FC<{ path: string }> = ({ path }) => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useAtom(navDrawerAtom)
  // Navbar-local visibility check, preserving the original expression exactly:
  // pages WITHOUT #tldr always show the navbar (?? 0), home shows it once
  // tldr's top crosses the viewport top (and keeps it at page bottom).
  // rAF-batched listener; React state changes only when the boolean flips, so
  // scroll re-renders nothing here in steady state. (A tldr-bound
  // IntersectionObserver fights AnimatePresence remounts across route
  // transitions — deviation from the original ARCHITECTURE.md wording,
  // amended in the same commit; render economics are identical.)
  const [showNavbar, setShowNavbar] = useState(false)
  // biome-ignore lint/correctness/useExhaustiveDependencies: `path` is deliberately unused in the body — the layout (and navbar) persists across routes, so the [path] dep is what re-runs check() on navigation
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      setShowNavbar(
        (document.getElementById('tldr')?.getBoundingClientRect()?.y ?? 0) <= 0
      )
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    // After a route transition the new article mounts one frame after
    // onExitComplete; a double rAF re-checks against the settled DOM (the
    // [path] re-run fires too early, while the old page is still exiting).
    const onTransitionDone = () => {
      requestAnimationFrame(() => {
        if (!raf) raf = requestAnimationFrame(check)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('page-transition-done', onTransitionDone)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('page-transition-done', onTransitionDone)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [path])
  const { h } = (() => {
    const dynHNum = parseInt(dynamicFont(110), 10)
    return { h: dynHNum }
  })()

  return (
    <header
      className="font-Menlo px-[1.5ch]"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        width: '100%',
        color: '#fff',
        top: 0,
        left: 'auto',
        right: 0,
        position: path !== '/' ? 'sticky' : 'fixed',
        fontSize: `${h}px`,
        transition,
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        backgroundColor: 'rgba(18, 18, 18, 0.75)',
        border: '2px solid rgba(255, 255, 255, 0.015)',
        zIndex: 1201,
        transform: showNavbar ? 'translateY(0%)' : 'translateY(-100%)',
        opacity: showNavbar ? '100%' : '0%'
      }}
    >
      <div className="flex justify-between">
        <Link
          className="flex space-x-[0.5ch] items-center"
          href="/"
          style={{
            textDecoration: 'none',
            alignItems: 'center'
          }}
        >
          <span>Rux</span>
        </Link>

        <div
          className="hidden md:flex space-x-[1ch] justify-end"
          style={{
            alignItems: 'center',

            fontSize: `${h * 0.8}px`
          }}
        >
          {Links.internal}
          {Links.external}
        </div>
        <div
          className="flex flex-row items-center md:hidden"
          style={{ gap: '9.6px' }}
        >
          <Hamburger
            toggled={isNavDrawerOpen}
            toggle={setIsNavDrawerOpen}
            color="currentColor"
            hideOutline
          />
        </div>
      </div>
    </header>
  )
}

export default Navbar
