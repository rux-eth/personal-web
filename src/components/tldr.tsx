import { CommentedContent, CommentedHeader } from '@src/components/commented'
import Seperator from '@src/components/seperator'
import { compileTags, works } from '@src/data/works'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
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
      header: 'whoami',
      content: `Maxwell Rux — Rux professionally, Max to friends. (There are too many Maxes.) I build systems that can't afford to be wrong: trading infrastructure, ML pipelines, and AI agents with write access to real things. My software doesn't trust itself — the optimizers check their own math, the agents can't act without proof, and the backtests are built to refuse to flatter me.`
    },
    {
      header: 'evidence',
      content: 'Adjectives are cheap, so here are specifics instead:',
      highlights: {
        'On the record': [
          'A 23-crate Rust research monorepo for quantitative trading; its execution core is public, with KKT-condition probes that verify the optimizer against closed-form references instead of trusting the solver',
          'A production agent runtime where invalid graph wiring fails at compile time, orders are idempotent by construction, and every event lands in an append-only log — 994 of the 2,000+ tests across my public systems live here',
          'An AI assistant with write access to my actual calendar and tasks — untrusted content is quarantined, destructive actions are verified against fresh reads and approval-gated, and its memory is one git revert from undone',
          'An ML workbench where every trial carries full reproducibility provenance — config hashes, data hashes, seeds, environment — and models are promoted through a gated registry, never by hand'
        ]
      },
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
      header: 'now',
      content: `Finishing a computer science and mathematics degree while building the trading platform in the open. Off the clock: two motorcycles, old country, and more philosophy than is strictly useful. If any of this reads like your kind of engineering — or your kind of conversation — I'm easy to reach.`,
      extraCompenent: (
        <Link className="white-comp text-[2.2ch]" href={'/contact'}>
          Get In Touch
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

          <p>Software Engineer — Rust · ML · Agents</p>
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
