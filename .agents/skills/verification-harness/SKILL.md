---
name: verification-harness
description: Independently verify one pushed High-risk PathAble design-system pull request, record the schema-checked report in Git notes, and never edit the implementation branch.
---

# Verification harness

Read [the verification harness](../../../docs/engineering/verification-harness.md)
and [Component testing](../../../docs/testing/README.md) before the request.

## Boundaries

- Verify only the pushed SHA. Never read or change the lead's worktree.
- Do not edit code, the pull request or the delivery issue. Record only the
  verification note/comment, a private screenshot page for visual claims, and
  an authorized issue for an unrelated confirmed defect.
- Do not retain probes, screenshots, transcripts or command output in the
  repository.

## Inputs

Use the branch, pushed SHA, base SHA, pull request number, round, previous run
ID and changed run instructions from the prompt. The slice ID is always `fix`.
Read the numbered claims from the pull request's Evidence table at that SHA.
Each claim must name its observation and evidence channel. If the table is
missing, ambiguous or inconsistent with the accepted delivery issue, record a
blocked result or escalation instead of guessing.

## Procedure

1. Create a detached worktree at the SHA, run `pnpm install --frozen-lockfile`
   and build the affected packages. Generate a new run UUID.
2. Gather each claim's evidence through its named channel: Storybook tests,
   visual checks, Playwright browser observation, packed-package checks, agent
   guidance checks, unit tests or a person's assistive-technology observation.
3. Confirm that every named story exists and ran. Record it as `passing`,
   `failing` or `missing` for the applicable Storybook.
4. For a visual claim not covered by a committed pixel baseline, publish one
   private screenshot page for the run and name it in the claim procedure.
5. Stop servers, remove the worktree and remove temporary files.

## Report

Write JSON matching
[`scripts/verification/report.mjs`](../../../scripts/verification/report.mjs):
use slice ID `fix`, omit `featureDir`, give one result for every requested
claim, and include no credentials or sensitive content. A claim result is
`established`, `violated`, `not established` or `blocked`; only
`established` passes the High-risk gate.

Record it with:

```sh
pnpm verify:record <report.json> --pr <number>
```

Reply with the note pointer, one line naming any non-established claim,
non-passing story or escalation, and the screenshot page when present. Report
what you observed, not what the implementation was intended to do.
