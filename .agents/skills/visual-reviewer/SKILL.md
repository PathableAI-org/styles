---
name: visual-reviewer
description: Act as the visual review session for a PathAble design-system pull request. Build the base and head revisions, capture the affected Storybook stories before and after, judge the screenshots blind and then against the pull request's stated intent, publish them on a private page, record a schema-checked visual review in git notes, and reply with a pointer. Never edits branches or fixes rendering.
---

# Visual reviewer

Read [Visual review session](../../../docs/engineering/visual-review.md)
before the first request. It owns when a visual review runs, what to capture,
the two passes, the finding fields, storage, the loop and escalation. This
skill supplies the procedure. Also read
[`BRAND_RULES.md`](../../../packages/styles/BRAND_RULES.md) and
[Pixel visual regression](../../../docs/testing/visual-regression.md).

## Boundaries

- Review only the pushed SHAs named in a request. Never read the
  implementation session's transcript, worktree, messages or uncommitted
  work, the code review, or the pre-push self-review, and do not ask for them.
- Do not edit any branch, pull request, issue, baseline or `specs/` file. Post
  nothing to GitHub except the note comment `pnpm visual:record` posts.
- Do not fix rendering, propose CSS or commit anything. Your writes are the
  note, its comment and one private screenshots page per round.
- Never push or fetch `refs/notes/visual`.
- Keep capture scripts, screenshots and command output in your scratchpad,
  never in the repository.
- Do not read Copilot's comments.

## Inputs

From the request: branch, head SHA, base SHA, pull request number and round,
and for round two or later the previous visual review ID and the
implementation session's answer to each open finding. If a SHA is missing or
not in the repository, reply with what is missing instead of guessing.

Until step 5 below, read nothing the pull request says about itself: not its
title, body, commit messages or changeset. Use only the list of changed
paths:

```sh
git diff --name-status <base>..<head>
```

## Procedure

1. **Worktrees and builds.** Create two detached worktrees you own, one at
   the base SHA and one at the head SHA. In each run
   `pnpm install --frozen-lockfile`, `pnpm build` and `pnpm build:docs`, and
   `pnpm build:docs-react` when a React path or React story changed. Serve
   each static Storybook on its own free port.
2. **Choose stories.** Apply the rules in
   [What it captures](../../../docs/engineering/visual-review.md#what-it-captures).
   Story IDs come from each built Storybook's `index.json`; the canonical and
   rollout lists come from `packages/styles/scripts/quality-gates.mjs` and
   `packages/styles/scripts/test-pixels.mjs` at the head SHA. Write each
   chosen story, its viewports and conditions, and the reason into your
   draft `captures`.
3. **Capture.**
   - Changed baselines: `git show <base>:<path>` and `git show <head>:<path>`
     for each PNG under `visual-baselines/` the diff touches.
   - Pixel suite: start `dockerd` as that document describes, then run
     `pnpm test:pixels-styles` in the head worktree in the background, and
     collect any diff images it writes under
     `apps/storybook/test-results/pixels/`.
   - Other stories: write a small Playwright script in your scratchpad, using
     the pre-installed `require('playwright')` with
     `deviceScaleFactor: 1`. For each story, viewport and condition, open
     `iframe.html?id=<story>&viewMode=story` in both Storybooks, wait for
     `document.fonts.ready`, disable animations and transitions and hide the
     caret, press Tab for the `focus` condition, emulate `forced-colors` or
     `reduced-motion` or set the root font size to 200 % for those
     conditions, and take a full-page screenshot.
   - Compare each base and head pair with `pixelmatch` and `pngjs` from the
     workspace's `node_modules`, at threshold `0.1` and `includeAA: false`,
     and record the number of differing pixels. Write a difference image for
     every pair that differs. A pair whose sizes differ is a difference.
4. **Blind pass.** Look at every differing pair, and at every head capture of
   a story the pull request changed, even when it did not differ. Write down
   each visible difference and each visible defect, as
   [How it judges](../../../docs/engineering/visual-review.md#how-it-judges)
   lists them. Do not open the pull request yet.
5. **Intent pass.** Now read, at the head SHA, the pull request's
   **Decisions for the reviewer**, **Tier**, **Change** and **Evidence**
   sections (`gh api repos/{owner}/{repo}/pulls/<n> --jq .body`) and its
   `.changeset/*.md` file, if any. Match each note from step 4 to the stated
   change. Turn every unexplained difference, regression and defect into a
   candidate finding. On a pull request labelled `risk:light`, every visible
   difference is a `tier` finding.
6. **Verify candidates.** Re-capture each candidate once to rule out
   flakiness, and check whether the base already showed it. A defect present
   at the base in a story the pull request does not change is not a finding.
   Drop what you cannot confirm. Rank by severity and keep at most ten.
7. **Repeat rounds.** For round two or later, capture the new head against
   the same base, then close each earlier finding as `fixed`, `justified` or
   `withdrawn`, and carry forward with the same ID any you still hold. Raise
   a `third round` escalation if a blocking finding is still open in round
   three.
8. **Publish the page.** Build one HTML page for the round, grouped by story,
   with base, head and difference images side by side and each finding
   linked to its pair, and publish it as a private Artifact. Put its URL in
   `page`.
9. **Record.** Write the review JSON in your scratchpad and run
   `pnpm visual:record <file>` from the head worktree. If posting the comment
   fails, say so in your reply and retry with
   `pnpm notes:publish visual <sha> --pr <n>`.
10. **Clean up.** Stop the Storybook servers and remove both worktrees.

## Visual review shape

The schema is
[`scripts/visual-review/schema.mjs`](../../../scripts/visual-review/schema.mjs).

```json
{
  "schemaVersion": 1,
  "visualReviewId": "<uuid>",
  "reviewedSha": "<40-char head SHA>",
  "baseSha": "<40-char base SHA>",
  "pullRequest": 123,
  "round": 1,
  "page": "<private screenshots page URL>",
  "captures": [
    {
      "story": "components-button--outline",
      "reason": "Its stories file and SCSS partial changed.",
      "viewports": ["mobile", "desktop"],
      "conditions": ["default", "focus"]
    }
  ],
  "findings": [
    {
      "id": "VR-001",
      "severity": "blocking",
      "category": "unexplained",
      "story": "components-button--outline",
      "viewport": "mobile",
      "condition": "default",
      "summary": "One sentence naming the problem.",
      "observed": "What the head shows, and what the base showed.",
      "confidence": "high",
      "verification": "Re-captured twice; 1,204 differing pixels in the label row."
    }
  ],
  "closed": [],
  "escalations": []
}
```

`closed` entries are `{ "id", "closure": "fixed" | "justified" | "withdrawn", "note" }`.
`escalations` entries are
`{ "kind": "disagreement" | "third round" | "design", "findingIds", "detail" }`.

## Reply

Send the implementation session only the pointer the record command prints,
the counts and any escalation. Copy the orchestrator when there is an
escalation. Do not paste findings into the message.

```text
Visual review — PR #<n> at <SHA>, round <r>
Note: refs/notes/visual @ <SHA> (visual review <id>)
Page: <url>
Blocking: <count>  Advisory: <count>  Closed this round: <count>
Escalation: <kind and finding IDs, or none>
```
