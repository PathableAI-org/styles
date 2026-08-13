# Quickstart: Accordion Behavior Contract Pilot

## Prerequisites

- Node.js matching the root engine policy
- pnpm matching the root `packageManager` declaration
- Locked workspace dependencies installed
- Playwright Chromium available

## Focused Validation

### Styles reference implementation

```bash
pnpm test:contracts:styles
```

Expected: the three readable Accordion scenarios pass against the styles
Storybook, with the target identified as `styles`.

### Complete registered-target matrix

```bash
pnpm test:contracts
```

Expected: every discovered feature runs against every registered target. The
pilot produces three styles-target results, and all catalog servers and browser
processes stop when the command ends.

## Repository Validation

```bash
pnpm lint
pnpm typecheck
pnpm test:storybook
pnpm test:next-consumer
pnpm test:contracts
git diff --check origin/main
```

Expected: every command succeeds without broad exceptions or excluded source
files.

## Manual Ownership Check

1. Inspect `apps/storybook/.storybook/preview.js` and confirm it imports the
   styles JavaScript bundle.
2. Run the styles contract command and confirm all scenarios pass through the
   reference DOM behavior.
3. Confirm this feature's diff contains no React component, story, or catalog
   configuration changes.

## Future Target Registration

To add a framework after the pilot:

1. Add deterministic Accordion stories matching the two shared fixtures.
2. Register the target's workspace, build steps, static output, port, fixture
   story IDs, and capabilities in `behavior-contracts/targets.mjs`.
3. Run all existing features unchanged against the new target.
4. Keep framework-only API assertions in that package's own tests.

Do not copy or generate the Gherkin scenarios into the framework package.
