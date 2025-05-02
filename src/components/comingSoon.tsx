import { CommentedHeader } from '@src/components/commented'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
/* @ts-ignore */
const ComingSoonPage: React.FC = () => {
  return (
    <div className="text-white">
      <CommentedHeader content="Under Construction..." />
      <div
        className="w-full text-center justify-center opacity-[90%]  font-Menlo"
        style={{
          fontSize: dynamicFont(4, true)
        }}
      >
        <span>{`\n\nThis page is being worked on.\n\n`}</span>
        <span>{`In the meantime, you can visit the `}</span>
        <a href="/contact" className="font-bold text-[#1896FF]">
          <u>{`contact page`}</u>
        </a>
        <span>{` to get a hold of Rux.\n\n`}</span>
      </div>
    </div>
  )
}
export default ComingSoonPage
