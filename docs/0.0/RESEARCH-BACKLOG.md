# Research Backlog — v0.0

Indexes each PR's research status per the Research-Backed Decisions constraint. Tier 1 = research-backed at design time (PR-research Phase 1 state assessment still required before implementation). Tier 2 = research-pending (full PROCEDURE-pr-research.md required).

| PR | Tier | Design-time backing | Outstanding research topics |
|----|------|--------------------|-----------------------------|
| PR-001 | 2 (light) | Playwright = convention choice (D8) | Playwright screenshot config for deterministic captures (fonts loaded, animations settled, breakpoint matrix); handling animated/random elements (rain uses Math.random per module load — needs seed or masking strategy) |
| PR-002 | 1 | Next 16 upgrade guide (Biome/ESLint), Biome v2 docs | Biome config mapping from src/prettier.config.js options |
| PR-003 | 1 | MUI usage inventory (audit, measured); behaviors enumerated in D2 | Drawer focus/Esc/scroll-lock parity checklist (flagged in D2) |
| PR-004 | 1 | Observer support floors [proven, cited in D4] | None expected |
| PR-005 | 1 | Local (D5, documented research-skip) | None expected |
| PR-006 | 1 | Local usage analysis (D7) | None expected |
| PR-007 | 1 | D1 sources (Next 12→13→16 guides, React 19 guide, codemod list); D3 sources (motion docs) | Verify mode="wait" rename + LazyMotion strict-mode behavior at implementation; Node ≥20.9 local + Vercel |
| PR-008 | 1 | Tailwind 4 upgrade guide [proven, cited in D2] | v4 upgrade-tool behavior with our custom breakpoints incl. `ha` raw media query |
| PR-009 | 2 (partial) | next/font since v13 [proven]; sizes measured | Font subsetting tooling + license-safe glyph ranges; image compression targets; sw.js stale-registration consideration for returning visitors; btc.png/download.jpg/eth-logo-black.png reference-check |
| PR-010 | 1 | Audit findings | /loading route removal is a URL-surface change — needs explicit user sign-off (flagged) |
