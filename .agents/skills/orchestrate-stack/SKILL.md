---
name: orchestrate-stack
description: Act as the lead session for one PathAble design-system delivery issue. Specify, plan and implement it as its risk tier requires, run the pre-push self-review, code review, verification and visual review as clean-context subagents on each pushed SHA, answer their findings, merge Standard and Light pull requests under agent merge, stop for a person at High work and the other stop points, and print status from pull request and notes state.
---

# Lead a delivery issue

Read [Orchestration](../../../docs/engineering/orchestration.md) first. It
owns the loop by tier, the stop points, how subagents stay independent,
notifications and the models table. Also read
[Git workflow](../../../docs/engineering/git-workflow.md), including
[Risk tiers](../../../docs/engineering/git-workflow.md#risk-tiers) and
[Agent merge](../../../docs/engineering/git-workflow.md#agent-merge). This
skill supplies the procedure.

## Boundaries

- You are the only writer of the issue's branches. Subagents never edit them.
- Start every independent role from its `.claude/agents/` definition with the
  Agent tool, never as a fork and never as a general-purpose agent. Pass only
  the request fields under [Requests](#requests). Never describe the change,
  its intent, what to check, or another subagent's findings.
- Keep pre-push self-review findings out of every request and the pull
  request body. Keep Copilot's comments out of every request.
- Read results from the notes (`pnpm review:show`, `pnpm verify:show`,
  `pnpm visual:show`), not from subagents' replies.
- Merge only under agent merge, only with the GitHub MCP tool
  `merge_pull_request` and `merge_method: squash`, and only after
  `pnpm merge:gate <pr>` passes. Never enable GitHub auto-merge. Never merge,
  mark ready or touch the `ci: version packages` pull request.
- Never poll. Run long commands and subagents in the background and end your
  turn; you are woken when they finish. While waiting on CI or a person,
  schedule at most one check-in about two hours out (`send_later` in cloud
  sessions), and do not reschedule it as a loop.
- Use `gh api` REST paths or the GitHub MCP tools, never `gh pr` or
  `gh issue` subcommands; see
  [Working without GraphQL](../../../docs/engineering/git-workflow.md#working-without-graphql).
- When you find a defect unrelated to the current change, file a bug issue as
  [Defects found along the way](../../../docs/engineering/orchestration.md#defects-found-along-the-way)
  describes, list it in your round summary, and keep it out of the current
  pull request.

## Start

From the person: the delivery issue number.

1. `gh api repos/{owner}/{repo}/issues/<N> --jq .body` and read its **Risk
   tier** section: the tier, its triggers, whether the work is new behaviour
   or a fix inside an existing contract, and whether the maintainer asked for
   a specification. Work that only changes how `@pathableai/styles` looks is
   [visual-only](../../../docs/engineering/git-workflow.md#visual-only-styles-work)
   and gets no specification unless the maintainer explicitly overrides that
   in the issue. If the tier is missing or a trigger obviously matches a
   higher tier, stop and ask. Never lower it.
2. Look for an existing feature directory (`specs/{number}-{slug}/` naming
   the issue) and pull requests for the issue, and resume from the phase they
   show:

   ```sh
   gh api "repos/{owner}/{repo}/pulls?state=all&per_page=100" \
     | jq --arg n '#<N>' '[.[] | select((.body // "") | contains($n)) | {number, head: .head.ref, state, draft}]'
   ```

3. Tell the person in a few lines: the row of the loop table you will follow,
   the subagents each round runs, whether the pull requests merge under agent
   merge, and the stop points. Then start.

## Phases

| Work                  | Phases                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------ |
| High, new behaviour   | [Specification](#specification), stop; [Plan](#plan), stop; one [round](#rounds) per slice |
| High, fix             | One [round](#rounds) loop on one pull request, slice ID `fix`                              |
| Standard, specified   | [Specification](#specification) combined with the plan, stop; one round loop per slice     |
| Other Standard, Light | One round loop on one pull request, slice ID `fix`                                         |
| Visual-only styles    | One round loop on one pull request, slice ID `fix`, at every tier; never specified         |

A person's approval of a stop starts the next phase without asking again.
When the approved predecessor has not merged, cut the next branch from it and
target it as the base.

### Specification

1. Run `speckit-specify` for exactly this issue, then `speckit-clarify`. Ask
   the person your clarification questions and end your turn while you wait.
2. Write `spec.md` with the tier and triggers in its header, and
   `verification.md` with numbered claims (`V-001`, …), each with its
   meaningful violation, its observation and its evidence channel, as
   [Claims follow verification](../../../docs/engineering/verification-harness.md#claims-follow-verification)
   describes.
3. For combined specification and plan, continue with [Plan](#plan) on the
   same branch.
4. Push, open the pull request with the
   [template](../../../.github/pull_request_template.md), a Conventional
   Commit title, `Contributes to #<N>`, the `risk:` label and Decisions for
   the reviewer first, mark it ready when its checks pass, notify the person,
   and stop.

Do not plan classes, props or slices unless the work is combined. A scope
conflict with the delivery issue is a stop point.

### Plan

1. `export SPECIFY_FEATURE_DIRECTORY=specs/<number>-<slug>`, then run
   `speckit-plan` on the `{number}-{slug}-plan` branch, skipping its "Agent
   context update" step: `plan.md` with the slice table, `quickstart.md`,
   `research.md` and any `contracts/`. Order slices source first.
2. After committing, check every slice with
   `pnpm verify:request --feature <dir> --slice <ID> --sha HEAD`: it must give
   no warnings.
3. Push, open the plan pull request with Decisions for the reviewer first,
   mark it ready when checks pass, notify the person, and stop.

Do not change acceptance criteria or claims here: that is a specification
correction and a stop point.

## Rounds

For each slice or single pull request, on its
[feature branch](../../../docs/engineering/git-workflow.md#feature-branches)
or a `<type>/<slug>` branch:

1. **Build.** On the first implementation branch, run `speckit-tasks`. Implement
   only the current scope, source first. Commit Conventional Commits, add the
   changeset, and run the
   [Before committing](../../../AGENTS.md#before-committing) checks.
2. **Self-review.** `git fetch origin <base>`, then run the
   `pre-push-reviewer` subagent with only the base branch. Fix what you
   accept, re-run the checks, and note a reason for each finding you reject.
3. **Push.** Push and open or update the draft pull request (`draft: true`)
   with its `risk:` label. For agent-merge work, write the body now, with
   Decisions for the reviewer first and every intended visible change in
   **Change**, and keep it current each round.
4. **Check.** Start the round's subagents in the background on the pushed
   SHA, each with its [request](#requests):
   - `code-reviewer`, always
   - `verifier`, for a slice or a High fix
   - `visual-reviewer`, for visual-only styles work at any tier, and for
     agent-merge work whose changed files
     (`gh api --paginate repos/{owner}/{repo}/pulls/<n>/files --jq '.[].filename'`)
     include a
     [rendering path](../../../docs/engineering/visual-review.md#when-a-visual-review-runs)

   End your turn.
5. **Read.** As each finishes, read its record from the notes. Answer every
   finding, advisory ones included: fix it, or write a justification you will
   pass in the next request. A visual `tier` finding means the work is
   Standard: raise the label and the Tier section first. A blocking finding
   closed as `justified` goes in Decisions for the reviewer. Start a new round
   from step 1 until no record has an open blocking finding, claim or
   escalation. An escalation is a stop point: stop at a clean, pushed state
   and notify the person with the record pointer.
6. **Evidence.** For a slice, when `pnpm verify:gate` passes, run
   `pnpm verify:render --write`, commit the evidence-only result and push. The
   body names the verified SHA and run.
7. **Ready.** Mark the pull request ready with the GitHub MCP tool
   `update_pull_request` and `draft: false`. The hook runs the gate.
8. **Merge or stop.** For High work, notify the person that it waits on their
   review, and stop. For agent-merge work:
   - Keep it [up to date](../../../docs/engineering/git-workflow.md#keeping-up-to-date):
     when it falls behind `main`, merge `origin/main` in (or
     `update_pull_request_branch`) and push. If that changed the pull
     request's own diff, run a new round. A slice needs a new verification
     round after any merge from `main`.
   - Wait for CI on the head by ending your turn with one check-in scheduled.
   - When `pnpm merge:gate <pr>` passes, merge with `merge_pull_request` and
     `merge_method: squash`. The hook reruns the gate.
   - If the gate reports the pull request not eligible, notify the person
     with its reason and stop.
   - After merging, notify the person with the number, tier and changeset,
     then go on to the next slice or [Release](#release).

Slice N+1 may start once slice N's verification gate passes: cut its branch
from N's branch and target N's branch. Fix later findings on N and merge N
upward; never rebase a pushed branch. After N merges, merge `origin/main`
into N+1.

### Requests

Pass exactly these fields, one per line, and nothing else:

```text
branch: <branch>
sha: <pushed 40-char SHA>
base: <40-char base SHA>
slice: <slice ID, or fix>
feature: <specs/{number}-{slug}, or none>
pr: <number>
round: <n>
previous: <previous record ID, or none>
answers: <for each open finding ID, the fixing commit or the justification, or none>
```

The `pre-push-reviewer` gets only `base: <branch>`. The verifier also gets
`run instructions changed: <what, or none>`. Keep every subagent of a round on
the same SHA.

## Release

After a pull request with a changeset merges, check for the release pull
request:

```sh
gh api "repos/{owner}/{repo}/pulls?state=open&per_page=100" \
  | jq '[.[] | select(.title == "ci: version packages") | {number, head: .head.ref, updated_at}]'
```

When one is open, notify the person that it is waiting on them, with its
number, packages and bumps. Merging it publishes to npm. Never merge it or
mark it ready.

## Status

On request, and before each notification that waits on the person, print one
table. Fetch first (`git fetch origin --quiet`). For each pull request of the
issue, run `pnpm notes:sync <pr>`, then:

```sh
checks() { gh api "repos/{owner}/{repo}/commits/$1/check-runs" --jq '[.check_runs[] | .conclusion // .status] | group_by(.) | map("\(length) \(.[0])") | join(", ")'; }
newest() { git rev-list "origin/$2..$3" | grep -m1 -F -f <(git notes --ref="$1" list | cut -d' ' -f2); }
summary='"round \(.round); blocking \([.findings[] | select(.severity == "blocking")] | length); advisory \([.findings[] | select(.severity == "advisory")] | length); escalations \(.escalations | length)"'
r=$(newest review <base-branch> <head-sha>);  [ -n "$r" ] && pnpm -s review:show "$r" 2>/dev/null | jq -r "$summary"
w=$(newest visual <base-branch> <head-sha>);  [ -n "$w" ] && pnpm -s visual:show "$w" 2>/dev/null | jq -r "$summary"
v=$(newest verification <base-branch> <head-sha>)
[ -n "$v" ] && pnpm -s verify:show "$v" | jq -r '[.runId[0:8], (.claims | group_by(.result) | map("\(length) \(.[0].result)") | join(", ")), "stories not passing \([.stories[] | select(.status != "passing")] | length)", "escalations \(.escalations | length)"] | join("; ")'
```

Print:

```text
Issue #<N> (<tier>)
| Slice | PR | Head SHA | Review | Visual | Verify | PR state | Merge gate | Blockers |
```

PR state is draft, ready or merged, plus `checks <head-sha>`. Merge gate is
the first line of `pnpm -s merge:gate <number>` for agent-merge work. End with
**Open decisions**: each question put to the person and not yet answered, or
`Open decisions: none`. A bare approval such as "proceed" approves only the
stop it plainly answers; ask each other open question again by name.

## Wrap-up

When the last phase has merged:

1. Print the final status, including any open `ci: version packages` pull
   request.
2. Remove leftover worktrees under your scratchpad
   (`git worktree list`, then `git worktree remove`), and list any you could
   not remove.
3. Match the merged pull requests' changed paths against the area pathspecs in
   [Drift review](../../../docs/engineering/drift-review.md#areas) and report
   the touched area IDs. File nothing.
