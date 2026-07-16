# Quickstart Guide: React Card Wrapper

This guide demonstrates how to install and use the `Card` component from the React wrapper package.

## Prerequisites

- Node.js and npm/pnpm installed.
- A React project set up.

## Installation

Install the React wrapper package:

```bash
pnpm add @pathable/react
```

## Usage

### Basic Card

Render a simple card with a title and body content.

```jsx
// Install the package first: pnpm add @pathable/react

import { Card } from '@pathable/react';

function BasicCardExample() {
  return (
    <Card title="Card Title" className="my-custom-card">
      <p>This is the main body content of the card.</p>
      <p>It can contain multiple paragraphs or other React elements.</p>
    </Card>
  );
}

export default BasicCardExample;
```

### Card with Footer

Add a footer to the card for additional information or actions.

```jsx
import { Card } from '@pathable/react';

function CardWithFooterExample() {
  return (
    <Card title="With a Footer" footer={<span>Learn more</span>}>
      <p>This card has some body content and a clickable footer.</p>
    </Card>
  );
}

export default CardWithFooterExample;
```

### Media Card

Utilize the media presentation for cards that display visual content.

```jsx
import { Card } from '@pathable/react';

function MediaCardExample() {
  return (
    <Card presentation="media" media={<img src="/path/to/your/image.jpg" alt="Card Media" style={{ width: '100%', height: 'auto' }} />}>
      <p>This card showcases media content.</p>
      <footer>Additional info, optional</footer>
    </Card>
  );
}

export default MediaCardExample;
```

### Workflow Card

Display cards with metadata, status, and actions for workflow-specific information.

```jsx
import { Card } from '@pathable/react';

function WorkflowCardExample() {
  return (
    <Card
      presentation="workflow"
      title="Workflow Card Example"
      metadata={<span>Project: Pathable Styles</span>}
      status={<span>Status: In Progress</span>}
      actions={<button>View Details</button>}
    >
      <p>This card represents a step in a workflow.</p>
    </Card>
  );
}

export default WorkflowCardExample;

```

### Importing Styles

The easiest way to ensure all Pathable styles are available is to import them once in your application's entry point (e.g., `main.tsx` or `App.tsx`):

```tsx
// Example: In your application's main entry file (e.g., main.tsx or App.tsx)
import '@pathable/react/dist/style.css'; // Adjust path if necessary based on the package export
```

**Note**: The `@pathable/react` package is designed to bundle and export the necessary styles transitively. However, importing the primary CSS file once in your application's entry point is a common and recommended practice to ensure all styles are loaded correctly.

## Verification

After implementing the `Card` component in your React application:

1.  **Install** the `@pathable/react` package.
2.  **Import** the `Card` component and the necessary styles.
3.  **Render** the `Card` with different props (title, body, footer, media, presentation variants) and verify:
    *   The card renders correctly with Pathable styling.
    *   The styling is applied without requiring a separate `@pathable/styles` import in your application code.
    *   Different presentations and content regions appear as expected.
    *   The component name is `Card` and it maps to existing `packages/styles` contracts.
