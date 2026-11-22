# Visual review

This document describes the visual review subagent: an agent with a clean
context that looks at screenshots of what a pull request renders, before and
after the change, and judges whether every visible difference is intended,
described and free of defects. It owns when a visual review runs, what it
captures, how it judges, its findings and where they are stored. The
`visual-reviewer` skill supplies the procedure.

[Code review](code-review.md) owns the review of the code itself.
[The verification harness](verification-harness.md) owns claims and their
evidence. [Git workflow](git-workflow.md#agent-merge) owns when an agent may
merge, which reads this review.

The code reviewer reads the diff and can only infer what it renders. The pixel
suite compares only the stories with baselines, and a baseline update passes it
by definition. The visual reviewer covers the rest: it looks at the rendered
result, as a person reviewing the pull request would, and that look is
recorded and gates [agent merge](git-workflow.md#agent-merge).

## When a visual review runs

A visual review runs on every pull request that can change what the
Storybooks render and that an agent will merge: Standard and Light work
under [agent merge](git-workflow.md#agent-merge), including each slice of
specified Standard work. A pull request can change rendering when it changes
any of these paths:

- `packages/styles/src/`, `packages/styles/scripts/` or
  `packages/styles/package.json`
- `packages/react/src/` or `packages/react/package.json`
- `apps/storybook/` or `apps/storybook-react/`
- `visual-baselines/`
- `pnpm-lock.yaml`

The list lives in code, in `renderingPaths` in
[`scripts/merge-gate.mjs`](../../scripts/merge-gate.mjs); change both
together. A pull request that touches none of them, such as documentation or
repository tooling, needs no visual review.

High work keeps its person's review and gets no visual review, except
[visual-only styles work](git-workflow.md#visual-only-styles-work), which gets
one at every tier because the visual review is its evidence. The
verifier's [screenshots for visual claims](verification-harness.md#screenshots-for-visual-claims)
still apply to it.

## Inputs

The visual reviewer starts with a clean context and reads only:

- the request: branch, head SHA, base SHA, pull request number and round, plus
  for a repeat round the previous visual review ID and the implementation
  session's answer to each open finding
- the list of changed paths from the base SHA to the head SHA, which it uses
  to choose the stories to capture, not to judge the code
- the stories it captures, rendered at both SHAs
- after the blind pass only: the pull request's **Decisions for the
  reviewer**, **Tier**, **Change** and **Evidence** sections and its
  changeset, at the head SHA
- the standards it judges by, in [priority order](#priorities): Section 508,
  the constitution's principles X and XV and its Visual Regression Protection
  section, [`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md) for the
  default theme, and [Pixel visual regression](../testing/visual-regression.md)

It never reads the lead session's transcript, worktree or messages,
the code review, or the pre-push self-review. It does not read the diff's
content beyond what it needs to pick stories and confirm a finding's cause.

## What it captures

Capturing is mechanical and judging is not, so they are split. The
[`visual-capture`](../../.claude/agents/visual-capture.md) subagent, on a
small model, runs
[`scripts/visual-capture.mjs`](../../scripts/visual-capture.mjs) for the base
and head SHAs. The script does everything in the list below except naming
themes, and writes a manifest of image paths and numbers. The visual reviewer
starts with that manifest, checks its SHAs and its story choice, and judges.
It runs the same script with `--only` to add a story the choice missed or to
re-capture a candidate finding, and removes the worktrees with `--clean`
when done.

The script builds both SHAs in detached worktrees under its output directory
(`pnpm install --frozen-lockfile`, `pnpm build`, then `pnpm build:docs` and,
when a React path changed, the React Storybook build), with build output in
log files, and serves them on ports 6020 to 6023.

1. **Choose stories.** Every story in a stories file the pull request changes,
   every story of a component whose page, fixtures, styles or React source
   changed, and every rollout story in the pixel suite whose component
   is touched. A change to a shared token, a base partial or a dependency
   affects every component: capture the full pixel rollout list and the
   canonical stories in `CANONICAL_STORIES` instead, or, while both lists are
   empty, the first story of each stories file. A shared React change (the
   theming source, the React Storybook configuration, the React package's
   dependencies or the lockfile) samples the first story of each React stories
   file. The script matches stories to changed files by component name, and
   records a story missing from the index, or one that does not render, as a
   capture error rather than a screenshot; the reviewer adds any story it
   missed. The
   reviewer names each chosen story, why, and its
   [theme](#the-default-theme-and-the-brand-book) in the review's
   `captures`.
2. **Changed baselines.** For each PNG the pull request adds, changes or
   removes under `visual-baselines/`, take the base and head versions from
   Git and put them side by side with a difference image.
3. **Pixel suite.** Run `pnpm test:pixels-styles` at the head SHA, in the
   pinned container, as
   [Pixel visual regression](../testing/visual-regression.md#in-a-claude-code-cloud-session)
   describes. A failure is a finding in its own right; its diff images are
   evidence.
4. **Stories without baselines.** Capture each remaining chosen story with the
   pre-installed Playwright Chromium at the base and head SHAs, at the
   story's viewports (375, 768 and 1280 px, as its `mode` sets), full page,
   with animations disabled, after fonts load. Compare each pair by YIQ
   colour distance at the pixel suite's threshold and produce a difference
   image.
5. **Conditions.** Capture every story the pull request changes with keyboard
   focus on its first interactive control and at 200 % text size, because
   Section 508 needs both. When the change touches colour, motion or
   forced-colors styles, also capture the affected stories under emulated
   `forced-colors: active` or `prefers-reduced-motion: reduce`.
6. **Measurements.** For every text and focus indicator in a chosen story at
   the head, read the foreground and background colours from the page's
   computed styles and compute the contrast ratio. The script marks text over
   an image or gradient `needsSample`, and the reviewer samples its pixels
   from the capture.

Captures are evidence for the review, not committed baselines. They are never
committed and never copied into `visual-baselines/`.

## Priorities

The visual reviewer judges by these, in this order. A higher one always wins
over a lower one:

1. **Section 508.** The revised Section 508 standards incorporate WCAG 2.0
   Level A and AA. The reviewer checks what it can see and measure:
   - 1.4.3 Contrast (Minimum): 4.5:1 for text, 3:1 for large text (18 pt, or
     14 pt bold)
   - 1.4.4 Resize text: nothing clipped, overlapped or lost at 200 % text size
   - 2.4.7 Focus Visible: a visible focus indicator on every focusable control
   - 1.4.1 Use of Color: colour is not the only way a state or meaning shows
   - 1.4.5 Images of Text: text is not rendered as an image, outside logos
   - 1.3.3 Sensory Characteristics: a story's instructions do not rely on
     shape, position or colour alone

   A failure is a `section-508` finding, names its criterion and always
   blocks.

2. **The constitution's accessibility and responsive principles** (X and XV):
   visible focus, accessible state colours and disabled affordances, and
   layouts that hold at every viewport. A clear failure is a blocking
   `defect`. Where a principle asks for more than WCAG 2.0, such as 3:1
   non-text contrast for a focus ring, it is still a `defect`, not a
   `section-508` finding.
3. **The brand book**, for the default theme only; see
   [below](#the-default-theme-and-the-brand-book).
4. **The pull request's stated intent**, and the instructions in the request,
   this document and the skill.

### When Section 508 conflicts with an instruction

Instructions can contradict Section 508: a brand rule, the pull request's
stated intent, the lead session's justification of an earlier finding, a
story written to show a failing combination, or this document and the skill
themselves. When following any instruction would mean passing a Section 508
failure, the reviewer does not resolve it, even where
[`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md) already says
accessibility takes priority. It records:

- the `section-508` finding, blocking, with its criterion
- a `section 508 conflict` escalation naming that finding, the instruction,
  where it came from, and what each side requires

It never closes a `section-508` finding as `justified`; only `fixed`, or a
person's decision relayed by the lead session, closes it. The escalation makes
the pull request not eligible for agent merge, so the merge hook hands the
decision to a person.

### The default theme and the brand book

Only the default theme must follow the brand book. The default theme is
`@pathableai/styles` as it ships, with the values in
`packages/styles/src/theme-default.scss`, and React components with no
`theme` or a `ThemeProvider` that overrides nothing. A story that applies any
other theme, such as a `ThemeProvider` with overrides, a consumer theme
example, or a dark or high-contrast candidate, is captured with theme
`other`.

- Default-theme stories are judged against every priority above, including
  [`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md): its palette, colour
  hierarchy and pairings, typography, iconography and the violations it lists.
- Other-theme stories are judged against Section 508, the constitution and the
  pull request's intent, and never against the brand book. A `brand` finding
  on one is invalid, and the schema rejects it.

## How it judges

The review has two passes, in this order, so the author's account cannot
anchor what the reviewer sees.

1. **Blind pass.** Before reading anything the pull request says about
   itself, look at every pair and the head captures alone. Write down each
   visible difference between base and head, and each visible defect at the
   head: clipped or overlapping content, horizontal overflow, misaligned
   icons or baselines, inconsistent spacing within a component, text that is
   unreadable against its background, a missing or doubled focus indicator,
   a state that looks like a different state, or a layout that breaks at one
   viewport. Then check every head capture of a changed story against the
   [priorities](#priorities), Section 508 first.
2. **Intent pass.** Now read the pull request's sections and changeset. Match
   each difference from the blind pass to the stated change. A difference the
   pull request does not describe is unexplained, however small. A stated
   change with no visible difference where one was expected is also a
   finding.

A Light pull request states that nothing visible changes. Any visible
difference on one is a blocking `tier` finding: the work is Standard, and
the lead session raises the tier before anything else.

A defect or Section 508 failure that the base already had, in a story the
pull request does not change, is not this review's finding. The reviewer
files it as a bug issue under
[Defects found along the way](orchestration.md#defects-found-along-the-way)
and names the issue in its reply.

## Findings

Each visual review is one JSON document that
[`scripts/visual-review/schema.mjs`](../../scripts/visual-review/schema.mjs)
validates. It names the reviewed SHA, the base SHA, the pull request number,
the round, the stories captured, the page that shows the captures, every
finding still open, the findings this round closes, and any escalations. Each
finding has:

- `id`: `VR-001`, `VR-002`, and so on, kept across rounds until closed
- `severity`: `blocking` when merging would ship a Section 508 failure, an
  unintended or unexplained visible change, a visible defect, or a Light pull
  request that changes rendering; otherwise `advisory`. A `section-508`
  finding is always blocking.
- `category`, one of:

  | Category      | What it covers                                                                                               |
  | ------------- | ------------------------------------------------------------------------------------------------------------ |
  | `section-508` | A Section 508 failure at the head in a story the pull request changes or touches, with its WCAG criterion    |
  | `regression`  | A visible change the pull request did not intend: a component it did not mean to touch, or a state it broke  |
  | `unexplained` | A visible change the pull request's sections and changeset do not describe                                   |
  | `defect`      | A visible defect at the head, whether or not the base had it, in a story the pull request changes or touches |
  | `brand`       | A default-theme rendering that breaks [`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md)               |
  | `baseline`    | A baseline added or changed without a reason in the pull request, or one that captures a defect              |
  | `missing`     | A stated visible change with no visible difference, or an affected state no story shows                      |
  | `tier`        | A visible change on a pull request labelled Light                                                            |

- `story`: the Storybook story ID, and `viewport` (`mobile`, `tablet` or
  `desktop`) and `condition` (`default`, `focus`, `forced-colors`,
  `text-200`, `reduced-motion`) where they apply
- `criterion`: for a `section-508` finding, the WCAG success criterion it
  fails, such as `1.4.3`
- `summary`: the problem in one sentence
- `observed`: what the head capture shows, and, for a difference, what the
  base showed
- `confidence`: `high` or `medium`; the reviewer drops anything less
- `verification`: how the reviewer confirmed it, for example a re-capture or
  the pixel count of the difference

A review reports at most ten findings, most severe first. It passes when no
blocking finding and no escalation is open.

## Screenshots page

GitHub's REST API cannot attach images to a comment. The reviewer publishes
every pair it judged, with base, head and difference side by side and grouped
by story, as one private page per round (an Artifact in Claude Code
sessions), and names that page in the review's `page`. The comment that
`pnpm visual:record` posts links it, so a person can look at the same images
later. The page is evidence, not the record; the note is the record.

## Storage

Visual reviews are Git notes on the reviewed SHA in `refs/notes/visual`, and
travel between clones as pull request comments with the
`<!-- pathable-note kind=visual … -->` marker, exactly as
[Code review storage](code-review.md#storage) describes for reviews.

```sh
pnpm visual:record visual.json   # validate, append to the reviewed SHA's note, post it on the pull request
pnpm visual:show <sha>           # sync, then print the latest visual review; exits 1 while a blocking finding or escalation is open
```

`visual:record` adds the review's `inputs` itself: the code trees of the base
and reviewed SHAs.

## The visual review loop

The lead session sends the visual reviewer a request at the same
time as the code review request, on the same pushed SHA (see
[Agent merge](git-workflow.md#agent-merge)). A repeat request after a fix names the new SHA, the previous visual review
ID, and for each open finding either the fixing commit or a written
justification.

The reviewer records the review with `pnpm visual:record` and replies with a
pointer only, `refs/notes/visual @ <sha> (visual review <id>)`, plus the
counts of blocking and advisory findings.

On a repeat round it captures again at the new SHA, and closes each finding
as `fixed`, `justified` or `withdrawn`, as the code reviewer does. A
`justified` blocking finding goes in the pull request's **Decisions for the
reviewer**.

A review covers the reviewed SHA. It still covers a later head when every
commit since changes no path, or when the head only merged the base branch in
and the pull request's own diff against its base is unchanged, as
[Keeping up to date](git-workflow.md#keeping-up-to-date) defines. Any other change
needs a new request.

### Escalation

Escalate to a person, through the lead session, instead of
continuing when:

- Section 508 conflicts with any instruction, as
  [above](#when-section-508-conflicts-with-an-instruction), with a
  `section 508 conflict` escalation
- the reviewer and the lead session disagree whether a visible
  change is intended or acceptable
- a blocking finding is still open in round three
- a finding needs a design decision, such as a brand rule that does not cover
  the case

An escalated pull request waits for a person, who then decides and merges it
or tells the sessions how to continue.

## Boundaries

The visual reviewer is read-only. It edits no branch, pull request, issue,
baseline or `specs/` file, and does not fix rendering or propose patches. Its
only writes are its note, the comment `pnpm visual:record` posts, the
private screenshots page, and bug issues for unrelated defects.

## Known limits

- Captures are Chromium only. `forced-colors` and reduced motion are
  emulated.
- The capture's pixel counts include anti-aliased edge pixels, which the
  pixel suite leaves out. Base and head render in the same browser, so edges
  differ only where content moved.
- The reviewer judges stories. A rendering change that no story shows is
  invisible to it, which is why `missing` is a category: it reports an
  affected state without a story rather than passing it.
- When the head merges the base branch in, captures taken before that merge
  do not show how the base's own changes combine with the pull request's. The
  pixel suite in CI runs at the head and catches that for the stories it
  covers.
- Every session posts as the same GitHub login, so the gate trusts that a
  visual review note was written by a visual review subagent, as it does for
  code reviews.
