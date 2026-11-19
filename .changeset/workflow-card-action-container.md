---
'@pathableai/styles': patch
---

A plain link or a `.pathable-link` inside a workflow card's `.pathable-card__action` container now gets the same colour, underline and brand focus indicator as a link that carries `.pathable-card__action` itself. A `.pathable-link` there no longer shows its own 4px focus ring, on keyboard focus or on a mouse click. Other anchors in the container, such as one styled with `.pathable-button`, keep their own styling. The React `Card` renders its `actions` inside such a container, so a React workflow card's action link now matches the styles workflow card. No class or token changes.
