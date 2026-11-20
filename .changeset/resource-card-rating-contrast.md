---
'@pathableai/styles': patch
---

The resource card rating (`.pathable-resource-card__rating`) now uses `--pathable-color-text-success`, the text-safe deep jade `#0d7a63` (5.3:1 on the white card), instead of `--pathable-color-accent`, Intelligent Jade `#1cae96` (2.78:1), which was below the 3:1 WCAG 1.4.11 asks of meaningful graphics. The stars are visibly darker. On a hovered interactive card, whose background is Shilling Silver, the rating darkens by mixing 15 % black into the same token (5.2:1). A theme that overrides `accent` no longer recolours the rating; override `textSuccess` (`--pathable-color-text-success`) to change it.

No token or class is added, renamed or removed.

The list layout (`.pathable-resource-card--list`) also wraps its body below the media when the body would be narrower than `10rem`, so enlarged text no longer squeezes the body to nothing or pushes it past the card.
