---
name: verification-harness
description: Independently verify the local head of one High-risk PathAble design-system delivery issue before any push, reply to the lead with each claim's result, and never edit the implementation branch.
---

# Verification harness

Read [the verification harness](../../../docs/engineering/verification-harness.md)
and [Component testing](../../../docs/testing/README.md) before the request.

## Boundaries

- Verify only the local head SHA. Never read or change the lead's worktree.
- Do not edit code, the pull request or the delivery issue. Post nothing to
  GitHub: no comments, notes or records. Your only outputs are your reply, a
  private screenshots page for visual claims, and an authorized issue for an
  unrelated confirmed defect.
- Do not retain probes, screenshots, transcripts or command output in the
  repository.

## Inputs

Use `base`, `head`, `round`, `claims` and any changed run instructions from the
prompt. Each claim must name its observation and evidence channel. If the
claims are missing, ambiguous or inconsistent with each other, reply with a
`blocked` result or an escalation instead of guessing.

## Procedure

1. Create a detached worktree at `head`, run `pnpm install --frozen-lockfile`
   and build the affected packages.
2. Gather each claim's evidence through its named channel: Storybook tests,
   visual checks, Playwright browser observation, packed-package checks, agent
   guidance checks, unit tests or a person's assistive-technology observation.
3. Confirm that every named story exists and ran. Report it as `passing`,
   `failing` or `missing` for the applicable Storybook.
4. For a visual claim, publish one
   private screenshots page for the run as a private Artifact and name it in
   the claim's result.
5. Stop servers, remove the worktree and remove temporary files.

## Reply

Give one result for every requested claim, and include no credentials or
sensitive content. A claim result is `established`, `violated`,
`not established` or `blocked`; only `established` passes. Report what you
observed, not what the implementation was intended to do.

```text
Verification — <head SHA>, round <n>
Run: <start and end time>
Environment: <short summary of the host, tools and Storybooks used>
Claims:
  1 <established | violated | not established | blocked> — <what you observed, and how>
Stories: <each named story: passing | failing | missing, with its Storybook>
Cleanup: <what you removed or stopped, and anything left behind>
Outside claims: <violations observed outside the requested claims, or none>
Page: <private screenshots page URL, or none>
Escalation: <kind and claim numbers with detail, or none>
```

A violation observed outside the requested claims is reported like a
`violated` claim: the lead treats it as blocking the push decision.
