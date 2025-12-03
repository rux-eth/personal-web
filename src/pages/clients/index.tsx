import ComingSoonPage from '@src/components/comingSoon'
import { CommentedHeader } from '@src/components/commented'
import GasCutSprintPage from '@src/components/gasCutSprintPage'
import Layout from '@src/components/layouts/pages'
import { NextPage } from 'next'
/* @ts-ignore */
const Clients: NextPage = () => {
  return (
    <Layout title="Client Page">
      <GasCutSprintPage />
    </Layout>
  )
}
export default Clients
