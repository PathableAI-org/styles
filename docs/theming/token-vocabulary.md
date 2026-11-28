# Token vocabulary reference

This reference is the canonical answer to "what can I override, and what does
each token control?" It lists every public color token in the `ThemeColors`
surface of `@pathableai/react`, its `--pathable-color-*` CSS custom property,
its default value, and a plain-language description of its role.

For how to override these tokens, see the
[consumer guide](./consumer-guide.md). The public types in
`packages/react/src/theme/` and the generated declarations own the runtime API;
the SCSS semantic map owns the defaults.

## The 25 color tokens

Rows follow the authoritative `THEME_COLOR_KEYS` order in
`packages/react/src/theme/tokens.ts`. The key-to-property mapping is the
existing `THEME_COLOR_TOKEN_MAP`; default values are copied from
`defaultTheme.colors`, itself generated from `$semantic-colors` in
`packages/styles/src/_semantic.scss` — so this table cannot drift from the
compiled stylesheet.

| Key                   | CSS custom property                      | Default value | Role                                                            |
| --------------------- | ---------------------------------------- | ------------- | --------------------------------------------------------------- |
| `bg`                  | `--pathable-color-bg`                    | `#dde2e8`     | Page and application background.                                |
| `surface`             | `--pathable-color-surface`               | `#ffffff`     | Raised surfaces: cards, panels, sidebars, and top bars.         |
| `text`                | `--pathable-color-text`                  | `#00365c`     | Primary body and heading text.                                  |
| `textMuted`           | `--pathable-color-text-muted`            | `#015a76`     | Secondary and muted text.                                       |
| `border`              | `--pathable-color-border`                | `#dde2e8`     | Borders and dividers.                                           |
| `link`                | `--pathable-color-link`                  | `#015a76`     | Links and interactive text accents (Tech Teal).                 |
| `accent`              | `--pathable-color-accent`                | `#1cae96`     | Brand accent: active states, indicators, and emphasis.          |
| `focusRing`           | `--pathable-color-focus-ring`            | `#4899e8`     | Keyboard focus ring outline (Bright Blue Brooks).               |
| `danger`              | `--pathable-color-danger`                | `#dc3545`     | Danger and error foreground (text and icons).                   |
| `success`             | `--pathable-color-success`               | `#1cae96`     | Success foreground.                                             |
| `textSuccess`         | `--pathable-color-text-success`          | `#0d7a63`     | WCAG-AA-safe success text on `surface`.                         |
| `actionPrimaryBg`     | `--pathable-color-action-primary-bg`     | `#00365c`     | Primary button and action background.                           |
| `actionPrimaryText`   | `--pathable-color-action-primary-text`   | `#ffffff`     | Primary button and action foreground text.                      |
| `actionSecondaryBg`   | `--pathable-color-action-secondary-bg`   | `#1cae96`     | Secondary button and action background.                         |
| `actionSecondaryText` | `--pathable-color-action-secondary-text` | `#001a33`     | Secondary button and action foreground text.                    |
| `statusSuccessBg`     | `--pathable-color-status-success-bg`     | `#1cae96`     | Success status background.                                      |
| `statusSuccessText`   | `--pathable-color-status-success-text`   | `#001a33`     | Success status foreground text.                                 |
| `statusWarningBg`     | `--pathable-color-status-warning-bg`     | `#f5a623`     | Warning status background.                                      |
| `statusWarningText`   | `--pathable-color-status-warning-text`   | `#001a33`     | Warning status foreground text.                                 |
| `statusDangerBg`      | `--pathable-color-status-danger-bg`      | `#dc3545`     | Danger status background.                                       |
| `statusDangerText`    | `--pathable-color-status-danger-text`    | `#ffffff`     | Danger status foreground text.                                  |
| `workflowActive`      | `--pathable-color-workflow-active`       | `#4899e8`     | Active workflow-state marker.                                   |
| `workflowComplete`    | `--pathable-color-workflow-complete`     | `#1cae96`     | Complete workflow-state marker.                                 |
| `workflowBlocked`     | `--pathable-color-workflow-blocked`      | `#dc3545`     | Blocked workflow-state marker.                                  |
| `onAccent`            | `--pathable-color-on-accent`             | `#001a33`     | Text on accent, success, or warning backgrounds (WCAG-AA safe). |

The focus outline is drawn on the background behind a control, so `focusRing` is not used on every background. Each background sets this through `--pathable-surface-focus-ring`. The `pathable-bg-accent`, `pathable-bg-success` and `pathable-bg-danger` utilities and the success, warning and error alerts use `onAccent`; `pathable-bg-base` and the footer sections use `text`; the emergency alerts use `statusDangerText` (white); and the info and plain alerts use PathAble Blue, compiled to match their backgrounds, so neither `focusRing` nor any other theme token changes it there. Component outlines drawn outside the element, and the link and unstyled button outlines, read the same property. The dark containers and the light component containers reset it: the `pathable-bg-primary` and `pathable-bg-surface` utilities, `.pathable-dark-background`, the breadcrumb, the card container and the table. The `pathable-bg-link` utility instead sets it to white, because `focusRing` is under 3:1 on Tech Teal, and the containers above reset it so a white ring does not inherit into them. There, and outside any of these backgrounds, the outline uses `focusRing`, and a scoped `ThemeProvider` override of `focusRing` applies as usual.

## Staying in sync

`pnpm lint:tokens` enforces that the 25-key set stays in lockstep between the
SCSS `$semantic-colors` map and `THEME_COLOR_KEYS`. If a token is added to or
removed from the theme but this reference is not updated, that is a defect.
