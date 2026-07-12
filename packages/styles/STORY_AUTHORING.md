# Story Authoring Checklist

Use this checklist when creating or updating Storybook stories for
`@pathable/styles`. All items should be satisfied before opening a PR.

## Token Rules

- [ ] Use `--pathable-*` CSS custom properties instead of raw hex values.
- [ ] Use semantic tokens (`--pathable-color-text`, `--pathable-color-surface`, etc.)
      for application UI, not brand-level tokens.
- [ ] Do not hardcode brand hex values (`#00365c`, `#1cae96`, etc.) in story
      or component code — reference tokens via `var(--pathable-*)`.
- [ ] Run `pnpm lint:tokens` locally and fix any undefined token references.

## Accessibility Requirements

- [ ] Stories pass the axe accessibility checks at all viewports.
- [ ] Color contrast checks (`color-contrast`) are enabled and pass for all
      story variants.
- [ ] Interactive elements have accessible names (`select-name` enabled).
- [ ] Touch targets on mobile stories meet the 44 px minimum (WCAG 2.2 2.5.8)
      or are explicitly allowlisted if exempt (native radio/checkbox, breadcrumb
      links, etc.).
- [ ] Run `pnpm test:storybook` locally and ensure all axe tests pass.

## Visual Smoke Requirements

- [ ] Stories render correctly at 375, 768, and 1280 px viewport widths.
- [ ] No horizontal overflow (`scrollWidth <= clientWidth + 2`).
- [ ] Document height > 20 px (reasonable content).
- [ ] Screenshots are not all-black or all-white at any viewport.
- [ ] Run `pnpm test:visual` locally (requires `pnpm build` first).

## Coverage Expectations

- [ ] New story IDs are present in the Storybook index after building.
- [ ] New stories are listed in the category expectations in
      `packages/styles/scripts/storybook-coverage.mjs`.
- [ ] Run `pnpm storybook:coverage` after building Storybook to verify.

## Quality Gates

- [ ] Story passes the quality gates: story index check, horizontal overflow,
      unnamed controls, and touch-target checks.
- [ ] Run `pnpm quality-gates` locally after building Storybook.

## PR Checklist

Copy this section into your PR description:

```markdown
### Story Authoring Checklist

- [ ] All `--pathable-*` token references are defined (`pnpm lint:tokens` passes)
- [ ] Axe accessibility tests pass (`pnpm test:storybook`)
- [ ] Visual smoke tests pass at 375/768/1280 px (`pnpm test:visual`)
- [ ] Storybook coverage updated (`pnpm storybook:coverage`)
- [ ] Quality gates pass (`pnpm quality-gates`)
```
