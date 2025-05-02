import ComingSoonPage from '@src/components/comingSoon'
import { CommentedHeader } from '@src/components/commented'
import Layout from '@src/components/layouts/pages'
import { NextPage } from 'next'
/* @ts-ignore */
const Clients: NextPage = () => {
  return (
    <Layout title="Client Page">
      <ComingSoonPage />
    </Layout>
  )
}
export default Clients
