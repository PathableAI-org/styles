# Code review

This document describes the code review: a subagent that reviews the local
commits of a delivery issue, before anything is pushed, for correctness
reasoning, the design-system's owning rules, and maintainability, with a clean
context. It runs on `opus` at `high` effort. It owns the reviewer's scope, its
findings, the review loop and its escalation.
[The verification harness](verification-harness.md) owns the verification loop.
[Git workflow](git-workflow.md) owns the review that a person applies. The
`code-reviewer` skill supplies the procedure.

The verifier proves what the Storybooks and packed packages do. Lint,
stylelint, the token lint, typecheck and the Storybook test-runner check what
tools can check. The reviewer covers what neither can: whether the code's
reasoning holds, whether it follows the ownership rules no tool enforces, and
whether its stories and tests would notice a regression. Its findings are
input to the lead session and then to the human review, not approval.

A separate scope review, owned by
[`.claude/agents/scope-reviewer.md`](../../.claude/agents/scope-reviewer.md),
checks that the diff delivers the accepted scope of the delivery issue, no more
and no less. The code reviewer does not judge scope except as `contract-drift`.

## When a reviewer runs

The reviewer runs in every review round of every High, Standard and Light
delivery issue, as [process by tier](git-workflow.md#process-by-tier) defines
them, on the committed local `HEAD`. Nothing has been pushed.

The reviewer works independently of Copilot's pull request review. It does not
read Copilot's comments as input or answer them, and Copilot does not read its
findings.

## Inputs

The reviewer starts with a clean context. It reads only:

- the request: `base` and `head` (40-character SHAs of local commits), `round`,
  `previous` (its own earlier findings with the lead session's answer to each,
  or `none`) and `since` (the 40-character SHA it reviewed last round, or
  `none`)
- the diff from `base` to `head`, and the files it touches at `head`; on a
  repeat round, the commits since `since` instead (see the [range](#reply))
- the delivery issue, when the commits name one
- [AGENTS.md](../../AGENTS.md) and the owning
  documents for the code the diff changes, as the routing table names them:
  for example [`packages/styles/AGENTS.md`](../../packages/styles/AGENTS.md)
  and [`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md) for styles,
  [`STORY_AUTHORING.md`](../../packages/styles/STORY_AUTHORING.md) or
  [`STORYBOOK_STANDARD.md`](../../packages/react/STORYBOOK_STANDARD.md) for
  stories, and [Component testing](../testing/README.md) for tests

It never reads the lead session's transcript, worktree or uncommitted work. It
reviews the committed local commits only, from its own detached worktree of the
lead's clone or with `git show` and `git diff` on the SHAs.

## Scope

The reviewer owns what tools cannot check. The design-system lenses come from
the current owning documents routed by `AGENTS.md`.

| Category              | What it looks for                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `source-first`        | A wrapper exposing visual behaviour, a variant or a prop before the `packages/styles` class, token or pattern it maps to exists                                          |
| `wrapper-styling`     | Private CSS, inline styles or style objects in a wrapper that change visual semantics outside the `@pathableai/styles` contract                                          |
| `naming-parity`       | A React component whose name is not the CamelCase form of the styles component name without its `pathable` prefix                                                        |
| `token-usage`         | A raw color, size, spacing, radius or elevation value where a semantic token exists, or a Sass variable without its published custom property                            |
| `story-contract`      | A new or changed supported state without a deterministic named story, a Playground standing in for one, or a story with randomness, dates or invented props              |
| `accessibility`       | Keyboard, focus placement and restoration, accessible names, ARIA state, or a narrow-exception rule that hides a real violation                                          |
| `guidance-drift`      | A public API change the consumer agent guidance should describe but does not, or guidance that now contradicts the code                                                  |
| `ownership`           | Code in the wrong package or layer: framework code in `@pathableai/styles`, a styles concern defined in React, or a consumer asked to import `@pathableai/styles` itself |
| `correctness`         | Races, error and edge paths, state transitions, event-listener and timer cleanup, and assumptions the code does not check                                                |
| `duplication`         | A helper, token, constant or type that repeats one the package, or the package it wraps, already has                                                                     |
| `readability`         | Names that mislead, abstractions that do not fit the problem, and code a maintainer would misread                                                                        |
| `complexity`          | Indirection, configuration or generality the slice does not need                                                                                                         |
| `test-meaningfulness` | Play functions or tests that would still pass if the behaviour they name broke, judged by [Component testing](../testing/README.md)                                      |
| `contract-drift`      | Classes, props, exports or behaviour that differ from the delivery issue or current owning documentation without an approved correction                                  |

It does not repeat lint, stylelint, token-lint, typecheck or test-runner
findings, and does not re-verify claims; those belong to the checks and the
verifier. It does not review pre-existing code the slice did not change,
unless the slice makes an existing defect reachable. A pre-existing defect it
comes across anyway is filed as a bug issue under
[Defects found along the way](orchestration.md#defects-found-along-the-way),
not reported as a finding.

## Findings

Each finding has:

- `id`: `R-001`, numbered across rounds
- `severity`: `blocking` when it would let the slice merge with a defect, an
  ownership or accessibility violation, a story or test that cannot fail, or
  unapproved contract drift; otherwise `advisory`
- `category` from the table above
- `file` and `line` at the reviewed `head`
- `summary`: the defect in one sentence
- `failureScenario`: concrete inputs or state and the wrong outcome they
  produce
- `confidence`: `high` or `medium`; the reviewer drops anything less
- `verification`: how the reviewer confirmed the finding before reporting it

The reviewer verifies every candidate finding before reporting it, by reading
the code it depends on, tracing the path, or running a focused command, and
drops what it cannot confirm. A review reports at most ten findings. A finding
keeps its `R-nnn` ID across rounds until a review closes it as `fixed`,
`justified` or `withdrawn`.

## The review loop

### Request

The lead session sends the reviewer a request in every review round, on the
local head, with the fields under [Inputs](#inputs). A repeat request after a
fix names the new `head`, the reviewer's own previous findings with, for each,
the fixing commit or a written justification, and `since`.

### Reply

The reviewer replies to the lead session with its findings, the closures of its
previous findings and any escalation, and nothing else. It posts nothing on
GitHub and records nothing: the reply is the only output. The lead answers
every finding.

On a repeat round the reviewer closes a finding as `fixed` when the new code
removes the failure scenario, `justified` when it accepts the written
justification, and `withdrawn` when it finds its own finding was wrong. It
carries forward, with the same ID, any finding it still holds.

It runs the candidate search only on the commits since `since`:
`git log -p --no-merges <since>..<head> ^<base>`, plus the conflict resolution
of each merge commit in that range, `git show --remerge-diff <merge>`. The
branch may merge `<base>` in to stay current, and a plain two-dot diff would
sweep the base branch's changes into the review. It reads the surrounding code
at `head` as needed to trace each changed path, including the callers and
dependents of changed code. It does not re-sweep the parts of `<base>...<head>`
that are unchanged since `since`, because the previous round already reviewed
them.

It does a full review of `<base>...<head>` instead, and says why in the reply,
when the previous round's base differs from the request's base in a way that
changes the diff (a head that only merged the base branch in does not count),
when `since` is `none` or is not an ancestor of `head`, for example because
history was rewritten, or when the previous review reported ten findings (the
cap), because it may have dropped candidates in code the incremental search
would not revisit.

### Responses

The lead session answers every finding, advisory ones included, with a fix or
a written justification. It does not push while the latest review has an open
blocking finding. A blocking finding closed as `justified` goes in the pull
request's **Decisions for the reviewer** for the human reviewer.

### Escalation

There is no machine gate. The review is clean when it has no open blocking
finding and no unresolved escalation, and the lead pushes only then.

Escalate to a person, through the lead session, instead of continuing the loop
when:

- a finding belongs to the accepted delivery issue under the
  [corrections table](git-workflow.md#corrections)
- the reviewer does not accept a justification, and the lead session does not
  accept the finding
- a blocking finding is still open in round three

## Boundaries

The reviewer is read-only. It edits no branch, pull request or issue, and does
not fix the code or write patches. It names the defect, where it is and how it
fails. Its only GitHub write is a bug issue for an
[unrelated defect](orchestration.md#defects-found-along-the-way).

## Model choice

The reviewer runs on `opus` at `high` effort, a fixed setting that does not
step up. A clean context removes anchoring on the implementer's reasoning.
[Models and effort](orchestration.md#models-and-effort) sets the actual models.
