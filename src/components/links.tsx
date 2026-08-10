import type { JSX } from 'react'
import { FaGithub, FaMedium, FaTelegram } from 'react-icons/fa'
import Link from './link'

interface LinkFormat {
  external: { [key: string]: { link: string; icon: JSX.Element } }
  internal: string[]
}
export type LinkReturn = {
  [key in keyof LinkFormat]: JSX.Element[]
}
const defaultStyles = {
  text: { fontFamily: 'Menlo' },
  icon: {}
}
// Former MUI sx hover styling, preserved exactly: #bbbbbb → white on hover,
// 500ms with the shared easing curve.
const linkClass = 'text-[#bbbbbb] hover:text-white hover:cursor-pointer'
const linkStyle = { transition: 'all 500ms cubic-bezier(0.23, 1, 0.32, 1)' }

const allLinks: LinkFormat = {
  external: {
    medium: {
      link: 'https://medium.com/@rux.eth',
      icon: <FaMedium style={defaultStyles.icon} />
    },
    github: {
      link: 'https://github.com/rux-eth',
      icon: <FaGithub style={defaultStyles.icon} />
    },
    telegram: {
      link: 'https://t.me/Rux0x',
      icon: <FaTelegram style={defaultStyles.icon} />
    }
  },
  internal: ['works', 'services', 'contact']
}

const Links: LinkReturn = {
  external: Object.entries(allLinks.external).map(([key, val]) => (
    <Link
      key={key}
      href={val.link}
      target="_blank"
      className={linkClass}
      style={linkStyle}
    >
      {val.icon}
    </Link>
  )),
  internal: allLinks.internal.map(val => (
    <Link key={val} href={`/${val}`} className={linkClass} style={linkStyle}>
      <p style={defaultStyles.text}>
        {val.charAt(0).toUpperCase() + val.slice(1)}
      </p>
    </Link>
  ))
}
export default Links
