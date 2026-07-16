# Contracts for React Card Wrapper

## Component Props Contract

This contract defines the public API for the `Card` component in the React wrapper package. It ensures alignment with the underlying `packages/styles` contract and provides ergonomic React-native usage.

### `Card` Component Props

| Prop Name   | Type                                                                      | Optional | Description                                                                                                                                                                                                                               | Mapping to `@pathable/styles` Contract                      |
| :---------- | :------------------------------------------------------------------------ | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| `children`  | `ReactNode`                                                               | No       | The main content area of the card. This will typically encompass the body of the card.                                                                                                                                                       | Maps to the card's body region.                               |
| `className` | `string`                                                                  | Yes      | Additional CSS class names to be applied to the root element of the card for custom styling or composition by the consumer.                                                                                                                   | Appended to the root card element's existing class list.    |
| `title`     | `ReactNode`                                                               | Yes      | Content for the card's heading region. If provided, it will be rendered in the designated title area.                                                                                                                                       | Maps to the card's heading region.                          |
| `footer`    | `ReactNode`                                                               | Yes      | Content for the card's footer region. This is useful for contextual information or actions related to the card's content.                                                                                                                 | Maps to the card's footer region.                           |
| `media`     | `ReactNode`                                                               | Yes      | Content for the card's media region. Primarily used for visual elements like images or videos, especially in the 'media' presentation.                                                                                                       | Maps to the card's media region.                            |
| `presentation` | `'base' | 'media' | 'flag' | 'header-first' | 'workflow'` | Yes      | Specifies the visual treatment or layout variant of the card. Defaults to 'base'. The presence of certain props (like `media`, `metadata`, `status`, `actions`) may implicitly trigger specific presentations or override this prop. | Maps to corresponding `pathable-card` classes/modifiers. |
| `metadata`  | `ReactNode`                                                               | Yes      | Content for metadata, typically used in the 'workflow' card presentation.                                                                                                                                                                 | Maps to the card's metadata region (e.g., for workflow cards). |
| `status`    | `ReactNode`                                                               | Yes      | Content for status information, often used in the 'workflow' card presentation.                                                                                                                                                           | Maps to the card's status region (e.g., for workflow cards). |
| `actions`   | `ReactNode`                                                               | Yes      | Content for interactive elements or actions associated with the card, common in 'workflow' presentation.                                                                                                                                   | Maps to the card's actions region (e.g., for workflow cards). |

## Behavioral Contracts

### Presentation Logic

-   When `presentation` is explicitly set to `'media'`, and `media` prop is provided, the card will render with the media region and appropriate styling.
-   When `presentation` is `'workflow'`, the component will expect and render `metadata`, `status`, and `actions` props in their designated regions.
-   If `media` prop is provided without `presentation='media'`, it will still render the media region, potentially defaulting to a presentation that accommodates media.
-   The component will prioritize explicit `presentation` prop values, but may infer presentation based on the presence of content props (e.g., `media` implies a media-compatible presentation).
-   Combinations of `presentation` and content props should map to valid documented `packages/styles` card combinations. If a combination is not explicitly supported in `packages/styles`, the component may default to a base presentation or render the content without specific variant styling.

### Accessibility

-   The `Card` component will ensure interactive elements within `children`, `title`, `footer`, `metadata`, `status`, or `actions` receive appropriate focus management and affordances.
-   Semantic HTML elements (e.g., `<header>`, `<footer>`, `<section>`) will be used internally where appropriate to structure card content, reflecting the underlying styles contract and ARIA best practices.
-   Consumer-provided `className` will be applied to the root element without interfering with internally managed styles or accessibility attributes.
