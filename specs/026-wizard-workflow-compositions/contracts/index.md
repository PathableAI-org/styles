# Interface Contracts: Structured Wizard and Guided Workflow Compositions

## CSS Class Namespace

The `@pathable/styles` package exports the following public CSS classes for the wizard and workflow compositions.

### Wizard Classes

| CSS Class | Purpose | Parent Required | USWDS Dependency |
|-----------|---------|----------------|-----------------|
| `.pathable-wizard` | Top-level wizard container | — | — |
| `.pathable-wizard__mobile-summary` | Compact mobile step summary | `.pathable-wizard` | — |
| `.pathable-wizard__heading` | Current step page heading | `.pathable-wizard` | — |
| `.pathable-wizard__content` | Content/form region | `.pathable-wizard` | — |
| `.pathable-wizard__validation` | Validation summary region | `.pathable-wizard` | — |
| `.pathable-wizard__actions` | Action footer | `.pathable-wizard` | — |
| `.pathable-step-indicator` | Step indicator (from existing package) | — | `usa-step-indicator` |
| `.pathable-step-indicator__step--current` | Current step marker | `.pathable-step-indicator` | `usa-step-indicator__step--current` |
| `.pathable-step-indicator__step--completed` | Completed step marker | `.pathable-step-indicator` | `usa-step-indicator__step--completed` |

### Workflow Panel Classes

| CSS Class | Purpose | Parent Required |
|-----------|---------|-----------------|
| `.pathable-workflow-panel` | Top-level workflow panel container | — |
| `.pathable-workflow-panel--loading` | Loading state modifier | `.pathable-workflow-panel` |
| `.pathable-workflow-panel--saving` | Saving state modifier | `.pathable-workflow-panel` |
| `.pathable-workflow-panel--saved` | Saved confirmation modifier | `.pathable-workflow-panel` |
| `.pathable-workflow-panel--offline` | Offline state modifier | `.pathable-workflow-panel` |
| `.pathable-workflow-panel--validation-error` | Validation error modifier | `.pathable-workflow-panel` |
| `.pathable-workflow-panel--completed` | Completed state modifier | `.pathable-workflow-panel` |
| `.pathable-workflow-panel__context-header` | Person/record context | `.pathable-workflow-panel` |
| `.pathable-workflow-panel__objective` | Session objective | `.pathable-workflow-panel` |
| `.pathable-workflow-panel__current-activity` | Current activity label | `.pathable-workflow-panel` |
| `.pathable-workflow-panel__prompt` | Prompt/instruction content | `.pathable-workflow-panel` |
| `.pathable-workflow-panel__input` | Observation/note input area | `.pathable-workflow-panel` |
| `.pathable-workflow-panel__status` | Progress/save-status region | `.pathable-workflow-panel` |
| `.pathable-workflow-panel__actions` | Completion action buttons | `.pathable-workflow-panel` |

### Save-Status Classes

| CSS Class | Purpose | Parent Required |
|-----------|---------|-----------------|
| `.pathable-save-status` | Standalone save-status indicator | — |
| `.pathable-save-status--loading` | Loading state | `.pathable-save-status` |
| `.pathable-save-status--saving` | Saving state | `.pathable-save-status` |
| `.pathable-save-status--saved` | Saved confirmation state | `.pathable-save-status` |
| `.pathable-save-status--offline` | Offline state | `.pathable-save-status` |
| `.pathable-save-status--error` | Error state | `.pathable-save-status` |
| `.pathable-save-status--idle` | Idle (no operation) state | `.pathable-save-status` |

## CSS Custom Properties

### Wizard Custom Properties

| Property | Default | Purpose |
|----------|---------|---------|
| `--pathable-wizard-max-width` | `uswds.units('desktop')` | Maximum width of the wizard container |
| `--pathable-wizard-gap` | `uswds.units(2)` | Gap between wizard regions |

### Workflow Panel Custom Properties

| Property | Default | Purpose |
|----------|---------|---------|
| `--pathable-workflow-panel-max-width` | `uswds.units('mobile')` | Maximum width of the workflow panel |
| `--pathable-workflow-panel-gap` | `uswds.units(1.5)` | Gap between workflow regions |
| `--pathable-workflow-panel-prompt-bg` | `uswds.color('gray-5')` | Background color for the prompt region |

### Save-Status Custom Properties

| Property | Default | Purpose |
|----------|---------|---------|
| `--pathable-save-status-font-size` | `uswds.type-scale('sm')` | Font size for the save-status indicator |
| `--pathable-save-status-icon-size` | `1em` | Size for the status icon |

## Selective Import Paths

Consumers import individual components from `@pathable/styles` SCSS source:

```scss
// Individual components
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-wizard';
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-wizard-actions';
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-workflow-panel';
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-save-status';

// Bundle (forwards all four above)
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-structured-workflow';

// All-in-one (already includes all bundles)
@forward '@pathable/styles/src/pathable-component-wrappers';
```

## Compilation Contracts

1. Selective import of any individual partial MUST compile without errors with the standard `--load-path=node_modules/@uswds/uswds/packages` flag.
2. All-in-one import via `pathable-all.scss` MUST compile without errors.
3. Selective imports MUST NOT introduce CSS classes from unrelated components (verified via selective-import test).
4. The bundle imports for USWDS `usa-validation`, `usa-step-indicator`, and `usa-button` MUST be available via `--load-path` because the existing component wrappers (`pathable-validation`, `pathable-step-indicator`, `pathable-button`) already import these — no new external dependencies are introduced.