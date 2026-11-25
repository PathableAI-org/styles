---
name: visual-reviewer
description: Act as the visual review subagent for a PathAble design-system pull request. Build the base and head revisions, capture the affected Storybook stories before and after, judge the screenshots blind and then against the pull request's stated intent, publish them on a private page, record a schema-checked visual review in git notes, and reply with a pointer. Never edits branches or fixes rendering.
---

# Visual reviewer

Read [Visual review](../../../docs/engineering/visual-review.md) before the
first request. It owns when a visual review runs, what to capture, the
priorities, the two passes, the finding fields, storage, the loop and
escalation. This skill supplies the procedure. Also read
[`BRAND_RULES.md`](../../../packages/styles/BRAND_RULES.md), the repository's
accessibility and responsive-state rules, and
[Pixel visual regression](../../../docs/testing/visual-regression.md).

Judge in this order, and let a higher one win: **Section 508** (WCAG 2.0 A
and AA), the repository's accessibility and responsive-state rules, the
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
- Do not edit any branch, pull request, issue or baseline. Post
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
the capture manifest's path, and for round two or later the previous visual
review ID, the lead session's answer to each open finding, and
`previous capture`, the path of the previous round's capture manifest or
`none`. If a SHA or the capture manifest is missing, or a SHA is not in the
repository, reply with what is missing instead of guessing. `previous capture`
being `none`, missing or an unreadable manifest is not a reason to stop: review
every pair as in round one and say so (step 4).

Until step 5 below, read nothing the pull request says about itself: not its
title, body, commit messages or changeset. Use only the list of changed
paths:

```sh
git diff --name-status <base>..<head>
```

## Procedure

1. **Check the manifest.** Read the capture manifest. Its `baseSha` and
   `headSha` must equal the request's SHAs; if they do not, reply with the
   mismatch and stop. Every path in it is relative to the manifest's
   directory. An entry in `errors` for a head build is itself a blocking
   finding (the head does not build); an error in a single capture means
   re-capture it in step 3.
2. **Check the story choice.** The script applied the rules in
   [What it captures](../../../docs/engineering/visual-review.md#what-it-captures)
   from the changed paths, by component name. Compare its `stories` with
   `git diff --name-status <base>..<head>`. When a story the rules call for
   is missing, add it in step 3. Write each story, its viewports and
   conditions, the reason, and its theme into your draft `captures`:
   `default` unless the story applies another theme (a `ThemeProvider` with
   overrides, a consumer theme example, a dark or high-contrast candidate),
   then `other`.
3. **Fill gaps.** To add a story or re-capture one, run
   `node scripts/visual-capture.mjs --base <base> --head <head> --out <dir> --only --story <id>`
   (`react:<id>` for a React story), with `<dir>` the manifest's directory.
   It reuses the built worktrees and writes a `recapture-<n>.json` beside the
   manifest. What the manifest gives you:
   - `pairs`: base, head and difference images per story, viewport and
     condition, with `differingPixels` at the pixel suite's threshold and
     `sizeMismatch`. A pair whose sizes differ is a difference. The count
     includes anti-aliased edge pixels, which the pixel suite leaves out.
   - `pairs[].contrast` at the head: text rows grouped by colour pair, with
     the ratio, whether the text is large, and the AA minimum, and the focus
     indicator under the `focus` condition. A row marked `needsSample` has an
     image or gradient behind it, or a colour computed styles cannot give:
     sample its pixels from the head capture yourself and say so in
     `verification`.
   - `baselines`: each changed PNG under `visual-baselines/` at base and head,
     with a difference image.
   - `pixels`: the pixel suite's status at the head, its log and its diff
     images.
4. **Blind pass.** On a repeat round, first compare each pair's head image in
   the new manifest with the same story, viewport and condition head image in
   the previous manifest (the `previous capture` path), pixel by pixel, for
   example with PIL. Judge only the pairs whose head image
   changed, the pairs new to this manifest and every story tied to an open
   finding; carry the rest from the previous review without judging them
   again. If the previous manifest is missing, unreadable or has a different
   `baseSha`, judge every pair as in round one and say so in the review.
   Look at every differing pair, and at every head capture of
   a story the pull request changed, even when it did not differ (within that
   set on a repeat round). Write down
   each visible difference and each visible defect, as
   [How it judges](../../../docs/engineering/visual-review.md#how-it-judges)
   lists them. Then check the changed stories against
   [Priorities](../../../docs/engineering/visual-review.md#priorities):
   Section 508 first (contrast measurements, 200 % text, a visible focus
   indicator, colour not the only signal, no images of text), then the
   owning docs, then `BRAND_RULES.md` for the `default`-theme stories only.
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
6. **Verify candidates.** Re-capture each candidate once, as in step 3, to
   rule out flakiness, and check whether the base already showed it. A defect or
   Section 508 failure present at the base in a story the pull request does
   not change is not a finding: file a bug issue for it. Drop what you cannot
   confirm. Rank by severity, `section-508` first, and keep at most ten.
7. **Repeat rounds.** For round two or later, the lead sends a new manifest
   for the new head against the same base, with the previous round's manifest
   path as `previous capture`. Judge only what step 4 selects, but still read
   the pull request body in full in step 5. Close each earlier finding as `fixed`, `justified` or
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
10. **Clean up.** Remove the capture's worktrees with
    `node scripts/visual-capture.mjs --out <dir> --clean`.

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
