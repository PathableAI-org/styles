---
name: orchestrate-stack
description: Lead one PathAble design-system delivery issue through a single implementation pull request, independent review and verification appropriate to its risk tier, and the repository's merge rules.
---

# Lead a delivery issue

Read [Orchestration](../../../docs/engineering/orchestration.md) and
[Git workflow](../../../docs/engineering/git-workflow.md) first. The delivery
issue owns the accepted outcome, scope, contract impact, claims and
implementation approach. This skill owns the execution loop.

## Boundaries

- You are the only writer who commits or pushes. The `implementer` may edit
  your working tree for one bounded task while you wait; no reviewing subagent
  edits it.
- Start every role from its `.claude/agents/` definition. Give reviewers and
  verification only the request fields below. Do not brief them with the
  author's explanation or another reviewer's findings.
- Leave each role at the model and effort in its definition unless
  [Stepping up](../../../docs/engineering/orchestration.md#stepping-up)
  explicitly allows a change.
- Merge only under [agent merge](../../../docs/engineering/git-workflow.md#agent-merge),
  only with the GitHub MCP merge tool and squash, and only after
  `pnpm merge:gate <pr>` passes. High and guardrail work wait for a person.
- Never poll. End the turn while long checks, subagents or CI run.
- A Stop-hook reminder about uncommitted or unpushed work while an implementer
  or a pre-push self-review runs is not a reason to commit or push early. Say
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
3. Tell the person which tier row applies, which subagents run, and whether the
   pull request waits for their merge approval.

If the accepted work is too large for one reviewable pull request, stop and
propose separately releasable delivery issues. Do not create a specification
stack inside the repository.

## Round

1. **Build.** Implement only the accepted issue. Delegate a task only when the
   files, behavior, constraints and checks are explicit. Add a changeset when
   published package code changes and run the checks routed by `AGENTS.md`.
   Give a rendering-path brief an `acceptance:` field. Run short commands
   yourself; a subagent is for reading a lot of material.
2. **Self-review.** Run the `pre-push-reviewer` with only the base branch, plus
   `since:` on a later push. Never skip it on a later push. Fix accepted
   findings, rerun affected checks and keep rejected findings out of other
   subagent requests.
3. **Push.** Before each push that starts or answers a round, bring the pull
   request body current: Change, Evidence and the visible-change description
   cover every commit in the round. Push and open or update one draft pull
   request with the matching risk label. Keep Decisions for the reviewer and
   Validation current.
4. **Check.** On the same pushed SHA, start:
   - `code-reviewer`, always;
   - `verifier`, for High work;
   - `visual-reviewer`, whenever the changed paths match the rendering paths
     in the visual-review guide, after you run the capture script yourself
     (see Requests).

   End the turn while they run.

5. **Read.** Read records with `pnpm review:show`, `pnpm verify:show` and
   `pnpm visual:show`. Answer every finding with a fix or a written
   justification. When every required record passes apart from advisory
   findings, the fix loop ends: no review has an open blocking finding, and for
   High work the latest verification report passes (no `violated`,
   `not established` or `blocked` claim and no failing or missing named story),
   as `docs/engineering/verification-harness.md` step 6 requires. Answer each advisory finding with a justification, a follow-up issue
   or a fix, prefer the first two outside the accepted scope, and put accepted
   fixes in one batch and one final round. Never start a round for a single
   advisory fix. Otherwise begin another round. Stop on an escalation,
   accepted scope/claim change, a round that ends with a blocking finding open
   in round three or later (new or carried), or a blocking finding whose fix
   needs a design trade-off or sets two documented guarantees against each
   other; for the last, stop when it first appears. Send the open findings and
   your options.
6. **Ready.** Mark the pull request ready only when its required records pass.
   The ready hook runs `pnpm verify:gate` for High work.
7. **Merge or stop.** High and guardrail work stop for a person. Otherwise keep
   the branch current with `main`; if the pull request's own diff changes,
   repeat the affected reviews. When CI and `pnpm merge:gate <pr>` pass, squash
   merge through the GitHub MCP tool and notify the person.

## Requests

Pass these fields and nothing else to code review or verification:

```text
branch: <branch>
sha: <pushed 40-character SHA>
base: <40-character base SHA>
slice: fix
pr: <number>
round: <n>
previous: <previous record ID, or none>
previous sha: <40-character SHA reviewed in the previous round, or none>
answers: <finding ID and fixing commit or justification, or none>
```

Verification also gets `run instructions changed: <what, or none>`. The
pre-push reviewer gets only `base: <branch>`, plus
`since: <40-character SHA>` on a later push: the last commit a pre-push
self-review covered. The lead passes the full SHA from `git rev-parse`.

When the round has a visual review, run the capture script yourself; no
subagent takes the screenshots. Make sure Docker is running: if `docker info`
fails, start it with `(nohup dockerd > /tmp/dockerd.log 2>&1 &)` and wait for
`docker info` to succeed, at most two minutes. If it never does, add
`--no-pixels` and say so in the round summary. Then run it in the background,
with its output sent to a log file:

```sh
mkdir -p <scratchpad>/visual-capture
node scripts/visual-capture.mjs --base <base SHA> --head <pushed SHA> \
  --out <scratchpad>/visual-capture/<pr>-round-<n> \
  > <scratchpad>/visual-capture/<pr>-round-<n>.log 2>&1
```

When it finishes, read only the script's summary lines (the manifest path, the
counts and any error lines) from the end of the log. Never read the
screenshots, the manifest's contents or the full log. Leave the worktrees: the
visual reviewer reuses them and removes them. The script exits non-zero
whenever the manifest has any `errors` entry, so a non-zero exit is not a
failed run. When it writes a manifest, pass it to the visual reviewer even if
it reports errors: a head that does not build is the reviewer's blocking
finding, a result about the code, and a single capture error is something the
reviewer re-captures. Re-run once only when the script writes no manifest; a
second run with no manifest is a stop point.

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
checks: <commands to run before replying>
```

For `acceptance:`, name the rules that bear on the change from
[Priorities](../../../docs/engineering/visual-review.md#priorities) and
[Delegating implementation](../../../docs/engineering/orchestration.md#delegating-implementation).

Run one implementer at a time and do not edit the working tree until it
replies. Read and own the diff before committing it. Resume the same
implementer for follow-up on the same task; start a fresh one with a fresh
brief when the task changes or after about three resumes.

## Release and wrap-up

After a changeset pull request merges, report any open `ci: version packages`
pull request and never merge or mark it ready. Remove worktrees, summarize the
records and checks, and name the drift-review areas touched by the merged diff.
