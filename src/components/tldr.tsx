import { CommentedContent, CommentedHeader } from '@src/components/commented'
import Seperator from '@src/components/seperator'
import { compileTags, works } from '@src/data/works'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
import { getAge, getWorkingYears } from '@src/utils/time'
import React, { type JSX } from 'react'
import Link from './link'
import { WorkPreviews } from './works'

interface Section {
  header: string
  content: string
  highlights?: { [key: string]: Array<string> }
  extraCompenent?: JSX.Element
}

const TLDR: React.FC = () => {
  const fs = dynamicFont(70)
  const sections: Section[] = [
    {
      header: 'Introduction',
      content: `Hello, I am Rux, a ${getAge()} year old software engineer from the midwest, USA. I work across fintech, payments, and AI — Rust and Python ML systems, TypeScript backends, and LLM/agent infrastructure, from architecture through production. Since I was young, I have had a strong interest in computers, and that interest eventually became my career: several startups, a lot of shipped systems, and plenty of mistakes I learned from along the way. I believe in strong values of integrity, discipline, honesty, and hard work — professionally and otherwise. Currently I am finishing a degree in computer science and mathematics while building the systems below.`
    },
    {
      header: 'Work',
      content: `I have been a professional software engineer for over ${getWorkingYears()} years — payment infrastructure at Paystand, AI-agent backends at Blorm, and digital-asset platforms earlier on. These days my own work sits at the intersection of machine learning and markets: a quantitative research and execution platform in Rust, Python, and TypeScript, plus AI products and infrastructure. I have always been a learner, researching interests until I understand them deeply — and I test heavily enough to defend everything I ship, line by line.`,

      extraCompenent: (
        <>
          <Seperator />
          <CommentedHeader content="Recent Works" />
          <div className="flex flex-col text-center space-y-[1.3ch]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 p-6">
              <WorkPreviews
                works={works
                  .filter(work => compileTags(work).has('Completed'))
                  .slice(0, 3)}
              />
            </div>
          </div>
          <Link className="white-comp text-[2.5ch]" href="/works">
            View All Works
          </Link>
        </>
      )
    },
    {
      header: 'Personal',
      content:
        "In my free time I am usually working on side-projects. However when I'm not developing software, I am usually either enjoying nature or studying.",
      highlights: {
        'Start a conversation with me about': [
          'Tech',
          'Finance/Trading',
          'Business',
          'Philosophy',
          'Psychology',
          'Gaming',
          'Music',
          'Movies',
          'Fitness',
          'Motorcycles (I have a 2024 Yamaha R3 and a 2025 Kawasaki ZX-6R)',
          'Fishing/Hunting'
        ],
        'Favorite Movies': [
          'Lord of the Rings',
          'Scarface',
          'American Psycho',
          'Gran Torino',
          'Straight Outta Compton',
          'The Wolf of Wall Street',
          'The Social Network',
          'The Blues Brothers',
          'Life of Pi'
        ],
        'Favorite Books': [
          'Atomic Habits',
          'The Art of War',
          'Rich Dad Poor Dad',
          'Harry Potter'
        ],
        'Favorite Music': [
          'Rap',
          'Country (only the classics, 70s - early 2000s)',
          'Metal',
          'Electronic',
          'Hip-Hop'
        ]
      }
    },
    {
      header: 'Contact',
      content:
        'Feel free to contact me if you have any questions or business inquiries.',
      extraCompenent: (
        <Link className="white-comp text-[2.2ch]" href={'/contact'}>
          Contact Me
        </Link>
      )
    }
  ]
  const compileHighlights = (hl: Section['highlights']): string =>
    hl === undefined
      ? ''
      : `\n${Object.entries(hl)
          .map(([k, v]) => `\n${k}:${v.map(elem => `\n - ${elem}`).join('')}`)
          .join('\n')}`
  return (
    <div
      id="tldr"
      className="flex flex-col bg-inherit text-left text-primary-main space-y-[2%] pb-[3ch]"
      style={{ fontSize: fs }}
    >
      <CommentedHeader content="tl;dr" />

      <Seperator />
      <div
        className="flex flex-row justify-between items-center font-Menlo"
        style={{ paddingLeft: '3ch', paddingRight: '3ch' }}
      >
        <div className="text-white flex flex-col space-y-[0.4ch]">
          <div>
            <p className="font-bold text-[3.4ch]">Rux</p>
            <p className="opacity-70 mt-[-1ch] text-[1.3ch]">ENS: rux.eth</p>
          </div>

          <p>Full-Stack Software Engineer</p>
        </div>
      </div>
      {sections.map(s => (
        <React.Fragment key={s.header}>
          <Seperator />
          <CommentedContent
            content={
              s.highlights
                ? `${s.content}${compileHighlights(s.highlights)}`
                : `${s.content}`
            }
            header={s.header}
            fontSize={fs}
          />
          {s.extraCompenent}
        </React.Fragment>
      ))}
    </div>
  )
}
export default TLDR
