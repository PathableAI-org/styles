# Orchestration

A Spec Kit feature runs as separate agent sessions: specification, plan,
implementation, verification and review. The orchestrator is the session that
starts them, briefs them, and relays what needs a person. This document owns
the orchestrator's lifecycle by risk tier, its stop points, its concurrency
limits, what it may read, and the model and effort each role runs on. The
`orchestrate-stack` skill supplies the procedure and the brief templates.

[Git workflow](git-workflow.md) owns tiers, branches, merges and corrections.
[The verification harness](verification-harness.md) owns the roles table and
the verification loop. [Code review session](code-review.md) owns the
reviewer's loop. This document does not restate them.

This workflow is adapted from the one the sister repository
`pathableai-org/pre-ets` uses. The notes and gate tooling under `scripts/` is a
JavaScript port of Pre-ETS's TypeScript tooling, and every ported file names
its Pre-ETS source path and commit in a provenance header. The two copies
are maintained separately and may diverge: each repository evolves its own
schemas and gate, and a fix in one copy is ported to the other only when it
applies there. The provenance headers record where each file started.

## What the orchestrator does

The orchestrator coordinates sessions. It never edits a branch, commits,
pushes, rebases, merges, approves or marks a pull request ready. Every Git and
pull request operation is done by the session that owns the branch.

It reads state, not code. It may read pull request and issue metadata, check
runs, the verification and review notes (`pnpm notes:sync`, `pnpm verify:show`,
`pnpm review:show`), the delivery issue, the feature's slice table in
`plan.md`, and session status. It does not read diffs, source files or other
sessions' transcripts. A question that needs code goes to the session that owns
it. It reads GitHub through the REST API (`gh api`) or the GitHub MCP tools,
because cloud sessions block GraphQL, which `gh pr` and `gh issue` subcommands
use (see [Working without GraphQL](git-workflow.md#working-without-graphql)).

A session's turn ending does not notify the orchestrator: the platform tells a
parent only when a child's turn fails or its worker restarts, and a session that
finishes cleanly may not report back. So every brief carries the orchestrator's
session ID, and each role sends its status line to the orchestrator with the
session messaging tool whenever its state is `pushed`, `verified`, `pr-ready`,
`waiting-on-person`, `escalated`, `blocked` or `failed`, before ending its turn.
The orchestrator acts when a session reports, when a person messages it, or
when it is asked for status.

The orchestrator never polls or loops on CI. Its one fallback is a single
check-in: after starting or briefing a session that owes it a report, it
schedules one message to itself about two hours out (`send_later` in cloud
sessions). When it fires, the orchestrator reads pull request and session
status once and acts on what they show. It does not reschedule the check-in as
a loop; a new one follows only a new brief.

## Lifecycle by tier

The [risk tier](git-workflow.md#risk-tiers) on the delivery issue decides the
phases, as [Process by tier](git-workflow.md#process-by-tier) sets them:

| Work                  | Sessions the orchestrator starts                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| High, new behaviour   | Specification; after approval, plan; after approval, one implementation, one verification and one review session for the feature's slices |
| High, fix             | One implementation, one verification and one review session for the single pull request                                                   |
| Standard, specified   | One combined specification-and-plan session; after approval, implementation, verification and review sessions for the slices              |
| Other Standard, Light | One implementation session. No verifier or reviewer; normal CI and human review apply                                                     |

The verification and review sessions start when the implementation session
first reports `pushed`, not with it. Until then they would only wait, holding a
full context whose prompt cache expires before the first request arrives, and
the verifier would build Storybooks nobody needs yet. The orchestrator builds
their first request from the draft pull request's metadata, puts it in their
briefs, and then sends the implementation session their session IDs for later
rounds.

A tier that rises during the work changes the sessions from the next phase on,
as the Git workflow's tier rules require. The orchestrator never lowers a tier.

## Autonomy and stop points

A person's approval of a phase is the trigger for the next one. Approval
reaches the orchestrator as the person's message, an approving review on the
pull request, or the phase having merged. The orchestrator then starts the next
phase's session without asking again.

Slices are sequential, one pull request each (see
[Implementation slices](git-workflow.md#implementation-slices)). The
implementation session may start slice N+1 once slice N's latest verification
report passes the [verification gate](verification-harness.md#gate-and-escalation),
without waiting for slice N's code review or merge, by cutting N+1's branch
from N's branch. Review findings on N are then fixed on N and merged upward
into N+1, so N+1's evidence is regenerated for its new SHA.

The orchestrator always stops and waits for a person at these points:

- A specification, plan or combined pull request is ready for review. Only a
  person approves it.
- Any merge. Only a person asks for a merge, under
  [Merge timing](git-workflow.md#merge-timing).
- A slice or fix the implementation session marked ready. It does so once the
  gates pass; the ready hook runs the gate and blocks a failing attempt, and no
  person confirms the ready step itself. The person then reviews it.
- The `ci: version packages` release pull request that
  [`publish.yml`](../../.github/workflows/publish.yml) opens or updates after a
  feature with changesets merges. Merging it publishes to npm, so only a person
  decides when. The orchestrator reports that it is open and which packages and
  bumps it carries; it never merges it or asks another session to.
- An escalation from the verifier or reviewer: a specification or plan
  correction under the [corrections table](git-workflow.md#corrections), a
  claim still failing after three verification rounds, a blocking finding open
  in round three, or a disagreement between the implementation session and the
  verifier or reviewer.
- Any correction that goes back to an earlier phase, a delivery-scope
  discovery, or a tier change.
- A session that failed, stopped or hit a usage limit.

A session reporting `waiting` is not a stop point: it has nothing to do until
the event it names. `blocked` means a prerequisite stops work the session was
asked to do. A problem with setup or the environment, such as a failed
Playwright browser launch, becomes a stop point only when it blocks a request.
Before that, the session retries when the request arrives and reports `blocked`
then if it still fails.

## Concurrency

- **Cap:** one feature at a time, with at most three working sessions
  (implementation, verification, review). The orchestrator does not count.
  Every session shares the person's usage limits.
- **One writer per set of files.** One implementation session owns a feature's
  branches at a time. A fresh implementation session per slice is allowed once
  the previous one has finished.
- **Unmerged predecessors.** A phase or slice branch cut from an open
  predecessor says so in its brief and names the predecessor branch. After the
  predecessor merges, the next branch starts from `origin/main`.
- **Shared hot spots** such as the [AGENTS.md](../../AGENTS.md) routing table,
  root `package.json` scripts, `packages/styles/src/pathable-components.scss`,
  `packages/react/src/index.ts`, the Storybook contracts rollout ledger and the
  consumer agent guidance: one writing session at a time, or expect a merge
  conflict and say so in the brief.
- **No polling.** One fallback check-in per brief, as
  [What the orchestrator does](#what-the-orchestrator-does) describes.

## Other agents and Copilot

The orchestrated flow runs only Claude Code sessions, because the project's
hooks, the ready gate and the permission rules in `.claude/settings.json` run
only there. Codex, OpenCode and Cursor stay available to a person outside the
flow. Their work enters it only as a pushed SHA that a Claude Code verifier and
reviewer check, and it is marked ready from a Claude Code session.

Copilot's pull request review stays advisory, on its
[path-scoped instructions](../../.github/instructions/). It is not a gate. The
implementation session answers each Copilot finding as accepted, rejected with
a reason, or waiting on a person.

## Notifications

The orchestrator sends a push notification when:

- a phase or slice is waiting on the person: review, approval, a merge
  request, a release pull request, or a decision
- a session escalated or is blocked
- a session failed, stopped or hit a usage limit
- a slice is green: its verification gate passes and its review has no open
  blocking finding

A notification reaches a phone only while the orchestrator session has Remote
Control connected. Each message is one line that leads with what to act on.

## Models and effort

This table is the one place a role's model and effort are set. The briefs and
the skill read it. Change a role by editing its row. The rows start as copies
of Pre-ETS's; revisit them with the measures below.

| Role                         | Model                                                                                 | Effort                        |
| ---------------------------- | ------------------------------------------------------------------------------------- | ----------------------------- |
| Specification, plan          | `claude-opus-5-5`; `claude-fable-5-2` for High work                                   | `high`                        |
| Implementation               | `claude-opus-5-5`                                                                     | `high`; `xhigh` for High work |
| Verification                 | `claude-opus-5-5`                                                                     | `medium`                      |
| Review                       | `claude-fable-5-2`, a different and stronger model than the implementation            | `high`                        |
| Pre-push self-review         | `fable` (`claude-fable-5-2`), a subagent on a different model from the implementation | `high`                        |
| Orchestrator                 | `claude-sonnet-5-5`                                                                   | `medium`                      |
| Drift review                 | `claude-opus-5-5`                                                                     | `high`                        |
| Lookups, read-only subagents | `claude-haiku-5-5`, or `claude-sonnet-5-5` when the lookup needs judgment             | `low`                         |

Set effort explicitly. `claude-opus-5-5` defaults to `medium`.

### How a session gets its model and effort

- **Started from another session.** A session started from another session
  takes `model` and `effort`, but only the starting session's model or a
  cheaper one, and only its effort or lower. A higher model or effort is set
  afterwards with the app's set-model and set-effort session tools, which apply
  from the target's next turn and ask the person first. A `claude-sonnet-5-5`
  orchestrator at `medium` therefore starts each role session with a one-line
  holding prompt, raises its model and effort, and only then sends the brief.
- **Command line.** `claude --model <id> --effort <level> -n <name> "<brief>"`
  sets both at start with no ceiling.
- **Skills.** A skill's `model` and `effort` frontmatter applies only to the
  turn that invokes it, so it does not set a role session's model. Role skills
  do not carry it.
- **Subagents.** A lookup subagent takes the Agent tool's per-call `model`, or
  the `model` and `effort` frontmatter of a `.claude/agents/` definition, for
  its whole run. The one project definition is
  [`pre-push-reviewer`](../../.claude/agents/pre-push-reviewer.md), which sets
  its row's model and effort; change both there and here together.
- **Overrides.** `CLAUDE_CODE_EFFORT_LEVEL` overrides session, skill and
  subagent effort. Do not set it in a shell that starts role sessions.

### Revisiting the table

Revisit a row when these measures move:

- verification rounds to a passing gate, per slice (the reports in each slice's
  verification note)
- reviewer findings accepted versus dismissed (closures `fixed` against
  `justified` and `withdrawn` in review notes)
- defects that escaped to `main` or were first found in human review, such as
  a `test:visual` regression or an axe violation caught after merge
- usage-limit pressure: sessions stopped by limits, and time spent waiting for
  them to reset
- the independent reviewer's round-1 findings per slice, before and after the
  [pre-push self-review](code-review.md#pre-push-self-review), against the
  self-review findings each `pushed` report lists as accepted or rejected

## Wrap-up

After a person merges the last phase, the orchestrator asks once to archive the
feature's sessions, which also removes their worktrees, and lists any leftover
worktrees for the person. It reports whether a `ci: version packages` pull
request is open, as a stop point above. It reports which
[drift review](drift-review.md) areas the merged pull requests touched, by
matching their changed paths against each area's pathspecs, so a person can
choose whether to review one early. It files nothing.

## Decisions

The maintainer decided these on 2026-11-17. Change one by editing its row and
the documents it links in the same pull request.

| Decision                    | Outcome                                                                                                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Models and effort           | Keep the [table above](#models-and-effort), copied from Pre-ETS. Revisit it after the first orchestrated feature, using [the measures](#revisiting-the-table)                                                                        |
| Standard process            | One pull request by default. The maintainer asks for a specification when the work warrants it, and the work then runs as a combined pull request and verified slices ([Process by tier](git-workflow.md#process-by-tier))           |
| Stacked pull requests       | No `gh stack` and no native GitHub stacks. Slices use plain branches and merge upward, because force pushes are denied here and cloud sessions cannot reach GraphQL ([Implementation slices](git-workflow.md#implementation-slices)) |
| Drift review                | Not started. The skill and [areas](drift-review.md#areas) are ready; the `drift` label, the tracking issue and any scheduled task are not created                                                                                    |
| Screenshots                 | The verifier publishes screenshots for visual claims only, as a private page linked from one pull request comment ([Screenshots for visual claims](verification-harness.md#screenshots-for-visual-claims))                           |
| Evidence from consumers     | In-repository only. Consumer impact is an approved limitation plus a linked delivery issue in the consumer's repository ([Known limits](verification-harness.md#known-limits))                                                       |
| Labels                      | `risk:high`, `risk:standard` and `risk:light` exist; the gate reads `risk:high`                                                                                                                                                      |
| Ready without a prompt      | Allowed. `gh pr ready` and the REST ready route are in the project allow list, and the hook approves the MCP call; the gate decides every attempt                                                                                    |
| Pull request comment marker | `<!-- pathable-note kind=… sha=… id=… -->`, renamed from Pre-ETS's marker                                                                                                                                                            |
| Shared tooling package      | None. The JavaScript port is maintained separately from Pre-ETS's copy                                                                                                                                                               |
