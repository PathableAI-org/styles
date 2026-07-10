# Quickstart: Component Brand Refinement — Validation Walkthrough

This document describes how to verify the implementation of the Component Brand Refinement feature. Follow these steps to validate that all requirements are met.

## Prerequisites

- Repository cloned and `pnpm install` completed
- `pnpm build` succeeds
- `pnpm storybook` starts without errors
- Storybook a11y addon is available and enabled

## Validation Steps

### Step 1: Button Brand Verification

1. Open Storybook and navigate to **Components > Button**
2. Verify each button variant renders with correct brand colors:
   - **Primary**: PathAble Blue background (`--pathable-color-action-primary-bg` / #162e51 USWDS-mapped) with white text
   - **Secondary**: Intelligent Jade background (`--pathable-color-action-secondary-bg` / #1cae96 brand exact) with dark text (`--pathable-color-action-secondary-text` / #00365c)
   - **Accent-cool**: Bright Blue Brooks treatment, visually subordinate to primary
3. Run the Storybook a11y addon panel on each button variant
4. **Expected**: No color contrast violations for normal text on any variant
5. **Expected**: If a variant uses Lived-In Lime, its contrast is documented as a warning

### Step 2: Workflow Card Verification

1. Navigate to **Components > Card** in Storybook
2. Find the "Workflow Card" story
3. Verify visual properties:
   - Surface: Shilling Silver or white (`--pathable-color-bg` or `--pathable-color-surface`)
   - Heading: PathAble Blue (`--pathable-color-text` / #00365c)
   - Optional status signal: Intelligent Jade (`--pathable-color-accent` or `--pathable-color-success`)
   - Links/actions: Restrained Bright Blue Brooks (`--pathable-color-link`)
   - Metadata row: Muted text (`--pathable-color-text-muted`)
   - Spacing: Generous (USWDS spacing scale)
   - Focus state: Visible (`--pathable-color-focus-ring`)
4. **Expected**: No decorative color used unless it communicates state or hierarchy

### Step 3: Form Workflow Example Verification

1. Navigate to form component stories (e.g., **Components > FormControls > Input**, **Textarea**, **Checkbox**, **Select**)
2. Find workflow-specific examples under a "Workflow Patterns" or similar section heading
3. Verify the following six patterns exist:
   - Session note field (textarea)
   - Participant goal selector (select or combo-box)
   - Intervention checklist (checkbox group)
   - Progress signal picker (radio or range)
   - Required compliance field (input with error state)
   - Supervisor approval comment (textarea)
4. **Expected**: Error states include human-readable recovery guidance
5. **Expected**: All examples pass a11y addon scan

### Step 4: Semantic Alert Verification

1. Navigate to **Components > Communication > Alert**
2. Find semantic workflow pattern examples
3. Verify the following six alert contexts exist:
   - Compliance blocking issue (error alert)
   - Missing required evidence (warning alert)
   - Draft note not submitted (warning alert)
   - Supervisor approval needed (info alert)
   - Successful artifact generation (success alert)
   - Sync/connectivity warning (warning alert)
4. **Expected**: Alert colors match the semantic token mapping from `_semantic.scss`
5. **Expected**: Success alerts use dark text (#00365c) on Intelligent Jade background
6. **Expected**: Warning alerts use dark text (#00365c) on amber background
7. **Expected**: Error alerts maintain white text on red background
8. **Expected**: No a11y contrast violations

### Step 5: Navigation Workflow Verification

1. Navigate to **Components > Navigation > Sidenav** (and other navigation stories)
2. Verify navigation items include Pathable staff workflow labels:
   - "Today's Sessions", "Participants", "Approvals", "Reports", "Templates", "Settings"
3. **Expected**: All navigation items are keyboard navigable
4. **Expected**: Visible focus states on all interactive elements

### Step 6: Build Verification

1. Run `pnpm build` from the repository root
2. **Expected**: Build completes without errors
3. **Expected**: No new CSS warnings related to brand overrides

## Success Criteria Checklist

| Criterion | Verification Method | Status |
| ----------- | ------------------- | -------- |
| SC-001: Buttons use brand colors, pass AA | Storybook visual + a11y addon | [ ] |
| SC-002: Workflow card has all 7 properties | Storybook visual inspection | [ ] |
| SC-003: 6 form workflow examples exist | Storybook visual | [ ] |
| SC-004: 6 semantic alert examples exist | Storybook visual | [ ] |
| SC-005: Navigation has workflow items | Storybook visual | [ ] |
| SC-006: No new contrast violations | Storybook a11y addon | [ ] |
| SC-007: All examples keyboard accessible | Manual keyboard testing | [ ] |

## Troubleshooting

- **Build errors after modifying wrapper SCSS**: Verify `@use` paths are correct. The wrapper files import from USWDS source packages (`@use 'usa-button/src/styles'`).
- **Storybook doesn't reflect SCSS changes**: The storybook imports SCSS directly from `packages/styles/src/index.scss`. Rebuild with `pnpm build` then restart storybook with `pnpm storybook`.
- **Contrast violations in a11y addon**: Check that the correct foreground/background token pair is used. Reference the contrast table in `research.md` for approved pairings.
- **Workflow card modifier not appearing**: The `.pathable-card--workflow` modifier must be added to `pathable-card.scss` and the card story must use the modifier class.
