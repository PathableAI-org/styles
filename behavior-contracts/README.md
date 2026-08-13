# Behavior contracts

This top-level directory owns framework-neutral, executable component behavior.
Packages remain free to implement that behavior with their native runtime or to
reuse JavaScript published by `@pathableai/styles`.

The initial pilot covers only Accordion. It does not establish shared contracts
for other components.

## How the Gherkin is consumed

The execution path is:

1. Cucumber discovers every `features/**/*.feature` file. Accordion is the only
   feature in the initial pilot.
2. Cucumber binds each `Given`, `When`, and `Then` sentence to definitions under
   `steps/**/*.mjs`.
3. The selected entry in `targets.mjs` maps a shared fixture name such as
   `accordion.first-expanded` to that package's deterministic Storybook story.
4. `support/world.mjs` opens the story's direct iframe URL in Playwright.
5. Shared steps interact through accessible roles and names, send real keyboard
   input, and inspect observable ARIA state, panel availability, visibility, and
   focus.
6. Cucumber reports the same readable scenarios for the selected target.
7. `run.mjs` stops the browser and Storybook server it started, including after
   failures or interruption.

The feature file does not know about React props, hooks, JavaScript event
listeners, PathAble CSS selectors, Storybook IDs, or package directories.

## Commands

Run every discovered behavior contract against every registered target:

```bash
pnpm test:contracts
```

Run every discovered contract against only the styles target:

```bash
pnpm test:contracts:styles
```

Each command builds its selected package prerequisites and Storybook, starts a
static server, waits up to 30 seconds for readiness, runs every discovered
feature, and cleans up its owned processes. Aggregate validation runs all
registered targets sequentially and returns nonzero if any target fails.

## Accordion contract scope

The pilot defines three rules:

- Enter expands a collapsed disclosure.
- Space collapses an expanded disclosure.
- Opening a second disclosure in single-open mode closes the first.

Those scenarios also verify disclosure-to-panel association, `aria-expanded`,
panel visibility and availability, and focus retention.

Disabled-item and multiple-open behavior are deliberately excluded. They should
not become shared requirements until their framework-neutral ownership and
parity are resolved explicitly.

## Implementation independence

The initial styles Storybook target imports `@pathableai/styles/js`, so its
Accordion scenarios exercise the reference DOM behavior published by the
styles package. This pilot does not alter or register React components or the
React Storybook. A framework target can be added later without moving or
copying the Gherkin definitions.

## Target preflight and failures

Every target declares:

- a stable target name;
- ordered package and Storybook build commands;
- a static Storybook output directory and isolated port;
- mappings for every shared fixture;
- every required behavior capability.

Unknown targets, missing fixtures, missing capabilities, failed builds,
unreachable catalogs, missing disclosures or panels, behavioral mismatches, and
cleanup failures are errors. Required scenarios are never silently skipped.

Runtime output begins with the selected target name. Cucumber then reports the
product-readable scenario name and unmet observable step.

## Adding another framework target

To add a future React, Vue, Svelte, or other implementation:

1. Create deterministic Accordion stories for all-collapsed and
   first-expanded single-open states.
2. Add a `targets.mjs` entry with its build commands, static directory, port,
   story mappings, and required capabilities.
3. Add a root script invoking `node behavior-contracts/run.mjs <target>` if a
   dedicated command is useful.
4. Run all unchanged feature files against the new target.

Do not copy or generate the Gherkin into the package. Framework-only concerns,
such as controlled state, callbacks, ref forwarding, or model binding, remain
in that package's tests. Ensure a framework target does not also load a DOM
behavior runtime that could mask or compete with its native implementation.

## Relationship to other validation

These contracts supplement rather than replace:

- deterministic named Storybook stories;
- package-specific Storybook `play` tests;
- rendered automated accessibility checks;
- visual regression review;
- lint, type, build, and package-consumer validation; and
- explicit human keyboard, focus, and assistive-technology review.

Passing this automated matrix is conformance evidence, not accessibility
certification.
