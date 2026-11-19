# Orchestration

A delivery issue runs in **one lead session**. The lead session writes the
specification, plan and code, and runs every independent check as a
**subagent** with a clean context: the pre-push self-review, the code review,
the verification and the visual review. This document owns the lead
session's loop by risk tier, its stop points, how it starts subagents and
keeps them independent, its notifications, and the model and effort each role
runs on. The `orchestrate-stack` skill supplies the procedure.

[Git workflow](git-workflow.md) owns tiers, branches, merges, corrections and
[agent merge](git-workflow.md#agent-merge).
[The verification harness](verification-harness.md) owns claims and the
verification loop. [Code review session](code-review.md) owns the reviewer's
scope and loop, and [Visual review session](visual-review.md) the visual
reviewer's. This document does not restate them.

This workflow is adapted from the one the sister repository
`pathableai-org/pre-ets` uses. The notes and gate tooling under `scripts/` is a
JavaScript port of Pre-ETS's TypeScript tooling, and every ported file names
its Pre-ETS source path and commit in a provenance header. The two copies
are maintained separately and may diverge: each repository evolves its own
schemas and gate, and a fix in one copy is ported to the other only when it
applies there. The provenance headers record where each file started.

## Why subagents, not sessions

Earlier, each role ran as its own cloud session, started and briefed by an
orchestrator session. That meant five or six sessions per feature for a
person to follow. Subagents give the same independence with one session:

- **Clean context.** A subagent started from a `.claude/agents/` definition
  begins with only its definition and the prompt it is given. It never sees
  the lead session's conversation. It is never a fork.
- **Fixed brief.** Each role's brief lives in its definition, with its model,
  effort and tools. The lead session passes only the request fields the
  definition asks for, and never a description of the change, its intent or
  what to check, because a reviewer handed the author's hypothesis tends to
  confirm it. Each definition tells its subagent to ignore anything else in
  the prompt.
- **Same model rules.** A definition's `model` and `effort` apply for the
  subagent's whole run, with no ceiling from the lead session's own model, so
  a reviewer runs on a different and stronger model than the code it reviews.
- **Same hooks.** The suppression, ready and merge hooks in
  `.claude/settings.json` apply to subagents' tool calls as to the lead's.
- **Same records.** Each reviewing subagent records its result as a Git note
  and posts it on the pull request, exactly as the session did. The lead
  session reads the note, not the subagent's reply, so the gate decides on the
  record.

## Roles

| Role                 | Runs as                                                                   | Writes                                                                         |
| -------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Lead                 | The one session for the delivery issue                                    | Branches, specification, plan, code, stories, changesets, pull requests, merge |
| Pre-push self-review | [`pre-push-reviewer`](../../.claude/agents/pre-push-reviewer.md) subagent | Nothing; advisory reply only                                                   |
| Code review          | [`code-reviewer`](../../.claude/agents/code-reviewer.md) subagent         | Its review note and the note comment                                           |
| Verification         | [`verifier`](../../.claude/agents/verifier.md) subagent                   | Its report note, the note comment, and a screenshots page for visual claims    |
| Visual review        | [`visual-reviewer`](../../.claude/agents/visual-reviewer.md) subagent     | Its visual review note, the note comment, and the screenshots page             |
| Drift review         | Its own scheduled or person-started session, outside any delivery issue   | Drift issues                                                                   |

The reviewing subagents are read-only on every branch. Each works in its own
detached worktree of the lead session's clone, at the SHA it was given, so
their notes land in the shared local notes refs as well as on the pull
request.

## The loop by tier

The [risk tier](git-workflow.md#risk-tiers) on the delivery issue decides the
phases, as [Process by tier](git-workflow.md#process-by-tier) sets them:

| Work                  | Phases in the lead session                                                            | Subagents per round                             | Merge                      |
| --------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------- |
| High, new behaviour   | Specification pull request; stop. Plan pull request; stop. One pull request per slice | Code review, verification                       | A person, per pull request |
| High, fix             | One pull request                                                                      | Code review, verification                       | A person                   |
| Standard, specified   | Combined specification-and-plan pull request; stop. One pull request per slice        | Code review, verification, visual review        | Agent merge, per slice     |
| Other Standard, Light | One pull request                                                                      | Code review; visual review for a rendering path | Agent merge                |

[Visual-only styles work](git-workflow.md#visual-only-styles-work) is never
specified: at Standard or Light it is one pull request with code review and
visual review, and at High it runs like a High fix with a visual review
added.

Every round also starts with the pre-push self-review. Visual review runs only
when the pull request touches a
[rendering path](visual-review.md#when-a-visual-review-runs).

### One round

1. **Build.** The lead session implements the slice or change and runs the
   [Before committing](../../AGENTS.md#before-committing) checks.
2. **Self-review.** It runs the `pre-push-reviewer` subagent with only the
   base branch, fixes what it accepts, and keeps the findings for its round
   summary. They never go to another subagent or the pull request body.
3. **Push.** It pushes and opens or updates the draft pull request. For
   agent-merge work, the body already describes every intended visible
   change, because the visual reviewer judges against it.
4. **Check.** It starts the round's subagents in the background, all on the
   same pushed SHA, each with only its request fields: branch, SHA, base SHA,
   slice ID (`fix` for single-pull-request work), feature directory, pull
   request number and round, plus for a repeat round the previous record's ID
   and the lead's answer to each open finding. Then it ends its turn; each
   subagent's completion wakes it.
5. **Read.** It reads each record with `pnpm review:show`, `pnpm verify:show`
   or `pnpm visual:show`, answers every finding with a fix or a written
   justification, and goes back to step 1 for a new round, or on when every
   record passes.
6. **Ready.** It marks the pull request ready. The ready hook runs the
   verification gate on slices and High fixes.
7. **Merge.** For agent-merge work it keeps the branch
   [up to date](git-workflow.md#keeping-up-to-date) with `main`, waits for CI
   without polling, and merges when `pnpm merge:gate` passes. For High work it
   stops for the person.

The verifier and the visual reviewer each build Storybooks. They may run at
the same time: the verifier serves on ports 6006 and 6007, the pixel suite on
6014, and the visual reviewer on 6020 and 6021. If the session's disk
allowance runs low, run them one after the other.

Slices are sequential, one pull request each (see
[Implementation slices](git-workflow.md#implementation-slices)). The lead may
start slice N+1 once slice N's verification gate passes, without waiting for
its review or merge, by cutting N+1's branch from N's branch.

## Stop points

The lead session stops, notifies the person and waits at these points:

- A specification, plan or combined pull request is ready for review. Only a
  person approves it, and that approval starts the next phase.
- A High slice or fix is ready for review. A person reviews and merges it.
- The merge gate reports a pull request as not eligible for agent merge.
- The `ci: version packages` release pull request is open after a merge with
  a changeset. Merging it publishes to npm, so only a person does; the lead
  reports which packages and bumps it carries and never merges it.
- An escalation in any record: a specification or plan correction under the
  [corrections table](git-workflow.md#corrections), a claim still failing
  after three verification rounds, a blocking finding open in round three, or
  a disagreement the lead does not accept.
- A correction that goes back to an earlier phase, a delivery-scope
  discovery, or a tier change.
- A subagent that failed or hit a usage limit twice in a row.

An agent-merged pull request is not a stop point. The lead merges it,
notifies the person, and goes on.

Approval reaches the lead session as the person's message, an approving review
on the pull request, or the phase having merged.

## Defects found along the way

Any agent, the lead session or a subagent, that finds a defect unrelated to
the change it is working on files a bug issue for it and carries on. It does
not fix it in the current pull request, and does not report it as a finding
on that pull request. A defect is unrelated when the base branch already has
it and the current change neither causes it nor touches the code or story
that shows it.

1. **Confirm it.** Reproduce it at the base SHA or on `main`: a story, a
   command, or a measurement. Drop anything that cannot be reproduced.
2. **Look for an existing issue.**
   `gh api -X GET search/issues -f q='repo:PathableAI-org/styles is:issue is:open <key words>'`.
   When one matches, add a comment with the new evidence instead of filing.
3. **File it** with `gh api repos/{owner}/{repo}/issues -f title=… -f body=…`
   and the `bug` label plus one package label, `package:styles` or
   `package:react`, for the package the defect is in. A defect in both
   packages is two issues, one per package, each linking the other. The title is a plain sentence naming the component
   and the defect. The body gives:
   - **Observed** and **expected**, with the story ID, viewport and condition,
     or the file and line
   - **How to reproduce**, and the SHA it was seen on
   - **Proposed risk tier** with the trigger or condition, for the maintainer
     to set; do not add a `risk:` label
   - **Found by**: the role (lead, code review, verification, visual review or
     pre-push self-review) and the pull request it was working on
   - for a Section 508 failure, the WCAG criterion it fails
4. **Mention it** in the subagent's reply, or the lead session's round
   summary, by issue number. The lead never adds the defect to the current
   pull request's scope.

Filing a bug issue is the one GitHub write every role may make beyond its
records. It needs no person's approval, because an issue changes no code.
Use only synthetic content in it, as in the stories.

## Concurrency

- **One lead session per delivery issue,** and one delivery issue per lead
  session. A person may run several lead sessions on unrelated issues; they
  share the person's usage limits.
- **One writer.** Only the lead session writes the issue's branches.
  Subagents write only notes, note comments and screenshots pages.
- **Shared hot spots** such as the [AGENTS.md](../../AGENTS.md) routing table,
  root `package.json` scripts, `packages/styles/src/pathable-components.scss`,
  `packages/react/src/index.ts`, the Storybook contracts rollout ledger and the
  consumer agent guidance: two lead sessions editing one of them should expect
  a merge conflict, and the second resolves it by merging `origin/main`.
- **No polling.** The lead runs long commands and subagents in the background
  and ends its turn; it is woken when they finish. While waiting on CI or a
  person, it schedules at most one check-in about two hours out
  (`send_later` in cloud sessions) and does not reschedule it as a loop.

## Other agents and Copilot

The loop runs only in Claude Code, because the project's hooks, the gates and
the permission rules in `.claude/settings.json` run only there. Codex,
OpenCode and Cursor stay available to a person outside the loop. Their work
enters it only as a pushed SHA that a Claude Code lead session sends through
the reviewing subagents, and it is marked ready and merged from Claude Code.

Copilot's pull request review stays advisory, on its
[path-scoped instructions](../../.github/instructions/). It is not a gate. The
lead session answers each Copilot finding as accepted, rejected with a reason,
or waiting on a person, and never passes Copilot's comments to a subagent.

## Notifications

The lead session sends a push notification when:

- it reaches a stop point: review, approval, a merge request, a release pull
  request, an escalation or a decision
- it merged a pull request under agent merge, with its number, tier and
  whether it carries a changeset
- it is blocked, or a subagent failed or hit a usage limit

A notification reaches a phone only while the session has Remote Control
connected. Each message is one line that leads with what to act on. Every
notification that waits on the person ends with the open decisions: each
question put to the person and not yet answered.

## Models and effort

This table is the one place a role's model and effort are set. The agent
definitions carry them in their frontmatter; change a row and its definition
together.

| Role                         | Model                                                                      | Effort                        |
| ---------------------------- | -------------------------------------------------------------------------- | ----------------------------- |
| Lead                         | `claude-opus-5-5`                                                          | `high`; `xhigh` for High work |
| Pre-push self-review         | `fable` (`claude-fable-5-2`), a different model from the lead              | `high`                        |
| Code review                  | `fable` (`claude-fable-5-2`), a different and stronger model than the lead | `high`                        |
| Verification                 | `opus` (`claude-opus-5-5`)                                                 | `medium`                      |
| Visual review                | `fable` (`claude-fable-5-2`), a different model from the lead              | `high`                        |
| Drift review                 | `claude-opus-5-5`                                                          | `high`                        |
| Lookups, read-only subagents | `claude-haiku-5-5`, or `claude-sonnet-5-5` when the lookup needs judgment  | `low`                         |

Set effort explicitly. `claude-opus-5-5` defaults to `medium`. A person starts
the lead session at its row: `claude --model claude-opus-5-5 --effort high`,
or the model and effort pickers in the app. `CLAUDE_CODE_EFFORT_LEVEL`
overrides session, skill and subagent effort; do not set it in a lead
session's shell.

### Revisiting the table

Revisit a row when these measures move:

- verification rounds to a passing gate, per slice (the reports in each
  slice's verification note)
- reviewer findings accepted versus dismissed (closures `fixed` against
  `justified` and `withdrawn` in review notes)
- visual review findings accepted versus dismissed, and visible regressions
  found after an agent merge that the visual review passed
- defects that escaped to `main` or were first found in human review, and
  agent-merged pull requests that a person later reverted or corrected
- usage-limit pressure: subagents or lead sessions stopped by limits
- the code reviewer's round-1 findings per pull request, before and after the
  [pre-push self-review](code-review.md#pre-push-self-review)

## Wrap-up

When the last phase has merged, the lead session reports whether a
`ci: version packages` pull request is open, removes any worktree it or its
subagents left behind, and reports which [drift review](drift-review.md)
areas the merged pull requests touched, by matching their changed paths
against each area's pathspecs, so a person can choose whether to review one
early. It files nothing.

## Decisions

The maintainer decided these on 2026-11-17, unless a row says otherwise.
Change one by editing its row and the documents it links in the same pull
request.

| Decision                    | Outcome                                                                                                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Models and effort           | Keep the [table above](#models-and-effort). Revisit it after the first features run through the loop, using [the measures](#revisiting-the-table)                                                                                    |
| Standard process            | One pull request by default. The maintainer asks for a specification when the work warrants it, and the work then runs as a combined pull request and verified slices ([Process by tier](git-workflow.md#process-by-tier))           |
| Stacked pull requests       | No `gh stack` and no native GitHub stacks. Slices use plain branches and merge upward, because force pushes are denied here and cloud sessions cannot reach GraphQL ([Implementation slices](git-workflow.md#implementation-slices)) |
| Drift review                | Not started. The skill and [areas](drift-review.md#areas) are ready; the `drift` label, the tracking issue and any scheduled task are not created                                                                                    |
| Screenshots                 | The verifier publishes screenshots for visual claims only, as a private page linked from one pull request comment ([Screenshots for visual claims](verification-harness.md#screenshots-for-visual-claims))                           |
| Evidence from consumers     | In-repository only. Consumer impact is an approved limitation plus a linked delivery issue in the consumer's repository ([Known limits](verification-harness.md#known-limits))                                                       |
| Labels                      | `risk:high`, `risk:standard` and `risk:light` exist; the gate reads `risk:high`. The merge gate also reads `hold`. `package:styles` and `package:react` mark which package a bug affects; nothing reads them                         |
| Ready without a prompt      | Allowed. `gh pr ready` and the REST ready route are in the project allow list, and the hook approves the MCP call; the gate decides every attempt                                                                                    |
| Pull request comment marker | `<!-- pathable-note kind=… sha=… id=… -->`, renamed from Pre-ETS's marker                                                                                                                                                            |
| Shared tooling package      | None. The JavaScript port is maintained separately from Pre-ETS's copy                                                                                                                                                               |
| Agent merge                 | Decided 2026-11-19. Standard and Light pull requests merge without a person, once an independent code review and, for rendering changes, a visual review pass the merge gate ([Agent merge](git-workflow.md#agent-merge))            |
| Subagents over sessions     | Decided 2026-11-19. One lead session per delivery issue; every independent role runs as a clean-context subagent from a `.claude/agents/` definition, replacing the orchestrator and per-role sessions                               |
