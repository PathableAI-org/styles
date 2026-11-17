# Pixel visual regression

This document owns the pixel visual-regression suite: what it compares, how
captures are made, which conditions apply to a story, and how to compare and
update baselines. Which risk tier a baseline change implies is in
[Risk tiers](../engineering/git-workflow.md#risk-tiers).

## Coverage today

The suite compares only the story entries of components on the **rollout
list**, and its output names the stories it compares and says how many
canonical stories it does not.

| Workspace                      | Suite                     | Stories compared          | Not compared                                                                                 |
| ------------------------------ | ------------------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| styles (`apps/storybook`)      | `pnpm test:pixels-styles` | IconButton `all-variants` | Every other story in `CANONICAL_STORIES`, including IconButton's other six canonical stories |
| React (`apps/storybook-react`) | None yet                  | None                      | Every story                                                                                  |

Coverage is partial and counted in stories, not components. A story without
baselines passes without comparison, even when its component is on the
rollout list: a change to IconButton's compact, large, circle, disabled or
loading rendering is not compared today.
[#271](https://github.com/PathableAI-org/styles/issues/271) tracks the
rollout: one pull request per component, adding all of that component's
canonical stories, then a final change that turns the list into a check so
that a canonical story without baselines fails CI.

The suite is separate from `pnpm test:visual`, the visual smoke test, which
checks that canonical stories render without blank output or horizontal
overflow and compares no pixels.

## How a capture is made

[`packages/styles/scripts/test-pixels.mjs`](../../packages/styles/scripts/test-pixels.mjs)
holds the story entries, the rollout list and the threshold. It serves the
built styles Storybook and runs the Storybook test-runner on the planned
stories' files. The test-runner renders each story and runs its play
function; then the `postVisit` hook in
[`apps/storybook/.storybook/pixels.js`](../../apps/storybook/.storybook/pixels.js)
captures it and compares the capture with its baseline through
[jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot).
The accessibility checks in the same test-runner configuration are skipped
during pixel runs.

- **Pinned container.** Captures run in
  `mcr.microsoft.com/playwright:v<version>-noble`, where `<version>` is the
  exact Playwright version in `pnpm-lock.yaml`, without network access.
- **Viewports.** The shared `VIEWPORTS` in
  `packages/styles/scripts/quality-gates.mjs` (mobile 375 px, tablet 768 px,
  desktop 1280 px), chosen by the story's `mode` as for `test:visual`: `both`
  captures all three.
- **Framing.** The whole story iframe page at the viewport width, full page,
  with the Storybook preview's own padding and background.
- **Settling.** After the play function, the hook waits for web fonts and
  returns focus to the document body, so focus left by the play function is
  not captured. Conditions are applied to the rendered story, not before it
  loads, so play-function assertions always run under default conditions.
- **Comparison.** CSS animations and transitions are disabled and the text
  caret is hidden. A pixel differs when its colour distance exceeds 0.01 on a
  0 to 1 scale, which a uniform shift of about 3/255 per channel exceeds, and
  no differing pixel is allowed. Anti-aliased edge pixels are not counted. A
  smaller colour change passes, and an update does not rewrite a baseline for
  it.
- **Baselines.** Plain PNG files in
  [`visual-baselines/`](../../visual-baselines/), outside every package's
  published `files`, named
  `<workspace>/<component>/<state>/<viewport>-<condition>.png`. The
  `<component>/<state>` key comes from the story entry, not from the story ID,
  so a React capture of the same state can share the key and be paired later.

## Conditions

Each capture checks that its condition is in effect before the screenshot.

| Condition        | How it is applied                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `default`        | No emulation, nothing focused                                                              |
| `forced-colors`  | `forced-colors: active`                                                                    |
| `text-200`       | The browser's default text size set to 32 px (200 %), as a user enlarging text would       |
| `reduced-motion` | `prefers-reduced-motion: reduce`                                                           |
| `focus-visible`  | One real keyboard Tab from the document start, which focuses the first interactive control |

Each story entry lists its conditions, with the reason next to it. Apply a
condition only where it can change what the story shows:

- `default`: every story, unless the story only renders under a condition.
- `forced-colors`: the component tells states or variants apart by colour,
  background or border, or has `forced-colors` rules.
- `text-200`: the component renders text, or sizes or positions itself in
  `rem`, `em` or other text-relative units.
- `reduced-motion`: the component has an animation, or a
  `prefers-reduced-motion` rule that changes a static property. A rule that
  only removes transitions does not qualify, because captures disable
  transitions anyway.
- `focus-visible`: the story contains an interactive control with a focus
  indicator.

A story that builds a condition into its markup, such as an
`--increased-text` story, is captured under `default` only; a
`--forced-colors` story is captured under `forced-colors` only. Combinations
of conditions are not captured. IconButton `all-variants` is captured under
`default`, `forced-colors` and `focus-visible`.

## Commands

```bash
pnpm build:docs                 # build the styles Storybook first
pnpm test:pixels-styles         # compare the rollout list with its baselines
pnpm test:pixels-styles:update -- --component icon-button
```

Both commands run in the pinned container through Docker, with the
repository mounted at the same path and your user ID. An update needs
`--component <key>`. Failures write a diff image (expected, difference and
received side by side) and the received image to
`apps/storybook/test-results/pixels/<component>/<state>/`. The suite also
fails when `visual-baselines/styles/` holds an image that no rollout capture
compares.

Without Docker, take new or changed baselines from CI: the
`Styles pixel visual regression` job uploads the `pixels-styles` artifact on
failure. Review each `-received.png` and copy it to the matching baseline
path without the `-received` suffix. `--no-container` compares on the host
browser for diagnosis only, and refuses to update.

## Adding a component

Each component's baselines land in their own pull request, which changes
nothing else:

1. Check that the component's canonical stories render deterministically. If
   they do not, fix the stories in a separate pull request first.
2. Add an entry to `STORIES` for each canonical story of the component, with
   its key and conditions, and add the component to `ROLLOUT`.
3. Run the update for that component, look at every image, and commit them.

A component whose rendering is visibly wrong today is not added: file a
defect issue, link it from the pull request, and leave the component off the
rollout list until it is fixed or a maintainer accepts its rendering. Review a
changed baseline in the pull request's file diff, and treat an unexplained
difference as a regression (constitution, Visual Regression Protection).

## Known limits

- Chromium only, in one Linux image.
- `forced-colors` and `prefers-reduced-motion` are emulated in Chromium; they
  do not establish behaviour in Windows High Contrast or other browsers.
- Storybook 10 has ended official support for the test-runner in favour of its
  Vitest addon. The repository's accessibility job uses the test-runner too.
- Text in a story's own framing markup that sets no font family renders in
  the browser's default font, because `@pathableai/styles` applies no base
  font to `body`.
