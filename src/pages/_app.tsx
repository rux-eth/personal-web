import { ThemeProvider } from '@mui/material/styles'
import Layout from '@src/components/layouts/main'
import '@src/styles/global.css'
import { theme } from '@src/styles/theme'
import ResizeObserver from '@src/utils/resize-observer'
import { Config, DAppProvider, Mainnet } from '@usedapp/core'
import { getDefaultProvider } from 'ethers'
import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/next'

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider('mainnet')
  }
}
function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <DAppProvider config={config}>
      <ResizeObserver>
        <ThemeProvider theme={theme}>
          <Layout router={router}>
            <AnimatePresence exitBeforeEnter initial={true}>
              {/* @ts-ignore */}
              <Component {...pageProps} />
            </AnimatePresence>
          </Layout>
        </ThemeProvider>
      </ResizeObserver>
      <Analytics />
    </DAppProvider>
  )
}

export default MyApp
