---
'@pathableai/styles': patch
---

A link inside a workflow card's `.pathable-card__action` container now gets the same colour, underline and brand focus indicator as a link that carries `.pathable-card__action` itself, including when the link also carries `.pathable-link`. The React `Card` renders its `actions` inside such a container, so its action link now matches the styles workflow card instead of showing the browser's default focus ring or the `.pathable-link` ring. No class or token changes.
