import cssIcon from '@src/images/icons/cssIcon.png'
import expressJSIcon from '@src/images/icons/expressJSIcon.png'
import GitIcon from '@src/images/icons/GitIcon.png'
import htmlIcon from '@src/images/icons/htmlIcon.png'
import JavaIcon from '@src/images/icons/JavaIcon.png'
import javascriptIcon from '@src/images/icons/javascriptIcon.png'
import LinuxIcon from '@src/images/icons/LinuxIcon.png'
import nodeJSIcon from '@src/images/icons/nodeJSIcon.png'
import pythonIcon from '@src/images/icons/pythonIcon.png'
import rustIcon from '@src/images/icons/rustIcon.png'
import { floating, integer, pickset } from '@src/utils/chance'
import Image, { type StaticImageData } from 'next/image'
import type { FC, JSX, RefObject } from 'react'

interface RainItem {
  src: StaticImageData
  scale: number
  transX: number
  rot: number
  startX: number
  startY: number
}

interface RainProps {
  refContain: RefObject<HTMLDivElement | null>
  scrollY: number
  variant?: number
}

interface Config {
  numItems: number
  numVars: number
  vertSpread: number
}

const config: Config = {
  numItems: 25,
  numVars: 10,
  vertSpread: 7
}

const slotIcons = [pythonIcon, rustIcon, LinuxIcon, GitIcon]
// Same icon order as the former string pool — rain layouts are seeded-random
// and draw-order-sensitive (see tests/visual/fixtures.ts).
const pool: StaticImageData[] = [
  cssIcon,
  expressJSIcon,
  GitIcon,
  htmlIcon,
  JavaIcon,
  javascriptIcon,
  LinuxIcon,
  nodeJSIcon,
  pythonIcon
]

// Utility to generate random rain items, using custom replacements instead of Chance
const getSeeds = (): RainItem[] => {
  let allItems: RainItem[] = []
  const addItems = (newItems: StaticImageData[]) => {
    newItems.forEach(icon => {
      allItems.push({
        src: icon,
        scale: floating({ min: 0.6, max: 1.8, fixed: 2 }),
        transX: integer({ min: -100, max: 100 }),
        rot: floating({ min: -0.5, max: 0.5, fixed: 2 }),
        startX: integer({ min: -50, max: 200 }),
        startY: -integer({ min: 0, max: 20 })
      })
    })
  }

  const temp: number = Math.floor(config.numItems / pool.length)
  for (let i = 0; i < temp; i++) {
    addItems(pool)
  }
  const remainder: number = config.numItems - allItems.length

  if (remainder > 0) {
    const r = pickset(pool, remainder)
    addItems(r)
  }
  allItems = allItems.sort((a, b) => a.scale - b.scale)
  return allItems
}

const variants: RainItem[][] = Array.from(Array(config.numVars), getSeeds)

const Rain: FC<RainProps> = ({ refContain, scrollY, variant }) => {
  // If no variant is provided, pick one randomly
  const v: number = variant ?? integer({ min: 0, max: config.numVars - 1 })
  let progress = 0
  const { current: elContainer } = refContain
  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight)
  }

  return (
    <div
      className="absolute bg-white h-[97%] w-[97%] top-0 p-px left-[50%] top-[50%]"
      style={{
        boxSizing: 'border-box',
        overflow: 'hidden',
        transform: 'translateX(-50%) translateY(-50%)'
      }}
    >
      {(() => {
        const items: RainItem[] = variants[v % variants.length]
        const allComps: JSX.Element[] = []
        const splits: number = Math.floor(items.length / config.vertSpread)
        for (let i = 0; i <= splits; i++) {
          const s: RainItem[] = items.slice(i * splits, i * splits + splits)
          allComps.push(
            <div
              key={`rain_id_${i}`}
              className="flex flex-row"
              style={{
                position: 'absolute',
                maxWidth: `${100 / splits}%`,
                top: `${i * 6 - 40}px`,
                transform: `translateY(${progress * 10}vh)`
              }}
            >
              {s.map((item, index) => (
                <Image
                  className="bg-white border-black"
                  alt=""
                  loading="eager"
                  // biome-ignore lint/suspicious/noArrayIndexKey: sources repeat, so index disambiguates; array is render-static, never reordered (stable-id generation deliberately deleted in D5)
                  key={`${item.src.src}_${index}`}
                  src={item.src}
                  style={{
                    zIndex: index,
                    borderRadius: '50%',
                    transform: `scale(${item.scale}) translateY(${
                      (progress * 200000) ** (50 / 100)
                    }%) translateX(${item.transX * (progress + 1)}%) rotate(${
                      item.rot * progress - item.rot
                    }turn) `,
                    border: '3px solid black'
                  }}
                />
              ))}
            </div>
          )
        }
        return allComps
      })()}
    </div>
  )
}

const Slot: FC<RainProps> = ({ refContain, scrollY }) => {
  let progress = 0
  const { current: elContainer } = refContain
  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight)
  }
  return (
    <div
      className="absolute bg-black h-full w-full top-0 p-px left-[50%] top-[50%]"
      style={{
        boxSizing: 'border-box',
        overflow: 'hidden',
        transform: 'translateX(-50%) translateY(-50%)'
      }}
    >
      <div
        className="flex flex-col-reverse bottom-0 bg-black"
        style={{
          position: 'absolute',
          transform: `translateY(${progress * 105}%)`
        }}
      >
        {slotIcons.map((c, index) => (
          <Image
            alt=""
            loading="eager"
            // biome-ignore lint/suspicious/noArrayIndexKey: sources repeat, so index disambiguates; array is render-static, never reordered
            key={`slot_${c.src}_${index}`}
            src={c}
            style={{ transform: 'scale(0.7)', borderRadius: '50%' }}
          />
        ))}
      </div>
    </div>
  )
}
export default Rain
export { Slot }
