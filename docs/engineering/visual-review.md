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

High work keeps its person's review and gets no visual review subagent. The
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
- [`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md), the
  constitution's Visual Regression Protection section, principle XV, and
  [Pixel visual regression](../testing/visual-regression.md)

It never reads the lead session's transcript, worktree or messages,
the code review, or the pre-push self-review. It does not read the diff's
content beyond what it needs to pick stories and confirm a finding's cause.

## What it captures

The reviewer builds both SHAs in its own detached worktrees (`pnpm install
--frozen-lockfile`, `pnpm build`, then `pnpm build:docs` and, when React
stories are affected, the React Storybook build).

1. **Choose stories.** Every story in a stories file the pull request changes,
   every canonical story of a component whose styles, React source or story
   file changed, and every rollout story in the pixel suite whose component
   is touched. A change to a shared token, a base partial or a dependency
   affects every component: capture the full pixel rollout list and the
   canonical stories in `CANONICAL_STORIES` instead. Name each chosen story
   and why in the review's `captures`.
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
   with animations disabled, after fonts load. Compare each pair with
   pixelmatch at the pixel suite's threshold and produce a difference image.
5. **Conditions.** When the change touches focus styles, colour, motion or
   text sizing, also capture the affected stories with keyboard focus on the
   changed control, under emulated `forced-colors: active`, at 200 % text
   size, or under `prefers-reduced-motion: reduce`, as relevant.

Captures are evidence for the review, not committed baselines. They are never
committed and never copied into `visual-baselines/`.

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
   viewport.
2. **Intent pass.** Now read the pull request's sections and changeset. Match
   each difference from the blind pass to the stated change. A difference the
   pull request does not describe is unexplained, however small. A stated
   change with no visible difference where one was expected is also a
   finding.

A Light pull request states that nothing visible changes. Any visible
difference on one is a blocking `tier` finding: the work is Standard, and
the lead session raises the tier before anything else.

## Findings

Each visual review is one JSON document that
[`scripts/visual-review/schema.mjs`](../../scripts/visual-review/schema.mjs)
validates. It names the reviewed SHA, the base SHA, the pull request number,
the round, the stories captured, the page that shows the captures, every
finding still open, the findings this round closes, and any escalations. Each
finding has:

- `id`: `VR-001`, `VR-002`, and so on, kept across rounds until closed
- `severity`: `blocking` when merging would ship an unintended or unexplained
  visible change, a visible defect, or a Light pull request that changes
  rendering; otherwise `advisory`
- `category`, one of:

  | Category      | What it covers                                                                                               |
  | ------------- | ------------------------------------------------------------------------------------------------------------ |
  | `regression`  | A visible change the pull request did not intend: a component it did not mean to touch, or a state it broke  |
  | `unexplained` | A visible change the pull request's sections and changeset do not describe                                   |
  | `defect`      | A visible defect at the head, whether or not the base had it, in a story the pull request changes or touches |
  | `brand`       | A rendering that breaks [`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md)                             |
  | `baseline`    | A baseline added or changed without a reason in the pull request, or one that captures a defect              |
  | `missing`     | A stated visible change with no visible difference, or an affected state no story shows                      |
  | `tier`        | A visible change on a pull request labelled Light                                                            |

- `story`: the Storybook story ID, and `viewport` (`mobile`, `tablet` or
  `desktop`) and `condition` (`default`, `focus`, `forced-colors`,
  `text-200`, `reduced-motion`) where they apply
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
only writes are its note, the comment `pnpm visual:record` posts, and the
private screenshots page.

## Known limits

- Captures are Chromium only. `forced-colors` and reduced motion are
  emulated.
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
