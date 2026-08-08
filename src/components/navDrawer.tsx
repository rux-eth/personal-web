import { navDrawerAtom } from '@src/store/jotai'
import { useAtom } from 'jotai'
import { FC, useCallback, useEffect, useRef } from 'react'
import Links from './links'

// Hand-rolled replacement for MUI's temporary Drawer (anchor="top").
// Behavior parity contract (research-locked in prs/PR-003-mui-removal.md):
// Esc closes · backdrop click closes · body scroll locked while open · focus
// moves into panel and returns to the trigger on close · Tab stays within the
// panel · slide-from-top 225ms in / 195ms out · any click inside closes.
const glass = {
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  backgroundColor: 'rgba(18, 18, 18, 0.75)',
  border: '1px solid rgba(255, 255, 255, 0.015)'
} as const

const NavDrawer: FC = () => {
  const [isOpen, setIsOpen] = useAtom(navDrawerAtom)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const close = useCallback(() => setIsOpen(false), [setIsOpen])

  useEffect(() => {
    if (!isOpen) return
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    // Scroll lock with scrollbar-width compensation (as MUI's Modal does) —
    // without the padding, content reflows horizontally when the bar vanishes.
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0)
      document.body.style.paddingRight = `${scrollbarWidth}px`
    panelRef.current?.focus()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      restoreFocusRef.current?.focus()
    }
  }, [isOpen, close])

  return (
    <div
      aria-hidden={!isOpen}
      style={{
        position: 'fixed',
        inset: 0,
        // MUI zIndex.drawer = 1200; the navbar (1201) deliberately rides ABOVE
        // the open drawer so the brand and the hamburger-as-X stay visible
        // and clickable.
        zIndex: 1200,
        visibility: isOpen ? 'visible' : 'hidden',
        transition: `visibility 0ms linear ${isOpen ? 0 : 195}ms`
      }}
    >
      <div
        onClick={close}
        style={{
          position: 'absolute',
          inset: 0,
          ...glass,
          opacity: isOpen ? 1 : 0,
          transition: isOpen
            ? 'opacity 225ms cubic-bezier(0, 0, 0.2, 1)'
            : 'opacity 195ms cubic-bezier(0.4, 0, 0.6, 1)'
        }}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={close}
        className="flex flex-col text-center font-Menlo outline-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          ...glass,
          color: '#fff',
          fontSize: '2rem',
          gap: '9.6px',
          paddingTop: '80px',
          paddingBottom: '1rem',
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: isOpen
            ? 'transform 225ms cubic-bezier(0, 0, 0.2, 1)'
            : 'transform 195ms cubic-bezier(0.4, 0, 0.6, 1)'
        }}
      >
        {Links.internal}
        <div
          className="flex flex-row justify-center"
          // MUI Stack spacing is margin-based, so the row's mt:2rem REPLACED
          // the 9.6px spacing; flex gap adds instead — compensate.
          style={{ gap: '24px', marginTop: 'calc(2rem - 9.6px)' }}
        >
          {Links.external}
        </div>
      </div>
    </div>
  )
}

export default NavDrawer
