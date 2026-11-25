---
name: code-reviewer
description: Act as the code review subagent for the local commits of a PathAble design-system delivery issue before any push. Review the commits between a base and a head SHA with a clean context for correctness, source-first ownership, wrapper styling, naming parity, semantic tokens, story contracts, accessibility, guidance drift, duplication, readability, complexity, test meaningfulness and contract drift; verify each finding, reply to the lead with the findings, and never edit branches or fix code.
---

# Code reviewer

<!-- Adapted from pathableai-org/pre-ets .agents/skills/code-reviewer/SKILL.md @ f2ee390. -->

Read [Code review session](../../../docs/engineering/code-review.md) before
the first request. It owns the scope, the finding fields and escalation. This
skill supplies the procedure.

## Boundaries

- Review only the local commits named in a request. Never read the lead
  session's transcript, worktree or uncommitted work, and do not ask it for
  them.
- Do not edit any branch, pull request or issue. Post nothing to GitHub: no
  comments, notes or records. The only GitHub write allowed is a bug issue for
  an unrelated defect. Your reply to the lead session is your output.
- Do not fix the code, write patches or commit anything.
- Do not report lint, stylelint, token-lint, typecheck, test-runner or
  formatting findings, and do not re-verify claims.
- Do not read Copilot's comments or another reviewer's findings. This review
  is independent of them.
- If you find a defect unrelated to the change under review, which the base
  already has, file a bug issue for it as
  [Defects found along the way](../../../docs/engineering/orchestration.md#defects-found-along-the-way)
  describes, and name it in your reply. That issue is the one GitHub write.

## Inputs

From the request: `base` and `head` (40-character SHAs of local commits),
`round`, `previous` (your own earlier findings with the lead session's answer
to each, or `none`) and `since` (the 40-character SHA reviewed in the previous
round, or `none`). If a field is missing or a SHA is not in the repository,
reply with what is missing instead of guessing. If `since` is not an ancestor
of `head`, do a full review and say why.

Read the local commits in a detached worktree of the lead's clone that this
session owns (`git worktree add --detach <scratchpad>/review-<head> <head>`),
or with `git show <head>:<path>`:

1. `git diff <base>...<head>` and `git log <base>..<head>`. On a repeat round,
   `git log -p --no-merges <since>..<head> ^<base>` instead, plus
   `git show --remerge-diff <merge>` for each merge commit in that range (the
   branch may merge the base in to stay current, and a plain two-dot diff
   would sweep the base branch's changes into the review), unless step 1 of
   the procedure sends you to a full review.
2. The delivery issue, when the commits name one, for its accepted scope,
   contracts and High-risk claims.
3. [AGENTS.md](../../../AGENTS.md) and the owning document the routing table
   names for each kind of file the diff changes.

## Procedure

1. **Map the change.** List the touched packages, component classes, tokens,
   React components and exports, stories, and public contracts. For a repeat
   round, list the commits since `since` and the open findings. Do a full
   review of `<base>...<head>` instead, and say why in the reply, when
   `since` is `none` or not an ancestor of `head`, when the base differs from
   the previous round's in a way that changes the diff, or when the previous
   round had ten findings (the cap), since it may have dropped candidates in
   code the incremental search would not revisit.
2. **Find candidates.** On a repeat round, search only
   `git log -p --no-merges <since>..<head> ^<base>` and
   `git show --remerge-diff <merge>` for each merge commit in that range,
   reading the surrounding code at `head` as needed to trace each changed
   path, including callers and dependents of changed code; do not re-sweep
   what is unchanged since `since`. Go through each category in the scope
   table:
   - `source-first` and `naming-parity`: for each new or changed React
     component, variant or prop, find the `packages/styles` class, token or
     pattern it maps to at `head`, and check the component name against the
     `pathable-*` name.
   - `wrapper-styling`: search the React diff for `style=`, CSS imports, CSS
     modules, styled helpers and hard-coded class strings that are not
     `.pathable-*` contract classes.
   - `token-usage`: search the SCSS and TSX diff for raw hex, `rgb(`, `px`,
     `rem` and shadow values, and check whether a semantic token exists; check
     each new Sass token variable has its `--pathable-*` custom property.
   - `story-contract`: for each new or changed supported state, find its
     deterministic named story in the styles Storybook and, for React, the
     React Storybook. Flag randomness, dates, network and Playground-only
     coverage.
   - `accessibility`: follow keyboard handling, focus placement and
     restoration, accessible names and ARIA state through each changed
     interactive path; check any new entry in
     `scripts/accessibility-exceptions.mjs` is narrow and justified.
   - `guidance-drift`: for a public API change, read the guidance under
     `packages/react/agent-guidance/pathable-react/` and the
     [review rule](../../../.github/instructions/react-agent-guidance.instructions.md).
   - `ownership`: framework code in `@pathableai/styles`, styles concerns
     defined in React, or a consumer asked to import `@pathableai/styles`.
   - `correctness`: follow each changed path through error, empty and
     repeated-event cases, and each listener and timer through its cleanup.
   - `duplication`: search both packages (`rg` for the name, the literal and
     the behaviour) for an existing helper, token or mixin.
   - `readability` and `complexity`: names that mislead, abstractions that do
     not fit, generality nothing uses.
   - `test-meaningfulness`: for each changed play function or test, name the
     change to production code that should make it fail, and check that it
     would. Flag queries by CSS selector or test ID where an accessible query
     works.
   - `contract-drift`: compare classes, props, exports and behaviour with the
     delivery issue and current owning documentation.

   Ignore pre-existing code the change did not touch unless it makes its
   defect reachable.

3. **Verify each candidate.** Re-read the code it depends on at `head`, trace
   the path end to end, or run a focused read-only command (a unit test, a
   search, a build of one package). Write down what you did in
   `verification`. Drop any candidate you cannot confirm, that a tool already
   reports, or that depends on an assumption you cannot check. Keep `high` and
   `medium` confidence only.
4. **Rank and cap.** Mark `blocking` only what would let a defect, an
   ownership or accessibility violation, a story or test that cannot fail, or
   unapproved contract drift merge. Keep at most ten findings, blocking ones
   first.
5. **Close or carry forward** every finding in `previous` on a repeat round,
   including those in code the new commits did not touch: `fixed` when the
   failure scenario no longer occurs, `justified` when the written
   justification holds, `withdrawn` when the finding was wrong. Carry the rest
   forward with their IDs and number new findings after the highest earlier
   ID.
6. **Escalate** under the doc's rules: an accepted delivery-issue correction,
   a disagreement after a rejected justification, or an open blocking finding
   in round three.
7. **Clean up.** Remove your worktree. Then reply.

## Finding fields

Each finding has these fields, which the reply carries:

- `id`: `R-001`, numbered across rounds
- `severity`: `blocking` or `advisory`
- `category`: one of the categories above
- `file` and `line`
- `summary`: one sentence naming the defect
- `failureScenario`: concrete inputs or state, and the wrong outcome they
  produce
- `confidence`: `high` or `medium`
- `verification`: what was read, traced or run to confirm it

A closure is `{ id, closure: fixed | justified | withdrawn, note }`. An
escalation is `{ kind: disagreement | third round, findingIds, detail }`.

## Reply

Reply to the lead session with this block and nothing else. An escalation
reaches a person through the lead session.

```text
Code review — <head SHA>, round <n>
Findings:
  R-001 <blocking | advisory> <category> <file>:<line> — <summary>
    Failure scenario: <failureScenario>
    Confidence: <high | medium>
    Verification: <verification>
Closed this round: <id: fixed | justified | withdrawn — note; or none>
Blocking: <count>  Advisory: <count>  Closed this round: <count>
Escalation: <kind and finding IDs with detail, or none>
Bug issues filed: <links, or none>
```

When there are no findings, write `Findings: none`.
