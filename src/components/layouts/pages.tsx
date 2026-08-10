import Head from 'next/head'
import type { FC, PropsWithChildren } from 'react'
import { CommentedHeader } from '../commented'
import Seperator from '../seperator'

interface LayoutProps {
  title?: string
}

// The page-transition wrapper (formerly a duplicated motion.article here)
// lives in _app.tsx since PR-007 (D3): this layout renders content only.
const Layout: FC<PropsWithChildren<LayoutProps>> = ({ children, title }) => {
  const t = title ? `${title} - Rux` : 'Rux'
  return (
    <>
      {t && (
        <Head>
          <title>{t}</title>
          <meta name="twitter:title" content={t} />
          <meta property="og:title" content={t} />
        </Head>
      )}
      {title && (
        <div className="text-white">
          <CommentedHeader content={title} />
          <Seperator />
        </div>
      )}
      {children}
    </>
  )
}

export default Layout
