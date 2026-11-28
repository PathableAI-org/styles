---
'@pathableai/styles': patch
---

`pathable-alert` now renders every state on its component page, and the error
alert's text is no longer white on a pale pink tint.

- `pathable-alert__heading` and `pathable-alert__text` now have their heading
  and text styles, including in the alert nested in `pathable-site-alert`.
- The success, warning and error alerts fill the body with the status colour and
  set text, icon and links in the status text colour.
- Links in the emergency alert are white.
- The info alerts use a PathAble Blue focus ring, which has 3:1 on
  their surface.
- Long words in an alert wrap instead of running out of it under large text.
- The status icon is laid out in the normal flow of the body and shows in
  forced-colours mode.
- A one-line alert is no longer 32px taller than it needs to be.
