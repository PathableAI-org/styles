---
'@pathableai/styles': patch
---

`.pathable-card__action` in a workflow card can now go on a container around the actions, as well as on the action link. Inside the container, a plain link gets the action colour and underline, and both a plain link and a `.pathable-link` get the action's brand focus indicator (2px, 2px offset) on keyboard focus. A `.pathable-link` there no longer shows its own 4px focus ring, on keyboard focus or on a mouse click, and keeps its own colour, hover and active colours. A container that holds links is no longer drawn in the link colour with an underline itself. Other anchors in the container, such as one styled with `.pathable-button`, keep their own styling. The React `Card` renders its `actions` inside such a container, so a React workflow card's action link now matches the styles workflow card. No class or token changes.
