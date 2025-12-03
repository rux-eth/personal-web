// src/components/gasCutSprintPage.tsx
import React from 'react'
import { CommentedContent } from '@src/components/commented'
import Seperator from '@src/components/seperator'
import {
  dynamicFont,
  dynamicFontNum
} from '@src/utils/hooks/getCurrentBreakpoint'
import Link from './link'

type Section = {
  header: string
  content: string
  component?: JSX.Element
  defaultOpen?: boolean
}

const sections: Section[] = [
  {
    header: 'Who this is for',
    content: [
      'Mid-tail DeFi protocols on Ethereum or major L2s (Arbitrum, Optimism, Base, etc.) that:',
      '',
      '- Have active mainnet contracts and meaningful usage.',
      '- Run flows like `deposit`, `withdraw`, `borrow`, `liquidate`, `swap`, `stake`, `claim`, etc.',
      '- Care about gas because it impacts user experience, incentives, and net yields.',
      '',
      'Think: Silo-like lending, Aura-style staking/incentives, ultrayield vaults, and Nucleus-type structured yield / derivatives – not just blue-chip giants like Uniswap.'
    ].join('\n')
  },
  {
    header: 'The problem',
    content: [
      'Most teams ship fast and promise to "optimize later." In practice this often means:',
      '',
      '- Core flows end up much more expensive than they need to be.',
      '- Users or integrators eat extra gas, hurting UX and retention.',
      '- Protocols pay higher incentives to compensate for gas friction.',
      '- Every new deploy gets riskier as the codebase grows.',
      '',
      'There’s usually low-hanging fruit in a few hot paths that, if fixed, have an outsized impact on cost and UX.'
    ].join('\n')
  },
  {
    header: 'What you get',
    content: [
      'In one 7-Day Gas Cut Sprint, I:',
      '',
      '- Review your on-chain analytics (and any internal dashboards you can share) to identify the 2–4 key user flows where gas reductions will create the most value (most frequently used or most expensive in aggregate).',
      '- Profile the relevant contracts and focus on those flows (each usually one public/external function like `swap`, `deposit`, `borrow`, `liquidate`, `stake`, `claim`, etc.).',
      '- Apply safe Solidity-level optimizations that do not change your core protocol logic or risk model.',
      '- Re-run tests and gas reports to quantify improvements.',
      '',
      'You receive:',
      '- A before/after gas report for each targeted flow.',
      '- Estimated $ savings at recent on-chain usage levels.',
      '- A clean PR or patch set with annotated changes.',
      '- A 30-minute walkthrough call to connect the technical work back to protocol-level impact.'
    ].join('\n')
  },
  {
    header: 'How the 7 days work',
    content: [
      'Day 1 – Baseline & target selection',
      '- Set up your repo in my gas profiling toolkit.',
      '- Run baseline gas reports on candidate contracts.',
      '- Agree on 2–4 key flows to target based on gas + usage analytics.',
      '',
      'Days 2–5 – Optimization',
      '- Systematically apply low-risk, high-yield optimizations to the chosen flows and related internals.',
      '- Keep behavior intact and ensure your tests still pass.',
      '- Share interim notes/screenshots so you’re never in the dark.',
      '',
      'Days 6–7 – Reporting & handoff',
      '- Finalize the before/after gas report and estimated $ impact.',
      '- Open PR(s) or provide patches with clear comments.',
      '- 30-minute call with your team to walk through changes and answer questions.'
    ].join('\n')
  },
  {
    header: 'Pricing & guarantee',
    content: [
      'Intro price: $1,000 for a 7-Day Gas Cut Sprint',
      'Intro cap: First 3 teams at this rate as part of an initial rollout.',
      '',
      'Scope per sprint:',
      '- 1–3 contracts, depending on complexity.',
      '- 2–4 high-impact user flows within those contracts.',
      '',
      'Guarantee:',
      'If I can’t demonstrate at least 20% gas reduction on at least one of the targeted key flows, you only pay 50% of the sprint fee.',
      '',
      'Payment terms:',
      '- 50% upfront to reserve the 7-day window.',
      '- 50% on delivery of the report and PR/patches.',
      '- Payment in USDC/USDT on Ethereum or major L2s.'
    ].join('\n')
  },
  {
    header: 'Who I am',
    content: [
      'I’m Max Rux, a USA-based systems-focused engineer working across:',

      '- Rust + Solidity + quantitative modeling',
      '- Payments-grade blockchain architecture for financial use cases',
      '- AI agents for decentralized finance, trading, and developer tooling',
      '',
      'I care about business impact, not just code: I choose flows based on on-chain analytics and tie optimizations back to UX and economics. I care about bringing the most value to your business through my technical skillset.'
    ].join('\n'),
    component: (
      <div className="mt-[1ch]">
        {/* link to tldr. id=tldr, auto scroll to it */}
        <Link className="white-comp text-[2.2ch]" href={'/#tldr'}>
          More About Me
        </Link>
      </div>
    )
  },
  {
    header: 'Next step',
    content: [
      'If you’re running a DeFi protocol and suspect some of your hot paths are more expensive than they need to be, let’s chat!',
      'Please reach out to me through any of the following channels:',
      '- Email (most reachable): ruxdoteth@gmail.com',
      '- DM me on X/Discord/Telegram',
      '- book a 15-minute free intro call',
      '',
      'On the call, we’ll:',
      '1. Look at analytics.',
      '2. Go over your core flows.',
      '3. Discuss which flows would be beneficial to optimize.',
      '4. See if we’re a good fit to work together.'
    ].join('\n'),
    component: (
      <div className="mt-[1ch]">
        <Link className="white-comp text-[2.2ch]" href={'/contact'}>
          Contact Me
        </Link>
      </div>
    )
  }
]

// Helper: inset divider that doesn’t touch borders
function InsetDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-[1.2ch] my-[0.8ch] h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent"
    />
  )
}

function CollapsibleSection({
  header,
  content,
  component,
  defaultOpen
}: Section) {
  return (
    <details
      className="
        group mt-[1.5ch]
        rounded-xl border border-gray-700/50
        bg-gray-900/30 shadow-sm
        transition-colors
      "
      open={defaultOpen}
    >
      <summary
        className="
          flex items-center justify-between gap-3
          cursor-pointer select-none list-none
          px-4 py-3 rounded-xl
          hover:bg-white/5
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-white/15
          [&::-webkit-details-marker]:hidden
        "
      >
        <span className="font-mono text-[1.3ch] ">
          {/* comment-style inline header */}
          {/* /* {header} */}
          {`${header}`}
        </span>

        {/* Chevron */}
        <svg
          className="h-4 w-4 text-gray-400 transition-transform duration-200 group-open:rotate-180"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </summary>

      {/* Expanded area */}
      <div className="rounded-b-xl px-4 pb-4 pt-1">
        <InsetDivider />
        <div
          className="
            rounded-lg
            bg-black/10
            px-3 py-2
          "
        >
          <CommentedContent
            header={header}
            content={content}
            fontSize={dynamicFont(50)}
          />
        </div>
        {/* Optional extra component. centered */}
        {component && <div className=" flex justify-center">{component}</div>}
      </div>
    </details>
  )
}

const GasCutSprintPage: React.FC = () => {
  const fs = dynamicFontNum(70)

  return (
    <div
      id="gas-cut-sprint"
      className="flex flex-col bg-inherit text-left text-primary-main space-y-[2%] pb-[3ch]"
      style={{ fontSize: fs }}
    >
      {/* Hero */}
      <CommentedContent
        header="7-Day Gas Cut Sprint for DeFi Protocols"
        content="Focus on changes that move business metrics: UX, net yield, and
          protocol economics. Reduce gas costs on your most‑used DeFi flows by 20–40% in 7 days"
      />

      <Seperator />

      {/* Collapsible sections */}
      <div className="mx-[3ch]">
        {sections.map(s => (
          <CollapsibleSection
            key={s.header}
            header={s.header}
            content={s.content}
            defaultOpen={s.defaultOpen}
            component={s.component}
          />
        ))}

        {/* Bottom CTAs for convenience */}
      </div>
    </div>
  )
}

export default GasCutSprintPage
