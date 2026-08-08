import { WorksPage } from '@src/components/works'
import { WorkInfo, works } from '@src/data/works'
import { GetStaticProps, NextPage } from 'next'

interface Props {
  works: readonly WorkInfo[]
}

const Works: NextPage<Props> = ({ works }) => <WorksPage works={works} />

export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: { works }
})

export default Works
