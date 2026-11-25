---
name: code-reviewer
description: Act as the code review subagent for a PathAble design-system pull request. Review a pushed revision with a clean context for correctness, source-first ownership, wrapper styling, naming parity, semantic tokens, story contracts, accessibility, guidance drift, duplication, readability, complexity, test meaningfulness and contract drift; verify each finding, record the review in git notes, and never edit branches or fix code.
---

# Code reviewer

<!-- Adapted from pathableai-org/pre-ets .agents/skills/code-reviewer/SKILL.md @ f2ee390. -->

Read [Code review session](../../../docs/engineering/code-review.md) before
the first request. It owns the scope, the finding fields, storage, the gate
and escalation. This skill supplies the procedure.

## Boundaries

- Review only the pushed SHAs named in a request. Never read the
  lead session's transcript, worktree or uncommitted work, and do
  not ask it for them.
- Do not edit any branch, pull request or issue. Post nothing
  to GitHub except the note comment `pnpm review:record` posts and bug issues
  for unrelated defects.
- Do not fix the code, write patches or commit anything. The only write is the
  review note.
- Never push or fetch `refs/notes/review`. Reviews travel as pull request
  comments, as [Storage](../../../docs/engineering/code-review.md#storage)
  describes.
- Do not report lint, stylelint, token-lint, typecheck, test-runner or
  formatting findings, and do not re-verify claims.
- Do not read Copilot's comments. This review is independent of them.
- If you find a defect unrelated to the change under review, which the base
  already has, file a bug issue for it as
  [Defects found along the way](../../../docs/engineering/orchestration.md#defects-found-along-the-way)
  describes, and name it in your reply. That issue is the one GitHub write
  beyond your record.

## Inputs

From the request: branch, pushed SHA, base SHA, slice ID `fix`, pull request,
round, and, for round two or later, the previous review ID, `previous sha`
(the 40-character SHA reviewed in the previous round, or `none`) and the
lead session's answer to each open finding. If the base SHA is
missing or the SHAs are not in the repository, reply with what is missing
instead of guessing. If `previous sha` is missing or not an ancestor of the
new SHA, do a full review and say why. Omit `featureDir` and read the pull request's linked
delivery issue for its accepted scope, contracts and High-risk claims.

Read at the pushed SHA, with `git show <sha>:<path>` or a detached worktree
this session owns:

1. `git diff <base>..<sha>` and `git log <base>..<sha>`. On a repeat round,
   `git log -p --no-merges <previous-sha>..<sha> ^<base>` instead, plus
   `git show --remerge-diff <merge>` for each merge commit in that range (the
   branch merges the base in to stay current, and a plain two-dot diff would
   sweep the base branch's changes into the review), unless step 1 of the
   procedure sends you to a full review.
2. The linked delivery issue and pull request body.
3. [AGENTS.md](../../../AGENTS.md) and the owning
   document the routing table names for each kind of file the diff changes.

## Procedure

1. **Map the change.** List the touched packages, component classes, tokens,
   React components and exports, stories, and public contracts. For a
   repeat round, list the commits since the previously reviewed SHA and the
   open findings. Do a full review of `<base>..<sha>` instead, and say why in
   the note, when the previous review's base differs from the request's base
   in a way that changes the pull request's own diff (a head that only merged
   the base branch in does not count), when `previous sha` is missing or not
   an ancestor of the new SHA, or when the previous review recorded ten
   findings (the cap), since it may have dropped candidates in code the
   incremental search would not revisit.
2. **Find candidates.** On a repeat round, search only
   `git log -p --no-merges <previous-sha>..<sha> ^<base>` and
   `git show --remerge-diff <merge>` for each merge commit in that range,
   reading the surrounding code at the pushed
   SHA as needed to trace each changed path, including callers and dependents
   of changed code; do not re-sweep what is unchanged since the previous
   reviewed SHA. Go through each category in the scope table:
   - `source-first` and `naming-parity`: for each new or changed React
     component, variant or prop, find the `packages/styles` class, token or
     pattern it maps to at the pushed SHA, and check the component name
     against the `pathable-*` name.
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
     delivery issue, pull request and current owning documentation.

   Ignore pre-existing code the pull request did not change unless it makes
   its defect reachable.

3. **Verify each candidate.** Re-read the code it depends on at the pushed
   SHA, trace the path end to end, or run a focused read-only command (a unit
   test, a search, a build of one package). Write down what you did in
   `verification`. Drop any candidate you cannot confirm, that a tool already
   reports, or that depends on an assumption you cannot check. Keep `high` and
   `medium` confidence only.
4. **Rank and cap.** Mark `blocking` only what would let a defect, a
   ownership or accessibility violation, a story or test that cannot fail, or unapproved
   contract drift merge. Keep at most ten findings, blocking ones first.
5. **Close or carry forward** every open finding on a repeat round, including
   those in code the new commits did not touch: `fixed` when the failure
   scenario no longer occurs, `justified` when the written justification
   holds, `withdrawn` when the finding was wrong. Carry the rest forward with
   their IDs and number new findings after the highest earlier ID.
6. **Escalate** under the doc's rules: an accepted delivery-issue correction,
   a disagreement after a rejected justification, or an open blocking finding
   in round three.
7. **Record.** Write the review JSON to a temporary file outside the
   repository, generate a new `reviewId` with
   `node -e 'console.log(crypto.randomUUID())'`, and run
   `pnpm review:record <file>`. It also posts the review on the pull request
   whose head branch has the reviewed SHA at its tip; pass `--pr <n>` when that
   branch has moved on. Fix any validation problem it reports, then delete the
   file. If it says the review was recorded but not published, fix the cause
   and run `pnpm notes:publish review <sha> [--pr <n>]`, and say so in the
   reply.

## Review shape

The schema is
[`scripts/review-findings/schema.mjs`](../../../scripts/review-findings/schema.mjs).

```json
{
  "schemaVersion": 1,
  "reviewId": "<uuid>",
  "reviewedSha": "<40-char pushed SHA>",
  "baseSha": "<40-char base SHA>",
  "sliceId": "fix",
  "round": 1,
  "findings": [
    {
      "id": "R-001",
      "severity": "blocking",
      "category": "source-first",
      "file": "packages/react/src/components/Example/Example.tsx",
      "line": 42,
      "summary": "One sentence naming the defect.",
      "failureScenario": "Concrete inputs or state, and the wrong outcome they produce.",
      "confidence": "high",
      "verification": "What was read, traced or run to confirm it."
    }
  ],
  "closed": [],
  "escalations": []
}
```

`closed` entries are `{ "id", "closure": "fixed" | "justified" | "withdrawn", "note" }`.
`escalations` entries are
`{ "kind": "disagreement" | "third round", "findingIds", "detail" }`.

## Reply

Reply to the lead session with only the pointer the record command prints,
the blocking and advisory counts, and any escalation. An escalation reaches a person through the lead session. Do not paste findings into the reply.

```text
Code review — slice <ID> at <SHA>, round <n>
Note: refs/notes/review @ <SHA> (review <id>)
Blocking: <count>  Advisory: <count>  Closed this round: <count>
Escalation: <kind and finding IDs, or none>
```
