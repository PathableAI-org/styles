# Sequence Contracts: React Link and Tag Wrappers

## Render Link or Tag

```mermaid
sequenceDiagram
    participant Consumer
    participant Package as "@pathable/react"
    participant Wrapper as "Link or Tag"
    participant Styles as "@pathable/styles"

    Consumer->>Package: import Link or Tag
    Package-->>Consumer: component export and transitive styles
    Consumer->>Wrapper: render bounded value, content, attributes
    Wrapper->>Wrapper: resolve implemented modifier
    Wrapper->>Wrapper: append className and forward attributes
    Wrapper-->>Consumer: semantic root with unchanged content
    Styles-->>Consumer: owning Pathable presentation applied
```

## External Link Presentation

```mermaid
sequenceDiagram
    participant Consumer
    participant Link

    Consumer->>Link: render external presentation with navigation props
    Link->>Link: add pathable-link--external
    Link-->>Consumer: anchor with navigation props unchanged
```

## Unsupported Value Fallback

```mermaid
sequenceDiagram
    participant Consumer
    participant Wrapper as "Link or Tag"

    Consumer->>Wrapper: render unsupported presentation or size
    Wrapper->>Wrapper: reject undocumented modifier mapping
    Wrapper-->>Consumer: render owning base class only
```

## Package Validation

```mermaid
sequenceDiagram
    participant Maintainer
    participant Build as "React package build"
    participant Storybook as "React Storybook build"
    participant Pack as "package-content check"

    Maintainer->>Build: compile public package
    Build-->>Maintainer: Link and Tag exports succeed
    Maintainer->>Storybook: build documented scenarios
    Storybook-->>Maintainer: all in-scope treatments compile
    Maintainer->>Pack: inspect publish contents
    Pack-->>Maintainer: entrypoint, README, and style dependency evidence
```
