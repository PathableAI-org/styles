# Token vocabulary reference

This reference is the canonical answer to "what can I override, and what does
each token control?" It lists every public color token in the `ThemeColors`
surface of `@pathableai/react`, its `--pathable-color-*` CSS custom property,
its default value, and a plain-language description of its role.

For how to actually override these tokens, see the
[consumer guide](./consumer-guide.md). For the runtime API contracts behind the
types and defaults, see the feature contracts under `specs/`:

- Key set and camelCase-to-kebab mapping:
  `specs/058-theme-token-types/contracts/theme-types.md`
- Default values and `defaultTheme`:
  `specs/059-default-theme-create-theme/contracts/default-theme.md`

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
| `link`                | `--pathable-color-link`                  | `#4899e8`     | Links and interactive text accents.                             |
| `accent`              | `--pathable-color-accent`                | `#1cae96`     | Brand accent: active states, indicators, and emphasis.          |
| `focusRing`           | `--pathable-color-focus-ring`            | `#4497f5`     | Keyboard focus ring outline.                                    |
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

## Staying in sync

`pnpm lint:tokens` enforces that the 25-key set stays in lockstep between the
SCSS `$semantic-colors` map and `THEME_COLOR_KEYS`. If a token is added to or
removed from the theme but this reference is not updated, that is a defect — see
the verification record in [acceptance-verification.md](./acceptance-verification.md).
