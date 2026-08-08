import NextLink from 'next/link'
import { AnchorHTMLAttributes, forwardRef } from 'react'

// Slim replacement for the former MUI-composed Link (131 lines → this).
// Same import surface for all consumers; external URLs (http/mailto) render a
// plain anchor, internal paths route through next/link (Next 12 anchor-child
// form — simplified again in PR-007).
export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, style, ...rest }, ref) => {
    const mergedStyle = { textDecoration: 'none', ...style }
    const isExternal = href.startsWith('http') || href.startsWith('mailto:')
    if (isExternal) {
      return (
        <a href={href} ref={ref} style={mergedStyle} {...rest}>
          {children}
        </a>
      )
    }
    return (
      <NextLink href={href}>
        <a ref={ref} style={mergedStyle} {...rest}>
          {children}
        </a>
      </NextLink>
    )
  }
)
Link.displayName = 'Link'

export default Link
