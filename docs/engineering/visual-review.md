# Visual review

This document describes the visual review subagent: an agent with a clean
context, running on `opus` at `high` effort, that looks at screenshots of what
the local commits of a delivery issue render, before and after the change, and
judges whether every visible difference is intended, described and free of
defects. It owns when a visual review runs, what it captures, how it judges,
its findings and its reply. The `visual-reviewer` skill supplies the
procedure.

[Code review](code-review.md) owns the review of the code itself.
[The verification harness](verification-harness.md) owns claims and their
evidence. [Git workflow](git-workflow.md) owns the review that a person
applies.

The code reviewer reads the diff and can only infer what it renders. The visual
reviewer looks at the rendered result, as a person reviewing the pull request would, and replies to the lead
session with what it saw. There is no gate: the lead answers every finding.

## When a visual review runs

A visual review runs in a review round whose diff can change what the
Storybooks render, at every tier. A path can need a review when it can change
what a Storybook renders:

- shipped SCSS, fonts and icons
- Storybook configuration and decorators
- stories and fixtures
- component pages and the component-docs generator
- runtime or Storybook-rendering dependencies

Tests, check and test scripts, test-runner hooks, lint configuration,
contributor docs and dev-only dependencies do not. A file the classifier does
not list but that sits in a render tree counts as rendering. A package manifest
or `pnpm-lock.yaml` counts only when a dependency, export or build script that
affects rendering changed; for the lockfile, when a render dependency's
resolved closure changed.

[`scripts/visual-capture/classify.mjs`](../../scripts/visual-capture/classify.mjs)
owns the exact rule and its list of paths. The lead session never judges by
hand. In the review round it runs:

```sh
node scripts/visual-capture.mjs --base <base SHA> --head <head SHA> --classify
```

This builds nothing and takes about a second. Exit 0 means a visual review is
required; exit 3 means it is not. The lead quotes the verdict line in the round
summary.

When a review is required, the lead runs the capture as before. The capture
can end early, and writes a manifest `verdict`:

| Verdict            | Meaning                                                                                                                                                             | What the lead does                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `not-required`     | No changed path can change rendering. Written when the capture runs without `--classify` on a diff that needs no review.                                            | Records the verdict and summary; starts no reviewer. |
| `no-render-change` | A styles-only diff whose built `packages/styles/dist` and `apps/storybook/generated` are byte-identical at base and head, with no Storybook-side dependency change. | Records the verdict and summary; starts no reviewer. |
| `no-difference`    | Every pair matches, no story is one the change touches directly and no story is gone at the head (`removedStories` is empty).                                       | Records the verdict and summary; starts no reviewer. |
| `review`           | Something differs, a touched story needs judging, or a stories file's stories are gone at the head (removed stories).                                               | Passes the manifest to the visual reviewer.          |

Only `review` goes to the visual reviewer. For the other three, the lead
records the verdict and the capture summary as the round's visual evidence.
For `no-render-change` and `no-difference` the script removes its worktrees
itself, because no reviewer runs to do it.
`--force` captures anyway, when the lead or a person wants a review on a diff
the rule skips. It skips the classifier gate and the output pre-check, always
ends with the verdict `review`, and, when the diff has no rendering paths,
samples the first story of each stories file.

[Visual-only styles work](git-workflow.md#visual-only-styles-work) gets a
visual review at every tier, because the visual review is its evidence. For
visual-only work the lead runs the capture with `--force`, so the reviewer
always runs and a missing visible change is reported as `missing`. High work
gets a visual review whenever its diff changes rendering, because such a diff
always touches SCSS, stories, fixtures or component pages, which have no
exclusions. The verifier's
[screenshots for visual claims](verification-harness.md#screenshots-for-visual-claims)
still apply to High work.

## Inputs

The visual reviewer starts with a clean context and reads only:

- the request: `base` and `head` (40-character SHAs of local commits), `round`,
  `capture` (the path of the capture manifest), `task` (the delivery issue URL
  or number, or the task text the person gave), `previous` (its own earlier
  findings with the lead session's answer to each, or `none`), and
  `previous capture`, the path of the previous round's capture manifest or
  `none`
- the list of changed paths from the base SHA to the head SHA, which it uses
  to check the story choice and the manifest's `classification`, not to judge
  the code
- the stories it captures, rendered at both SHAs
- after the blind pass only: the task's stated intent (the delivery issue or
  task text), the commit messages between the two SHAs and the changeset, at
  the head SHA
- the standards it judges by, in [priority order](#priorities): Section 508,
  the repository's accessibility and responsive-state rules,
  and [`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md) for the
  default theme

It never reads the lead session's transcript, worktree or messages,
or another reviewer's findings. It does not read the diff's
content beyond what it needs to pick stories and confirm a finding's cause.

## What it captures

Capturing is mechanical and judging is not, so they are split. The lead
session runs
[`scripts/visual-capture.mjs`](../../scripts/visual-capture.mjs) itself, for
the local base and head SHAs, in the background, and passes the manifest to the
reviewer only when its verdict is `review`. The script does everything in the
list below except naming themes, and writes a manifest (schema 2) of image
paths and numbers, with the `verdict`, the `classification` of each changed
path, the `precheck` result and `removedStories` (the stories in the base
index that the head index lacks, which always make the verdict `review`). The
script removes its worktrees itself when the verdict is `no-render-change` or
`no-difference`. The visual reviewer
starts with that manifest, checks its SHAs and its story choice, and judges.
It runs the same script with `--only` to add a story the choice missed or to
re-capture a candidate finding, and removes the worktrees with `--clean`
when done.

The script first classifies the diff and stops with `not-required` when no
path can change rendering. For a styles-only diff it then builds both SHAs and
compares `packages/styles/dist` and `apps/storybook/generated` (the output
pre-check, before story choice), stopping with `no-render-change` when they are
identical. Otherwise it builds both SHAs in detached worktrees under its output directory
(`pnpm install --frozen-lockfile`, `pnpm build`, then `pnpm build:docs` and,
when a React path changed, the React Storybook build), with build output in
log files, and serves them on ports 6020 to 6023.

1. **Choose stories.** Paths the classifier marks none never sample stories:
   a test-runner edit does not sample every stories file. A lockfile change
   samples only the Storybook whose dependencies changed. Every story in a stories file the pull request changes,
   every story of a component whose page, fixtures, styles or React source
   changed. A change to a shared token, a base partial or a dependency
   affects every component: capture the canonical stories in
   `CANONICAL_STORIES` instead, or, while that list is empty, the first story
   of each stories file. A shared React change (the
   theming source, the React Storybook configuration, the React package's
   dependencies or the lockfile) samples the first story of each React stories
   file. The script matches stories to changed files by component name. It
   also matches a wrapper partial to the component pages whose `styles-class`
   names its class and to the fixture folders that use the class, and it
   samples like a shared change when a changed component matches no story. It
   records a story missing from the index, or one that does not render, as a
   capture error rather than a screenshot; the reviewer adds any story it
   missed. The
   reviewer names each chosen story, why, and its
   [theme](#the-default-theme-and-the-brand-book) in its reply.
2. **Captures.** Capture each chosen story with the
   pre-installed Playwright Chromium at the base and head SHAs, at the
   story's viewports (375, 768 and 1280 px, as its `mode` sets), full page,
   with animations disabled, after fonts load. Compare each pair by YIQ
   colour distance, with a pixel counting as different past 1 % of the largest
   distance, and produce a difference image.
3. **Conditions.** Capture every story the pull request changes with keyboard
   focus on its first interactive control and at 200 % text size, because
   Section 508 needs both. When the change touches colour, motion or
   forced-colors styles, also capture the affected stories under emulated
   `forced-colors: active` or `prefers-reduced-motion: reduce`.
4. **Measurements.** For every text and focus indicator in a chosen story at
   the head, read the foreground and background colours from the page's
   computed styles and compute the contrast ratio. The script marks text over
   an image or gradient `needsSample`, and the reviewer samples its pixels
   from the capture.

Captures are evidence for the review. They are never committed.

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

2. **The repository's accessibility and responsive-state rules:**
   visible focus, accessible state colours and disabled affordances, and
   layouts that hold at every viewport. A clear failure is a blocking
   `defect`. Where a principle asks for more than WCAG 2.0, such as 3:1
   non-text contrast for a focus ring, it is still a `defect`, not a
   `section-508` finding.
3. **The brand book**, for the default theme only; see
   [below](#the-default-theme-and-the-brand-book).
4. **The task's stated intent**, and the instructions in the request,
   this document and the skill.

### When Section 508 conflicts with an instruction

Instructions can contradict Section 508: a brand rule, the task's
stated intent, the lead session's justification of an earlier finding, a
story written to show a failing combination, or this document and the skill
themselves. When following any instruction would mean passing a Section 508
failure, the reviewer does not resolve it, even where
[`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md) already says
accessibility takes priority. It reports:

- the `section-508` finding, blocking, with its criterion
- a `section 508 conflict` escalation naming that finding, the instruction,
  where it came from, and what each side requires

It never closes a `section-508` finding as `justified`; only `fixed`, or a
person's decision relayed by the lead session, closes it. The lead stops and
hands the decision to a person.

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
- Other-theme stories are judged against Section 508, the owning docs and the
  task's intent, and never against the brand book. A `brand` finding on one is
  invalid.

## How it judges

The review has two passes, in this order, so the author's account cannot
anchor what the reviewer sees.

1. **Blind pass.** Before reading anything the task says about
   itself, look at every pair and the head captures alone. Write down each
   visible difference between base and head, and each visible defect at the
   head: clipped or overlapping content, horizontal overflow, misaligned
   icons or baselines, inconsistent spacing within a component, text that is
   unreadable against its background, a missing or doubled focus indicator,
   a state that looks like a different state, or a layout that breaks at one
   viewport. Then check every head capture of a changed story against the
   [priorities](#priorities), Section 508 first.
2. **Intent pass.** Now read the task, the commit messages and the changeset.
   Match each difference from the blind pass to the stated change. A
   difference the task does not describe is unexplained, however small. A
   stated change with no visible difference where one was expected is also a
   finding.

A Light delivery issue states that nothing visible changes. Any visible
difference on one is a blocking `tier` finding: the work is Standard, and
the lead session raises the tier before anything else.

A defect or Section 508 failure that the base already had, in a story the
change does not touch, is not this review's finding. The reviewer
files it as a bug issue under
[Defects found along the way](orchestration.md#defects-found-along-the-way)
and names the issue in its reply.

## Findings

Each visual review reply names the reviewed head SHA, the base SHA, the round,
the stories captured, the page that shows the captures, every finding still
open, the findings this round closes, and any escalations. Each finding has:

- `id`: `VR-001`, `VR-002`, and so on, kept across rounds until closed
- `severity`: `blocking` when merging would ship a Section 508 failure, an
  unintended or unexplained visible change, a visible defect, or a Light
  change that alters rendering; otherwise `advisory`. A `section-508`
  finding is always blocking.
- `category`, one of:

  | Category      | What it covers                                                                                      |
  | ------------- | --------------------------------------------------------------------------------------------------- |
  | `section-508` | A Section 508 failure at the head in a story the change touches, with its WCAG criterion            |
  | `regression`  | A visible change the task did not intend: a component it did not mean to touch, or a state it broke |
  | `unexplained` | A visible change the task, commit messages and changeset do not describe                            |
  | `defect`      | A visible defect at the head, whether or not the base had it, in a story the change touches         |
  | `brand`       | A default-theme rendering that breaks [`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md)      |
  | `missing`     | A stated visible change with no visible difference, or an affected state no story shows             |
  | `tier`        | A visible change on work labelled Light                                                             |

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

A review reports at most ten findings, most severe first. It is clean when no
blocking finding and no escalation is open. There is no gate: the lead
session reads the reply and answers every finding.

## Screenshots page

The reviewer publishes every pair it judged, with base, head and difference
side by side and grouped by story, as one private page per round (an Artifact
in Claude Code sessions), and names that page's URL in its reply. A private
page is allowed; the reviewer does not post the images on the pull request or
anywhere else. The lead may link the page in the pull request body so a person
can look at the same images. The page is evidence; the reply is the review.

## The visual review loop

The lead session sends the visual reviewer a request in the same review
round as the code review request, on the same local head. It classifies the
diff and runs the capture script itself first, and sends the request only when
the manifest's verdict is `review`, passing the manifest. A repeat request after a fix
names the new head, the reviewer's own previous findings with, for each open
finding, the fixing commit or a written justification, and
`previous capture: <path to the previous round's capture manifest, or none>`.
With `none`, a missing value or an unreadable manifest the reviewer reviews
every pair as in round one and says so.

The reviewer replies with its findings, the page URL, the closures of its
previous findings and any escalation. It records and posts nothing else.

On a repeat round it reads the new capture, and closes each finding as
`fixed`, `justified` or `withdrawn`, as the code reviewer does. A `justified`
blocking finding goes in the pull request's **Decisions for the reviewer**.

Before the blind pass, the reviewer compares each pair's head image in the
new manifest with the head image of the same story, viewport and condition in
the previous manifest, pixel by pixel. The blind pass and the Section 508
checks (contrast rows, 200 % text, focus indicator) then cover every pair
whose head image changed since the previous round, every pair new to this
manifest, and every story tied to an open finding. A pair whose head image is
unchanged since the previous round and that is tied to no open finding is
carried from the previous review and not judged again. If the previous
manifest is missing, unreadable or has a different `baseSha`, or the previous
visual review reported ten findings (the cap), the reviewer reviews every pair
as in round one and says so. The intent pass still reads the task in full
every round and checks every base-to-head difference in the manifest,
including pairs carried from the previous review, against it.

A review covers the reviewed head. It still covers a later head when every
commit since changes no path, or when the head only merged the base branch in
and the diff against its base is unchanged, as
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

An escalated delivery issue waits for a person, who decides or tells the
sessions how to continue.

## Boundaries

The visual reviewer is read-only. It edits no branch, pull request, or issue,
and does not fix rendering or propose patches. It posts
nothing on GitHub. Its only writes are the private screenshots page, its reply
and bug issues for unrelated defects.

## Known limits

- Captures are Chromium only. `forced-colors` and reduced motion are
  emulated.
- The capture's pixel counts include anti-aliased edge pixels. Base and head
  render in the same browser, so edges differ only where content moved.
- The reviewer judges stories. A rendering change that no story shows is
  invisible to it, which is why `missing` is a category: it reports an
  affected state without a story rather than passing it.
- When the head merges the base branch in, captures taken before that merge
  do not show how the base's own changes combine with the pull request's.
