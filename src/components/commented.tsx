import { Stack } from '@mui/material'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
import { ResizeContext } from '@src/utils/resize-observer'
import { createHash } from 'crypto'
import { Map as IMap } from 'immutable'
import { FC, RefObject, useContext, useRef } from 'react'
interface CommentedHeaderProps {
  content: string
  scale?: number
}
interface CommentedContentProps extends CommentedHeaderProps {
  fontSize?: string
  header?: string
}

let refs: IMap<string, RefObject<HTMLDivElement>> = IMap()
const CommentedContent: FC<CommentedContentProps> = ({
  content,
  header,
  fontSize
}) => {
  const fs = fontSize ?? dynamicFont(80)
  const lh: string = `${Math.floor(parseInt(fs, 10) * 1.6)}px`
  const concatStr: JSX.Element =
    header === undefined ? (
      <span>{`\n${content}\n`}</span>
    ) : (
      <>
        <div
          className="text-[#1896FF] font-bold"
          style={{ opacity: '100%' }}
        >{`\n\n${header}\n\n`}</div>
        <span>{`${content}\n`}</span>
      </>
    )
  const id: string = createHash('sha1')
    .update(`${header}${content}`)
    .digest('hex')
    .slice(0, 10)
  const refContain = useRef<HTMLDivElement>(null)
  refs = refs.set(id, refContain)
  const { numLines } = useContext(ResizeContext)

  const nl = numLines.get(id) ?? 1
  const comments = `/**\n${Array(nl).fill('*\n').join('')}*/`
  return (
    <Stack
      fontFamily={'Menlo'}
      direction={'row'}
      position={'relative'}
      fontSize={fs}
      style={{
        lineHeight: lh,
        whiteSpace: 'pre-line',
        opacity: '80%'
      }}
    >
      <span className="absolute">{comments}</span>

      <div
        ref={refContain}
        id={id}
        className="commented"
        style={{
          marginLeft: lh,
          lineHeight: lh
        }}
      >
        {concatStr}
        <br />
        <br />
      </div>
    </Stack>
  )
}
const CommentedHeader: FC<CommentedHeaderProps> = ({ content, scale }) => {
  return (
    <div
      className="w-full flex text-center justify-center opacity-[70%]  font-Menlo italic"
      style={{
        fontSize: dynamicFont((scale ?? 110) / (content.length + 6), true)
      }}
    >
      <p>{`/* ${content} */`}</p>
    </div>
  )
}
export { refs, CommentedContent, CommentedHeader }
