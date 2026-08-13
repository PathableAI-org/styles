# Behavior contracts

This top-level directory owns framework-neutral, executable component behavior.
Packages remain free to implement that behavior with their native runtime or to
reuse JavaScript published by `@pathableai/styles`.

The initial pilot covers only Accordion. It does not establish shared contracts
for other components.

## How the Gherkin is consumed

The execution path is:

1. Cucumber reads `features/accordion.feature`.
2. Cucumber binds each `Given`, `When`, and `Then` sentence to a definition in
   `steps/accordion.steps.mjs`.
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

Run the styles reference implementation:

```bash
pnpm test:contracts:accordion:styles
```

Run the React implementation:

```bash
pnpm test:contracts:accordion:react
```

Run the complete two-target matrix:

```bash
pnpm test:contracts:accordion
```

Each command builds its selected package prerequisites and Storybook, starts a
static server, waits up to 30 seconds for readiness, runs all three scenarios,
and cleans up its owned processes. Aggregate validation runs targets
sequentially and returns nonzero if either target fails.

## Accordion contract scope

The pilot defines three rules:

- Enter expands a collapsed disclosure.
- Space collapses an expanded disclosure.
- Opening a second disclosure in single-open mode closes the first.

Those scenarios also verify disclosure-to-panel association, `aria-expanded`,
panel visibility and availability, and focus retention.

Disabled-item and multiple-open behavior are deliberately excluded. React
currently exposes those APIs, but they should not become shared requirements
until their framework-neutral ownership and parity are resolved explicitly.

## Implementation independence

The styles Storybook imports `@pathableai/styles/js`, so its Accordion target
exercises the reference DOM behavior published by the styles package.

The React Storybook imports PathAble CSS but not `@pathableai/styles/js`.
React's Accordion component owns its state changes. This prevents the reference
DOM behavior from masking a React defect or competing with React event handling.

The same Gherkin and step definitions execute against both.

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

To add a future Vue, Svelte, or other implementation:

1. Create deterministic Accordion stories for all-collapsed and
   first-expanded single-open states.
2. Add a `targets.mjs` entry with its build commands, static directory, port,
   story mappings, and required capabilities.
3. Add a root script invoking `node behavior-contracts/run.mjs <target>` if a
   dedicated command is useful.
4. Run the unchanged Accordion feature against the new target.

Do not copy or generate the Gherkin into the package. Framework-only concerns,
such as controlled React state, callbacks, ref forwarding, or a Vue model
binding, remain in that package's tests.

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
