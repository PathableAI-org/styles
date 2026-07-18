# Class Diagram: React Link and Tag Wrappers

```mermaid
classDiagram
    class ReactPackageEntrypoint {
      +export Link
      +export Tag
      +import compiled Pathable styles
    }
    class Link {
      +presentation
      +children
      +className
      +restAttributes
      +render anchor
    }
    class Tag {
      +size
      +children
      +className
      +restAttributes
      +render span
    }
    class PathableLinkContract {
      +pathable-link
      +pathable-link--external
    }
    class PathableTagContract {
      +pathable-tag
      +pathable-tag--big
    }

    ReactPackageEntrypoint --> Link : exports
    ReactPackageEntrypoint --> Tag : exports
    Link --> PathableLinkContract : maps presentation
    Tag --> PathableTagContract : maps size
```

## Responsibility Boundaries

- `Link` owns only semantic anchor rendering, bounded class selection, and prop forwarding.
- `Tag` owns only semantic span rendering, bounded class selection, and prop forwarding.
- The Pathable source contracts own all visual behavior.
- The package entrypoint owns public exports and transitive style delivery.
- Consumers own content, navigation policy, accessibility labeling, handlers,
  and composition-specific classes.
