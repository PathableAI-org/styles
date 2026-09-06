---
applyTo: 'packages/react/**'
---

# React consumer guidance review

When reviewing changes under `packages/react`, consider whether they change the
consumer-visible contract described in
`packages/react/agent-guidance/pathable-react/`.

Request a guidance update when a change affects public exports, component
selection advice, supported styling or theming, accessibility requirements,
package entry points, or server/client and browser-JavaScript boundaries.

Do not request guidance churn for tests, stories, formatting, refactors with no
consumer-visible effect, or implementation details that preserve the public
contract. The installed package's runtime and declarations remain the source of
truth.
