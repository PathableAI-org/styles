# Class Diagram: React Table Wrapper

```mermaid
classDiagram
    class Table {
      +presentation
      +children
      +className
      +restAttributes
      +render()
    }

    class TablePresentation {
      <<enumeration>>
      default
      borderless
      compact
      striped
    }

    class TableContent {
      +caption
      +sections
      +rows
      +cells
      +interactiveContent
    }

    class PathableTableContract {
      +rootClass pathable-table
      +borderlessModifier
      +compactModifier
      +stripedModifier
    }

    Table "1" --> "1" TablePresentation : resolves
    Table "1" --> "0..*" TableContent : preserves
    Table --> PathableTableContract : maps to
```

## Responsibility Notes

- `Table` is the only new public React component in this feature.
- `TableContent` describes consumer-owned native markup, not a wrapper data API.
- `PathableTableContract` remains owned by `packages/styles`.
