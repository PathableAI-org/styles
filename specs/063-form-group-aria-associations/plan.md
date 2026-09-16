# Implementation Plan: FormGroup ARIA Associations

**Branch**: `feat/form-group-aria-associations` | **Issue**: [#233](https://github.com/PathableAI-org/styles/issues/233)

## Summary

Make the common `FormGroup` composition accessible without consumer-owned ID
plumbing. The React wrapper associates one direct or Fragment-nested supported
control with its `Label`, `Hint`, and `ErrorMessage` children while preserving
explicit consumer relationships and failing safely for ambiguous compositions.

## Scope

The implementation may update:

- `packages/react/src/components/FormGroup/**` for runtime behavior and unit tests.
- React FormGroup and related form-control stories for executable documentation.
- `packages/react/README.md` and React agent guidance for the public contract.
- CI configuration needed to execute the existing React unit suite.
- One React package changeset for the additive behavior change.

The implementation does not change `@pathableai/styles` runtime CSS, form state,
validation state, announcement timing, focus management, or submission behavior.
It does not add shared Storybook rollout capabilities without Styles-first proof.

## Behavior

- Automatically wire exactly one direct or Fragment-nested `Input`, `Select`,
  `Textarea`, or `Range`.
- Associate one `Label` unless the control has a non-empty `aria-labelledby`.
- Combine direct `Hint` and `ErrorMessage` IDs in source order unless the control
  supplies `aria-describedby`, including an explicit empty string.
- Preserve usable explicit IDs, `htmlFor`, and ARIA relationships.
- Disable all automatic wiring for multiple direct field controls, including a
  supported control mixed with a native control or a PathAble composite control.
- Leave native controls, custom wrappers, and composite controls consumer-wired.
- Keep generated IDs opaque and stable through server rendering and hydration;
  React key contents must not appear in rendered markup.

## Technical Approach

Use React child inspection for direct and Fragment-nested participants, `useId`
for the per-group prefix, and source-order suffixes for generated description
IDs. Clone only elements receiving generated association props while preserving
the same child-normalization path across ambiguous and unambiguous renders.

Known direct composite controls (`Checkbox`, `Radio`, `ComboBox`, `DatePicker`,
and `DateRangePicker`) identify themselves through a private registry, so they
count toward ambiguity without making server-compatible `FormGroup` depend on
their client-oriented implementations. Composite controls are never modified.

## Validation

- Focused FormGroup unit tests, including overrides, ambiguous compositions,
  child identity, SSR, hydration, and generated-ID privacy.
- Full React unit tests, typecheck, build, ESLint, Prettier, and Markdownlint.
- React Storybook browser, accessibility, coverage, quality, and visual gates.
- React 18 and React 19 packed-consumer checks and the advisory server audit.
