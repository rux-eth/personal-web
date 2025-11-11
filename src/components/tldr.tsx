import { Stack } from '@mui/material'
import { CommentedContent, CommentedHeader } from '@src/components/commented'
import Seperator from '@src/components/seperator'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
import { Set } from 'immutable'
import React from 'react'
import Link from './link'
import { Works } from './works'
import { getAge, getWorkingYears } from '@src/utils/time'

interface Section {
  header: string
  content: string
  highlights?: { [key: string]: Array<string> }
  extraCompenent?: JSX.Element
}

const TLDR: React.FC = () => {
  const fs = dynamicFont(70)
  const works = new Works()
  const sections: Section[] = [
    {
      header: 'Introduction',
      content: `Hello, I am Rux, a ${getAge()} year old full-stack software engineer, entreprenuer, and futures trader. For most of my life I have lived in the midwest, USA. Since I was young, I have had a strong interest in computers. This interest has eventually led me to my passion. I dropped out of college in August of 2021 to start a tech company. Since then, I have been hustling with various businesses and have worked with numerous startups. I have also made many mistakes and will make many more, all a part of my learning process. Also, I believe in having strong values of integrity, discipline, honesty, and hard work. I believe that these values are the key to success, not just professionally, but in life. I am always looking for new challenges and opportunities to learn and grow. I am excited to share my journey with you and hope to inspire others to pursue their passions as well.`
    },
    {
      header: 'Work',
      content: `I have been a professional software engineer for over ${getWorkingYears()} years. I have a strong passion for software development, especially cryptography, making decentralized applications, and artificial intelligence/machine learning. I have always been a learner, always researching interests until I have a deep understanding of the concept. This curiousity has led me to work with various frameworks and technologies and the entreprenuership has led me to work with the most talented minds in the space and learn many things about tech, finance, and business.`,

      extraCompenent: (
        <>
          <Seperator />
          <CommentedHeader content="Recent Works" />
          <div className="flex flex-col text-center space-y-[1.3ch]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 p-6">
              {works.getAllPreviews(Set(['Completed'])).slice(0, 3)}
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
      <Stack
        direction={'row'}
        paddingX={'3ch'}
        fontFamily="Menlo"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div className="text-white flex flex-col space-y-[0.4ch]">
          <div>
            <p className="font-bold text-[3.4ch]">Rux</p>
            <p className="opacity-70 -mt-[1ch] text-[1.3ch]">ENS: rux.eth</p>
          </div>

          <p>Full-Stack Software Engineer</p>
        </div>
      </Stack>
      {sections.map(s => (
        <>
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
          <>{s.extraCompenent ?? <></>}</>
        </>
      ))}
    </div>
  )
}
export default TLDR
