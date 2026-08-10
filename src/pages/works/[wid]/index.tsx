import { WorkPage } from '@src/components/works'
import { getWork, type WorkInfo, works } from '@src/data/works'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

interface Props {
  work: WorkInfo
}

const Work: NextPage<Props> = ({ work }) => <WorkPage work={work} />

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: works.map(work => ({ params: { wid: work.id } })),
  fallback: false
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const work = getWork(String(params?.wid))
  return work ? { props: { work } } : { notFound: true }
}

export default Work
