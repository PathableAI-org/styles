# Story Interface Contract: Storybook Story Files

**Branch**: `008-storybook-documentation` | **Date**: 2026-07-08 | **Plan**: [plan.md](../plan.md)

## Purpose

Define the contract for all `.stories.js` files in the `packages/styles/src/stories/` directory. Every story file MUST conform to this contract to ensure consistent documentation generation.

## File Location

- **Component stories**: `packages/styles/src/stories/components/{ComponentName}.stories.js`
- **Utility stories**: `packages/styles/src/stories/utilities/{UtilityGroup}.stories.js`
- Subdirectories within `components/` may be used for grouping (e.g., `components/FormControls/Input.stories.js`)

## Required Exports

### Default Export

Every story file MUST export a default object with:

| Field | Required | Type | Description |
| ------- | ---------- | ------ | ------------- |
| `title` | Yes | String | Storybook sidebar path. Format: `"Components/{Category}/{Name}"` or `"Utilities/{Name}"` |
| `tags` | Yes | String[] | Must include `'autodocs'` for auto-generated documentation pages |
| `render` | No | Function | Only if the file has a single, default story (otherwise use named exports with individual `render` functions) |

### Named Exports (Stories)

Each named export is a story object. Every story object MUST have:

| Field | Required | Type | Description |
| ------- | ---------- | ------ | ------------- |
| `render` | Yes | Function | Returns an HTML string. Signature: `() => string` or `(args) => string` |
| `args` | No | Object | Only for component stories that benefit from interactive controls. NOT for utility stories. |
| `argTypes` | No | Object | Only for component stories that use `args` |
| `parameters` | No | Object | Optional Storybook parameters (e.g., `{ docs: { description: { story: '...' } } }`) |

## Conventions

### Component Stories

1. **File naming**: PascalCase matching the component name. Examples: `Button.stories.js`, `Alert.stories.js`, `Accordion.stories.js`.

2. **Title format**: `"Components/{Category}/{ComponentName}"` where Category is one of: Basic, Form Controls, Navigation, Communication, Layout.

3. **Story names**: Each component variant gets its own named export. Use PascalCase export names.
   - `Default` — the base component with no modifiers
   - One export per modifier variant: `AccentCool`, `Outline`, `Big`, etc.
   - One export per sub-element or compound state if relevant

4. **HTML rendering**: Stories return HTML template strings. All CSS classes use the `pathable-*` prefix. No `.usa-*` classes.

5. **JS-driven components**: When `isJsDriven` is true, the first story or the default export's `parameters` MUST include a docs description noting the JavaScript dependency. Format:

   ```js
   parameters: {
     docs: {
       description: {
         story: '**Note:** This component requires USWDS JavaScript for full interactivity (accordion toggle, etc.). Only static CSS documentation is provided here. See the USWDS documentation for JS setup.',
       },
     },
   }
   ```

6. **Interactive controls**: Component stories MAY use `args` and `argTypes` for interactive controls (e.g., switching button variants, changing text). This is optional but recommended for components with multiple visual variants.

### Utility Stories

1. **File naming**: PascalCase describing the utility group. Examples: `BackgroundColors.stories.js`, `Spacing.stories.js`, `FlexAlignment.stories.js`.

2. **Title format**: `"Utilities/{GroupName}"`.

3. **Story names**: Each utility group typically has one or two stories:
   - `AllValues` — shows all supported values in a grid or list
   - `ResponsiveVariants` — shows responsive breakpoint examples (if applicable)

4. **HTML rendering**: Stories return HTML template strings. Use inline `style` attributes for layout (e.g., flexbox for the swatch grid) but use `pathable-*` classes for the documented utility itself.

5. **No args or argTypes**: Utility stories are static documentation. They MUST NOT use `args` or `argTypes`.

6. **Color swatches**: For color utilities (Background Colors, Text Colors), use a visual swatch layout with the class name, the color name, and optionally the hex value.

### Bundle Packages

Bundle packages (e.g., `pathable-form-controls`, `pathable-typography`) are NOT documented as separate story files. Their individual component wrappers are documented individually. The bundle package structure is documented in the package README only.

## Validation

1. Every story file in `src/stories/` MUST have a default export with a `title` field.
2. Every story file with `tags: ['autodocs']` MUST have at least one named export with a `render` function.
3. No story file may reference `.usa-*` classes — only `pathable-*` classes.
4. No story file may import or reference USWDS JavaScript modules.
5. Utility story files MUST NOT export `args` or `argTypes`.
6. JS-driven component stories MUST include a docs description noting the JavaScript dependency.
