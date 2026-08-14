import type {
  LanguageTag,
  Role,
  StackTag,
  Tag,
  WorkStatus
} from '@src/components/category'
import blormmyImage from '@src/images/thumbnails/blormmy-image.png'
import defaultThumb from '@src/images/thumbnails/default.png'
import hospitalImage from '@src/images/thumbnails/hospital-in-a-box.png'
import irisImage from '@src/images/thumbnails/iris.png'
import maestroImage from '@src/images/thumbnails/maestro.png'
import paystandImage from '@src/images/thumbnails/paystand-image.png'
import ppEditorImage from '@src/images/thumbnails/pp-editor.png'
import rumpyExecutionImage from '@src/images/thumbnails/rumpy-execution.png'
import ruxMlImage from '@src/images/thumbnails/rux-ml.png'
import vidToTextImage from '@src/images/thumbnails/vid-to-text.png'
import zerepyImage from '@src/images/thumbnails/zerepy-image.png'
import type { StaticImageData } from 'next/image'

// Exported so consumers can branch on the placeholder (work-detail page).
export const defaultThumbnail = defaultThumb

export interface WorkInfo {
  id: string
  title: string
  description: string
  thumbnail: StaticImageData
  status: WorkStatus
  role: Role
  languages: readonly LanguageTag[]
  stack: readonly StackTag[]
  repo?: string
  website?: string
  article?: string
  trello?: string
}

export const works: readonly WorkInfo[] = [
  {
    id: 'rumpy-execution',
    title: 'Rumpy Execution',
    description:
      'The public execution layer of my quantitative trading research platform: a cost-aware convex portfolio optimizer (second-order cone program with a market-impact cost model) and a holdings-based backtester, in Rust. Optimality is independently verified rather than trusted: KKT-condition probes against closed-form references, dimensional-analysis checks, and byte-level cross-platform float determinism. 177 tests.',
    thumbnail: rumpyExecutionImage,
    status: 'Completed',
    role: 'Back-End',
    languages: ['rust'],
    stack: [],
    repo: 'https://github.com/rux-eth/rumpy-execution'
  },
  {
    id: 'casus',
    title: 'Casus.fyi',
    description:
      "AI exam-prep platform that generates board-style practice questions from students' uploaded course material; reached 100+ users through shareable question sets. Schema-constrained LLM pipeline with streaming and embedding-based dedup, passwordless magic-link auth with fail-closed authorization, Redis rate limiting, Sentry/PostHog observability, and 7-workflow CI/CD with staged deploys.",
    thumbnail: defaultThumb,
    status: 'Completed',
    role: 'Full-Stack',
    languages: ['typescript'],
    stack: ['next', 'postgres', 'drizzle', 'redis', 'tailwind'],
    website: 'https://casus.fyi'
  },
  {
    id: 'iris',
    title: 'Iris',
    description:
      'Self-hosted AI assistant that runs my calendar, tasks, and daily planning over Telegram. A TypeScript MCP tool server with a deterministic planner and a security envelope: prompt-injection quarantine, approval-gated writes, git-backed memory. A model-eval harness replaying its own captured traffic drove a default-model switch that cut per-turn cost by roughly two-thirds. 294 tests.',
    thumbnail: irisImage,
    status: 'Completed',
    role: 'Back-End',
    languages: ['typescript'],
    stack: ['mcp', 'docker', 'node'],
    repo: 'https://github.com/rux-eth/iris'
  },
  {
    id: 'maestro',
    title: 'Maestro',
    description:
      'Production runtime for a DAG of trading agents (NestJS): compile-time-typed graph wiring where invalid connections fail the build, staleness gates and circuit breakers, idempotent order submission, and an append-only event log that feeds the research loop. Hexagonal architecture with CI-enforced boundaries; validated on testnet. 994 tests.',
    thumbnail: maestroImage,
    status: 'Completed',
    role: 'Back-End',
    languages: ['typescript'],
    stack: ['nestjs', 'postgres', 'docker'],
    repo: 'https://github.com/rux-eth/maestro'
  },
  {
    id: 'rux-ml',
    title: 'Rux-ML',
    description:
      'Config-driven ML workbench for gradient-boosted models (XGBoost, LightGBM, CatBoost): Optuna hyperparameter search with purged, time-aware cross-validation for leakage control, full per-trial reproducibility provenance (config hashes, data hashes, seeds, environment), and a gated model registry with atomic champion promotion. 407 tests.',
    thumbnail: ruxMlImage,
    status: 'Completed',
    role: 'Back-End',
    languages: ['python'],
    stack: ['xgboost', 'optuna'],
    repo: 'https://github.com/rux-eth/rux-ml'
  },
  {
    id: 'pp-editor',
    title: 'PP-Editor',
    description:
      "AI-driven PowerPoint editor built on a hard constraint: anything the AI doesn't touch passes through untouched. Decks live as their raw OOXML tree with a JSON editing view projected on top; edits splice back with hash-verified passthrough regions and Microsoft's OpenXML SDK as the validation gate. The repo includes an end-to-end tour with before/after renders.",
    thumbnail: ppEditorImage,
    status: 'Completed',
    role: 'Back-End',
    languages: ['python', 'csharp'],
    stack: ['dotnet'],
    repo: 'https://github.com/rux-eth/pp-editor',
    article: 'https://github.com/rux-eth/pp-editor/blob/main/examples/tour.md'
  },
  {
    id: 'vid-to-text',
    title: 'Vid-To-Text',
    description:
      'Turns video into a timestamped speech/visual/sound timeline using local models (Whisper on CPU, Qwen3-VL via Ollama on GPU), with ffmpeg chunking, transcript-aware vision prompting, and crash-resumable jobs. A Rust client/server pair; nothing leaves my machines except an optional formatting step.',
    thumbnail: vidToTextImage,
    status: 'Completed',
    role: 'Back-End',
    languages: ['rust'],
    stack: ['ollama', 'ffmpeg', 'axum'],
    repo: 'https://github.com/rux-eth/vid-to-text'
  },
  {
    id: 'hospital-in-a-box',
    title: 'Hospital In A Box',
    description:
      'Simulates a very common hospital integration task: ingest HL7 v2 messages (e.g., ADT admit/discharge/transfer and ORU lab results), transform them into FHIR resources (Patient, Encounter, Observation), store them, and show a simple web UI timeline (“Patient admitted → lab results posted → discharged”).',
    thumbnail: hospitalImage,
    status: 'Completed',
    role: 'Full-Stack',
    languages: ['java', 'typescript', 'javascript'],
    stack: ['next', 'springboot', 'postgres'],
    repo: 'https://github.com/rux-eth/hospital-in-a-box'
  },
  {
    id: 'zerepy',
    title: 'ZerePy',
    description:
      'ZerePy is an open-source framework for AI agents written in Python. I collaborated with several other talented engineers to build this framework during my time at Blorm. I was responsible for platform integrations as well as refactoring the codebase to be more efficient and enforce strict typing to reduce bugs.',
    thumbnail: zerepyImage,
    status: 'Completed',
    role: 'Back-End',
    languages: ['python'],
    stack: [],
    repo: 'https://github.com/blorm-network/ZerePy',
    website: 'https://www.zerepy.org/'
  },
  {
    id: 'blormmy',
    title: 'Blormmy',
    description:
      'Blormmy is an AI-powered chat assistant that performs actions on behalf of users. I led backend development, building the service from scratch on a hexagonal/vertical-slice architecture (NestJS/PostgreSQL): per-user agent routing, persistent action history, secure APIs, automated deployment of agent instances to isolated compute, and a plugin layer that processes agent commands from platforms like X and Discord.',
    thumbnail: blormmyImage,
    status: 'Completed',
    role: 'Back-End',
    languages: ['typescript'],
    stack: ['nestjs', 'postgres']
  },
  {
    id: 'paystand',
    title: 'Paystand',
    description:
      'Involved with numerous projects across ~2 years at Paystand. I designed a zero-fee, instant-transaction payment system for large cross-border B2B payments (hexagonal architecture, plug-and-play providers), working directly with the VP of Engineering on architecture, CI/CD, and launch. I also led a small team building secure multi-approval enterprise funding flows, and built and operated a service anchoring transaction state for auditability. The lessons and skills I learned there have been priceless.',
    thumbnail: paystandImage,
    status: 'Completed',
    role: 'Full-Stack',
    languages: ['typescript', 'rust', 'javascript'],
    stack: ['next', 'hardhat', 'foundry', 'postgres', 'ethers']
  },
  {
    id: 'rarity-ranker',
    title: 'Rarity Ranker',
    description:
      'An NLP + Elo-rating system built during my time at Treasure, which generated tens of millions of ranked game items with tuned rarity distributions. Written in Rust with heavy testing.',
    thumbnail: defaultThumb,
    status: 'Completed',
    role: 'Back-End',
    languages: ['rust'],
    stack: [],
    repo: 'https://github.com/rux-eth/rarity-ranker'
  },
  {
    id: 'club-cards',
    title: 'Club Cards',
    description:
      'An expandable digital card collection. I wrote the back-end: the protocol contract and the API that handles claims. Transaction costs were a major constraint during development, so efficiency was the priority: claim authorization is handled off-chain and signatures are verified on-chain, with bit-level optimization to cut storage and transaction costs.',
    thumbnail: defaultThumb,
    status: 'Completed',
    role: 'Back-End',
    languages: ['typescript', 'solidity'],
    stack: ['hardhat', 'ethers', 'express', 'mongodb'],
    repo: 'https://github.com/rux-eth/clubcards-backend',
    website: 'https://www.clubcards.cc/'
  }
]

export const getWork = (id: string): WorkInfo | undefined =>
  works.find(work => work.id === id)

export const compileTags = (item: WorkInfo): Set<Tag> => {
  const tags: Tag[] = [item.status, item.role, ...item.languages, ...item.stack]
  if (item.website) {
    tags.push('website')
  }
  if (item.article) {
    tags.push('article')
  }
  if (item.trello) {
    tags.push('trello')
  }
  return new Set(tags)
}

export type TagCounts = Record<
  'Status' | 'Stack' | 'Language' | 'Other',
  Partial<Record<Tag, number>>
>

export const tagCounts = (list: readonly WorkInfo[]): TagCounts => {
  // Insertion-ordered plain objects reproduce the former immutable-Map
  // dropdown ordering exactly (category order + per-category tag order).
  const temp: TagCounts = {
    Status: {},
    Stack: {},
    Language: {},
    Other: {}
  }
  const bump = (cat: keyof TagCounts, key: Tag) => {
    temp[cat][key] = (temp[cat][key] ?? 0) + 1
  }
  list.forEach(elem => {
    bump('Status', elem.status)
    elem.stack.forEach(s => {
      bump('Stack', s)
    })
    elem.languages.forEach(l => {
      bump('Language', l)
    })
    bump('Other', elem.role)
    if (elem.website) bump('Other', 'website')
    if (elem.article) bump('Other', 'article')
    if (elem.trello) bump('Other', 'trello')
  })
  return temp
}
