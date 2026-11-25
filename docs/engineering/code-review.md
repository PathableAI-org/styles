# Code review

This document describes the reviewer session: an agent that reviews each
pushed pull request for correctness reasoning, the design-system's owning
rules, and maintainability, with a clean context. It owns the
reviewer's scope, its findings and where they are stored, the review loop, and
the advisory pre-push self-review.
[The verification harness](verification-harness.md) owns the other sessions
and the verification loop. [Git workflow](git-workflow.md) owns the review that
a person applies. The `code-reviewer` skill supplies the procedure.

The verifier proves what the Storybooks and packed packages do. Lint,
stylelint, the token lint, typecheck and the Storybook test-runner check what
tools can check. The reviewer covers what neither can: whether the code's
reasoning holds, whether it follows the ownership rules no tool enforces, and
whether its stories and tests would notice a regression. For High work its
findings are input to the human review, not approval. For Standard and Light
work it is one of the two independent reviews that
[agent merge](git-workflow.md#agent-merge) requires in place of a person's
approval; the [visual review](visual-review.md) is the other.

## When a reviewer runs

The reviewer runs on every High, Standard and Light pull request, as
[process by tier](git-workflow.md#process-by-tier) defines them. Reviews use
slice ID `fix` and omit the feature directory. The
advisory [pre-push self-review](#pre-push-self-review) runs at every tier and
is not a code review subagent.

The reviewer works independently of Copilot's pull request review. It does not
read Copilot's comments as input or answer them, and Copilot does not read its
findings.

## Inputs

The reviewer starts with a clean context. It reads only:

- the request: branch, pushed SHA, base SHA, slice ID `fix`, pull request and
  round, plus for a repeat round the previous review ID and the implementation
  session's answer to each open finding
- the diff from the base SHA to the pushed SHA, and the files it touches at
  the pushed SHA
- the linked delivery issue and pull request body
- [AGENTS.md](../../AGENTS.md) and the owning
  documents for the code the diff changes, as the routing table names them:
  for example [`packages/styles/AGENTS.md`](../../packages/styles/AGENTS.md)
  and [`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md) for styles,
  [`STORY_AUTHORING.md`](../../packages/styles/STORY_AUTHORING.md) or
  [`STORYBOOK_STANDARD.md`](../../packages/react/STORYBOOK_STANDARD.md) for
  stories, and [Component testing](../testing/README.md) for tests

It never reads the lead session's transcript, worktree or
uncommitted work. It reviews pushed commits only, from its own detached
worktree or with `git show` and `git diff` on the SHAs.

## Scope

The reviewer owns what tools cannot check. The design-system lenses come from
the current owning documents routed by `AGENTS.md`; the general ones are the
same as in Pre-ETS.

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
| `contract-drift`      | Classes, props, exports or behaviour that differ from the delivery issue, pull request or current owning documentation without an approved correction                    |

It does not repeat lint, stylelint, token-lint, typecheck or test-runner
findings, and does not re-verify claims; those belong to the checks and the
verifier. It does not review pre-existing code the slice did not change,
unless the slice makes an existing defect reachable. A pre-existing defect it
comes across anyway is filed as a bug issue under
[Defects found along the way](orchestration.md#defects-found-along-the-way),
not reported as a finding.

## Findings

Each review is one JSON document that
[`scripts/review-findings/schema.mjs`](../../scripts/review-findings/schema.mjs)
validates. It names the reviewed SHA, the base SHA, the slice, the round, every
finding still open, the findings this round closes, and any escalations. Each
finding has:

- `severity`: `blocking` when it would let the slice merge with a defect, a
  ownership or accessibility violation, a story or test that cannot fail, or unapproved
  contract drift; otherwise `advisory`
- `category` from the table above
- `file` and `line` at the reviewed SHA
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

## Storage

Reviews are Git notes on the reviewed SHA in `refs/notes/review`, and
verification reports are Git notes in `refs/notes/verification`, through the
same Git, schema-check and sync modules. The note keeps every entry recorded on
that SHA in order, and the latest is the last one. The gate reads the local
notes, so it works with no network.

The reviewing subagents work in worktrees of the lead session's clone, so their
notes are local to it at once. An entry also reaches every other clone, such
as a person's or a later lead session's, as a comment on the pull request,
which is also where a person reads it. Never push or fetch the notes refs
themselves.

- **Publish.** `pnpm review:record` validates the review, appends it to the
  local note, then posts it as a comment on the open pull request whose head
  branch has the reviewed SHA at its tip, or on `--pr <n>`. The comment starts
  with a hidden marker naming the note kind, SHA and entry ID, then a markdown
  rendering generated from the entry, so a person reads it without the JSON.
  The JSON itself sits in a collapsed `<details>` block as the comment's last
  fenced `json` block, and only it is read back. If no pull request is found
  or posting fails, the entry stays recorded locally and the command exits 1
  and says why. `pnpm notes:publish review <sha> [--pr <n>]` posts it once the
  cause is fixed. A pull request never gets the same entry twice.
- **Sync.** `pnpm notes:sync [<pr>]` reads the pull request's comments through
  the REST API, validates each marked comment with the same schema, and
  appends the entries missing from the local notes, oldest first and once per
  entry ID. A marked comment that does not parse or validate, whose marker
  disagrees with its entry, or whose recorded inputs are not those of its
  commits is rejected with its reason, and the command exits 1. When this
  clone lacks an entry's commit, sync fetches that one commit by SHA from
  `origin`; if that fails, the comment is listed as unavailable and not
  written.
- **Read.** `pnpm review:show`, `pnpm verify:show` and `pnpm verify:gate` sync
  the checked-out branch's pull request first. Without a branch, an open pull
  request or GitHub, they print one line saying so and read the local notes.

Sync imports only comments written by the account `gh` is authenticated as
(`gh api user`), because every session posts as the person who runs it. Trust
is the same as for locally writable notes, and no stronger: any session or tool
holding that login can post an entry, and a repository maintainer can edit a
comment.

```sh
pnpm review:record review.json   # validate, append to the reviewed SHA's note, post it on the pull request
pnpm review:show <sha>           # sync, then print the latest review; exits 1 while a blocking finding or escalation is open
pnpm notes:sync [<pr>]           # import the pull request's report and review comments into the local notes
```

`review:record` adds the review's `inputs` itself: the code trees of the base
and reviewed SHAs. `review:record` and `review:show` take `--notes-ref <ref>`
to use another ref under `refs/notes/`, for trials; a review recorded in a
trial ref is not posted.

## The review loop

### Request

The lead session sends the reviewer a request when it sends the
verifier one: when a slice is pushed as a draft pull request. A repeat request
after a fix names the new SHA, the previous review ID, `previous sha: <40-character
SHA reviewed in the previous round, or none>`, and for each open finding either
the fixing commit or a written justification.

Both reviewers read the pull request body. When the lead session's answer
changes only the body and adds no commit, the lead runs both reviewers again on
the same SHA. With no commits since the previously reviewed SHA, each repeat
review checks only the open findings and the body against the code, which
keeps the run small.

### Report

The reviewer records the review with `pnpm review:record` and replies with a
pointer only: `refs/notes/review @ <sha> (review <id>)`, plus the counts of
blocking and advisory findings. The note is the record. Do not paste findings
into messages.

On a repeat round the reviewer takes the previously reviewed SHA from the
request's `previous sha` field. It closes a finding as `fixed` when the
new code removes the failure scenario, `justified` when it accepts the written
justification, and `withdrawn` when it finds its own finding was wrong. It
carries forward, with the same ID, any finding it still holds.

It runs the candidate search only on the pull request's own commits since the
previously reviewed SHA: `git log -p --no-merges <previous-sha>..<sha> ^<base>`,
plus the conflict resolution of each merge commit in that range,
`git show --remerge-diff <merge>`. The branch merges `<base>` in to stay
current, and a plain two-dot diff would sweep the base branch's changes into
the review. It reads the surrounding code at
the pushed SHA as needed to trace each changed path, including the callers and
dependents of changed code. It does not re-sweep the parts of `<base>..<sha>`
that are unchanged since the previously reviewed SHA, because the previous
round already reviewed them.

It does a full review of `<base>..<sha>` instead, and says why in the note,
when the previous review's base differs from the request's base in a way that
changes the pull request's own diff (a head that only merged the base branch in
does not count), or when `previous sha` is missing or is not an ancestor of the
new SHA, for example because history was rewritten.

### Responses

The lead session answers every finding, advisory ones included,
with a fix or a written justification. It does not mark a slice ready while
the latest review at the pushed tip has an open blocking finding. A blocking
finding closed as `justified` goes in the pull request's **Decisions for the
reviewer** for the human reviewer.

### Gate and escalation

A slice may be marked ready for review only when its latest review shows no
open blocking finding and no unresolved escalation. The review covers the
reviewed SHA, which may be older than the pushed tip only through
evidence-only commits as
[the verification gate](verification-harness.md#gate-and-escalation) defines
them. Any other change after the reviewed SHA needs a new review request.

`pnpm verify:gate` and the ready hook that runs it enforce this on
`{number}-{slug}-impl*` branches and on a High fix's single pull request.
[The merge gate](git-workflow.md#the-merge-gate) enforces it on every
agent-merged pull request, where a review also covers a head that only
merged `main` in without changing the pull request's own diff. They
fail with a `code review:` reason for an open blocking finding, an open
escalation, a review for another feature or slice (a fix review must have
slice ID `fix`), or a change after the reviewed SHA that is not evidence-only.

Escalate to a person, through the lead session, instead of
continuing the loop when:

- a finding belongs to the accepted delivery issue under the
  [corrections table](git-workflow.md#corrections)
- the reviewer does not accept a justification, and the implementation
  session does not accept the finding
- a blocking finding is still open in round three; the schema rejects a
  round-three review with an open blocking finding unless it records a
  `third round` escalation

## Boundaries

The reviewer is read-only. It edits no branch, pull request or issue, and does
not fix the code or write patches. It names the defect, where
it is and how it fails. It writes only its note. Its GitHub writes are the
note comment `pnpm review:record` posts on the pull request, and bug issues
for [unrelated defects](orchestration.md#defects-found-along-the-way).

## Pre-push self-review

The pre-push self-review is an advisory check the lead session runs
on its own work before an independent round. It removes local findings first,
such as a story title that names a state the story does not show, a hard-coded
color, a duplicated helper or a leftover probe, so the gating rounds spend
their effort on what only an independent session finds. It does not replace or
weaken the review or verifier subagent, which stay the only gates.

- **When.** Once the lead session believes a slice or fix is
  complete, before each push that starts or answers a round. It runs at that
  milestone only, never from a Git hook. It also runs on unspecified Standard
  work and Light work, which get no verifier subagent. The lead session does
  not skip it on later pushes: the `since` form of the input keeps those runs
  small.
- **Who.** A subagent from the
  [`pre-push-reviewer`](../../.claude/agents/pre-push-reviewer.md) definition,
  which holds its fixed brief, its read-only tools and its model. It starts
  with a fresh context, never as a fork of the lead session, on a
  different model, as [Models and effort](orchestration.md#models-and-effort)
  sets.
- **Input.** The base branch, and optionally `since: <40-character SHA>`, the
  last commit that a pre-push self-review already covered. Without `since` it
  reviews `origin/<base>...HEAD` plus uncommitted changes, so an untracked or
  temporary file the push would leave behind or sweep in is a finding. With
  `since` it reviews the pull request's own commits since then,
  `git log -p --no-merges <since>..HEAD ^origin/<base>`, plus the conflict
  resolution of each merge commit in that range,
  `git show --remerge-diff <merge>`, plus uncommitted changes (the branch
  merges the base in to stay current, and a plain two-dot diff would sweep the
  base branch's changes into the review), reading the surrounding code as
  needed to trace each changed path, including callers and dependents of
  changed code. If `since` is not an ancestor of `HEAD`, it
  reviews the full `origin/<base>...HEAD` and says so. The lead session never
  describes the change or what to check, because a reviewer handed the author's
  hypothesis tends to confirm it.
- **Scope.** The [scope](#scope) and finding fields of the code review subagent,
  plus a `leftover` category for files and code that should not be pushed.
- **Unrecorded.** It writes no note, comment or message, and never counts
  toward `pnpm verify:gate`. The lead session fixes what it accepts
  and keeps every finding, accepted or rejected, with its reason, for the
  [measures](orchestration.md#revisiting-the-table).
- **No leakage.** Its findings never go to the review, visual review or
  verifier subagent and never appear in a pull request body, so the
  independent reviews are not anchored on them.

## Model choice

Run the reviewer on a different model from the lead session where
one is available. A clean context removes anchoring on the implementer's
reasoning, but the same model tends to share the implementer's blind spots. A
different model makes those errors less correlated. Give High work the highest
reasoning effort available. [Models and effort](orchestration.md#models-and-effort)
sets the actual models.
