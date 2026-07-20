# Sequence Contracts: React Communication Wrappers

## Render a Presentational Component

```mermaid
sequenceDiagram
    participant Consumer
    participant Package as "@pathable/react"
    participant Wrapper
    participant Styles as "@pathable/styles"

    Consumer->>Package: import component
    Package-->>Consumer: typed export and transitive CSS
    Consumer->>Wrapper: render bounded props and content
    Wrapper->>Wrapper: resolve implemented classes
    Wrapper-->>Consumer: semantic markup and preserved attributes
    Styles-->>Consumer: owning presentation applies
```

## Toggle Accordion or Banner Disclosure

```mermaid
sequenceDiagram
    participant User
    participant Control
    participant Wrapper
    participant Content
    participant Consumer

    User->>Control: activate with pointer, Enter, or Space
    Control->>Wrapper: request toggle
    Wrapper->>Wrapper: resolve controlled or uncontrolled state
    Wrapper-->>Control: update aria-expanded
    Wrapper-->>Content: update hidden state
    Wrapper-->>Consumer: report state change when callback exists
```

## Open and Close Modal

```mermaid
sequenceDiagram
    participant User
    participant Consumer
    participant Modal
    participant Document

    User->>Consumer: activate invoking control
    Consumer->>Modal: set open true
    Modal->>Document: mount portal and lock scroll
    Modal->>Modal: capture invoker and focus initial target
    User->>Modal: Tab within dialog or press Escape/close
    Modal-->>Consumer: request onClose
    Consumer->>Modal: set open false
    Modal->>Document: unmount portal and restore scroll
    Modal-->>User: restore focus to invoker
```

## Derive Step State

```mermaid
sequenceDiagram
    participant Consumer
    participant Indicator as StepIndicator
    participant Steps

    Consumer->>Indicator: render ordered steps and currentStep
    Indicator->>Indicator: validate one-based position
    alt valid position
        Indicator->>Steps: mark prior complete, one current, later upcoming
    else absent or invalid position
        Indicator->>Steps: render no invented current state
    end
    Steps-->>Consumer: semantic ordered progress
```

## Package Validation

```mermaid
sequenceDiagram
    participant Maintainer
    participant SourceSB as "Source Storybook"
    participant ReactSB as "React Storybook"
    participant Build as "React package"
    participant Pack as "Package validators"

    Maintainer->>SourceSB: verify corrected source contracts
    SourceSB-->>Maintainer: build and tests pass
    Maintainer->>ReactSB: run stories, interactions, and accessibility
    ReactSB-->>Maintainer: all supported states pass
    Maintainer->>Build: build JS and declarations
    Build-->>Maintainer: eight exports compile
    Maintainer->>Pack: inspect files, entrypoints, dependencies, and types
    Pack-->>Maintainer: consumer package is publishable
```
