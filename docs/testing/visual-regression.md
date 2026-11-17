# Pixel visual regression

This document owns the pixel visual-regression suites: what they compare, how
captures are made, which conditions apply to a story, and the commands to
compare and update baselines. Which risk tier a baseline change implies is in
[Risk tiers](../engineering/git-workflow.md#risk-tiers).

## Coverage today

Each Storybook workspace has its own suite, story list, baselines and CI job.
A suite compares only components on its workspace's **rollout list**, and its
output says how many canonical stories it does not compare.

| Workspace                      | Suite                     | Components on the rollout list | Not compared                                                   |
| ------------------------------ | ------------------------- | ------------------------------ | -------------------------------------------------------------- |
| styles (`apps/storybook`)      | `pnpm test:pixels-styles` | IconButton                     | Every other story in `CANONICAL_STORIES`                       |
| React (`apps/storybook-react`) | Not built yet             | None                           | Every story; the React suite reuses this harness when it lands |

Coverage is partial. A component that is not on its workspace's rollout list
has no baselines, so a change to its rendering passes the suite without
comparison. [#271](https://github.com/PathableAI-org/styles/issues/271) tracks
the rollout: one pull request per component, then a final change that turns
the list into a check so that a canonical story without baselines fails CI.

The pixel suites are separate from `pnpm test:visual`, the visual smoke test,
which checks that each canonical styles story renders without blank output or
horizontal overflow and compares no pixels.

## How a capture is made

The shared harness is in
[`scripts/visual-regression/`](../../scripts/visual-regression/):
`harness.mjs` holds everything both workspaces share, `workspaces.mjs` holds
each workspace's story list and rollout list, and `run.mjs` runs a suite.

- **Pinned container.** Captures run in
  `mcr.microsoft.com/playwright:v<version>-noble`, where `<version>` is the
  exact Playwright version in `pnpm-lock.yaml`. The browser build therefore
  always matches the Playwright library, and a Playwright upgrade moves the
  image with it. The container runs without network access.
- **Viewports.** The shared `VIEWPORTS` in
  `packages/styles/scripts/quality-gates.mjs`: mobile 375 px, tablet 768 px,
  desktop 1280 px. A story's `mode` in the canonical list chooses which, as
  for `test:visual`: `both` captures all three.
- **Framing.** The whole story iframe page at the viewport width, full page,
  with the Storybook preview's own padding and background and no harness
  decorators. Device scale factor 1, light colour scheme, `en-US`, UTC.
- **Settling.** The harness waits until Storybook has rendered the story and
  run its play function, then waits for web fonts and returns focus to the
  document body, so focus left behind by a play function is not captured. A
  render error fails the capture. Play-function assertions are the Storybook
  test-runner's job: under an emulated condition they can fail (for example a
  colour assertion under `forced-colors`), which does not stop the capture.
- **Comparison.** Playwright `toHaveScreenshot` with CSS animations and
  transitions disabled and the text caret hidden. A pixel counts as different
  when its colour distance exceeds 0.05 (Playwright `threshold`, on a 0 to 1
  scale); no differing pixels are allowed (`maxDiffPixels: 0`). The pinned
  container makes rendering deterministic, so the small per-pixel tolerance
  only absorbs anti-aliasing noise; a token colour change exceeds it.
- **Baselines.** Plain PNG files in
  [`visual-baselines/`](../../visual-baselines/), outside every package's
  published `files`, named
  `<workspace>/<component>/<state>/<viewport>-<condition>.png`. The
  `<component>/<state>` key comes from the story's entry in `workspaces.mjs`,
  not from the story ID, so the styles and React captures of the same state
  share a key and can later be paired.

## Conditions

The harness defines five condition variants, and every capture checks that
its condition is in effect before the screenshot. The suite also checks every
condition's emulation on the first rollout story, including conditions no
rollout story uses yet.

| Condition        | How it is applied                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `default`        | No emulation, nothing focused                                                              |
| `forced-colors`  | `forced-colors: active`, emulated before the story loads                                   |
| `text-200`       | The browser's default text size set to 32 px (200 %), as a user enlarging text would       |
| `reduced-motion` | `prefers-reduced-motion: reduce`, emulated before the story loads                          |
| `focus-visible`  | One real keyboard Tab from the document start, which focuses the first interactive control |

Each story entry in `workspaces.mjs` lists its conditions, with the reason
next to it. Apply a condition only where it can change what the story shows:

- `default`: every story, unless the story only renders under a condition
  (below).
- `forced-colors`: the component tells states or variants apart by colour,
  background or border, or has `forced-colors` rules.
- `text-200`: the component renders text, or sizes or positions itself in
  `rem`, `em` or other text-relative units.
- `reduced-motion`: the component has motion that a still capture can show
  differently under `reduce`: an animation, or a `prefers-reduced-motion` rule
  that changes a static property. A rule that only removes transitions does
  not qualify, because captures disable transitions anyway.
- `focus-visible`: the story contains an interactive control with a focus
  indicator.

A story that builds a condition into its markup, such as an
`--increased-text` story, is captured under `default` only. A
`--forced-colors` story needs the emulation to render as intended, so it is
captured under `forced-colors` only. Combinations of conditions, such as a
focus ring under `forced-colors`, are not captured.

For example, IconButton's `all-variants` story is captured under `default`,
`forced-colors` and `focus-visible`. It is not captured under `text-200`
(icon-only and sized in `px`) or `reduced-motion` (its only motion rule
removes transitions).

## Commands

Build the workspace's Storybook first; the suite serves the built output.

```bash
pnpm build:docs                 # build the styles Storybook
pnpm test:pixels-styles         # compare the rollout list with its baselines
pnpm test:pixels-styles:update -- --component icon-button
```

Both commands run inside the pinned container through Docker, with the
repository mounted at the same path and your user ID, so baselines written by
an update are owned by you. An update needs `--component <key>` (repeatable)
or `--all` for every rollout component, and writes only the captures that
differ or are missing. Failures write expected, actual and diff images to
`apps/storybook/test-results/pixels/`.

Without Docker you cannot write baselines that match CI, so update through
CI instead:

1. Push the change. The `Styles pixel visual regression` job fails and
   uploads the `pixels-styles` artifact.
2. Download the artifact. Each failing capture has an `-actual.png` image
   rendered in the pinned container.
3. Review it, then copy it over the baseline path the job printed, dropping
   the `-actual` suffix, and push.

`node scripts/visual-regression/run.mjs --workspace styles --no-container`
compares with the host's browser and fonts. Its differences can come from the
host rather than the change, so use it for diagnosis only; it refuses to
update baselines.

## In CI

The `Styles pixel visual regression` job in
[`storybook-quality.yml`](../../.github/workflows/storybook-quality.yml) runs
`pnpm test:pixels-styles` against the shared Storybook build, in the same
pinned container. On failure it uploads the expected, actual and diff images
as the `pixels-styles` artifact. It also fails when `visual-baselines/`
contains an image that no rollout capture compares.

## Adding a component

Each component's baselines land in a pull request of their own, which changes
nothing else, so the reviewer judges only that component's images:

1. Check that the component's canonical stories render deterministically. If
   they do not, fix the stories in a separate pull request first.
2. Add an entry to the workspace's `stories` for each canonical story of the
   component, with its `<component>/<state>` key and its conditions under the
   rule above, and add the component to `rollout`.
3. Run the update for that component, look at every image, and commit them.

A component whose rendering is visibly wrong today is not added. File a
defect issue, link it from the pull request, and leave the component off the
rollout list until the defect is fixed or a maintainer accepts the current
rendering.

## Reviewing a baseline change

A changed baseline is a deliberate change to how a story renders. Review the
old and new images in the pull request's file diff, confirm the change is the
one the pull request describes, and treat an unexplained difference as a
regression, not as a baseline to accept (constitution, Visual Regression
Protection).

## Known limits

- Chromium only, in one Linux image. No WebKit or Firefox baselines.
- `forced-colors` and `prefers-reduced-motion` are emulated in Chromium; they
  do not establish behaviour in Windows High Contrast or other browsers.
- Text in a story's own framing markup that sets no font family renders in
  the browser's default font, because `@pathableai/styles` applies no base
  font to `body`. Baselines record that text as it renders in the container.
