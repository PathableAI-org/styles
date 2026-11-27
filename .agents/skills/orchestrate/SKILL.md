---
name: orchestrate
description: Lead one PathAble design-system delivery issue through local implementation, independent local review and verification appropriate to its risk tier, and a single pull request opened ready for a person to review and merge.
---

# Lead a delivery issue

Read [Orchestration](../../../docs/engineering/orchestration.md) and
[Git workflow](../../../docs/engineering/git-workflow.md) first. The delivery
issue owns the accepted outcome, scope, contract impact, claims and
implementation approach. This skill owns the execution loop.

## Boundaries

- You are the only writer who commits or pushes. You diagnose and decide; the
  `implementer` edits and builds your working tree for one bounded task while
  you wait, and a fresh `checker` runs the checks on it. No reviewing subagent
  edits it.
- Start every role from its `.claude/agents/` definition. Give reviewers and
  verification only the request fields below. Do not brief them with the
  author's explanation or another reviewer's findings.
- Leave each role at the model and effort in its definition unless
  [Stepping up](../../../docs/engineering/orchestration.md#stepping-up)
  explicitly allows a change. Reviewers never step up; rerun one at the same
  setting if its run errors.
- Every subagent replies to you only. No role posts records, notes or findings
  on GitHub; the pull request body is yours, written for the human reviewer.
- Never merge, never enable auto-merge and never mark a release pull request
  ready. A person merges every pull request.
- Never poll. End the turn while long checks, subagents or CI run.
- A Stop-hook reminder about uncommitted or unpushed work while an implementer,
  a checker or a reviewer runs is not a reason to commit or push early. Say
  so and end the turn.

## Start

From the person, take the delivery issue number.

1. Read the issue and its risk tier. Confirm the outcome, scope, contract
   impact, dependencies, claims and implementation approach are sufficient.
   For High new behaviour, stop unless a maintainer has accepted the issue.
   Raise an understated tier; never lower one. For a component that embeds
   another component or is embedded in one, read both component pages in
   `components/`; settle any conflict between their guarantees before
   briefing. When settling it needs a design trade-off, stop and send the
   person the conflict and the options.
2. Find an existing pull request linked to the issue and resume it, or branch
   from current `origin/main` as `<type>/<short-slug>`.
3. Tell the person which tier row applies and which subagents run.

If the accepted work is too large for one reviewable pull request, stop and
propose separately releasable delivery issues. Do not create a specification
stack inside the repository.

## Round

1. **Build.** Implement only the accepted issue, through the loop in
   [Delegating implementation](../../../docs/engineering/orchestration.md#delegating-implementation):
   - Diagnose and decide yourself. Settle every open design question before
     briefing; a short lookup is yours to run, a subagent is for reading a lot
     of material.
   - Start the `implementer` with the [brief](#implementer-brief) and end the
     turn. It edits and builds, and does not run the checks. Write code
     yourself only where
     [Delegating implementation](../../../docs/engineering/orchestration.md#delegating-implementation)
     keeps it with the lead: the code behind a High trigger, a task you take
     back on the step-up ladder, or an edit whose brief would be at least as
     long as its diff, which you name in the round summary as a lead edit.
     Your own code goes through a checker too.
   - Then start a **new** `checker` with only the
     [check request](#check-request) and end the turn. Its checks are the ones
     `AGENTS.md` "Before committing" routes for the changed paths plus every
     check the work's tier requires in the
     [Process by tier](../../../docs/engineering/git-workflow.md#process-by-tier)
     evidence list (for example `pnpm --filter @pathableai/react check:package`
     and `check:types` for Standard React changes); you pick them from both
     lists. Never resume a checker, and
     never send it the brief's reasoning or the implementer's reply.
   - If anything fails, resume the implementer with the checker's report as
     written. When the failure shows the design or the brief was wrong,
     settle it yourself, rewrite the brief and start a fresh implementer with
     the new brief. Then start another new checker.
   - When the same failure survives two implementer fixes, start a fresh
     implementer one rung up
     [the ladder](../../../docs/engineering/orchestration.md#the-ladder), with
     a fresh brief that carries the checker's report. Past the ceiling, take
     the task back; if the check still fails after your own attempt, stop for
     the person.
   - Commit only when a checker reports every check and acceptance item
     passed on the tree you commit, and commit all of it: send a change you do
     not accept back to the implementer as a failure. When published package
     code changes, whoever writes the code writes the changeset: put it in
     the brief's `files` for an implementer, or write it with your own code.
2. **Review round.** Nothing is pushed yet. On the committed local `HEAD`,
   start in parallel, each in a fresh context with only its
   [request fields](#requests):
   - `code-reviewer`, always;
   - `scope-reviewer`, always;
   - `visual-reviewer`, only when the capture's verdict is `review`. First run
     `node scripts/visual-capture.mjs --base <base SHA> --head <local head SHA> --classify`
     yourself and quote its verdict line in the round summary; exit 0 means a
     visual review is required, exit 3 means it is not. On exit 0, run the
     capture (see Requests);
   - `verifier`, for High work.

   End the turn while they run. Each replies to you only.
3. **Answer.** Read every reply. Answer every finding with a fix, which goes
   through step 1 (implementer, then a new checker, then your commit), or a
   written justification. Start the next review round with each reviewer's own
   previous findings and your answers, plus `since: <sha>` so it reviews only
   what changed. Repeat steps 2 and 3 until no code, visual or verification
   finding is open as blocking, every scope finding is answered, every advisory
   finding is fixed or justified, and for High work the
   verifier reports every claim `established` and no failing or missing named
   story. Prefer a justification or a follow-up issue for an advisory finding
   outside the accepted scope, put accepted fixes in one batch, and never
   start a round for a single advisory fix. Stop for the person on an
   escalation, an accepted scope or claim change, a code, visual or verification finding open as blocking in
   round three or later (new or carried; scope findings never count), or a blocking finding whose fix
   needs a design trade-off or sets two documented guarantees against each
   other; for the last, stop when it first appears. Send the open findings and
   your options.
4. **Push.** Only when the loop is clean: bring the pull request body current
   (Change, Evidence, Decisions for the reviewer and Validation), with the
   Evidence section summarising each reviewer's final result and the round
   count. Push, and open or update one pull request with the matching risk
   label, ready for review and not draft, since all review is done. Post no
   reviewer findings or records on it.
5. **CI.** Fix a CI failure through steps 1 to 3 (fix, checks, a review round
   on the fix commits) before pushing again.
6. **Hand off.** Notify the person. They review and merge. Never merge.

## Requests

Pass these fields and nothing else to each reviewer. Reviewers read the local
commits (`git diff <base>...<head>`); nothing has been pushed. Pass full SHAs
from `git rev-parse`.

Code reviewer:

```text
base: <40-character base SHA>
head: <40-character local head SHA>
round: <n>
previous: <its own earlier findings with your answers, or none>
since: <40-character SHA it reviewed last round, or none>
```

Scope reviewer: the same fields, plus
`task: <delivery issue URL or number; with no issue, the person's task text quoted verbatim>`.

Visual reviewer: `base`, `head`, `round`, `previous`, `task` as above, plus
`capture: <manifest path>` and, from round 2,
`previous capture: <path to the previous round's manifest, or none>`.

Verifier: `base`, `head`, `round`, plus
`claims: <the numbered claims from the accepted issue, each with its observation and evidence channel>` and
`run instructions changed: <what, or none>`.

Never judge by hand whether a diff needs a visual review; the classifier
(`scripts/visual-capture/classify.mjs`) owns the rule. Run
`node scripts/visual-capture.mjs --base <base SHA> --head <local head SHA> --classify`
first (no build, about a second). On exit 3, no review is required: start no
capture and no visual reviewer. On exit 0, run the capture script yourself; no
subagent takes the screenshots. Run it in the background, with its output
sent to a log file:

```sh
mkdir -p <scratchpad>/visual-capture
node scripts/visual-capture.mjs --base <base SHA> --head <local head SHA> \
  --out <scratchpad>/visual-capture/round-<n> \
  > <scratchpad>/visual-capture/round-<n>.log 2>&1
```

When it finishes, read only the script's summary lines (the manifest path, the
`Verdict:` line, the counts and any error lines) from the end of the log. Never read the
screenshots, the manifest's contents or the full log. Leave the worktrees: the
visual reviewer reuses them and removes them. The script exits non-zero
whenever the manifest has any `errors` entry, so a non-zero exit is not a
failed run. When it writes a manifest, pass it to the visual reviewer even if
it reports errors: a head that does not build is the reviewer's blocking
finding, a result about the code, and a single capture error is something the
reviewer re-captures. Re-run once only when the script writes no manifest; a
second run with no manifest is a stop point.

Start the visual reviewer only when the verdict line says `review`. For
`not-required`, `no-render-change` and `no-difference`, record the verdict and
the capture summary as the round's visual evidence and start no reviewer.
`--force` captures anyway, when you or a person want a review on a diff the
rule skips. It skips the classifier gate and the output pre-check, always ends
with the verdict `review`, and, with no rendering paths, samples the first
story of each stories file. For visual-only styles work, always run the
capture with `--force`: the visual review is its evidence, so the reviewer
always runs and a missing visible change is reported as `missing`.

The visual reviewer gets the manifest path plus the common request fields.
From round 2 it also gets `previous capture: <path to the previous round's
capture manifest, or none>`.

## Implementer brief

The implementer is not an independent check and gets the full decided task:

```text
branch: <checked-out branch>
task: <bounded behavior to implement>
files: <files to change or add>
constraints: <owning docs, public contracts and explicit exclusions>
acceptance: <Section 508 and defect checks the visual reviewer applies that bear on the change, for a rendering path; or none>
build: <build command to run before replying, or none>
earlier work: <files holding uncommitted changes from an earlier implementer or from you, each with keep, rework or remove for this task; or none>
report: <the checker failures this task must still fix, quoted as written; or none>
```

Whenever a fresh implementer starts on a tree that still holds uncommitted
work, whether an earlier implementer's or your own, leave that work in place and say under
`earlier work` what to do with each file. Under `report`, pass only the
failures that still apply to the new task: all of them on a step-up or after
about three resumes, and none that a rewritten design makes moot. A fresh
implementer that starts from a committed tree gets `earlier work: none`.

For `acceptance:`, name the rules that bear on the change from
[Priorities](../../../docs/engineering/visual-review.md#priorities) and
[Delegating implementation](../../../docs/engineering/orchestration.md#delegating-implementation).

Run one implementer at a time. Read and own the diff before committing it. Resume the same
implementer for follow-up on the same task, including fixes for a checker's
report and answers to its questions; start a fresh one with a fresh brief
when the task changes, when a checker failure makes you rewrite the brief,
when you step it up, when the tree has changed since it last saw it (an edit
of yours, or a commit other than of its own changes), or after about three
resumes.

From the brief until you commit, only implementers edit the tree, unless you
take the task back, which ends the implementers' part in it. Resume an
implementer only when the tree is as it last saw it, apart from your commit
of its own changes: no edit of yours and no other commit since its last
reply. Earlier work it was briefed with counts as seen. Code you write
yourself is either committed after its own checker pass or left uncommitted
and listed under `earlier work`, and the next implementer after it is a fresh
one.

## Check request

Pass these fields and nothing else to a new `checker`:

```text
branch: <checked-out branch>
checks: <every check AGENTS.md routes for the changed paths and every check the tier's evidence list requires, as commands in order>
acceptance: <the brief's acceptance items, each with the fixture folders or story IDs to probe it on; or none>
```

Leave out the task, the reasoning, the implementer's reply and any expected
result. One checker runs every command in the request. Run one checker at a
time and start a new one for every pass through the checks.

## Release and wrap-up

After a changeset pull request merges, report any open `ci: version packages`
pull request and never merge or mark it ready. Remove worktrees, summarize the
review results and checks, and name the drift-review areas touched by the merged diff.
