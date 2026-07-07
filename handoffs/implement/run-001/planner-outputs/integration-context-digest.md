# Context Digest: Integration Verification (T015)

## Feature

USWDS Typography Settings — `specs/005-typography-settings`

## Task

**T015**: Final build and verification in `packages/styles/`

This is a verification-only task. No source files should be modified.

## Dependencies

T015 depends on both of these shards being complete:
- **S01-ui-01**: UI implementation of all typography SCSS changes (`_fonts.scss`, `_uswds-theme.scss`, `_typography.scss`, `index.scss`)
- **S02-documentation-01**: Documentation updates (`AGENTS.md`, `BRAND_RULES.md`)

## Context

- `packages/styles/dist/styles.css` is the compiled output — this is the artifact under verification
- `packages/styles/src/` contains the source files (read-only for this task)
- `handoffs/implement/run-001/context-index.json` contains the full context index for this feature run

## Verification Steps

### 1. Build

```bash
cd packages/styles && pnpm build
```

Expect: No compilation errors or warnings. Produces `dist/styles.css`.

### 2. Verify Brand Font Face Names in Compiled CSS

All four brand typefaces must appear in the compiled CSS output (enclosed in `@font-face` `src:` url descriptors or `font-family` declarations):

```bash
rg "Fredoka" dist/styles.css
rg "Nunito" dist/styles.css
rg "Poppins" dist/styles.css
rg "Montserrat" dist/styles.css
```

Each command should return at least one match.

### 3. Verify Dual CSS Custom Properties

Check that both `--pathable-font-*` and `--usa-font-*` custom properties are emitted:

```bash
rg "--pathable-font-" dist/styles.css
rg "--usa-font-" dist/styles.css
```

Each command should return multiple matches for the various font-family, font-size, font-weight, and line-height tokens.

### 4. Verify Existing Tokens Are Still Present

Existing `--pathable-*` color tokens (e.g., `--pathable-blue`) and `--ui-*` typography tokens (e.g., `--ui-display-lg`) must remain in the compiled output and not be broken by the typography changes:

```bash
rg "--pathable-blue" dist/styles.css
rg "--ui-display-lg" dist/styles.css
```

Each command should return at least one match with the expected value.

## Assertions Summary

| Assertion | Expected Result |
|---|---|
| `pnpm build` succeeds | Exit code 0, no errors/warnings |
| `rg "Fredoka" dist/styles.css` | ≥ 1 match |
| `rg "Nunito" dist/styles.css` | ≥ 1 match |
| `rg "Poppins" dist/styles.css` | ≥ 1 match |
| `rg "Montserrat" dist/styles.css` | ≥ 1 match |
| `rg "--pathable-font-" dist/styles.css` | ≥ 1 match |
| `rg "--usa-font-" dist/styles.css` | ≥ 1 match |
| `rg "--pathable-blue" dist/styles.css` | ≥ 1 match |
| `rg "--ui-display-lg" dist/styles.css` | ≥ 1 match |

## Quickstart Reference

From `specs/005-typography-settings/quickstart.md`:

> **Existing `--pathable-font-*` tokens continue to work**: No breaking changes to existing consumers.
> **New `--usa-font-*` tokens**: Added alongside existing `--pathable-font-*` tokens for USWDS-native consumers.
> **No USWDS component styles in output**: Only typography token settings are included.

## Notes

- Run `rg` commands from the `packages/styles/` directory, or use absolute paths: `rg "Fredoka" packages/styles/dist/styles.css`
- The `rg` (ripgrep) tool is used instead of `grep` for consistency with the codebase
- This task does NOT modify any source files — it is purely verification