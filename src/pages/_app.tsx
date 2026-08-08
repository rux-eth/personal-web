import Layout from '@src/components/layouts/main'
import '@src/styles/global.css'
import { AnimatePresence, domAnimation, LazyMotion, m } from 'motion/react'
import { AppProps } from 'next/app'

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
    <Layout router={router}>
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
