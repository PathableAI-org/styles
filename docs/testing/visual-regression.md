# Pixel visual regression

This document owns the pixel visual-regression suite: what it compares, how
captures are made, which stories get a baseline, and how to compare and
update baselines. Which risk tier a baseline change implies is in
[Risk tiers](../engineering/git-workflow.md#risk-tiers).

## Coverage today

The suite compares only the story entries of components on the **rollout
list**, and its output names the stories it compares and says how many
canonical stories it does not.

| Workspace                      | Suite                     | Stories compared                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Not compared                                                                                        |
| ------------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| styles (`apps/storybook`)      | `pnpm test:pixels-styles` | Button `outline` and `unstyled`, Button `accent-warm` (desktop), ButtonGroup `default` and `wrapping`, Icon `all-icons`, IconButton `all-variants`, IconTile `all-variants`, Integration `toolbar-panel`, Interaction States `all-states` and `state-precedence`, OptionalFormSection `default`, `expanded` and `narrow`, Input, Select and Textarea `keyboard-focus` (desktop), FormRow `default`, FormStack `default` and `with-form-row`, Checkbox `with-hint-and-error` and `disabled`, Radio `with-hint-and-error`, FilterableOptionList `default`, `selected` and `empty`, Modal `open`, `narrow` and `long-content`, SegmentedControl `single-select` (desktop), the desktop and mobile app shell `default` (the mobile shell includes the bottom navigation) and the mobile shell `shared-navigation`, Card `workflow-card-with-status` (desktop), PageError `full-page`, Toast `stacked` (desktop) | Every other story in `CANONICAL_STORIES`, including the other canonical stories of these components |
| React (`apps/storybook-react`) | None yet                  | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Every story                                                                                         |

Coverage is partial. A story without baselines passes without comparison,
even when its component is on the rollout list: IconButton's sizes, circle
shape and other surfaces are not compared today, and whether they need a
baseline is decided by the rule in
[Which stories get a baseline](#which-stories-get-a-baseline).
[#271](https://github.com/PathableAI-org/styles/issues/271) tracks the
rollout: one pull request per Storybook category, adding the stories that
rule picks for each component in it, then a final change that turns the list
into a check so that a component with no baseline fails CI.

The suite is separate from `pnpm test:visual`, the visual smoke test, which
checks that canonical stories render without blank output or horizontal
overflow and compares no pixels.

## Which stories get a baseline

The suite does not capture every canonical story. A baseline earns its place
when it shows CSS that no other baseline shows.

- **One aggregate story per component is the default.** A story that renders
  all of a component's variants together, such as IconButton `all-variants`,
  shows most of the component's rules in one image.
- **Add a further story only when it shows CSS the aggregate does not**, such
  as a layout under content pressure or a state with its own rules. Give the
  reason next to the story entry.
- **A component without an aggregate story** either gets one, in a separate
  stories pull request first, or uses the smallest set of its existing
  stories that together show its CSS. A page-level pattern or recipe usually
  needs only one populated story.

A pixel baseline is for appearance that cannot be written as an assertion:
how rules combine into alignment, spacing, wrapping, icon position and
forced-colors rendering. A result that can be named stays in its own check
and needs no baseline for that reason alone: behaviour, keyboard, focus
movement, state and ARIA in play functions; accessibility rules in the
test-runner's axe check; rendering and horizontal overflow in
`pnpm test:visual`, which covers every canonical story.

Keep the set small. Every baseline is an image a reviewer must look at when
it changes, and a set too large to look at gets approved unseen.

## How a capture is made

[`packages/styles/scripts/pixel-stories.mjs`](../../packages/styles/scripts/pixel-stories.mjs)
holds the story entries and the rollout list.
[`packages/styles/scripts/test-pixels.mjs`](../../packages/styles/scripts/test-pixels.mjs)
holds the threshold and runs the suite. It serves the
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
- **Settling and focus.** After the play function, the hook waits for web
  fonts and returns focus to the document body, so focus left by the play
  function is not captured. It then presses Tab once, a real key press, so
  the first interactive control has `:focus-visible` and the image shows one
  focus indicator next to the unfocused controls. A story without an
  interactive control is captured with nothing focused.
- **Comparison.** CSS animations and transitions are disabled and the text
  caret is hidden. A pixel differs when its colour distance exceeds 0.01 on a
  0 to 1 scale, which a uniform shift of about 3/255 per channel exceeds, and
  no differing pixel is allowed. Anti-aliased edge pixels are not counted. A
  smaller colour change passes, and an update does not rewrite a baseline for
  it.
- **Baselines.** Plain PNG files in
  [`visual-baselines/`](../../visual-baselines/), outside every package's
  published `files`, named
  `<workspace>/<component>/<state>/<viewport>.png`. The
  `<component>/<state>` key comes from the story entry, not from the story ID,
  so a React capture of the same state can share the key and be paired later.

## One image per viewport

Each story entry gets one image per viewport: the default rendering, with
keyboard focus on the first interactive control. IconButton `all-variants`
has three images.

`forced-colors`, increased text size and `prefers-reduced-motion` are not
captured, because each would add a further image per viewport for every
story. They are not pixel-checked. A claim about them is observed through the
`browser` channel of the
[verification harness](../engineering/verification-harness.md#evidence-channels),
and a story that builds one into its markup, such as an `--increased-text`
story, can get a baseline of its own by the rule above.

## Commands

```bash
pnpm build                      # build the packages; the Storybook imports them
pnpm build:docs                 # build the styles Storybook
pnpm test:pixels-styles         # compare the rollout list with its baselines
pnpm test:pixels-styles:update --component icon-button
```

`pnpm build:docs` fails to resolve `@pathableai/styles/js` until
`pnpm build` has run in the checkout.

Both commands run in the pinned container through Docker, with the
repository mounted at the same path and your user ID. The container uses the
installed `node_modules`, so this needs a Linux host. An update needs
`--component <key>`. Failures write a diff image (expected, difference and
received side by side) and the received image to
`apps/storybook/test-results/pixels/<component>/<state>/`. The suite also
fails when `visual-baselines/styles/` holds an image that no rollout capture
compares, or when a planned capture did not run (for example because the
test-runner skipped its story).

### In a Claude Code cloud session

Cloud sessions are Linux containers with Docker installed, but the Docker
daemon is not running when the session starts. `docker info` then reports
`Cannot connect to the Docker daemon` and `/var/run/docker.sock` is missing.
That means the daemon is stopped, not that Docker is unavailable. Start it,
then run the commands above as usual:

```bash
(nohup dockerd > /tmp/dockerd.log 2>&1 &)
```

```bash
for i in $(seq 1 30); do docker info > /dev/null 2>&1 && break; sleep 1; done; docker info --format '{{.ServerVersion}}'
```

The session runs as root, so no `sudo` is needed. The first run pulls the
pinned Playwright image from `mcr.microsoft.com` through the session's proxy,
which the default network policy allows; it needs no extra allowed host. The
capture itself runs with `--network=none`.

Do not take baselines from CI's artifact in a cloud session, and do not ask
for a network allowlist change to download one. GitHub Actions artifacts are
served from Azure blob hosts such as
`productionresultssa3.blob.core.windows.net`, and adding one to an
environment widens the network of every later session that uses it, for
something a local run does without. If `dockerd` will not start, stop and
report the error from its log instead.

### Without Docker

Only on a machine that cannot run Docker on Linux, such as a macOS or Windows
workstation, take new or changed baselines from CI: the
`Styles pixel visual regression` job uploads the `pixels-styles` artifact on
failure. Review each `-received.png` and copy it to the matching baseline
path without the `-received` suffix. `--no-container` compares on the host
browser for diagnosis only, and refuses to update.

## Adding a component

The baselines of one Storybook category's components land together in their
own pull request, which changes nothing else. For each component:

1. Choose the stories by the rule in
   [Which stories get a baseline](#which-stories-get-a-baseline). If the
   component needs an aggregate story, or a chosen story does not render
   deterministically, add or fix the stories in a separate pull request first.
2. Add an entry to `STORIES` in `packages/styles/scripts/pixel-stories.mjs`
   for each chosen story, with its key,
   and add the component to `ROLLOUT`. In the pull request, say
   which of the component's canonical stories have no baseline and why the
   chosen ones cover their CSS.
3. Run the update for that component, look at every image, and commit them.

A component whose rendering is visibly wrong today is not added: file a
defect issue, link it from the pull request, and leave the component off the
rollout list until it is fixed or a maintainer accepts its rendering; it is
then added in a pull request of its own. Review a changed baseline in the pull
request's file diff, and treat an unexplained difference as a regression
(constitution, Visual Regression Protection).

## Known limits

- Chromium only, in one Linux image.
- Rendering under `forced-colors`, increased text size and
  `prefers-reduced-motion` is not compared.
- Only the first interactive control in a story is captured focused.
- Storybook 10 has ended official support for the test-runner in favour of its
  Vitest addon. The repository's accessibility job uses the test-runner too.
- Text in a story's own framing markup that sets no font family renders in
  the browser's default font, because `@pathableai/styles` applies no base
  font to `body`.
