---
'@pathableai/styles': minor
---

`pathable-alert` now renders every state on its component page. Adds the
`pathable-alert--no-icon` modifier and gives `pathable-alert__heading` and
`pathable-alert__text` their heading and text styles, which also applies to the
alert nested in `pathable-site-alert`. The success, warning and error alerts
fill the body with the status colour and set text, icon and links in the status
text colour, so the error alert's text is no longer white on a pale pink tint.
Links in the emergency alert are white. The info and plain alerts use a PathAble
Blue focus ring, which has 3:1 on their surface. Long words in an alert wrap
instead of running out of it under large text, the status icon is laid out in
the normal flow of the body and shows in forced-colours mode, and a one-line
alert is no longer 32 px taller than it needs to be.
