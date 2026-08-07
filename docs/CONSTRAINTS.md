# Constraints

Hard rules that must never be violated. These are enforced by Claude at all times.

---

## Structural Constraints

These apply to every project built with this template.

### No Phantom Implementations (NON-NEGOTIABLE)

A step is NOT complete if:
- A function exists but returns a default, stub, or placeholder value
- A module is declared but never called from the main flow
- Tests only verify something exists, not that it works correctly

Every PR must include:
1. A test that exercises the **actual behavior**
2. Explicit listing of any stubs or TODOs in the PR description
3. Proof of end-to-end data flow where applicable

### Documentation Accuracy (NON-NEGOTIABLE)

Every code change must include corresponding doc updates in the same commit. Before writing docs, check the actual diff — base doc updates on what changed, not memory. Docs must never describe behavior that doesn't exist in code.

### One PR, One Thing

Each PR is a single, reviewable change. No "while I'm here I'll also add..." — that's scope creep. Each PR references the specific section of the architecture it implements.

### Config Over Hardcoding

All configurable values come from config files. Zero hardcoded parameters for behavior that might change. If a value could reasonably vary between environments or over time, it belongs in config.

### Research-Backed Decisions (NON-NEGOTIABLE)

Every architectural and significant design decision must be backed by research from **reputable sources**. "I think this is right" is not sufficient.

**Reputable sources:**
- Production system documentation
- Official framework source and docs
- Published post-mortems and engineering blog posts from serious engineering teams
- Battle-tested open-source code with meaningful adoption

**Not sufficient:**
- LLM intuition
- Marketing pages
- Personal blog posts without engineering weight
- StackOverflow answers without corroborating evidence

**Process:** decisions without research backing must be explicitly flagged as unresearched in the relevant PR or design doc, and researched before implementation begins. `docs/0.0/DESIGN-log.md` tracks which decisions have research and which don't. `PROCEDURE-design-planning.md` (vibe-rails) integrates research rounds into Phase 2 (Decisions).

### PR Research Procedure Required (NON-NEGOTIABLE)

No PR is implemented until `PROCEDURE-pr-research.md` (vibe-rails) has been followed and its findings are documented in the PR file's `## Research findings` section.

**Applies to all PRs — including PRs that were research-backed at design time.** State drifts between design and implementation. The procedure's Phase 1 (State Assessment) catches drift before implementation begins.

**Enforcement:**
- Every PR file starts from `prs/PR-TEMPLATE.md`, which includes a `## Before Implementation (NON-NEGOTIABLE)` section requiring this procedure
- Every PR file has a `## Research findings` section that must be populated before implementation
- PRs without completed research findings are rejected
- Research findings include a state-assessment date; staleness threshold for this project: **30 days**

### Per-Phase Approval Gate (NON-NEGOTIABLE)

In any multi-phase procedure, Claude does **not** advance to the next phase without explicit user approval.

- After completing a phase, Claude presents the phase output and explicitly requests permission to enter the next phase.
- "Auto-flowing" through multiple phases in a single response without user interjection is a hard violation.
- Every phase response ends with "Phase X complete. Awaiting approval to enter Phase X+1." (or equivalent.)
- A response covers at most one phase, then halts.

---

## Domain Constraints

Project-specific non-negotiables for the personal-web refactor (design session 2026-08-07).

### Pixel-Identical Invariant (NON-NEGOTIABLE)

The refactor must not change the rendered site: visuals and functionality are identical before and after. Enforced by the Playwright visual-regression baseline (PR-001) captured from the **pre-refactor** build. Every PR diffs clean against that baseline.

**Sole exception (D9)**: bug fixes. Each fix is a deliberate, reviewed, per-PR documented deviation from the baseline. The known-bug list at design time is recorded in `docs/0.0/DESIGN-log.md` under D9.

### No New Content Systems

Works content lives as typed code in `src/data/works.ts` (D7). Do not introduce a CMS, database, or runtime content fetching. If long-form content is ever wanted, the documented escalation path is MDX files — a design session is required first.

### Dependency Budget

Runtime dependencies only earn their place: any new runtime dependency requires an explicit design decision. The refactor's direction is fewer dependencies, not different ones.

### LOC Direction

Fewer lines while maintaining identical visuals/functionality is a stated success metric. Prefer deletion over abstraction.

### Baseline Before Change

No refactor PR may land before PR-001's visual baseline exists. The baseline must be captured from the current (pre-refactor) build.
