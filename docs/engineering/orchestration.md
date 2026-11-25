# Orchestration

A delivery issue runs in **one lead session**. The lead session reads the
accepted issue, writes the code or hands clearly scoped tasks to an
**implementer** subagent, and runs every independent check as a **subagent**
with a clean context: the pre-push self-review, the code review, the
verification and the visual review, whose screenshots a **visual capture**
subagent takes first. This document owns the lead session's loop by risk
tier, its stop points, how it starts subagents and keeps them independent,
its notifications, and the model and effort each role runs on, including when
the lead steps a role up. The `orchestrate-stack` skill supplies the
procedure.

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

| Role                 | Runs as                                                                   | Writes                                                                      |
| -------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Lead                 | The one session for the delivery issue                                    | Branches, code, stories, changesets, pull requests, merge                   |
| Implementer          | [`implementer`](../../.claude/agents/implementer.md) subagent             | Uncommitted edits in the lead's working tree, for one delegated task        |
| Pre-push self-review | [`pre-push-reviewer`](../../.claude/agents/pre-push-reviewer.md) subagent | Nothing; advisory reply only                                                |
| Code review          | [`code-reviewer`](../../.claude/agents/code-reviewer.md) subagent         | Its review note and the note comment                                        |
| Verification         | [`verifier`](../../.claude/agents/verifier.md) subagent                   | Its report note, the note comment, and a screenshots page for visual claims |
| Visual capture       | [`visual-capture`](../../.claude/agents/visual-capture.md) subagent       | Screenshots and a capture manifest in its output directory                  |
| Visual review        | [`visual-reviewer`](../../.claude/agents/visual-reviewer.md) subagent     | Its visual review note, the note comment, and the screenshots page          |
| Drift review         | Its own scheduled or person-started session, outside any delivery issue   | Drift issues                                                                |

The reviewing subagents and the visual capture are read-only on every branch.
Each works in its own detached worktrees of the lead session's clone, at the
SHAs it was given, so their notes land in the shared local notes refs as well
as on the pull request. The implementer is the one subagent that edits files,
and only as [Delegating implementation](#delegating-implementation) allows.

## The loop by tier

The [risk tier](git-workflow.md#risk-tiers) on the delivery issue decides the
phases, as [Process by tier](git-workflow.md#process-by-tier) sets them:

| Work            | Pull requests    | Subagents per round                                           | Merge       |
| --------------- | ---------------- | ------------------------------------------------------------- | ----------- |
| High            | One pull request | Code review, verification; visual review for a rendering path | A person    |
| Standard, Light | One pull request | Code review; visual review for a rendering path               | Agent merge |

[Visual-only styles work](git-workflow.md#visual-only-styles-work) gets a
visual review at every tier.

Every round also starts with the pre-push self-review. Visual review runs only
when the pull request touches a
[rendering path](visual-review.md#when-a-visual-review-runs).

### One round

1. **Build.** The lead session implements the change, or hands its
   clearly scoped tasks to the implementer as
   [Delegating implementation](#delegating-implementation) describes, reads
   the result, commits, and runs the
   [Before committing](../../AGENTS.md#before-committing) checks.
2. **Self-review.** It runs the `pre-push-reviewer` subagent with only the
   base branch, fixes what it accepts, and keeps the findings for its round
   summary. They never go to another subagent or the pull request body. On a
   later push it also passes `since: <SHA>`, the last commit a pre-push
   self-review covered, as
   [Pre-push self-review](code-review.md#pre-push-self-review) describes. It
   never skips the self-review on a later push.
3. **Push.** It pushes and opens or updates the draft pull request. Before
   each push that starts or answers a round, it brings the body's Change,
   Evidence and visible-change description up to date with every commit in the
   round. For agent-merge work, the body describes every intended visible
   change, because the visual reviewer judges against it, and a stale body
   costs a round.
4. **Check.** It starts the round's subagents in the background, all on the
   same pushed SHA, each with only its request fields: branch, SHA, base SHA,
   slice ID `fix`, pull request number and round, plus for a repeat round the previous record's ID
   and the lead's answer to each open finding. When the round has a visual
   review, it starts the visual capture instead of the visual reviewer, and
   starts the visual reviewer with the capture's manifest once the capture
   finishes. Then it ends its turn; each subagent's completion wakes it.
5. **Read.** It reads each record with `pnpm review:show`, `pnpm verify:show`
   or `pnpm visual:show`, answers every finding with a fix or a written
   justification, and goes back to step 1 for a new round, or on when every
   record passes. When no record in the round has an open blocking finding,
   the fix loop ends. The lead answers each advisory finding with a written
   justification, a follow-up issue or a fix, and prefers a justification or a
   follow-up issue for one outside the accepted scope. The fixes it accepts go
   into one batch and one final round; it never starts a round just to fix
   advisory findings one at a time.
6. **Ready.** It marks the pull request ready. The ready hook runs the
   verification gate on High work.
7. **Merge.** For agent-merge work it keeps the branch
   [up to date](git-workflow.md#keeping-up-to-date) with `main`, waits for CI
   without polling, and merges when `pnpm merge:gate` passes. For High work it
   stops for the person.

The verifier and the visual capture each build Storybooks. They may run at
the same time: the verifier serves on ports 6006 and 6007, the pixel suite on
6014, and the visual capture on 6020 to 6023. If the session's disk
allowance runs low, run them one after the other.

## Delegating implementation

Smaller models do well on work whose scope is clear and less well on work
that is ambiguous, so the lead keeps the ambiguous work and may hand the rest
to the [`implementer`](../../.claude/agents/implementer.md) subagent.

A task is **clearly scoped** when the lead can name the files to change, the
behaviour wanted, and the checks that show it is done: typically one bounded
part of the accepted issue, or a Light or Standard change the lead can
describe precisely.
The lead keeps:

- the delivery issue decisions and the pull request body
- any task whose scope or design is still open, or that needs a judgment the
  lead has not made yet
- the code behind a [High trigger](git-workflow.md#triggers): keyboard, focus
  and ARIA behaviour, removed or renamed public API, entry points and the
  theming API
- answering reviewer findings. Once it has decided a fix, it may hand that fix
  over as a task.

The implementer is not an independent check, so it gets a full brief: the
task, the files, the constraints and the checks to run, as the
`orchestrate-stack` skill's [implementer brief](../../.agents/skills/orchestrate-stack/SKILL.md#implementer-brief)
sets out. It edits the lead's working tree, runs the checks, and replies with
the files it changed, each check's result and any question. It never commits,
pushes, edits a pull request or records a note. When the brief
leaves a question open, it stops and asks instead of guessing. The lead runs
one implementer at a time, does not edit the working tree while it runs,
reads the diff, and commits only what it accepts. The pre-push self-review
and every later check then treat that code as the lead's.

Three more rules keep the brief complete and the cost down:

- Before deciding a design for a component that embeds another component or
  is embedded in one, the lead reads both component pages in `components/`. A
  conflict between their guarantees is a decision to settle before briefing,
  or a [stop point](#stop-points) when it needs a design trade-off.
- The brief carries an `acceptance:` field for a change on a rendering path:
  the Section 508 checks the visual reviewer applies, as they bear on the
  change, and its defect checks. They are text at 200 % at the captured
  viewports (375, 768 and 1280 px) without loss or overlap, text contrast, a
  visible focus indicator in every state, including checked and tinted states,
  with at least 3:1 contrast against what it sits on (the visual reviewer
  treats a ring under 3:1 as a defect, not a Section 508 failure), and the
  rules in [`fixtures/README.md`](../../fixtures/README.md) for any fixture
  changed. The implementer then catches them before a
  reviewer does. [Priorities](visual-review.md#priorities) lists the full set;
  the brief names only those that bear on the change.
- The lead follows up on the same task by resuming the same implementer. It
  starts a fresh implementer with a fresh brief when the task changes or after
  about three resumes, because each resume carries the whole earlier context.

## Stop points

The lead session stops, notifies the person and waits at these points:

- A High pull request is ready for review. A person reviews and merges it.
- The merge gate reports a pull request as not eligible for agent merge.
- The `ci: version packages` release pull request is open after a merge with
  a changeset. Merging it publishes to npm, so only a person does; the lead
  reports which packages and bumps it carries and never merges it.
- An escalation in any record: a delivery-issue correction under the
  [corrections table](git-workflow.md#corrections), a claim still failing
  after three verification rounds, a blocking finding open in round three, or
  a disagreement the lead does not accept.
- A round ends with a blocking finding open in round three or later, whether
  new or carried, so a pull request never enters a fourth round for a
  blocking finding without the person. The lead sends the open findings and
  the options it sees.
- A blocking finding whose fix needs a design trade-off, or that sets two
  documented guarantees against each other. The lead stops when it first
  appears, with options, instead of trying fixes round by round.
- A delivery-scope discovery or tier change.
- A subagent that failed or hit a usage limit twice in a row.

An agent-merged pull request is not a stop point. The lead merges it,
notifies the person, and goes on.

Approval reaches the lead session as the person's message or an approving
review on the pull request.

## Defects found along the way

Any agent, the lead session or a subagent, that finds a defect unrelated to
the change it is working on files a bug issue for it and carries on. It does
not fix it in the current pull request, and does not report it as a finding
on that pull request. A defect is unrelated when the base branch already has
it and the current change neither causes it nor touches the code or story
that shows it.

Use the shared [bug template](../../.github/ISSUE_TEMPLATE/bug.md). Consumer
agents using an installed package and contributor agents working here should
produce the same evidence: package version or base SHA, component slug or
non-component area, observed and expected behavior, reproduction, and the
broken component-page guarantee when one exists. An external consumer agent
files only when its environment and person authorize GitHub writes; otherwise
it prepares the completed report for the person.

1. **Confirm it.** Reproduce it at the base SHA or on `main`: a story, a
   command, or a measurement. Drop anything that cannot be reproduced.
2. **Look for an existing issue.**
   `gh api -X GET search/issues -f q='repo:PathableAI-org/styles is:issue is:open <key words>'`.
   When one matches, add a comment with the new evidence instead of filing.
3. **File it** with `gh api repos/{owner}/{repo}/issues -f title=… -f body=…`
   and the `bug` label plus one package label, `package:styles` or
   `package:react`, for the package the defect is in. A defect in both
   packages is two issues, one per package, each linking the other. For a
   component defect, name its component-page slug in the template and apply
   the repository's component label when one exists; do not invent a label.
   Use `tokens`, `utilities`, `packaging` or `documentation` for a styles
   defect that has no component. The title is a plain sentence naming the
   component or area and the defect. The body gives:
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

Filing a bug issue is the one GitHub write every repository contributor role in
this orchestration may make beyond its records. It needs no additional
approval, because an issue changes no code. This permission does not extend to
an agent operating from an installed package in another repository; that agent
follows its environment's and person's authority. Use only synthetic content
in the issue, as in the stories.

## Concurrency

- **One lead session per delivery issue,** and one delivery issue per lead
  session. A person may run several lead sessions on unrelated issues; they
  share the person's usage limits.
- **One writer.** Only the lead session commits to and pushes the issue's
  branches. The implementer edits the lead's working tree only while the lead
  waits on it, one task at a time, and never commits. Other subagents write
  only notes, note comments, screenshots pages and files in their own
  scratchpad.
- **Shared hot spots** such as the [AGENTS.md](../../AGENTS.md) routing table,
  root `package.json` scripts, `packages/styles/src/pathable-components.scss`,
  `packages/react/src/index.ts`, the Storybook contracts rollout ledger and the
  consumer agent guidance: two lead sessions editing one of them should expect
  a merge conflict, and the second resolves it by merging `origin/main`.
- **No polling.** The lead runs long commands and subagents in the background
  and ends its turn; it is woken when they finish. While waiting on CI or a
  person, it schedules at most one check-in about two hours out
  (`send_later` in cloud sessions) and does not reschedule it as a loop.
- **Short commands stay with the lead.** It runs a short command itself, such
  as a few checks or a git or `gh` lookup, in the background when it is long.
  A lookup subagent is for reading and digesting a lot of material, because
  every subagent pays a fixed cost to start a fresh context.
- **Stop-hook reminders.** A Stop-hook reminder about uncommitted or unpushed
  work while an implementer or a pre-push self-review is running is not a
  reason to commit or push early. The lead says so and ends its turn.

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

The roles split three ways. Work whose scope is unclear goes to the lead on
Opus. Work that only judges goes to Fable, the strongest model, at a fixed
setting. Work whose scope is clear, writing to a brief or running a script,
goes to Sonnet or Haiku and starts low.

| Role                         | Model                                                                      | Effort                        | Steps up                                                        |
| ---------------------------- | -------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------- |
| Lead                         | `claude-opus-5-5`                                                          | `high`; `xhigh` for High work | No; a person sets it                                            |
| Implementer                  | `sonnet` (`claude-sonnet-5-5`)                                             | `medium`                      | On a [failed round](#stepping-up), to `opus` at `high` at most  |
| Pre-push self-review         | `fable` (`claude-fable-5-2`), a different model from the lead              | `high`                        | No; [fixed](#which-roles-step-up)                               |
| Code review                  | `fable` (`claude-fable-5-2`), a different and stronger model than the lead | `high`                        | No; fixed                                                       |
| Verification                 | `sonnet` (`claude-sonnet-5-5`)                                             | `high`                        | After a [failed run](#which-roles-step-up), to `opus` at `high` |
| Visual capture               | `haiku` (`claude-haiku-5-5`)                                               | `low`                         | After a failed run, to `sonnet` at `medium`                     |
| Visual review                | `fable` (`claude-fable-5-2`), a different model from the lead              | `high`                        | No; fixed                                                       |
| Drift review                 | `claude-opus-5-5`                                                          | `high`                        | No                                                              |
| Lookups, read-only subagents | `claude-haiku-5-5`, or `claude-sonnet-5-5` when the lookup needs judgment  | `low`                         | No                                                              |

Set effort explicitly. `claude-opus-5-5` defaults to `medium`. A person starts
the lead session at its row: `claude --model claude-opus-5-5 --effort high`,
or the model and effort pickers in the app. `CLAUDE_CODE_EFFORT_LEVEL`
overrides session, skill and subagent effort; do not set it in a lead
session's shell.

### Stepping up

A role that starts low is raised only when a result shows it needs more. The
lead first asks why the result missed, because the answer decides what to
raise:

| Cause               | What it looks like                                                                                   | What the lead changes                |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------ |
| The brief was wrong | Missing context, an unclear task, the wrong files named, a check left out                            | The brief; the model and effort stay |
| It did too little   | Skipped a file, did not run a check, stopped early, ignored a rule the brief stated                  | Effort, one step                     |
| It knew too little  | The wrong approach, a misunderstanding of the system, the same mistake again after effort was raised | The model, one step                  |

#### Which roles step up

- **The implementer** steps up on a failed round: a verification claim
  fails, or a blocking finding lands, in code it wrote, or it reports a check
  it could not get green. A different finding in each round is ordinary
  review and does not count.
- **The verification and the visual capture** step up after a failed run:
  the subagent errors, returns no record or manifest, or returns one the lead
  cannot use. A failing claim, or a head that does not build, is a result
  about the code, not a failed run.
- **The reviewers** (pre-push self-review, code review and visual review)
  never change. A review that does too little passes what it should have
  flagged, and no failed round ever shows it, so reviewers stay at their row.
  A reviewer run that errors is rerun at the same setting.

#### The ladder

For the implementer, within the three rounds before the
[stop point](#stop-points):

1. **Round 1:** its row, `sonnet` at `medium`.
2. **Round 2:** one step on the axis the lead diagnosed: `sonnet` at `high`
   for too little, `opus` at `medium` for too little knowledge.
3. **Round 3:** one more step, up to `opus` at `high`, the ceiling.
4. **After round 3:** the existing stop point applies.

The verification and the visual capture take their one step on the next run
of the same round. The lead never steps a role down within a delivery issue,
and it may take a task back and write it itself at any step.

The lead sets a step with the Agent tool's `model` and `effort` parameters,
which override the definition for that run. This section is the instruction
that allows those parameters, and only for the roles and steps above. The
lead writes each step in its round summary, for example
`Step-up: implementer, round 2, did too little (skipped the story tests), sonnet/medium → sonnet/high`.

### Revisiting the table

Revisit a row when these measures move:

- verification rounds to a passing gate for High pull requests
- reviewer findings accepted versus dismissed (closures `fixed` against
  `justified` and `withdrawn` in review notes)
- visual review findings accepted versus dismissed, and visible regressions
  found after an agent merge that the visual review passed
- defects that escaped to `main` or were first found in human review, and
  agent-merged pull requests that a person later reverted or corrected
- usage-limit pressure: subagents or lead sessions stopped by limits
- review rounds per pull request
- reviewer cost per round, in tokens from each subagent's completion
- the code reviewer's round-1 findings per pull request, before and after the
  [pre-push self-review](code-review.md#pre-push-self-review)
- step-ups per role and their causes, from the round summaries. A role that
  steps up in most issues starts too low; raise its row. A brief that keeps
  being the cause means the implementer brief needs work, not a bigger model

## Wrap-up

When the pull request has merged, the lead session reports whether a
`ci: version packages` pull request is open, removes any worktree it or its
subagents left behind, and reports which [drift review](drift-review.md)
areas the merged pull requests touched, by matching their changed paths
against each area's pathspecs, so a person can choose whether to review one
early. It files nothing.

## Decisions

The maintainer decided these on 2026-11-17, unless a row says otherwise.
Change one by editing its row and the documents it links in the same pull
request.

| Decision                    | Outcome                                                                                                                                                                                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Models and effort           | Changed 2026-11-22 to save usage: Opus leads, Fable judges at a fixed setting, Sonnet and Haiku do clearly scoped work and [step up](#stepping-up) on evidence. Revisit using [the measures](#revisiting-the-table)                                                                                                 |
| Implementer and capture     | Decided 2026-11-22. The lead may delegate clearly scoped tasks to the `implementer` subagent, and the `visual-capture` subagent runs the visual capture script so the visual reviewer only judges                                                                                                                   |
| Delivery record             | The issue owns the accepted outcome, scope, contract impact, claims and implementation approach; the pull request owns the implementation and evidence ([Process by tier](git-workflow.md#process-by-tier))                                                                                                         |
| Pull request shape          | One pull request per independently reviewable change. Oversized work is split into separately releasable delivery issues rather than an in-repository specification stack                                                                                                                                           |
| Drift review                | Not started. The skill and [areas](drift-review.md#areas) are ready; the `drift` label, the tracking issue and any scheduled task are not created                                                                                                                                                                   |
| Screenshots                 | The verifier publishes screenshots for visual claims only, as a private page linked from one pull request comment ([Screenshots for visual claims](verification-harness.md#screenshots-for-visual-claims))                                                                                                          |
| Evidence from consumers     | In-repository only. Consumer impact is an approved limitation plus a linked delivery issue in the consumer's repository ([Known limits](verification-harness.md#known-limits))                                                                                                                                      |
| Labels                      | `risk:high`, `risk:standard` and `risk:light` exist; the gate reads `risk:high`. The merge gate also reads `hold`. `package:styles` and `package:react` mark which package a bug affects; nothing reads them                                                                                                        |
| Ready without a prompt      | Allowed. `gh pr ready` and the REST ready route are in the project allow list, and the hook approves the MCP call; the gate decides every attempt                                                                                                                                                                   |
| Pull request comment marker | `<!-- pathable-note kind=… sha=… id=… -->`, renamed from Pre-ETS's marker                                                                                                                                                                                                                                           |
| Shared tooling package      | None. The JavaScript port is maintained separately from Pre-ETS's copy                                                                                                                                                                                                                                              |
| Agent merge                 | Decided 2026-11-19. Standard and Light pull requests merge without a person, once an independent code review and, for rendering changes, a visual review pass the merge gate ([Agent merge](git-workflow.md#agent-merge))                                                                                           |
| Review rounds               | Decided 2026-11-25. Repeat rounds and later pre-push self-reviews review only what changed since the last review; advisory findings are batched; a blocking finding open in round three or later, or one that needs a design trade-off, stops for the person ([One round](#one-round), [Stop points](#stop-points)) |
| Subagents over sessions     | Decided 2026-11-19. One lead session per delivery issue; every independent role runs as a clean-context subagent from a `.claude/agents/` definition, replacing the orchestrator and per-role sessions                                                                                                              |
