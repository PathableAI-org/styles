# Orchestration

A delivery issue runs in **one lead session**. The lead session reads the
accepted issue, settles its design, and hands the code to an **implementer**
subagent. A **checker** subagent with a fresh context runs the checks on what
the implementer built. The lead runs every independent check as a
**subagent** with a clean context: the code review, the scope review, the
verification and the visual review, whose screenshots the lead takes first by
running the capture script itself. All of this happens on local commits. The
lead pushes and opens the pull request only when every review is clean, and a
person merges every pull request. This document owns the lead session's loop
by risk tier, its stop points, how it starts subagents and keeps them
independent, its notifications, and the model and effort each role runs on,
including when the lead steps a role up. The `orchestrate` skill
supplies the procedure.

[Git workflow](git-workflow.md) owns tiers, branches, merges and corrections.
[The verification harness](verification-harness.md) owns claims and the
verification loop. [Code review session](code-review.md) owns the code
reviewer's scope and loop, and [Visual review session](visual-review.md) the visual
reviewer's. This document does not restate them.

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
  a reviewer runs on a stronger model than the one that wrote the code it
  reviews.
- **Same hooks and permissions.** The suppression and guardrail hooks and the
  permission rules in `.claude/settings.json` apply to subagents' tool calls
  as to the lead's.
- **Replies only.** Every subagent replies to the lead session and nothing
  else. None posts a record, note or finding on GitHub: pull request comments
  are never a channel between roles. The lead answers each finding itself, and
  writes the pull request body for the human reviewer.

## Roles

| Role          | Runs as                                                                 | Writes                                                                |
| ------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Lead          | The one session for the delivery issue                                  | Branches, commits, briefs, lead-written code, push, pull request body |
| Implementer   | [`implementer`](../../.claude/agents/implementer.md) subagent           | Uncommitted edits in the lead's working tree, for one delegated task  |
| Checker       | [`checker`](../../.claude/agents/checker.md) subagent                   | Nothing but build output; its reply only                              |
| Code review   | [`code-reviewer`](../../.claude/agents/code-reviewer.md) subagent       | Its reply only                                                        |
| Scope review  | [`scope-reviewer`](../../.claude/agents/scope-reviewer.md) subagent     | Its reply only                                                        |
| Verification  | [`verifier`](../../.claude/agents/verifier.md) subagent                 | Its reply, and a private screenshots page for visual claims           |
| Visual review | [`visual-reviewer`](../../.claude/agents/visual-reviewer.md) subagent   | Its reply, and a private screenshots page                             |
| Drift review  | Its own scheduled or person-started session, outside any delivery issue | Drift issues                                                          |

The reviewing subagents are read-only on every branch. Each works in its own
detached worktrees of the lead session's clone, at the local SHAs it was given.
The implementer is the one subagent that edits files,
and only as [Delegating implementation](#delegating-implementation) allows.
The checker runs in the lead's working tree, because it checks uncommitted
work, but writes only build output and its own scratchpad.

## The loop by tier

The [risk tier](git-workflow.md#risk-tiers) on the delivery issue decides the
phases, as [Process by tier](git-workflow.md#process-by-tier) sets them:

| Work            | Pull requests    | Subagents per review round                                                              | Merge    |
| --------------- | ---------------- | --------------------------------------------------------------------------------------- | -------- |
| High            | One pull request | Code review, scope review, verification; visual review when the classifier requires one | A person |
| Standard, Light | One pull request | Code review, scope review; visual review when the classifier requires one               | A person |

[Visual-only styles work](git-workflow.md#visual-only-styles-work) gets a
visual review at every tier. Visual review runs when
`visual-capture.mjs --classify` requires one, as
[When a visual review runs](visual-review.md#when-a-visual-review-runs)
describes.

### One round

1. **Build.** The lead session settles the design and hands the code to the
   implementer, which edits and builds. A fresh checker then runs the
   [Before committing](../../AGENTS.md#before-committing) checks for the
   changed paths and every check the work's tier requires in the
   [Process by tier](git-workflow.md#process-by-tier) evidence list (the lead
   picks them from both lists), as
   [Delegating implementation](#delegating-implementation) describes. When
   every check passes, the lead reads the diff and commits.
2. **Review.** Nothing is pushed yet. On the committed local `HEAD`, it starts
   the round's subagents in the background, each in a fresh context with only
   its request fields, as the `orchestrate` skill's
   [requests](../../.agents/skills/orchestrate/SKILL.md#requests) list them:
   the code reviewer and the scope reviewer always, the visual reviewer when
   `visual-capture.mjs --classify` requires a review, and the verifier for
   High work. The reviewers read the local commits (`git diff <base>...<head>`).
   The lead first runs `--classify` on the local base and head SHAs. When it
   requires a review, the lead runs the capture script itself in the
   background and starts the visual reviewer only when the manifest verdict is
   `review`, passing it the manifest; for any other verdict it records the
   verdict and capture summary as the round's visual evidence. Then it ends
   its turn; each subagent's completion wakes it.
3. **Answer.** It reads each reply and answers every finding with a fix,
   which goes back through step 1, or a written justification. The next
   review round passes each reviewer its own previous findings and the lead's
   answers, plus `since: <SHA>`, the commit it reviewed last, so it reviews
   only what changed. Rounds repeat until no code, visual or verification
   finding is open as blocking, every scope finding is answered, every advisory finding is fixed or justified, and for High work
   the latest verification reply reports every claim `established` and no
   failing or missing named story, as
   [the verification harness](verification-harness.md) requires. The lead
   answers each advisory finding with a written justification, a follow-up
   issue or a fix, and prefers a justification or a follow-up issue for one
   outside the accepted scope. The fixes it accepts go into one batch and one
   final round; it never starts a round just to fix advisory findings one at
   a time.
4. **Push.** Only when the loop is clean. It brings the pull request body's
   Change, Evidence, Decisions for the reviewer and Validation up to date,
   with Evidence summarising each reviewer's final result and the round
   count, then pushes and opens or updates the pull request, ready for review
   and not draft, since all review is done. It posts no reviewer findings or
   records on it.
5. **CI.** It waits for CI without polling. A CI failure goes back through
   steps 1 to 3: a fix, the checks, and a review round on the fix commits,
   before it pushes again.
6. **Hand off.** It notifies the person, who reviews and merges. The lead
   never merges, never enables auto-merge and never marks a release pull
   request ready. It keeps the branch
   [up to date](git-workflow.md#keeping-up-to-date) with `main` while the
   person reviews.

The verifier and the capture script each build Storybooks. They may run at
the same time: the verifier serves on ports 6006 and 6007, and the capture
script on 6020 to 6023. If the session's disk
allowance runs low, run them one after the other.

## Delegating implementation

The lead runs on a more expensive setting than the implementer and the checker
start on, as [Models and effort](#models-and-effort) sets them, so it spends
that on judgment and hands the code to cheaper subagents. Smaller
models do well on work whose scope is clear and less well on work that is
ambiguous, so the lead first makes the work clear, then delegates it:

- The lead **diagnoses and decides**: it reads the issue and the failing
  checks, settles the design, and writes the brief.
- The [`implementer`](../../.claude/agents/implementer.md) **edits and
  builds**.
- The [`checker`](../../.claude/agents/checker.md) **checks**, always with a
  fresh context separate from the edit and build, so the code is never judged
  only by the context that wrote it.

The lead keeps:

- the delivery issue decisions and the pull request body
- diagnosis and design: anything whose scope or design is still open, or that
  needs a judgment the lead has not made yet. It settles these before
  briefing, not by handing over an open task.
- the code behind a [High trigger](git-workflow.md#triggers): keyboard, focus
  and ARIA behaviour, removed or renamed public API, entry points and the
  theming API
- answering reviewer findings. Once it has decided a fix, it hands that fix
  over as a task.

Everything the lead does not keep is delegated, with two exceptions. The
lead may take a task back and write it itself at any step of
[the ladder](#the-ladder). And it may write an edit so small that its brief
would be at least as long as its diff, such as a one-line fix it has already
decided. It names that edit in its round summary, for example `Lead edit: one-line token fix in pathable-card.scss
(brief longer than diff)`. Code the lead writes, whether it keeps it, takes
it back or makes a small edit, still goes through a fresh checker; nothing
skips the check step.

The implementer is not an independent check, so it gets a full brief: the
task, the files, the constraints, the acceptance items, the build to run and,
when it starts on uncommitted work already in the tree, what to do with
that work and the checker failures that still apply, as the `orchestrate` skill's
[implementer brief](../../.agents/skills/orchestrate/SKILL.md#implementer-brief)
sets out. It edits the lead's working tree, builds, and replies with the files
it changed, the build result and any question. It does not run the checks.
It never commits, pushes or edits a pull request. When the
brief leaves a question open, it stops and asks instead of guessing.

The checker then gets only the
[check request](../../.agents/skills/orchestrate/SKILL.md#check-request):
the branch, the check commands and the acceptance items with what to probe
them on. It never gets the brief's reasoning, the implementer's reply or what
the lead expects to pass. It reruns any build a check needs instead of
trusting the implementer's, runs every check, probes every acceptance item,
and replies with what passed and what failed, quoting the failing output.

The loop between them:

1. The lead starts the implementer with the brief and waits.
2. When it replies, the lead starts a **new** checker with the check request
   and waits. One checker runs every check in the request. A checker is
   never resumed, so each pass through the checks runs in a fresh context.
3. If every check and acceptance item passes, the lead reads the diff. When
   it accepts all of it, it commits that tree. A change it does not accept
   goes back to the implementer as a failure to fix, as in step 4, so what it
   commits is always the tree a checker passed. Every review then treats that
   code as the lead's.
4. If any fails, the lead reads the report. A failure the brief already
   covers goes back to the implementer: the lead resumes it with the
   checker's report as written and returns to step 2. A failure that shows
   the design or the brief was wrong comes back to the lead, which settles it,
   rewrites the brief and starts a fresh implementer with it.

The lead runs one implementer or one checker at a time. From the brief until
the lead commits, only implementers edit the tree, unless the lead takes the
task back, which ends the implementers' part in it. Whoever writes a change
writes its changeset: an implementer when it is one of the brief's files, the
lead with code it writes itself. The lead resumes an implementer only when
the tree is as that implementer last saw it, apart from the lead committing
the implementer's own changes: no lead edit and no other commit since its
last reply. Earlier work it was briefed with counts as seen. Code the lead
writes itself is either committed after its own checker pass or left
uncommitted and listed under earlier work, and the next implementer after it
is a fresh one. When the same failure survives two implementer
fixes, the lead steps the implementer up one rung of [the ladder](#the-ladder)
for its next run in the same round, as
[Which roles step up](#which-roles-step-up) describes. That run is a fresh
implementer, started at the new rung's model and effort with a fresh brief
that carries the checker's report, not a resume of the one that gave up.

Three more rules keep the brief complete and the cost down:

- Before deciding a design for a component that embeds another component or
  is embedded in one, the lead reads both component pages in `components/`. A
  conflict between their guarantees is a decision to settle before briefing,
  or a [stop point](#stop-points) when it needs a design trade-off.
- The brief carries an `acceptance:` field for a change the classifier marks as rendering:
  the Section 508 checks the visual reviewer applies, as they bear on the
  change, and its defect checks. They are text at 200 % at the captured
  viewports (375, 768 and 1280 px) without loss or overlap, text contrast, a
  visible focus indicator in every state, including checked and tinted states,
  with at least 3:1 contrast against what it sits on (the visual reviewer
  treats a ring under 3:1 as a defect, not a Section 508 failure), and the
  rules in [`fixtures/README.md`](../../fixtures/README.md) for any fixture
  changed. The implementer writes to them and the checker probes them, so
  they are caught before a reviewer does. [Priorities](visual-review.md#priorities) lists the full set;
  the brief names only those that bear on the change.
- The lead follows up on the same task, including answers to the
  implementer's questions, by resuming the same implementer. It starts a
  fresh implementer with a fresh brief when the task changes, when a checker
  failure makes it rewrite the brief, when it steps the implementer up, when
  the tree has changed since the implementer last saw it (a lead edit, or a
  commit other than of the implementer's own changes), or after about three
  resumes, because each
  resume carries the whole earlier context. It never resumes a checker.

## Stop points

The lead session stops, notifies the person and waits at these points:

- A pull request is ready for review. A person reviews and merges every pull
  request.
- The `ci: version packages` release pull request is open after a merge with
  a changeset. Merging it publishes to npm, so only a person does; the lead
  reports which packages and bumps it carries and never merges it.
- An escalation in any reviewer's reply: a delivery-issue correction under the
  [corrections table](git-workflow.md#corrections), a claim still failing
  after three verification rounds, a blocking finding open in round three, or
  a disagreement the lead does not accept.
- A round ends with a code, visual or verification finding open as blocking in
  round three or later, whether new or carried, so a pull request never enters
  a fourth round for a blocking finding without the person. Scope findings are
  advisory: they never hold the push by severity and never trigger this
  escalation, but the lead answers each one. The lead sends the open findings and
  the options it sees.
- A blocking finding whose fix needs a design trade-off, or that sets two
  documented guarantees against each other. The lead stops when it first
  appears, with options, instead of trying fixes round by round. Likewise two
  documented guarantees (for example two component pages) found to conflict
  before briefing, when settling them needs a design trade-off: the lead stops
  with options.
- A delivery-scope discovery or tier change.
- A check that still fails after the implementer has worked on it at the
  ceiling of [the ladder](#the-ladder) and the lead has taken it back. The
  lead sends the checker's report and what it tried.
- A subagent that failed or hit a usage limit twice in a row, or the capture
  script writing no manifest twice in a row. A manifest that reports errors
  is not a stop point: the lead passes it to the visual reviewer.

Approval reaches the lead session as the person's message or an approving
review on the pull request. The lead never merges.

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
   - **Found by**: the role (lead, code review, scope review, verification or
     visual review) and the pull request or branch it was working on
   - for a Section 508 failure, the WCAG criterion it fails
4. **Mention it** in the subagent's reply, or the lead session's round
   summary, by issue number. The lead never adds the defect to the current
   pull request's scope.

Filing a bug issue is the one GitHub write every repository contributor role in
this orchestration may make. It needs no additional
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
  waits on it, one task at a time, and never commits. The checker runs in that
  tree only while the lead waits on it, and writes only build output. Other
  subagents write only private screenshots pages and files in their own
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
- **Short lookups stay with the lead.** It runs a short lookup itself, such
  as a git or `gh` command or a quick read of a check's output while
  diagnosing, in the background when it is long. A lookup subagent is for
  reading and digesting a lot of material, because every subagent pays a fixed
  cost to start a fresh context. The edit, build and check loop is not a
  lookup: it goes to the implementer and the checker as
  [Delegating implementation](#delegating-implementation) describes.
- **Stop-hook reminders.** A Stop-hook reminder about uncommitted or unpushed
  work while an implementer, a checker or a reviewer is running is not a
  reason to commit or push early. The lead says so and ends its turn.

## Other agents and Copilot

The loop runs only in Claude Code, because the project's hooks and the
permission rules in `.claude/settings.json` run only there. Codex,
OpenCode and Cursor stay available to a person outside the loop. Their work
enters it only as local commits that a Claude Code lead session sends through
the reviewing subagents before it pushes.

Copilot's pull request review stays advisory, on its
[path-scoped instructions](../../.github/instructions/). It is not a gate. The
lead session answers each Copilot finding as accepted, rejected with a reason,
or waiting on a person, and never passes Copilot's comments to a subagent.

## Notifications

The lead session sends a push notification when:

- it reaches a stop point: a pull request ready for review and merge, a
  release pull request, an escalation or a decision
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
Opus. Work that only judges, the code, scope and visual reviews, runs on Opus
at `high`, a fixed setting. Work whose scope is clear goes to Sonnet or Haiku
and starts low: Sonnet does work written to a brief, and Haiku does lookups.

| Role                         | Model                                                                     | Effort                        | Steps up                                                          |
| ---------------------------- | ------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------- |
| Lead                         | `claude-opus-5-5`                                                         | `high`; `xhigh` for High work | No; a person sets it                                              |
| Implementer                  | `sonnet` (`claude-sonnet-5-5`)                                            | `low`                         | On a [failed round](#stepping-up), to `opus` at `high` at most    |
| Checker                      | `sonnet` (`claude-sonnet-5-5`)                                            | `medium`                      | After a [failed run](#which-roles-step-up), to `sonnet` at `high` |
| Code review                  | `opus` (`claude-opus-5-5`)                                                | `high`                        | No; [fixed](#which-roles-step-up)                                 |
| Scope review                 | `opus` (`claude-opus-5-5`)                                                | `high`                        | No; fixed                                                         |
| Verification                 | `sonnet` (`claude-sonnet-5-5`)                                            | `high`                        | After a [failed run](#which-roles-step-up), to `opus` at `high`   |
| Visual review                | `opus` (`claude-opus-5-5`)                                                | `high`                        | No; fixed                                                         |
| Drift review                 | `claude-opus-5-5`                                                         | `high`                        | No                                                                |
| Lookups, read-only subagents | `claude-haiku-5-5`, or `claude-sonnet-5-5` when the lookup needs judgment | `low`                         | No                                                                |

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
| The brief was wrong | Missing context, an unclear task, the wrong files named, the build left out                          | The brief; the model and effort stay |
| It did too little   | Skipped a file, skipped the build, stopped early, ignored a rule the brief stated                    | Effort, one step                     |
| It knew too little  | The wrong approach, a misunderstanding of the system, the same mistake again after effort was raised | The model, one step                  |

#### Which roles step up

- **The implementer** steps up on a failed round: a verification claim
  fails, or a blocking finding lands, in code it wrote, or the same checker
  failure survives two of its fixes. A different finding in each round, or a
  checker failure it fixes, is ordinary work and does not count.
- **The checker** steps up after a failed run: the subagent errors, returns
  no usable report, or reports a check it did not run. A failing check is a
  result about the code, not a failed run. It steps up once, to `sonnet` at
  `high`, on the next checker the lead starts.
- **The verification** steps up after a failed run: the subagent errors,
  returns no reply, or returns one the lead cannot use. A failing claim, or a head that does not build, is a result
  about the code, not a failed run.
- **The reviewers** (code review, scope review and visual review)
  never change. A review that does too little passes what it should have
  flagged, and no failed round ever shows it, so reviewers stay at their row.
  A reviewer run that errors is rerun at the same setting.

#### The ladder

For the implementer, within the three rounds before the
[stop point](#stop-points). Each failed round moves it one rung. A checker
failure that survives two of its fixes also moves it one rung, on its next
run in the same round, so it can reach the ceiling before review round 3:

1. **First rung:** its row, `sonnet` at `low`.
2. **Second rung:** one step on the axis the lead diagnosed: `sonnet` at
   `medium` for too little, `opus` at `low` for too little knowledge.
3. **Third rung:** one more step, up to `opus` at `high`, the ceiling.
4. **Past the ceiling:** the lead takes the task back. If a review round is
   failing, the existing stop points apply; if a check still fails after the
   lead's own attempt, that is a stop point too.

The verification takes its one step on the next run of the same round. The lead never steps a role down within a delivery issue,
and it may take a task back and write it itself at any step.

The lead sets a step with the Agent tool's `model` and `effort` parameters,
which override the definition for that run. This section is the instruction
that allows those parameters, and only for the roles and steps above. The
lead writes each step in its round summary, for example
`Step-up: implementer, round 2, did too little (skipped a file the brief named), sonnet/low → sonnet/medium`.

### Revisiting the table

Revisit a row when these measures move:

- verification rounds to a passing result for High pull requests
- reviewer findings accepted versus dismissed (closures `fixed` against
  `justified` and `withdrawn` in the reviewers' replies)
- visual review findings accepted versus dismissed, and visible regressions
  found after a merge that the visual review passed
- defects that escaped to `main` or were first found in human review, and
  merged pull requests that a person later reverted or corrected
- usage-limit pressure: subagents or lead sessions stopped by limits
- review rounds per pull request
- reviewer cost per round, in tokens from each subagent's completion
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

| Decision                   | Outcome                                                                                                                                                                                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Models and effort          | Changed 2026-11-25: Opus leads and runs the code, scope and visual reviews at `high`; Sonnet implements at `low` and Sonnet and Haiku do other clearly scoped work, and they [step up](#stepping-up) on evidence. Revisit using [the measures](#revisiting-the-table)                               |
| Implementer and capture    | Decided 2026-11-22: the `implementer` subagent was added; see Delegation and checks for its use. Changed 2026-11-25: the lead runs the capture script in the background; the `visual-capture` subagent was removed, as a script run needs no clean context and a background command costs no tokens |
| Delegation and checks      | Decided 2026-11-25. The lead diagnoses and decides and delegates the code to the `implementer`, apart from the exceptions in [Delegating implementation](#delegating-implementation); a fresh `checker` subagent runs every check pass                                                              |
| Delivery record            | The issue owns the accepted outcome, scope, contract impact, claims and implementation approach; the pull request owns the implementation and evidence ([Process by tier](git-workflow.md#process-by-tier))                                                                                         |
| Pull request shape         | One pull request per independently reviewable change. Oversized work is split into separately releasable delivery issues rather than an in-repository specification stack                                                                                                                           |
| Drift review               | Not started. The skill and [areas](drift-review.md#areas) are ready; the `drift` label, the tracking issue and any scheduled task are not created                                                                                                                                                   |
| Screenshots                | The verifier and the visual reviewer may publish screenshots as a private page and name its URL in their reply ([Screenshots for visual claims](verification-harness.md#screenshots-for-visual-claims))                                                                                             |
| Evidence from consumers    | In-repository only. Consumer impact is an approved limitation plus a linked delivery issue in the consumer's repository ([Known limits](verification-harness.md#known-limits))                                                                                                                      |
| Labels                     | `risk:high`, `risk:standard` and `risk:light` exist. `package:styles` and `package:react` mark which package a bug affects; nothing reads them. A person may use `hold` to mark a pull request not to merge; nothing an agent does reads it                                                         |
| Ready without a prompt     | Changed 2026-11-25: the lead opens the pull request ready for review, after every review is clean; no hook gates it. The lead never marks a release pull request ready                                                                                                                              |
| Shared tooling package     | None                                                                                                                                                                                                                                                                                                |
| Agent merge                | Dropped 2026-11-25 (decided 2026-11-19). A person merges every pull request; `gh pr merge`, the MCP merge tool and auto-merge are denied in `.claude/settings.json`                                                                                                                                 |
| Review rounds              | Decided 2026-11-25. Repeat rounds review only what changed since the last review; advisory findings are batched; a blocking finding open in round three or later, or one that needs a design trade-off, stops for the person ([One round](#one-round), [Stop points](#stop-points))                 |
| Local review, replies only | Decided 2026-11-25. Every review runs on local commits before the first push and replies to the lead only; nothing posts records, notes or findings on GitHub, and the pull request opens only when the reviews are clean. The scope reviewer was added                                             |
| Subagents over sessions    | Decided 2026-11-19, changed 2026-11-25. One lead session per delivery issue; every independent role runs as a clean-context subagent from a `.claude/agents/` definition and replies to the lead only, replacing the orchestrator and per-role sessions                                             |
| Visual review trigger      | Decided 2026-11-27. `scripts/visual-capture/classify.mjs` replaced the rendering-path list, with `--classify`, a lockfile and manifest content rule, an output pre-check and the zero-difference verdict. Revisit by comparing visual reviews skipped with visible regressions found after merge    |
