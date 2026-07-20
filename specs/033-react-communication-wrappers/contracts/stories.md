# Story Contract: React Communication Wrappers

Every story family includes `tags: ['autodocs']`, a typed meta definition,
purpose and misuse guidance, and an exploratory Playground. Fixed stories are
deterministic and use synthetic content.

| Component | Required fixed stories | Required interaction coverage |
| --- | --- | --- |
| Accordion | Default, Multiple Allowed, Initially Expanded, Disabled Item, Long Content, Narrow | Pointer and keyboard toggle, single/multiple behavior, disabled behavior, focus retention. |
| Alert | Info, Success, Warning, Error, Emergency, Slim, Long Content, Narrow | Accessible role/name and content preservation; no wrapper interaction. |
| Banner | Collapsed, Expanded, Long Content, Narrow | Pointer and keyboard disclosure, `aria-expanded`, controlled/uncontrolled state. |
| Modal | Closed Trigger, Open, Long Content, Long Actions, Narrow | Open, initial focus, Tab containment, Escape/close, scroll and focus restoration. |
| ProcessList | Default, Empty, Long Content, Narrow | Ordered semantics and content order. |
| SiteAlert | Default, Info, Emergency, Slim, Long Content, Narrow | Accessible role/name and absence of invented warning/dismissal. |
| StepIndicator | First, Middle, Final, No Current, Long Labels, Narrow | Ordered semantics, exactly one current state for valid positions, invalid fallback. |
| SummaryBox | Default, With Link, Rich Content, Long Content, Narrow | Heading/content semantics and link operability. |

## Composition

`CommunicationPatterns.stories.tsx` demonstrates a deterministic workflow page
that combines SiteAlert, StepIndicator, Alert, Accordion, SummaryBox,
ProcessList, Banner, and a Modal trigger without creating a new production API.

## Visual and Accessibility Fixtures

- Stable default/state stories participate in rendered accessibility checks.
- Narrow and long-content stories protect wrapping, overflow, spacing, message
  hierarchy, status presentation, and focus visibility.
- Modal, Accordion, and Banner play tests use `getByRole`, `getByLabelText`, or
  `getByText`; they do not use test IDs or CSS selectors.
- Forced-colors and reduced-motion checks are applied to interactive fixtures
  where the environment supports them.
- No broad accessibility exception is permitted.
