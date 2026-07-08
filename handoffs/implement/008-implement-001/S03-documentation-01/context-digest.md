# Context Digest — S03-documentation-01 (US1 Basic Components)

## Tasks
7 story files for Basic components. All use `pathable-*` classes only.

- **T008**: Button.stories.js — variants: Default, AccentCool, AccentWarm, Outline, Inverse, Base, Secondary, Big, Unstyled
- **T009**: ButtonGroup.stories.js — variants: Default, Segmented
- **T010**: Card.stories.js — variants: Default Card, Media Card, Card variants
- **T011**: Link.stories.js — variants: Default, External, Nav link
- **T012**: List.stories.js — variants: Unordered, Ordered, Unstyled
- **T013**: Tag.stories.js — variants: Default, Big
- **T014**: Table.stories.js — variants: Default, Borderless, Compact, Striped

## Story File Contract
- Default export: `{ title: 'Components/{Name}', tags: ['autodocs'], render: (args) => HTML string }`
- Named exports for each variant: `{ render: () => '<div class="pathable-...">...</div>' }`
- For variants with args: define `argTypes` and `args` on default export
- NO `.usa-*` class references — use only `pathable-*` prefixed classes
- These components are NOT JS-driven (no USWDS JS note needed)

## Example Pattern
```js
export default { title: 'Components/Button', tags: ['autodocs'] };
export const Default = { render: () => '<button class="pathable-button">Click Me</button>' };
export const AccentCool = { render: () => '<button class="pathable-button pathable-button--accent-cool">Accent Cool</button>' };
```