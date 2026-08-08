# PR-002: Tooling hygiene

**Landed-in:** master via GitHub PR #19, 2026-08-08 (pre-versioning; v0.0 roadmap)

## Before Implementation (NON-NEGOTIABLE)

This PR MUST NOT be implemented until `PROCEDURE-pr-research.md` has been completed in full and its output appended to the `## Research findings` section below.

**Tier-1**: research-backed at design time; Phase 1 (State Assessment) required.

## Research findings

### State Assessment (2026-08-07)

**Current state**:
- Formatting split measured: 23 source files end statements with semicolons, 18 without — the repo genuinely is half-and-half.
- `js-sha3`: zero imports (re-confirmed). `chance` not imported (`@types/chance` orphaned). `dotenv` used only at `next.config.js:1`; Next loads `.env` natively. `NEXT_ENV` consumed only by the dead, never-imported `url.tsx`.
- Since PR drafting, **PR-001 landed on its branch**: `@playwright/test` devDep, `playwright.config.ts`, `tests/visual/*`, `test:visual` script, `.gitignore` entries. Biome's config must include these paths; the repo-wide reformat will touch them (behavior-neutral).
- `tsc --noEmit` already passes with Playwright types on TS 4.7 (validated during PR-001) — the type-check verification criterion has a live baseline.
- Prior-art audit: config files have near-zero history (`trim chance`, `reinitialize`) — no hard-won patterns to carry.

**Assumptions at PR draft time**: dead deps removable; dotenv redundant; env injection unused. All re-confirmed above.

**Stale assumptions**: none.

**New constraints**:
- Sequencing: PR-001 is open as GitHub PR #18 (not yet merged). PR-002's branch must be cut from `pr/001-visual-baseline` (or land after its merge) — the Baseline Before Change constraint requires the harness present in PR-002's tree so its diff-clean criterion is runnable.
- The repo-wide reformat touches every file → all later PRs rebase across it; roadmap ordering (PR-002 before PR-003+) already accounts for this.

**Downstream contracts** (from `grep -rl "PR-002" prs/ docs/`):
- **PR-003** → "PR-002 recommended first for formatting stability" (soft ordering contract). Satisfiable: yes.
- **PR-007** → expects `moduleResolution: "bundler"` + target modernization to be **deferred** — PR-002 must NOT modernize these (stays `node` on TS 4.7/Next 12). Satisfiable: yes, explicit in scope.
- No other PR consumes PR-002 outputs beyond the universal visual-diff-clean contract.

**Path-tier checkpoint**: header Tier-1; ROADMAP concurs. **Phase 1 surfaces ONE narrow research need** (from RESEARCH-BACKLOG): whether Biome's formatter can express the full `src/prettier.config.js` style (`semi: false`, `singleQuote`, `arrowParens: "avoid"`, `trailingComma: "none"`, LF, 2-space) — load-bearing because an inexpressible option means visible formatting divergence from the declared style. → Phases 2–5 run on the light path (single Tier-A question).

### Research Questions

**Must-answer:**
1. Can Biome's formatter express every option in `src/prettier.config.js` — `semi: false`, `singleQuote: true`, `arrowParens: "avoid"`, `trailingComma: "none"`, `endOfLine: "lf"`, `tabWidth: 2`? — success criteria: the exact Biome option name + value for each, from Biome's official formatter docs; any inexpressible option flagged with fallback (keep Prettier for formatting, Biome for linting).

**Dependencies:** single question.

**Research plan (depth tiers):** Q1 — **Tier A** (one probe of biomejs.dev formatter docs); rationale: primary-source lookup, no controversy possible.

**Explicitly excluded:** Biome lint-rule selection (implementation detail; defaults + recommended rules), editor integration.

### Findings (2026-08-07, Tier-A, primary source: biomejs.dev/reference/configuration)

**Q1: Biome expressibility of the prettier style** — every option maps 1:1:

| prettier (src/prettier.config.js) | Biome |
|---|---|
| `semi: false` | `javascript.formatter.semicolons: "asNeeded"` |
| `singleQuote: true` | `javascript.formatter.quoteStyle: "single"` |
| `arrowParens: "avoid"` | `javascript.formatter.arrowParentheses: "asNeeded"` |
| `trailingComma: "none"` | `javascript.formatter.trailingCommas: "none"` |
| `endOfLine: "lf"` | `formatter.lineEnding: "lf"` |
| `tabWidth: 2` | `formatter.indentWidth: 2` + `indentStyle: "space"` |

*Disconfirming evidence sought:* looked for options without equivalents — none among the six used. *Recommendation:* proceed with Biome as sole formatter. **Status: proven** (official configuration reference). No Prettier fallback needed.

**Group D**: single-source schema lookup against the canonical documenter itself (biomejs.dev configuration reference) — Schema-Integrity satisfied by construction; no combinations to synthesis-check (each option is independent).

### Synthesis

**Outcome**: Confirm — the one open question resolved in favor of the existing spec; the option mapping above is now locked into scope. No changes to ARCHITECTURE/CONSTRAINTS; no prerequisite PRs.

### Gate Check

- Premise still valid: ✓
- No prerequisite PRs surfaced: ✓ (PR-001 merged — sequencing constraint satisfied)
- User approved updated spec: ✓ (2026-08-07)
- Implementation cleared

---

## Scope

- Add Biome at the repo root, configured to the style in `src/prettier.config.js` (single quotes, no semicolons, avoid arrow parens, LF, 2-space); delete `src/prettier.config.js`.
- Format the entire repo once with Biome (mechanical, behavior-neutral).
- tsconfig: remove the 6 nonexistent `include` entries (`reducers`, `hoc/wrapper`, `grid.js`, `stuff.js` ×2, `scripts`, `api/index.jsx`), modernize (`moduleResolution` appropriate to current stack — stays `node` until PR-007, revisited there), keep `strict`.
- next.config: remove `MONGO_URL`/`MASTER_ADMIN`/`NEXT_ENV` env injection and the `dotenv` require + dependency (Next loads `.env` natively). Note: `NEXT_ENV` is referenced only by the dead `url.tsx` (never imported).
- package.json: normalize scripts (`build` = `next build`; analyzer via env var only; `start` no longer rebuilds); remove unused dev deps `@types/chance` and unused runtime dep `js-sha3`.
- Add `lint` / `format` scripts.

## Dependencies

PR-001.

## Architecture section implemented

`docs/ARCHITECTURE.md` § Stack (tooling), § Utilities (dotenv/js-sha3 removal).

## Verification criteria

- [x] `yarn build` succeeds; `yarn test:visual` diffs clean vs baseline — 190/190 across three consecutive fresh-build runs (2026-08-07)
- [x] `biome check` passes repo-wide
- [x] No references to removed env vars remain outside dead files scheduled for PR-010 (`NEXT_ENV` only in never-imported `url.tsx`)
- [x] Type-check (`tsc --noEmit`) passes

## Implementation notes

- Biome 2.5.7, config at `biome.jsonc` (comments needed for the per-rule off-list). Formatter maps the prettier style 1:1 per the locked research. Linter: recommended preset with every currently-firing rule disabled and annotated with the PR that re-enables it (One PR, One Thing — no app-code lint fixes here). `biome check --write` applied import organization; note that import reordering permutes the seeded-random consumption order, which required regenerating rain-affected baselines (documented in fixtures.ts and PR-001).
- Deprecation fixed during implementation: `linter.rules.recommended` → `preset` (Biome 2.5).
- The PR-001 baseline amendment (services-era coverage + determinism hardening) rides in this branch as separate commits, cross-documented in both PR files.

## Research backing

D8: Next 16 removed `next lint`, officially names Biome or ESLint [proven]; Biome v2 Prettier-compatible formatting [convention]. See DESIGN-log D8.

## Notes

Pure-formatting commit should be separated from functional config changes within the PR for reviewability (two commits, one PR).
