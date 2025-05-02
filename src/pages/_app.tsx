import { ThemeProvider } from '@mui/material/styles'
import Layout from '@src/components/layouts/main'
import '@src/styles/global.css'
import { theme } from '@src/styles/theme'
import ResizeObserver from '@src/utils/resize-observer'
// import { Config, DAppProvider, Mainnet } from '@usedapp/core'
import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'
/* 
const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: 'https://cloudflare-eth.com' // <-- public Ethereum mainnet endpoint
  }
}
 */
function MyApp({ Component, pageProps, router }: AppProps) {
  return (
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
  )
}

export default MyApp
