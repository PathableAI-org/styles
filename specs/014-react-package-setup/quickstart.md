# Quickstart: React Package Workspace Setup

## Prerequisites

- Node.js >= 18
- pnpm >= 10

## Setup

```bash
# Install all workspace dependencies
pnpm install

# Build @pathable/styles first (required by @pathable/react)
pnpm --filter @pathable/styles build

# Build @pathable/react
pnpm --filter @pathable/react build
```

## Development

### Start the React Storybook (standalone)

```bash
pnpm --filter @pathable/storybook-react storybook
```

Opens on `http://localhost:6007`.

### Start the main Storybook (with composition)

```bash
# In one terminal, start the React Storybook:
pnpm --filter @pathable/storybook-react storybook

# In another terminal, start the main Storybook:
pnpm --filter @pathable/storybook storybook
```

The main Storybook on `http://localhost:6006` will show a "React" section composed from the React Storybook.

## Validation Paths

### Validate Dependency Chain

```bash
# 1. Build the React package
pnpm --filter @pathable/react build

# 2. Check that @pathable/styles is a dependency (not devDependency)
node -e "const pkg = require('./packages/react/package.json'); console.log(pkg.dependencies['@pathable/styles'] ? 'OK: @pathable/styles is a dependency' : 'ERROR: @pathable/styles missing from dependencies')"
```

### Validate Button Component Renders

```bash
# Create a small test by building the package and verifying exports
node -e "
  const path = require('path');
  const dist = require('./packages/react/dist/index.js');
  console.log(typeof dist.Button === 'function' ? 'OK: Button is exported' : 'ERROR: Button not exported');
"
```

### Validate Storybook Composition

1. Start the React Storybook: `pnpm --filter @pathable/storybook-react storybook`
2. Start the main Storybook: `pnpm --filter @pathable/storybook storybook`
3. Open `http://localhost:6006` and verify "React" section appears in the sidebar
4. Stop the React Storybook
5. Verify the "React" section in the main Storybook shows as unavailable (no crash)

## Validation Paths for Formal Behavior Contracts

### S-001: Consumer installs @pathable/react and gets styles automatically

```
Given a consumer project adds @pathable/react as a dependency
When  the dependency is resolved via pnpm install
Then  @pathable/styles is included as a transitive dependency
```

**Validation**: Create a temporary test directory, add `@pathable/react: workspace:*` to `package.json`, run `pnpm install`, check `node_modules/@pathable/styles` exists.

### S-002: Consumer renders Button with styles applied

```
Given a consumer project with @pathable/react installed
When  the consumer imports { Button } from @pathable/react
And   renders <Button>Click Me</Button>
Then  the rendered button has the pathable-button CSS class applied
```

**Validation**: In a React test environment (e.g., React Testing Library), import and render `Button`, assert the rendered element has class `pathable-button` and contains text "Click Me".

### S-003: Built output includes styles CSS

```
Given a consumer project with @pathable/react installed
When  the consumer runs the production build
Then  the CSS from @pathable/styles is included in the stylesheet
```

**Validation**: Build a consumer project that imports `@pathable/react`, inspect the built CSS output for `pathable-button` class rules.

### S-004: React Storybook displays Button story

```
Given the React Storybook server is running on port 6007
When  a developer navigates to the React Storybook in a browser
Then  the Button story is displayed with the pathable-button class applied
```

**Validation**: Start the React Storybook, navigate to the Button story URL, verify the rendered button has the `pathable-button` class.

### S-005: Main Storybook composes React stories

```
Given the main Storybook is running on port 6006
And   the React Storybook is running on port 6007
When  a developer views the main Storybook sidebar
Then  there is a "React" section containing the React Button stories
```

**Validation**: Start both Storybooks, open main Storybook, verify "React" section exists in sidebar with Button story.

### S-006: Main Storybook degrades gracefully when React Storybook is unavailable

```
Given the main Storybook is running on port 6006
And   the React Storybook is not running
When  a developer views the main Storybook sidebar
Then  the composed "React" section shows as unavailable
And   the main Storybook continues to function without errors
```

**Validation**: Start only the main Storybook, verify the "React" section shows as unavailable and no console errors appear.