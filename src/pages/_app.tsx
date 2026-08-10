import Layout from '@src/components/layouts/main'
import '@src/styles/global.css'
import { AnimatePresence, domAnimation, LazyMotion, m } from 'motion/react'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

// Typefaces (D6 as amended 2026-08-10): Inter Bold replaces SF Pro Display
// Bold, DejaVu Sans Mono replaces Menlo — licensed lookalikes; the Apple
// fonts' EULAs prohibit web embedding (PR-009 research findings). Only the
// 700 weight is loaded for Inter: the old SF face was a Bold file declared
// at weight 400 serving every weight, so all sans text has always rendered
// bold — 700-only reproduces that.
const inter = Inter({
  weight: '700',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter'
})
const dejavuMono = localFont({
  src: '../fonts/DejaVuSansMono-subset.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-dejavu-mono'
})

const fontsClass = `fonts-root ${inter.variable} ${dejavuMono.variable}`

// The single motion wrapper owning page transitions (D3). Variants match the
// former duplicated layout wrappers; the ease is the curve framer-motion 6
// actually rendered for its (invalid) `type: 'easeInOut'` config — popmotion
// routed it to the keyframes generator whose default easing is easeInOut
// (popmotion.cjs.js dispatch; see PR-007 research findings).
const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -0, y: 20 }
}

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Layout router={router} fontsClass={fontsClass}>
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence mode="wait" initial={true}>
          <m.article
            key={router.route}
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ position: 'relative' }}
          >
            <Component {...pageProps} />
          </m.article>
        </AnimatePresence>
      </LazyMotion>
    </Layout>
  )
}

export default MyApp
