# Context Digest — S08-documentation-01 (US3 Theme)

## Tasks
- **T048**: Create `.storybook/manager.js` with custom PathAble theme
- **T049**: Create `.storybook/manager-head.html` with Google Fonts

## Theme Values
| Property | Value |
|----------|-------|
| brandTitle | "Pathable Styles" |
| brandUrl | "https://github.com/pathableai-org/styles" |
| colorPrimary | "#00365c" |
| colorSecondary | "#1cae96" |
| base | "light" |
| fontBase | "'Nunito', system-ui, sans-serif" |
| fontCode | "'ui-monospace', 'SFMono-Regular', monospace" |
| appBg | "#f8f9fa" |
| appContentBg | "#ffffff" |
| barBg | "#00365c" |
| barTextColor | "#ffffff" |
| textColor | "#1a1a1a" |
| textMutedColor | "#6c757d" |

## manager.js Template
```js
import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

const pathableTheme = create({
  brandTitle: 'Pathable Styles',
  brandUrl: 'https://github.com/pathableai-org/styles',
  colorPrimary: '#00365c',
  colorSecondary: '#1cae96',
  // ... all other properties
});

addons.setConfig({ theme: pathableTheme });
```

## manager-head.html Template
```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap" rel="stylesheet" />
```

## Dependencies
Requires @storybook/theming and @storybook/manager-api installed (from T001), and .storybook/ directory existing (from T002).