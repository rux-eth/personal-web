import { Analytics } from '@vercel/analytics/react'
import Head from 'next/head'
import { Router } from 'next/router'
import React from 'react'
import Footer from '../footer'
import Masthead from '../masthead'
import Navbar from '../navbar'
import NavDrawer from '../navDrawer'
import Snackbar from '../snackbar'

interface LayoutProps {
  router: Router
  title?: string
}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  router
}) => {
  return (
    <article style={{ position: 'relative' }}>
      <Head>
        <title>Rux.eth - Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Maxwell Rux" />
        <meta name="twitter:site" content="@rux_eth" />
        <meta name="twitter:creator" content="@rux_eth" />
        <meta property="og:site_name" content="Rux.eth" />
        <meta name="og:title" content="Rux.eth" />
        <meta property="og:type" content="website" />
        <link rel="stylesheet" href="/fonts/sf-pro.css" />
        <link rel="stylesheet" href="/fonts/menlo.css" />
      </Head>

      <Navbar path={router.asPath} />
      {router.asPath === '/' && <Masthead />}

      <div style={{ backgroundColor: '#333333' }}>
        <div className="container auto min-h-screen">{children}</div>
      </div>
      <Footer />

      <Snackbar />
      <NavDrawer />
      <Analytics />
    </article>
  )
}

export default Layout
