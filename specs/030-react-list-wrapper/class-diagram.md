# Class Diagram: React List Wrapper

```mermaid
classDiagram
    class List {
      +presentation
      +items
      +children
      +className
      +restAttributes
      +render()
    }

    class ListItem {
      +content
      +key
      +className
      +attributes
    }

    class ListPresentation {
      <<enumeration>>
      unordered
      ordered
      unstyled
    }

    class PathableListContract {
      +rootClass pathable-list
      +unorderedPresentation
      +orderedPresentation
      +unstyledPresentation
    }

    List "1" --> "0..*" ListItem : renders
    List "1" --> "1" ListPresentation : selects
    List --> PathableListContract : maps to
```

## Responsibility Notes

- `List` is the only new React component planned for this feature.
- `ListItem` is a contract concept for item-driven rendering and validation; it
  does not require a separately exported component.
- `PathableListContract` remains owned by `packages/styles`.
