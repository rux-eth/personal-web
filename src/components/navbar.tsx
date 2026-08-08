import { navDrawerAtom } from '@src/store/jotai'

import transition from '@src/styles/utils'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
import Hamburger from 'hamburger-react'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import Link from './link'
import Links from './links'

// Former MUI AppBar, preserved exactly: header element, full-width flex
// column, fixed on home / sticky elsewhere, z-index 1201, glass styling.
const Navbar: FC<{ path: any }> = ({ path }) => {
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
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [path])
  const { w, h } = (() => {
    let dynHNum = parseInt(dynamicFont(110))
    return { w: dynHNum / 1.666, h: dynHNum }
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
          <Image
            className="grid-item-thumbnail"
            src="/eth-logo-white.png"
            alt=""
            width={w}
            height={h}
            // Explicit box: pre-13 next/image forced the w×h box; the modern
            // component lets the file's natural ratio set height (height:auto
            // preflight), which shifts everything below the sticky navbar by a
            // fraction of a pixel. Pin the authored box.
            style={{ width: w, height: h }}
          />
          <span>Rux.eth</span>
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
