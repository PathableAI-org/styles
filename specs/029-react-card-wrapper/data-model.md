# Data Model for React Card Wrapper

## Card Component

The `Card` component is a reusable UI element provided by the React wrapper package. It maps directly to the `pathable-card` contract defined in `@pathable/styles`.

### Entity: `Card`

Represents the overall card container.

**Properties**:

-   `children`: `ReactNode` (Required) - The main content of the card.
-   `className`: `string` (Optional) - Additional class names for custom styling or composition.
    10|- `title`: `ReactNode` (Optional) - Content for the card's heading.
-   `footer`: `ReactNode` (Optional) - Content for the card's footer.
-   `media`: `ReactNode` (Optional) - Content for a media region within the card.
-   `presentation`: `'base' | 'media' | 'flag' | 'header-first' | 'workflow'` (Optional, defaults to 'base') - Specifies the card's visual presentation variant.
-   `metadata`: `ReactNode` (Optional) - Content for metadata typically used in workflow cards.
-   `status`: `ReactNode` (Optional) - Content for status information typically used in workflow cards.
-   `actions`: `ReactNode` (Optional) - Content for interactive actions, often in workflow cards.

**Note**: The `Card` component will internally manage the correct class, modifier, or structure based on the provided properties and their combination, aligning with the `packages/styles` contract. For instance, providing `media` or `presentation='media'` will apply the necessary classes/structure for a media card. The `workflow` presentation implies the presence of metadata, status, and actions.

---

## Card Region Types

These represent the different types of content that can be placed within a `Card`.

### Entity: `CardRegion`

Abstract representation of a content area within the card.

**Properties**:

-   `children`: `ReactNode` (Required) - The content specific to this region.

**Specific Region Types (as properties of `Card`)**:

-   **Heading**: `title` property.
-   **Body**: `children` property (main content).
-   **Footer**: `footer` property.
    20|- **Media**: `media` property.
-   **Metadata**: `metadata` property (for workflow cards).
-   **Status**: `status` property (for workflow cards).
-   **Actions**: `actions` property (for workflow cards).

---

## Card Presentations

These are predefined visual treatments for the `Card` component, mapped from `packages/styles`.

### Entity: `CardPresentation`

Represents a specific visual style or layout for the card.

**Supported Values**:

-   `'base'`: The default card presentation.
-   `'media'`: Card optimized for displaying media content.
    30|- `'flag'`: Card with a flag-like presentation (e.g., for status indicators).
-   `'header-first'`: Card where content starts with a prominent header.
-   `'workflow'`: Card designed for displaying workflow-specific information (can include metadata, status, actions).

**Mapping**: The `presentation` prop or the presence of specific content props (`media`, `metadata`, `status`, `actions`) will determine the applied classes and structure corresponding to these presentations, as defined in `@pathable/styles`.
