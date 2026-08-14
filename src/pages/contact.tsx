import Contact, { type ContactItem } from '@src/components/contact'
import Layout from '@src/components/layouts/pages'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
import type { NextPage } from 'next'

const contacts: ContactItem[] = [
  {
    title: 'Email',
    value: 'maxjrux@gmail.com',
    link: 'mailto:maxjrux@gmail.com'
  },
  {
    title: 'GitHub',
    value: 'https://github.com/rux-eth',
    link: 'https://github.com/rux-eth'
  },
  {
    title: 'LinkedIn',
    value: 'maxwell-rux-96682724a',
    link: 'https://www.linkedin.com/in/maxwell-rux-96682724a/'
  }
]

const ContactPage: NextPage = () => {
  const fs = dynamicFont(60)
  return (
    <Layout title="Contact">
      <div
        className="text-white font-Menlo text-center pt-3"
        style={{
          fontSize: fs
        }}
      >
        <Contact items={contacts} />
      </div>
    </Layout>
  )
}
export default ContactPage
