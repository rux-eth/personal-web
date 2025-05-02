import Contact, { ContactItem } from '@src/components/contact'
import Layout from '@src/components/layouts/pages'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
import { NextPage } from 'next'

const contacts: ContactItem[] = [
  {
    title: 'Telegram',
    value: '@Rux0x',
    link: 'https://t.me/Rux0x'
  },
  {
    title: 'Twitter',
    value: '@Rux_eth',
    link: 'https://twitter.com/Rux_eth'
  },
  {
    title: 'Discord',
    value: 'Rux#2216'
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
        <div className="text-[2ch]">
          <p>I only give out my phone number to clients</p>
        </div>
        <Contact items={contacts} />
      </div>
    </Layout>
  )
}
export default ContactPage
