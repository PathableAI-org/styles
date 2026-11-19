---
'@pathableai/styles': patch
---

The `pathable-dashboard-header__breadcrumb` trail no longer clips the focus outline of its links at a viewport of 640 px or less. The trail now has 0.5rem of padding on every side at that width, so its text is inset 0.5rem from the left and the line is 1rem narrower; at large text sizes a crumb can wrap one line earlier. Its height otherwise stays the same and it stays inside the header's width.
