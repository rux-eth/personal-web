import Layout from '@src/components/layouts/main'
import '@src/styles/global.css'
import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Layout router={router}>
      <AnimatePresence exitBeforeEnter initial={true}>
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </AnimatePresence>
    </Layout>
  )
}

export default MyApp
