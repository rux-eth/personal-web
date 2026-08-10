import type { FC, JSX } from 'react'

interface Category {
  name: string
  rgb: number[]
}

const BuildCategory: FC<Category> = ({ name, rgb }) => {
  const textRGB = rgb.join(',')
  return (
    <span
      className={` font-Menlo rounded-[0.4ch] px-[0.5ch]`}
      style={{
        color: `rgba(${textRGB},1)`,
        backgroundColor: `rgba(${textRGB},0.4)`
      }}
    >
      {`${name}`}
    </span>
  )
}

// Single vocabulary source (D7): the literal-union types below are derived
// from these keys and type the works data in src/data/works.ts — an unknown
// tag there is a compile error, so data and presentation cannot drift.
const statusDefs = {
  Building: { name: 'Building', rgb: [255, 255, 0] },
  Deprecated: { name: 'Deprecated', rgb: [255, 35, 35] },
  Completed: { name: 'Completed', rgb: [0, 240, 0] }
}
const stackDefs = {
  node: { name: 'NodeJS', rgb: [83, 158, 67] },
  express: { name: 'ExpressJS', rgb: [247, 223, 30] },
  ethers: { name: 'EthersJS', rgb: [66, 97, 195] },
  hardhat: { name: 'Hardhat', rgb: [254, 176, 23] },
  foundry: { name: 'Foundry', rgb: [230, 230, 230] },
  mongodb: { name: 'MongoDB', rgb: [79, 171, 65] },
  next: { name: 'NextJS', rgb: [74, 179, 177] },
  web3: { name: 'Web3', rgb: [171, 79, 255] },
  tailwind: { name: 'TailwindCSS', rgb: [69, 140, 220] },
  fastify: { name: 'Fastify', rgb: [255, 90, 90] },
  wasm: { name: 'WebAssembly', rgb: [233, 10, 245] },
  nestjs: { name: 'NestJS', rgb: [255, 153, 0] },
  postgres: { name: 'Postgres', rgb: [102, 51, 153] },
  springboot: { name: 'Spring Boot', rgb: [0, 150, 136] }
}
const languageDefs = {
  typescript: { name: 'Typescript', rgb: [49, 120, 198] },
  python: { name: 'Python', rgb: [112, 81, 162] },
  solidity: { name: 'Solidity', rgb: [98, 126, 234] },
  rust: { name: 'Rust', rgb: [230, 123, 16] },
  javascript: { name: 'Javascript', rgb: [240, 219, 79] },
  java: { name: 'Java', rgb: [176, 114, 25] }
}
const roleDefs = {
  'Full-Stack': { name: 'Full-Stack', rgb: [255, 255, 0] },
  'Front-End': { name: 'Front-End', rgb: [0, 255, 0] },
  'Back-End': { name: 'Back-End', rgb: [255, 0, 0] }
}
const linkDefs = {
  website: { name: 'Website', rgb: [0, 126, 220] },
  article: { name: 'Article', rgb: [0, 158, 95] },
  trello: { name: 'Trello', rgb: [230, 230, 230] }
}

export type WorkStatus = keyof typeof statusDefs
export type StackTag = keyof typeof stackDefs
export type LanguageTag = keyof typeof languageDefs
export type Role = keyof typeof roleDefs
export type LinkTag = keyof typeof linkDefs
export type Tag = WorkStatus | StackTag | LanguageTag | Role | LinkTag

const buildGroup = <K extends string>(
  defs: Record<K, Category>
): Record<K, JSX.Element> => {
  const out = {} as Record<K, JSX.Element>
  for (const key of Object.keys(defs) as K[]) {
    out[key] = <BuildCategory key={key} {...defs[key]} />
  }
  return out
}

export const categories: Record<Tag, JSX.Element> = {
  ...buildGroup(statusDefs),
  ...buildGroup(stackDefs),
  ...buildGroup(languageDefs),
  ...buildGroup(roleDefs),
  ...buildGroup(linkDefs)
}
