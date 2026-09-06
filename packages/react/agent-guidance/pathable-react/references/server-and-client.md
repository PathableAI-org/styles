# Server and client boundaries

Keep application code server-first. Add a client boundary only where the
component or the way it is used requires browser behavior, state, effects, or
event-handler props.

## Components with inherent client behavior

Place these components beneath a client boundary in React Server Component
frameworks:

- `Accordion`
- `Banner`
- `ComboBox`
- `DatePicker`
- `DateRangePicker`
- `Modal`

They own state, effects, browser interaction, or portals. `Modal` portals to
`document.body` after mounting.

## Usage-driven boundaries

Some components render without internal hooks but become part of client code
when the consumer supplies callbacks or client-owned state. Examples include:

- controlled `SegmentedControl` usage;
- dismissible or dynamically displayed `Toast` and `ToastRegion` usage;
- forms and controls with event handlers;
- any component receiving a function prop from application code.

Do not pass non-serializable callbacks from a Server Component into a Client
Component. Put the state, handlers, and affected component tree together in a
client module.

Presentational components with serializable props can remain in server-rendered
trees. Do not add `'use client'` merely because a component is imported from a
React package.

## Header and USWDS JavaScript

`Header` renders useful semantic markup without JavaScript. Its responsive
mobile-menu behavior additionally requires `@pathableai/styles/js`.

That subpath reads `window` and `document` during module evaluation. Never
import it from a server-evaluated module. Load it once from the browser side of
the application boundary using the framework's supported client-only loading
mechanism. Do not import it inside individual reusable components.

The React-owned `Accordion`, `Banner`, `ComboBox`, `DatePicker`,
`DateRangePicker`, and `Modal` components do not require the USWDS JavaScript
bundle.
