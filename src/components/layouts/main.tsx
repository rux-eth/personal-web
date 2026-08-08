import { Analytics } from '@vercel/analytics/react'
import { motion } from 'framer-motion'
import Head from 'next/head'
import { Router } from 'next/router'
import React from 'react'
import Footer from '../footer'
import Masthead from '../masthead'
import Navbar from '../navbar'
import NavDrawer from '../navDrawer'
import Snackbar from '../snackbar'

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -0, y: 20 }
}
interface LayoutProps {
  router: Router
  title?: string
}

const Layout: React.FC<LayoutProps> = ({ children, router }) => {
  return (
    <motion.article
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4, type: 'easeInOut' }}
      style={{ position: 'relative' }}
    >
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
    </motion.article>
  )
}

export default Layout
