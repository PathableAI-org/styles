<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/041-component-test-infra/plan.md

## Shared component-contract conventions

This feature establishes a Styles-first component-testing path for shared,
renderer-neutral Accordion behavior.

- Shared validators live in the private `packages/storybook-contracts` package
  and exercise one capability each (e.g. `verifyEnterExpandsDisclosure`), never
  one broad "verify component" helper.
- Helpers accept an `HTMLElement` or a small structural interface only — never
  React props, Storybook renderer context types, CSS selectors, or package
  internals.
- `packages/styles` is the first and only executable owner of a shared behavior
  in this phase: a shared capability must be proven by the Styles Storybook
  (against the built public `@pathableai/styles` JS/CSS) before any framework
  package adopts it.
- Styles Accordion stories are deterministic, fixed fixtures (collapsed and
  initially expanded) with `play` functions that call the shared helpers.
- Interaction and assertions use accessible queries (`getByRole`,
  `getByLabelText`, `getByText`) and observable semantic outcomes; generated IDs
  may vary, but disclosure-to-panel relationships must resolve correctly.
- The interaction run must assert the runtime initialized before interacting and
  fail with target/story/capability context instead of silently skipping.
- Broad a11y rule exceptions are prohibited. Any exception lives in a shared,
  reviewable registry scoped to the narrowest target, story, and rule with a
  rationale and a tracking reference.
- An evidence report keeps three measures separate: deterministic fixtures,
  executable contract adoption, and automated Axe execution. Visual smoke and
  manual keyboard/focus/assistive-technology review remain separate evidence;
  no automated aggregate is labeled WCAG certification.
- The target-aware `scripts/test-storybook.mjs` runner drives a consistent
  build → serve → ready → test → report → cleanup lifecycle per target, with
  `styles` registered first and hard failures for unknown targets, occupied
  ports, missing builds/stories, or test failures.
- React adoption (Phase 2) and broader component coverage (Phase 3) are out of
  scope for this feature.

### Story checklist

When adding a Styles story with a shared contract, ensure:

- [ ] Deterministic, named fixture per shared starting state
- [ ] Fixed `play` function calling the shared helper for each shared capability
- [ ] Accessible queries (`getByRole`, `getByLabelText`, `getByText`)
- [ ] Runtime-initialized assertion before interaction
- [ ] Narrow story-level a11y exception only where justified
- [ ] Stories are deterministic (no dates, random values, or network calls)

### Running the focused Styles command

```bash
# Build the Styles package
pnpm --filter @pathableai/styles build

# Focused Styles Storybook/contract run (no React build)
pnpm test:storybook-styles
```

<!-- SPECKIT END -->
