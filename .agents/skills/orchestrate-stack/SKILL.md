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
- Start every role from its `.claude/agents/` definition. Give reviewers,
  verification and visual capture only the request fields below. Do not brief
  them with the author's explanation or another reviewer's findings.
- Leave each role at the model and effort in its definition unless
  [Stepping up](../../../docs/engineering/orchestration.md#stepping-up)
  explicitly allows a change.
- Merge only under [agent merge](../../../docs/engineering/git-workflow.md#agent-merge),
  only with the GitHub MCP merge tool and squash, and only after
  `pnpm merge:gate <pr>` passes. High and guardrail work wait for a person.
- Never poll. End the turn while long checks, subagents or CI run.

## Start

From the person, take the delivery issue number.

1. Read the issue and its risk tier. Confirm the outcome, scope, contract
   impact, dependencies, claims and implementation approach are sufficient.
   For High new behaviour, stop unless a maintainer has accepted the issue.
   Raise an understated tier; never lower one.
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
2. **Self-review.** Run the `pre-push-reviewer` with only the base branch. Fix
   accepted findings, rerun affected checks and keep rejected findings out of
   other subagent requests.
3. **Push.** Push and open or update one draft pull request with the matching
   risk label. Keep Decisions for the reviewer, Change, Evidence and Validation
   current.
4. **Check.** On the same pushed SHA, start:
   - `code-reviewer`, always;
   - `verifier`, for High work;
   - `visual-capture` and then `visual-reviewer`, whenever the changed paths
     match the rendering paths in the visual-review guide.

   End the turn while they run.

5. **Read.** Read records with `pnpm review:show`, `pnpm verify:show` and
   `pnpm visual:show`. Answer every finding with a fix or a written
   justification and begin another round. Stop on an escalation, accepted
   scope/claim change, or third-round blocking result.
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
answers: <finding ID and fixing commit or justification, or none>
```

Verification also gets `run instructions changed: <what, or none>`. The
pre-push reviewer gets only `base: <branch>`.

Visual capture gets:

```text
base: <40-character base SHA>
head: <pushed 40-character SHA>
out: <scratchpad>/visual-capture/<pr>-round-<n>
```

The visual reviewer gets that manifest path plus the common request fields.

## Implementer brief

The implementer is not an independent check and gets the full decided task:

```text
branch: <checked-out branch>
task: <bounded behavior to implement>
files: <files to change or add>
constraints: <owning docs, public contracts and explicit exclusions>
checks: <commands to run before replying>
```

Run one implementer at a time and do not edit the working tree until it
replies. Read and own the diff before committing it.

## Release and wrap-up

After a changeset pull request merges, report any open `ci: version packages`
pull request and never merge or mark it ready. Remove worktrees, summarize the
records and checks, and name the drift-review areas touched by the merged diff.
