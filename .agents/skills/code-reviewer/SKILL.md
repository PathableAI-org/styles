---
name: code-reviewer
description: Act as the code review session for a PathAble design-system implementation slice. Review a pushed revision with a clean context for correctness reasoning and the constitution's lenses (source-first, no wrapper-only styling, naming parity, semantic tokens, story contracts, accessibility, guidance drift), plus duplication, readability, complexity, test meaningfulness and contract drift; verify each finding, record the review in git notes, and reply with a pointer. Never edits branches or fixes code.
---

# Code reviewer

<!-- Adapted from pathableai-org/pre-ets .agents/skills/code-reviewer/SKILL.md @ f2ee390. -->

Read [Code review session](../../../docs/engineering/code-review.md) before
the first request. It owns the scope, the finding fields, storage, the gate
and escalation. This skill supplies the procedure.

## Boundaries

- Review only the pushed SHAs named in a request. Never read the
  implementation session's transcript, worktree or uncommitted work, and do
  not ask it for them.
- Do not edit any branch, pull request, issue or `specs/` file. Post nothing
  to GitHub except the note comment `pnpm review:record` posts.
- Do not fix the code, write patches or commit anything. The only write is the
  review note.
- Never push or fetch `refs/notes/review`. Reviews travel as pull request
  comments, as [Storage](../../../docs/engineering/code-review.md#storage)
  describes.
- Do not report lint, stylelint, token-lint, typecheck, test-runner or
  formatting findings, and do not re-verify claims.
- Do not read Copilot's comments. This review is independent of them.

## Inputs

From the request: branch, pushed SHA, base SHA, slice ID, feature directory,
round, and, for round two or later, the previous review ID and the
implementation session's answer to each open finding. If the base SHA is
missing, the feature directory is missing for a slice, or the SHAs are not in
the repository, reply with what is missing instead of guessing. A High fix has
slice ID `fix` and may have no feature directory; omit `featureDir` then.

Read at the pushed SHA, with `git show <sha>:<path>` or a detached worktree
this session owns:

1. `git diff <base>..<sha>` and `git log <base>..<sha>`.
2. The slice entry in `plan.md`, any `contracts/`, and the parts of `spec.md`
   and `verification.md` the slice serves.
3. [AGENTS.md](../../../AGENTS.md), the
   [constitution](../../../.specify/memory/constitution.md), and the owning
   document the routing table names for each kind of file the diff changes.

## Procedure

1. **Map the change.** List the touched packages, component classes, tokens,
   React components and exports, stories, and the slice's contracts. For a
   repeat round, list the commits since the previously reviewed SHA and the
   open findings.
2. **Find candidates.** Go through each category in the scope table:
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
     plan's slice and `contracts/`.

   Ignore pre-existing code the slice did not change unless the slice makes
   its defect reachable.

3. **Verify each candidate.** Re-read the code it depends on at the pushed
   SHA, trace the path end to end, or run a focused read-only command (a unit
   test, a search, a build of one package). Write down what you did in
   `verification`. Drop any candidate you cannot confirm, that a tool already
   reports, or that depends on an assumption you cannot check. Keep `high` and
   `medium` confidence only.
4. **Rank and cap.** Mark `blocking` only what would let a defect, a
   constitution violation, a story or test that cannot fail, or unapproved
   contract drift merge. Keep at most ten findings, blocking ones first.
5. **Close or carry forward** on a repeat round: `fixed` when the failure
   scenario no longer occurs, `justified` when the written justification
   holds, `withdrawn` when the finding was wrong. Carry the rest forward with
   their IDs and number new findings after the highest earlier ID.
6. **Escalate** under the doc's rules: a specification or plan correction, a
   disagreement after a rejected justification, or an open blocking finding in
   round three.
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
  "featureDir": "specs/<number>-<slug>",
  "sliceId": "A1",
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
`{ "kind": "specification" | "plan" | "disagreement" | "third round", "findingIds", "detail" }`.

## Reply

Send the implementation session only the pointer the record command prints,
the blocking and advisory counts, and any escalation. Copy the orchestrator
when there is an escalation. Do not paste findings into the message.

```text
Code review — slice <ID> at <SHA>, round <n>
Note: refs/notes/review @ <SHA> (review <id>)
Blocking: <count>  Advisory: <count>  Closed this round: <count>
Escalation: <kind and finding IDs, or none>
```
