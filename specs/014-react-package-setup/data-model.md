# Data Model: React Package Workspace Setup

## Entities

### @pathable/react Package

A pnpm workspace package that wraps `@pathable/styles` components as idiomatic React components.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | `@pathable/react` |
| `path` | path | `packages/react/` |
| `packageManager` | pnpm | Workspace protocol `workspace:*` for `@pathable/styles` |
| `entrypoint` | `dist/index.js` (or equivalent) | Compiled React component library |

**Validation rules**:
- Must declare `@pathable/styles` as a dependency (not devDependency)
- Must declare `react` and `react-dom` as peerDependencies
- Must export `Button` from its main entry point

**Relationships**:
- Consumes: `@pathable/styles` (compiled CSS dependency)
- Consumed by: Consumer React applications

### Button Component

A static React component wrapping the `pathable-button` CSS class.

| Field | Type | Description |
|-------|------|-------------|
| name | `Button` | React component name |
| element | `<button>` | Native HTML button element |
| props | `{ children: ReactNode }` | Only accepts children text |
| css_class | `pathable-button` | The CSS class applied to the rendered element |

**Validation rules**:
- MUST render a native `<button>` element (FR-004)
- MUST apply the `pathable-button` CSS class (FR-005)
- MUST accept only `children` prop (FR-006)
- MUST NOT accept `variant`, `onClick`, `disabled`, `type`, `className`, or `style` props (FR-007)

**Relationships**:
- Uses: `@pathable/styles` CSS (the `pathable-button` class)

### React Storybook (`apps/storybook-react`)

A standalone Storybook instance for developing and browsing React components.

| Field | Type | Description |
|-------|------|-------------|
| name | `@pathable/react-storybook` | Storybook workspace package |
| path | `apps/storybook-react/` | Location in repository |
| framework | `@storybook/react-vite` | Storybook framework |
| port | 6007 | Standalone port (distinct from main Storybook's 6006) |

**Relationships**:
- Composes stories from: `packages/react/src/stories/`
- Composed by: Main Storybook (`apps/storybook`) via refs configuration

### Storybook Composition

The mechanism in Storybook's `main.js` `refs` configuration that allows one Storybook to include stories from another Storybook instance.

| Field | Type | Description |
|-------|------|-------------|
| ref_name | `react` | The key used in the main Storybook's `refs` config |
| target_url | `http://localhost:6007` | URL of the React Storybook instance |
| fallback_behavior | Show as unavailable | What happens when the composed Storybook is not running |

### Button Story

A Storybook story that demonstrates the default Button component.

| Field | Type | Description |
|-------|------|-------------|
| name | Default | Story name |
| component | Button | The component being demonstrated |
| args | `{ children: "Click Me" }` | Story arguments |
| location | `packages/react/src/stories/` | Path relative to package |

## State Transitions

### Package Build Lifecycle

```
Source Code (JSX + CSS import)
  → pnpm build
  → Compiled output (dist/)
  → Published or consumed via workspace protocol
```

### Storybook Start Lifecycle

```
pnpm storybook (in apps/storybook-react)
  → Storybook server starts on port 6007
  → Stories from packages/react/src/stories/ are loaded
  → Developer navigates to http://localhost:6007
  → Button story renders with pathable-button class
```

### Storybook Composition Flow

```
Main Storybook (port 6006)
  → refs configuration points to http://localhost:6007
  → When React Storybook is UP: stories appear in sidebar under "React"
  → When React Storybook is DOWN: "React" section shows as unavailable
```

## N/A or Blocker

- BehaviorScenarioInstance, DataFixture, UIFPath, FeedbackView, BehaviorAssertion entities are not modeled at this level — this feature has no complex state machine, API contracts, or cross-boundary events that warrant formal behavior entity modeling. The behavior drafts in `behavior/` and behavior contracts in `contracts/behavior/` capture the scenario-level detail.