import snackbarAtom from '@src/store/jotai'
import { useAtom } from 'jotai'
import { FC, useCallback, useEffect, useRef } from 'react'

// Hand-rolled replacement for MUI Snackbar + filled Alert.
// Behavior parity contract (research-locked in prs/PR-003-mui-removal.md):
// auto-hide 3000ms · clickaway closes · Esc closes (app passed an unfiltered
// onClose) · timer pauses on window blur, resumes after 1500ms · top-right,
// but grows to full width under 600px · slide-down 225ms in / 195ms out.
// Icon SVG paths are copied verbatim from @mui/material internal svg-icons
// (SuccessOutlined, Close) for pixel parity.
const AUTO_HIDE = 3000
const RESUME_DELAY = AUTO_HIDE / 2

const SUCCESS_PATH =
  'M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z'
const CLOSE_PATH =
  'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'

const Icon: FC<{ path: string; size: number }> = ({ path, size }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
  >
    <path d={path} />
  </svg>
)

const Snackbar: FC = () => {
  const [snackbar, setSnackbar] = useAtom(snackbarAtom)
  const rootRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { isOpen, severity, message } = snackbar

  const close = useCallback(
    () => setSnackbar(s => ({ ...s, isOpen: false })),
    [setSnackbar]
  )

  useEffect(() => {
    if (!isOpen) return
    const start = (ms: number) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(close, ms)
    }
    const stop = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = null
    }
    start(AUTO_HIDE)
    const onBlur = () => stop()
    const onFocus = () => start(RESUME_DELAY)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const onClickAway = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        close()
    }
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('click', onClickAway, true)
    return () => {
      stop()
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', onClickAway, true)
    }
  }, [isOpen, close])

  const isSuccess = severity === 'success'
  return (
    <div
      ref={rootRef}
      role="presentation"
      className="snackbar-root"
      style={{
        position: 'fixed',
        zIndex: 1400,
        display: 'flex',
        justifyContent: 'flex-end',
        visibility: isOpen ? 'visible' : 'hidden',
        transform: isOpen ? 'translateY(0)' : 'translateY(calc(-100% - 8px))',
        transition: isOpen
          ? 'transform 225ms cubic-bezier(0, 0, 0.2, 1)'
          : 'transform 195ms cubic-bezier(0.4, 0, 0.6, 1), visibility 0ms linear 195ms'
      }}
    >
      <div
        role="alert"
        style={{
          display: 'flex',
          alignItems: 'center',
          width: isSuccess ? '100%' : undefined,
          padding: '6px 16px',
          borderRadius: '4px',
          boxShadow:
            '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          backgroundColor: isSuccess ? '#06ff76' : '#d32f2f',
          color: isSuccess ? 'black' : '#fff'
        }}
      >
        <span
          style={{
            display: 'flex',
            padding: '7px 0',
            marginRight: 12,
            opacity: 0.9
          }}
        >
          <Icon path={SUCCESS_PATH} size={22} />
        </span>
        <span style={{ padding: '8px 0' }}>{message}</span>
        <span
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginLeft: 'auto',
            paddingLeft: 16,
            marginRight: -8
          }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            style={{
              display: 'flex',
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: 5,
              borderRadius: '50%'
            }}
          >
            <Icon path={CLOSE_PATH} size={20} />
          </button>
        </span>
      </div>
      {/* MUI anchor offsets: 8px + full width on "small screens", 24px above.
          The boundary is theme.breakpoints.up('sm') — and the OLD app theme
          defined sm = 960, not MUI's default 600. Preserved exactly. */}
      <style>{`
        .snackbar-root { top: 8px; left: 8px; right: 8px; }
        @media (min-width: 960px) {
          .snackbar-root { top: 24px; left: auto; right: 24px; }
        }
      `}</style>
    </div>
  )
}

export default Snackbar
