import Layout from '@src/components/layouts/main'
import '@src/styles/global.css'
import ResizeObserver from '@src/utils/resize-observer'
import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <ResizeObserver>
      <Layout router={router}>
        <AnimatePresence exitBeforeEnter initial={true}>
          {/* @ts-ignore */}
          <Component {...pageProps} />
        </AnimatePresence>
      </Layout>
    </ResizeObserver>
  )
}

export default MyApp
