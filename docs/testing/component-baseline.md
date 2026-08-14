# Baseline component coverage

Every public component needs enough evidence to document its supported states,
detect basic regressions, and expose accessibility problems. Interactive or
specialized components add further coverage according to their behavior.

## Baseline for every component

Normally provide:

- a `Playground` story for exploration;
- a deterministic `Default` story;
- one fixed named story for every meaningful visual or semantic variant;
- a semantic description explaining purpose, appropriate use, and misuse;
- realistic content rather than placeholder-only markup;
- a narrow or mobile story when layout can break;
- a long-content story when text can wrap or overflow;
- a composition story when the component normally participates in a larger
  pattern;
- automated rendering and accessibility checks for stable stories.

Controls are an exploration surface. They do not replace fixed stories as
regression cases.

## Add coverage according to component capability

### Interactive controls

Test pointer and keyboard activation, focus, state changes, and disabled
behavior. Prefer actual `userEvent` interactions to calling handlers directly.

### Form controls

Test accessible labeling, value entry or selection, disabled and required
states, validation communication, and relevant form behavior.

### Disclosure components

Test activation keys, expanded state, panel association and availability,
focus retention, and single-open or multiple-open rules when supported.

### Focus-managing overlays

Test opening and closing, accessible naming, initial focus, focus containment,
Escape behavior when supported, and focus restoration.

### Collections and selection widgets

Test item semantics, selection state, keyboard navigation, disabled items, and
whether single or multiple selection is supported.

### Status and feedback components

Test semantic status or alert exposure, accessible names, meaningful content,
and dismissal behavior when dismissible.

### Responsive layout components

Provide fixed stories at meaningful viewport constraints. Add interaction tests
only when behavior—not merely CSS layout—changes with the viewport.

## Automated checks are not complete accessibility coverage

The Storybook accessibility runner detects many markup and rule violations. It
cannot establish that the keyboard model is correct, focus moves appropriately,
announcements are useful, or the component is understandable with assistive
technology.

Use `play` tests for deterministic interaction behavior and periodic manual
review for experience that automation cannot establish.

Next: [Behavioral parity](behavior-parity.md).
