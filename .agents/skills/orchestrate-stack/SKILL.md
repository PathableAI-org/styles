---
name: orchestrate-stack
description: Act as the orchestrator for one PathAble design-system delivery issue. Start and brief the specification, plan, implementation, verification, review and visual review sessions its risk tier needs, with each role's model and effort; relay approvals, escalations, agent merges and the release stop point; print feature status from pull request and notes state. Never edits branches, reads code, merges, approves or marks ready.
---

# Orchestrate a feature

<!-- Adapted from pathableai-org/pre-ets .agents/skills/orchestrate-stack/SKILL.md @ f2ee390. -->

Read [Orchestration](../../../docs/engineering/orchestration.md) first. It
owns the lifecycle by tier, the stop points, the concurrency cap, what you may
read, notifications, the models-and-effort table and the recorded decisions. This
skill supplies the procedure and the brief templates under `references/`. Also
read [Risk tiers](../../../docs/engineering/git-workflow.md#risk-tiers) and
[Sessions and roles](../../../docs/engineering/verification-harness.md#sessions-and-roles)
and [Agent merge](../../../docs/engineering/git-workflow.md#agent-merge).

## Boundaries

- Never edit, commit, push, merge, approve or mark a pull request ready. The
  owning session does Git work, as
  [Git workflow](../../../docs/engineering/git-workflow.md) describes.
- Read state only: REST reads through `gh api` (issues, pulls, check runs,
  reviews, changed files) or the GitHub tools, `pnpm notes:sync <pr>` (it
  writes only local notes), `pnpm verify:show`, `pnpm review:show`,
  `git notes --ref=<ref> list`, `git rev-list`, the slice table in `plan.md`
  through `git show <sha>:<path>`, and session status. Never read diffs,
  source files or transcripts; that rules out opening source files and running
  `git diff` in any form. Send a question about code to the session that owns
  it.
- Never poll or loop on CI. Act on a session's report message, a person's
  message, a status request, or the one fallback check-in under
  [Starting a role session](#starting-a-role-session).
- Respect the cap: at most four working sessions, one feature.
- Use `gh api` with REST paths, never `gh pr` or `gh issue` subcommands; they
  use GraphQL, which cloud sessions block.

## Start

From the person: the delivery issue number. Then:

1. `gh api repos/{owner}/{repo}/issues/<N> --jq .body` and read its **Risk
   tier** section: the tier, its triggers, and whether the work is new
   behaviour or a fix inside an existing contract. If the tier is missing or a
   trigger obviously matches a higher tier, stop and ask. Never lower it.
2. Look up the feature directory if one exists (`specs/{number}-{slug}/`
   naming the issue) and any open pull requests for it:

   ```sh
   gh api "repos/{owner}/{repo}/pulls?state=all&per_page=100" \
     | jq --arg n '#<N>' '[.[] | select((.body // "") | contains($n)) | {number, head: .head.ref, state, draft}]'
   ```

   Resume from the phase the state shows instead of restarting.

3. Pick the row in the doc's lifecycle table. Tell the person, in a few lines,
   the sessions you will start, their models and efforts, when each starts
   (verification, review and visual review at the first push), whether its
   pull requests merge under agent merge, and the stop points. Then start the
   first phase.

## Starting a role session

For each session:

1. Render its brief: `references/common.md` followed by the role's template,
   with every `{{slot}}` filled. Never write a brief freehand or shorten the
   templates. `{{orchestrator_id}}` is mandatory in every brief; take it from
   your own session status. Take `{{model}}` and `{{effort}}` from the doc's
   models-and-effort table for the role and tier. A slot you cannot fill means
   a missing identifier: get it from state or ask, never guess.
2. Start it on the branch the brief names (in a cloud session, pass that
   branch as the session's outcome branch). When the role's model or effort is
   above yours, start it with the holding prompt
   `Reply "ready" and wait for your brief.`, raise its model and effort with
   the session tools, then send the brief with the session messaging tool.
   Otherwise pass `model` and `effort` at start with the brief as the prompt.
3. Record its name and session ID. Peers get each other's IDs in their briefs.
4. Schedule one fallback check-in, about two hours out (`send_later` in cloud
   sessions), whenever you start or brief a session that owes you a report.
   Record the returned ID next to that session. When its report arrives first,
   cancel the check-in before acting on the report. When the check-in fires,
   read pull request and session status once and act on what they show. Do
   not reschedule it as a loop.

## Phases

| Phase                         | Session and template                                                                                                        | Identifiers to pass                                                                             | Next trigger                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Specification (High)          | `spec`, `references/spec.md`                                                                                                | Issue, tier and triggers, base `origin/main`                                                    | Its report names the draft pull request and the feature directory. Stop. |
| Combined (specified Standard) | `spec`, `references/spec.md` with `{{combined}}` = yes                                                                      | Same                                                                                            | Same. Stop.                                                              |
| Plan (High)                   | `plan`, `references/plan.md`                                                                                                | Issue, tier, feature directory, specification branch and whether it is merged                   | Its report names the draft plan pull request. Stop.                      |
| Implementation                | `impl`, `references/implementer.md`                                                                                         | Issue, tier, feature directory, slice IDs, first slice and its base branch, merged or not       | Each slice's push, results and readiness, below                          |
| Verification (orchestrated)   | `verify`, `references/verifier.md`, at the first `pushed`                                                                   | Feature directory, tier, implementation session ID, orchestrator ID, first request              | Its pointer to the implementation session; later requests come from it   |
| Review (orchestrated)         | `review`, `references/reviewer.md`, at the first `pushed`                                                                   | Same                                                                                            | Same                                                                     |
| Visual review (agent merge)   | `visual`, `references/visual-reviewer.md`, at the first `pushed`, when the pull request touches a rendering path            | Pull request number and branch, tier, implementation session ID, orchestrator ID, first request | Same                                                                     |
| High fix                      | All three with `{{fix}}` = yes; peers at the first `pushed`                                                                 | Issue, tier, triggers, base `origin/main`; no slices; `{{feature_dir}}` if any                  | One pull request through the same loop. Stop at ready.                   |
| Other Standard, Light         | `impl` with `{{fix}}` = yes and `{{agent_merge}}` = yes; `review` and, for a rendering path, `visual` at the first `pushed` | Issue, tier                                                                                     | Its `merged` report. Notify; no stop.                                    |

Approval of a stop is the trigger for the next phase: start it without asking
again. When the approved predecessor has not merged, the brief says the new
branch is cut from it and targets it as its base.

## Per slice

The implementation session sends the verification and review requests itself,
on the same pushed SHA. Your part:

1. **Pushed.** On the report `pushed <slice> @ <sha>`, check that the draft
   pull request's head is that SHA.
   - **First push:** start the peer sessions now, each brief ending with the
     first request: branch, SHA, base SHA, slice ID (`fix` for single-pull-request
     work), feature directory, pull request number and round 1, all from the
     pull request's metadata. The peers are verification for slices and a
     High fix, review for every pull request, and visual review for
     Standard and Light work whose changed files
     (`gh api --paginate repos/{owner}/{repo}/pulls/<n>/files --jq '.[].filename'`)
     include a [rendering path](../../../docs/engineering/visual-review.md#when-a-visual-review-runs).
     Then send the implementation session their session IDs.
   - **Later pushes:** if the report says it did not send every request, send
     the missing ones yourself. Keep every peer's SHA the same.
   - The report lists the pre-push self-review findings for measurement. Keep
     them out of every verification, review and visual review brief and
     request.
2. **Results.** The verifier, reviewer and visual reviewer reply to the implementation session
   with pointers, and message you only to escalate or report `blocked` or
   `failed`. Read the notes with the status step, not their messages.
3. **Green.** When the verification gate passes and the review shows no open
   blocking finding at the same SHA (or only evidence-only commits after it),
   notify the person that the slice is green, and tell the implementation
   session it may start the next slice from this one.
4. **Ready.** The implementation session marks the pull request ready. The
   hook runs the gate and blocks a failing attempt; no person confirms the
   ready step itself. For High work, notify that the slice waits on review.
   For agent-merge work, nothing waits on the person yet.
5. **Merged (agent merge).** On the report `merged`, check that the pull
   request shows `merged: true`, then notify the person with its number, tier
   and changeset, and continue with the next slice or [Release](#release).
   On `waiting-on-person` because the merge gate found the pull request not
   eligible, treat it as an escalation.
6. **Fix rounds.** A failing result goes back to the implementation session
   through its own loop. Count rounds from the notes. Step in only for an
   escalation.

## Release

After a feature pull request with a changeset merges, check for the release
pull request:

```sh
gh api "repos/{owner}/{repo}/pulls?state=open&per_page=100" \
  | jq '[.[] | select(.title == "ci: version packages") | {number, head: .head.ref, updated_at}]'
```

When one is open, notify the person that it is waiting on them, with its
number. Merging it publishes to npm. Never merge it, mark it ready, or ask a
session to; it is a stop point in
[Orchestration](../../../docs/engineering/orchestration.md#autonomy-and-stop-points).

## Escalation

On any stop point that is not a phase approval:

1. Pause the affected sessions by telling them to stop at a clean, pushed
   state.
2. Notify the person with one line naming the slice, the kind and the note
   pointer.
3. Wait for the person's decision and relay it verbatim, in quotes, to the
   sessions it concerns. A correction to an earlier phase is a new session on
   that phase's branch, or a corrective pull request, under the
   [corrections](../../../docs/engineering/git-workflow.md#corrections) path.
   Never route it through the implementation branch.

## Status

On request, after any session report, and before each notification, print one
table for the feature. Fetch first (`git fetch origin --quiet`). For each pull
request whose head branch starts with `{number}-{slug}`, or for single-pull-request
work the pull request itself:

```sh
gh api "repos/{owner}/{repo}/pulls?state=all&per_page=100" | jq --arg p '<number>-<slug>' \
  '[.[] | select(.head.ref | startswith($p)) | {number, head: .head.ref, base: .base.ref, sha: .head.sha, draft, state, merged: (.merged_at != null)}]'
checks() { gh api "repos/{owner}/{repo}/commits/$1/check-runs" --jq '[.check_runs[] | .conclusion // .status] | group_by(.) | map("\(length) \(.[0])") | join(", ")'; }
decision() { gh api "repos/{owner}/{repo}/pulls/$1/reviews" --jq '[.[] | select(.state != "COMMENTED")] | last | .state // "none"'; }
```

For each open slice or single pull request, import its note comments with `pnpm notes:sync <pr>`,
because the verifier and reviewer record in their own clones. Then find the
newest commit between its base and head that carries a note, and summarize it:

```sh
newest() { git rev-list "origin/$2..$3" | grep -m1 -F -f <(git notes --ref="$1" list | cut -d' ' -f2); }
v=$(newest verification <base-branch> <head-sha>)
[ -n "$v" ] && pnpm -s verify:show "$v" | jq -r '[.runId[0:8], (.claims | group_by(.result) | map("\(length) \(.[0].result)") | join(", ")), "stories not passing \([.stories[] | select(.status != "passing")] | length)", "escalations \(.escalations | length)"] | join("; ")'
r=$(newest review <base-branch> <head-sha>)
[ -n "$r" ] && pnpm -s review:show "$r" 2>/dev/null | jq -r '"round \(.round); blocking \([.findings[] | select(.severity == "blocking")] | length); advisory \([.findings[] | select(.severity == "advisory")] | length); escalations \(.escalations | length)"'
w=$(newest visual <base-branch> <head-sha>)
[ -n "$w" ] && pnpm -s visual:show "$w" 2>/dev/null | jq -r '"round \(.round); blocking \([.findings[] | select(.severity == "blocking")] | length); advisory \([.findings[] | select(.severity == "advisory")] | length); escalations \(.escalations | length)"'
```

Print:

```text
Feature <number>-<slug> (#<issue>, <tier>)
| Slice | PR | Head SHA | Verify (SHA: result) | Review (SHA: result) | Visual (SHA: result) | PR state | Blockers |
```

PR state is draft, ready or merged, plus `checks <head-sha>` and
`decision <number>`, and for agent-merge work the result of
`pnpm -s merge:gate <number>`. Blockers name the stop point or session the slice waits
on. A verified or reviewed SHA that is not the head is fine only when the diff
from it to the head is evidence-only; the implementation session's gate run
decides that, not you. A merged slice shows `merged` and needs no note lookup.

End every status you print, and every notification that waits on the person,
with an **Open decisions** list: each question you have put to the person,
with the slice or phase and the pointer or message it came from. Carry each
into every later status until the person answers it or you withdraw it. An
empty list prints as `Open decisions: none`.

A bare approval such as "proceed" that arrives while a question is open
approves only the phase or stop it plainly answers. Act on the approval, then
ask each open question again, by name, in the same reply.

## Wrap-up

When the last phase has merged, by a person or under agent merge:

1. Print the final status, including any open `ci: version packages` pull
   request.
2. Ask once whether to archive the feature's sessions. Archive only on yes.
   List any worktree left over.
3. Match the merged pull requests' changed paths
   (`gh api --paginate repos/{owner}/{repo}/pulls/<n>/files --jq '.[].filename'`)
   against the area pathspecs in
   [Drift review](../../../docs/engineering/drift-review.md#areas) and report
   the touched area IDs. File nothing.
