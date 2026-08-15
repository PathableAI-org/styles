# Service Sequences: React Activity List Wrapper

## Applicability

Intentionally minimal. This feature has no API request, service call, command
bus, event stream, asynchronous worker, callback protocol, retry, rollback,
compensation, or failure-propagation boundary. Rendering is a synchronous
projection of immutable consumer props into source-contract markup.

Observable render and interaction paths are therefore defined in:

- `../behavior/bdd.draft.feature`
- `./bdd/`
- `./uif/`
- `./behavior/`

Responsive and visual proof belongs in `../quickstart.md`; placing it in a
sequence diagram would duplicate the authoritative validation path without
adding a cross-boundary ordering constraint.
