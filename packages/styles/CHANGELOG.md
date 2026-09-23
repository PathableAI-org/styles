# @pathableai/styles

## 0.4.0

### Minor Changes

- 47aaa40: Add a Styles-first OptionalFormSection disclosure and React wrapper for retaining
  optional field state and submission behavior in collapsible form sections.

## 0.3.0

### Minor Changes

- d82c526: Add the shared FilterableOptionList style contract and React component for accessible controlled or uncontrolled multi-selection with client or external filtering, native form values, and documented client-boundary usage.

## 0.2.0

### Minor Changes

- 1bcae8a: Modal open presentation now uses a styles-owned portal DOM shell: wrapper → overlay → dialog (instead of a bare dialog under `document.body`).

  **Migration**

  - If you queried `document.body > .pathable-modal` or similar direct-child selectors, update queries for the new wrapper/overlay/dialog tree.
  - If you added temporary consumer overlay CSS or custom overlay wrappers to force a backdrop, remove them after upgrading — the package now owns the dimmer. Leaving ad-hoc overlays in place can cause double backdrops / stacked dimmers.

## 0.1.0

### Minor Changes

- 7c0b34a: Add responsive form rows that align direct input, select, and textarea controls when field labels, hints, and errors have uneven content.
- 80e3074: Add a dedicated FormStack layout contract that expands supported controls to the available form width, preserves explicit control constraints, and documents Form versus FormStack usage.

## 0.0.4

### Patch Changes

- a9830f4: Emit default tokens with zero selector specificity so application-owned `:root` declarations win regardless of stylesheet order. Also clarify the packaged README's React and CSS-only guidance.
- ba07c56: Correct the published Sass and USWDS setup guidance, including the source namespace, compiler load paths, and font asset copying.

## 0.0.3

### Patch Changes

- 5841748: Make Activity List status labels visible and accessible, constrain row metadata,
  and add the typed React ActivityList wrapper.
- cd6d566: Publish the semantic Heading SCSS and typed React contracts with independent document and visual levels, tokenized level-1 weight, and verified accessibility behavior.
- aad62f4: Prevent icon tiles from shrinking below their configured size in constrained flex layouts.
- 647bcbd: Harden canonical SegmentedControl selection, focus, disabled, keyboard-reference, and constrained-layout behavior.
- 5c2505a: Consolidate all `--pathable-color-*` declarations into a single `:root` block,
  split the compiled stylesheet into `components.css`, `utilities.css`, and
  `theme-default.css`, and expose `./components`, `./utilities`, and `./theme`
  subpath exports so consumers can import component styles without also importing
  the default theme tokens.
- 7eab2bd: Add the documented IconButton loading modifier with a stable, contrast-preserving icon-sized spinner and disabled-state usage guidance.
- d755135: Add consumer-configurable AppShell landmarks, skip links, and an opt-in shared
  navigation mode that keeps all destinations available across breakpoints. Keep
  mobile navigation visible while main content scrolls, and add an accessible
  active-text token while preserving existing active-color overrides.
- c119150: Add Text typographic primitive with semantic variant (body, small, caption) and tone (default, muted, danger, success) props, plus new typography and color tokens in styles.
- c119150: Add Surface primitive with variant (default, subtle, primary), elevation, and border tone props coordinating foreground, background, border, and focus treatment, plus new token-driven SCSS modifiers.
- f8cee08: Added theming documentation: token vocabulary reference, consumer guide, and acceptance criteria verification (`docs/theming/`). Updated READMEs in both packages with cross-links to the new theming docs. Added Storybook end-to-end test asserting partial-theme color resolution via `ThemeProvider`.

## 0.0.3-alpha.4

### Patch Changes

- f8cee08: Added theming documentation: token vocabulary reference, consumer guide, and acceptance criteria verification (`docs/theming/`). Updated READMEs in both packages with cross-links to the new theming docs. Added Storybook end-to-end test asserting partial-theme color resolution via `ThemeProvider`.

## 0.0.3-alpha.3

### Patch Changes

- 7eab2bd: Add the documented IconButton loading modifier with a stable, contrast-preserving icon-sized spinner and disabled-state usage guidance.

## 0.0.3-alpha.2

### Patch Changes

- cd6d566: Publish the semantic Heading SCSS and typed React contracts with independent document and visual levels, tokenized level-1 weight, and verified accessibility behavior.
- aad62f4: Prevent icon tiles from shrinking below their configured size in constrained flex layouts.

## 0.0.3-alpha.1

### Patch Changes

- 647bcbd: Harden canonical SegmentedControl selection, focus, disabled, keyboard-reference, and constrained-layout behavior.

## 0.0.3-alpha.0

### Patch Changes

- 5841748: Make Activity List status labels visible and accessible, constrain row metadata,
  and add the typed React ActivityList wrapper.

## 0.0.2

### Patch Changes

- b0b2fe0: Fix Next.js App Router consumption by using the consumer's React runtime,
  retaining automatic styles, and packaging every compiled CSS asset.

## 0.0.1

### Patch Changes

- 2df9552: Align the basic Header markup and mobile navigation styles with the patched
  USWDS runtime, including the overlay and background scroll lock.
- fix: Release workflow with changesets
