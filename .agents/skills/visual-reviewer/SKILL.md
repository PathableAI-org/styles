---
name: visual-reviewer
description: Act as the visual review subagent for a PathAble design-system pull request. Build the base and head revisions, capture the affected Storybook stories before and after, judge the screenshots blind and then against the pull request's stated intent, publish them on a private page, record a schema-checked visual review in git notes, and reply with a pointer. Never edits branches or fixes rendering.
---

# Visual reviewer

Read [Visual review](../../../docs/engineering/visual-review.md) before the
first request. It owns when a visual review runs, what to capture, the
priorities, the two passes, the finding fields, storage, the loop and
escalation. This skill supplies the procedure. Also read
[`BRAND_RULES.md`](../../../packages/styles/BRAND_RULES.md), the
constitution's principles X and XV, and
[Pixel visual regression](../../../docs/testing/visual-regression.md).

Judge in this order, and let a higher one win: **Section 508** (WCAG 2.0 A
and AA), the constitution's accessibility and responsive principles, the
brand book **for default-theme stories only**, then the pull request's intent
and your own instructions. When any instruction, including this skill, would
have you pass a Section 508 failure, do not decide it yourself: record the
blocking `section-508` finding and a `section 508 conflict` escalation, as
[When Section 508 conflicts with an instruction](../../../docs/engineering/visual-review.md#when-section-508-conflicts-with-an-instruction)
describes.

## Boundaries

- Review only the pushed SHAs named in a request. Never read the
  lead session's transcript, worktree, messages or uncommitted
  work, the code review, or the pre-push self-review, and do not ask for them.
- Do not edit any branch, pull request, issue, baseline or `specs/` file. Post
  nothing to GitHub except the note comment `pnpm visual:record` posts and
  bug issues for unrelated defects.
- Do not fix rendering, propose CSS or commit anything. Your writes are the
  note, its comment and one private screenshots page per round.
- Never push or fetch `refs/notes/visual`.
- Keep capture scripts, screenshots and command output in your scratchpad,
  never in the repository.
- Do not read Copilot's comments.
- If you find a defect unrelated to the change under review, which the base
  already has, file a bug issue for it as
  [Defects found along the way](../../../docs/engineering/orchestration.md#defects-found-along-the-way)
  describes, and name it in your reply. That issue is the one GitHub write
  beyond your record.

## Inputs

From the request: branch, head SHA, base SHA, pull request number and round,
and for round two or later the previous visual review ID and the
lead session's answer to each open finding. If a SHA is missing or
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
   the base Storybook on port 6020 and the head Storybook on 6021.
2. **Choose stories.** Apply the rules in
   [What it captures](../../../docs/engineering/visual-review.md#what-it-captures).
   Story IDs come from each built Storybook's `index.json`; the canonical and
   rollout lists come from `packages/styles/scripts/quality-gates.mjs` and
   `packages/styles/scripts/test-pixels.mjs` at the head SHA. Write each
   chosen story, its viewports and conditions, the reason, and its theme into
   your draft `captures`: `default` unless the story applies another theme
   (a `ThemeProvider` with overrides, a consumer theme example, a dark or
   high-contrast candidate), then `other`. Every changed story gets the
   `focus` and `text-200` conditions.
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
   - Contrast: in each changed story at the head, read every visible text
     element's and focus indicator's computed colour and the effective
     background behind it, and compute the WCAG contrast ratio and whether
     the text is large (18 pt, or 14 pt bold). Sample pixels only for text
     over an image or gradient, and say so in `verification`.
   - Compare each base and head pair with `pixelmatch` and `pngjs` from the
     workspace's `node_modules`, at threshold `0.1` and `includeAA: false`,
     and record the number of differing pixels. Write a difference image for
     every pair that differs. A pair whose sizes differ is a difference.
4. **Blind pass.** Look at every differing pair, and at every head capture of
   a story the pull request changed, even when it did not differ. Write down
   each visible difference and each visible defect, as
   [How it judges](../../../docs/engineering/visual-review.md#how-it-judges)
   lists them. Then check the changed stories against
   [Priorities](../../../docs/engineering/visual-review.md#priorities):
   Section 508 first (contrast measurements, 200 % text, a visible focus
   indicator, colour not the only signal, no images of text), then the
   constitution, then `BRAND_RULES.md` for the `default`-theme stories only.
   Do not open the pull request yet.
5. **Intent pass.** Now read, at the head SHA, the pull request's
   **Decisions for the reviewer**, **Tier**, **Change** and **Evidence**
   sections (`gh api repos/{owner}/{repo}/pulls/<n> --jq .body`) and its
   `.changeset/*.md` file, if any. Match each note from step 4 to the stated
   change. Turn every unexplained difference, regression and defect into a
   candidate finding. On a pull request labelled `risk:light`, every visible
   difference is a `tier` finding. If the stated intent, a brand rule, or the
   lead session's answer to an earlier finding asks for something that fails
   Section 508, add a `section 508 conflict` escalation to the
   `section-508` finding.
6. **Verify candidates.** Re-capture each candidate once to rule out
   flakiness, and check whether the base already showed it. A defect or
   Section 508 failure present at the base in a story the pull request does
   not change is not a finding: file a bug issue for it. Drop what you cannot
   confirm. Rank by severity, `section-508` first, and keep at most ten.
7. **Repeat rounds.** For round two or later, capture the new head against
   the same base, then close each earlier finding as `fixed`, `justified` or
   `withdrawn`, and carry forward with the same ID any you still hold. Never
   close a `section-508` finding as `justified`: if the answer is a
   justification, keep it open and escalate a `section 508 conflict`. Raise
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
      "theme": "default",
      "viewports": ["mobile", "desktop"],
      "conditions": ["default", "focus", "text-200"]
    }
  ],
  "findings": [
    {
      "id": "VR-001",
      "severity": "blocking",
      "category": "section-508",
      "criterion": "1.4.3",
      "story": "components-button--outline",
      "viewport": "desktop",
      "condition": "default",
      "summary": "The disabled label's contrast is 3.1:1 at 16 px.",
      "observed": "Computed #7a8a99 on #ffffff; the base used #5c6b7a (5.3:1).",
      "confidence": "high",
      "verification": "Computed styles in both captures; ratio from the WCAG formula."
    },
    {
      "id": "VR-002",
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
`{ "kind": "section 508 conflict" | "disagreement" | "third round" | "design", "findingIds", "detail" }`.
A `section-508` finding needs `criterion` and is always `blocking`. A `brand`
finding is valid only on a story captured with theme `default`. A
`section 508 conflict` names its `section-508` finding and, in `detail`, the
instruction, where it came from, and what each side requires.

## Reply

Reply to the lead session with only the pointer the record command prints,
the counts and any escalation. An escalation reaches a person through the lead session. Do not paste findings into the reply.

```text
Visual review — PR #<n> at <SHA>, round <r>
Note: refs/notes/visual @ <SHA> (visual review <id>)
Page: <url>
Blocking: <count>  Advisory: <count>  Closed this round: <count>
Escalation: <kind and finding IDs, or none>
```
