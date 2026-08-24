<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/016-interaction-icons-controls/plan.md

## IconButton Loading Contract Follow-Up

This maintenance branch returns to the interaction-controls feature after a
post-merge review found that the documented IconButton loading modifier was not
implemented or covered by executable evidence.

### Deliverables

- Implement the documented `.pathable-icon-button--loading` modifier.
- Preserve the existing generic `.is-loading` state.
- Add deterministic Storybook evidence for disabled/busy semantics, stable
  dimensions, hidden decorative icon content, and the icon-sized spinner.
- Record the published Styles behavior in a patch changeset.

### Key Constraints

- Keep the change limited to the audited IconButton loading defect.
- Loading remains CSS-only and framework-neutral.
- Consumers pair the visual modifier with native `disabled` and
  `aria-busy="true"` to suppress pointer and keyboard activation.
- Preserve reduced-motion behavior and the configured button/icon dimensions.
- Do not close the aggregate interaction-controls rollout task in this branch.

### Validation

```bash
pnpm --filter @pathableai/styles build
pnpm test:storybook-styles
pnpm test:visual
```

<!-- SPECKIT END -->
