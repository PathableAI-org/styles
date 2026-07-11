# Quickstart: Structured Wizard and Guided Workflow Compositions

## Getting Started

1. Ensure you have the `@pathable/styles` package installed and your build is configured with `--load-path=node_modules/@uswds/uswds/packages`.

2. Import the compositions:

   **All-in-one (via existing index)** — already includes all component wrappers:
   ```scss
   @forward '@pathable/styles';
   ```

   **Bundle import** — wizard + workflow panel + save-status:
   ```scss
   @forward '@pathable/styles/src/pathable-component-wrappers/pathable-structured-workflow';
   ```

   **Selective imports** — individual components:
   ```scss
   // Wizard only
   @forward '@pathable/styles/src/pathable-component-wrappers/pathable-wizard';
   @forward '@pathable/styles/src/pathable-component-wrappers/pathable-wizard-actions';

   // Workflow panel only
   @forward '@pathable/styles/src/pathable-component-wrappers/pathable-workflow-panel';

   // Save-status indicator only
   @forward '@pathable/styles/src/pathable-component-wrappers/pathable-save-status';
   ```

## Build

```bash
cd packages/styles
pnpm build
```

## Verify Selective Import

Create a test file (e.g., `test/wizard-import.scss`):

```scss
@forward '../src/pathable-component-wrappers/pathable-wizard';
@forward '../src/pathable-component-wrappers/pathable-wizard-actions';
```

Compile:

```bash
pnpm sass --load-path=node_modules/@uswds/uswds/packages test/wizard-import.scss test/wizard-import.css
```

Verify the output `test/wizard-import.css` contains `.pathable-wizard` classes but does NOT contain `.pathable-workflow-panel` classes.

## Storybook Stories

Two new story files are added under `src/stories/structured-workflow/`:

- `Wizard.stories.js` — Desktop, mobile, validation-error stories
- `WorkflowPanel.stories.js` — Desktop, mobile, loading, saving, saved, offline, validation-error, completed stories

Run Storybook:

```bash
cd packages/styles
pnpm storybook
```

## Updating `pathable-all.scss`

After creating the new SCSS partials, add the bundle forward to `pathable-all.scss`:

```scss
@forward 'pathable-structured-workflow';
```

Place it alphabetically after `pathable-sticky-panel` or in the bundle section with other composition bundles.

## Sensitive Data Warning

All Storybook examples MUST use synthetic fixture data only. Do not include real participant names, program identifiers, or any personally identifiable information in examples or documentation. When documenting the compositions, include a note:

> **Sensitive data**: This composition is designed for staff workflows that may display participant or program information. Minimize displayed data to only what is necessary for the current task. Avoid placing sensitive data in decorative examples.

## Accessibility Checklist

- [ ] Step indicator states are distinguishable without color (text labels + icons/structure)
- [ ] Validation summary provides focus guidance
- [ ] Status indicators include text labels in addition to color
- [ ] Touch targets meet minimum size (44x44 CSS pixels)
- [ ] Layout is usable at 200% zoom
- [ ] Layout is usable with on-screen keyboard visible
- [ ] Prompt content and user notes are visually distinct
- [ ] Long content does not overflow