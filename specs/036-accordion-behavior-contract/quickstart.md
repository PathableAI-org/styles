# Quickstart: Accordion Behavior Contract Pilot

## Prerequisites

- Node.js matching the root engine policy
- pnpm matching the root `packageManager` declaration
- Locked workspace dependencies installed
- Playwright Chromium available

## Focused Validation

### Styles reference implementation

```bash
pnpm test:contracts:accordion:styles
```

Expected: the three readable Accordion scenarios pass against the styles
Storybook, with the target identified as `styles`.

### React implementation

```bash
pnpm test:contracts:accordion:react
```

Expected: the same three scenarios pass against the React Storybook, with the
target identified as `react`. The React preview does not import the styles
JavaScript behavior bundle.

### Complete conformance matrix

```bash
pnpm test:contracts:accordion
```

Expected: six target-specific results pass: three scenarios multiplied by two
targets. Both catalog servers and browser processes stop when the command ends.

## Repository Validation

```bash
pnpm lint
pnpm typecheck
pnpm test:storybook
pnpm test:next-consumer
pnpm test:contracts:accordion
git diff --check origin/main
```

Expected: every command succeeds without broad exceptions or excluded source
files.

## Manual Independence Check

1. Inspect `apps/storybook/.storybook/preview.js` and confirm it imports the
   styles JavaScript bundle.
2. Inspect `apps/storybook-react/.storybook/preview.js` and confirm it imports
   only the compiled styles CSS.
3. Run the React contract command and confirm all scenarios pass.

This proves React conforms through its own implementation rather than through
global styles JavaScript mutation.

## Future Target Registration

To add a framework after the pilot:

1. Add deterministic Accordion stories matching the two shared fixtures.
2. Register the target's workspace, build steps, static output, port, fixture
   story IDs, and capabilities in `behavior-contracts/targets.mjs`.
3. Run the existing feature unchanged against the new target.
4. Keep framework-only API assertions in that package's own tests.

Do not copy or generate the Gherkin scenarios into the framework package.
