import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
import { type FC, type JSX, useEffect, useRef, useState } from 'react'

interface CommentedHeaderProps {
  content: string
  scale?: number
}
interface CommentedContentProps extends CommentedHeaderProps {
  fontSize?: string
  header?: string
}

// Each block measures itself with its own ResizeObserver and derives its
// /** * … */ gutter line count locally — no shared registry, no DOM ids, no
// global context (docs/ARCHITECTURE.md § Scroll/resize). Line math preserved
// exactly from the original: floor(offsetHeight / lineHeight) − 2, initial 1.
const CommentedContent: FC<CommentedContentProps> = ({
  content,
  header,
  fontSize
}) => {
  const fs = fontSize ?? dynamicFont(80)
  const lh: string = `${Math.floor(parseInt(fs, 10) * 1.6)}px`
  const refContain = useRef<HTMLDivElement>(null)
  const [nl, setNl] = useState(1)
  useEffect(() => {
    const el = refContain.current
    if (!el) return
    const compute = () => {
      const lineHeight = parseInt(el.style.lineHeight, 10)
      if (lineHeight > 0) setNl(Math.floor(el.offsetHeight / lineHeight) - 2)
    }
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
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
  const comments = `/**\n${Array(nl).fill('*\n').join('')}*/`
  return (
    <div
      className="flex flex-row relative font-Menlo"
      style={{
        fontSize: fs,
        lineHeight: lh,
        whiteSpace: 'pre-line',
        opacity: '80%'
      }}
    >
      <span className="absolute">{comments}</span>

      <div
        ref={refContain}
        style={{
          marginLeft: lh,
          lineHeight: lh
        }}
      >
        {concatStr}
        <br />
        <br />
      </div>
    </div>
  )
}
const CommentedHeader: FC<CommentedHeaderProps> = ({ content, scale }) => {
  return (
    <div
      className="w-full flex text-center justify-center opacity-70  font-Menlo italic"
      style={{
        fontSize: dynamicFont((scale ?? 110) / (content.length + 6), true)
      }}
    >
      <p>{`/* ${content} */`}</p>
    </div>
  )
}

export { CommentedContent, CommentedHeader }
