# Quickstart: Typography Storybook Section

## Prerequisites

- Node.js (see root `package.json` for `engines.node` range)
- pnpm (see root `package.json` for packageManager)
- Repository dependencies installed: `pnpm install`

## Build Verification

### 1. Verify the SCSS compiles without errors

```bash
cd packages/styles
pnpm build
```

Expected: No Sass compilation errors. The `dist/` directory contains up-to-date compiled CSS.

### 2. Start Storybook

```bash
cd apps/storybook
pnpm storybook
```

Expected: Storybook starts on `http://localhost:6006` (or next available port).

### 3. Verify Brand / Typography story exists

1. Open Storybook in a browser.
2. In the sidebar, navigate to the **Brand** section.
3. Confirm there is a **Typography** story listed alongside **Color Usage**.
4. Click the **Typography** story to open it.

### 4. Verify Font Role Display

In the Brand / Typography story, confirm:

- [ ] **Heading** section shows Fredoka Regular with font-family `'Fredoka', system-ui, sans-serif`, weight 400
- [ ] **Alternate Heading** section shows Montserrat Bold with font-family `'Montserrat', system-ui, sans-serif`, weight 700
- [ ] **Subheading** section shows Poppins Bold with font-family `'Poppins', system-ui, sans-serif`, weight 700
- [ ] **Body Text** section shows Nunito Regular with font-family `'Nunito', system-ui, serif`, weight 400

### 5. Verify Type Scale Display

- [ ] All 10 scale tokens are displayed: display-lg, heading-lg, heading-md, heading-sm, body-lg, body-md, body-sm, label-md, label-sm, caption-md
- [ ] Each token shows its font size, line height, and font weight
- [ ] Values match the expected values from `_typography.scss`

### 6. Verify Long-Text Examples

- [ ] A long-text example section exists showing body text in Nunito at body-md size
- [ ] A long-text example section exists showing body text in Nunito at body-lg size

### 7. Verify Typography Violations Section

- [ ] At least 3 violations are demonstrated:
  - [ ] Heading typeface used for long text (labeled)
  - [ ] Centered body text longer than 3 lines (labeled)
  - [ ] Body text in all caps (labeled)

### 8. Verify FEEDBACK.md is removed

```bash
# FEEDBACK.md should not exist or should not be tracked
git ls-files FEEDBACK.md
```

Expected: No output (file is not tracked).

### 9. Verify existing stories are unaffected

- [ ] Brand / Color Usage story still renders correctly
- [ ] Utilities / Typography story still renders correctly
- [ ] All other component stories still render correctly

## Cleanup

```bash
# Stop Storybook with Ctrl+C
# If FEEDBACK.md was removed, verify build still passes
cd packages/styles && pnpm build
```