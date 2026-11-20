/**
 * Offline example images for stories.
 *
 * Returns an SVG data URI, so a story renders the same on every run and
 * without network access. Never point a story at a remote image host.
 *
 * Pass colours from the brand pairings in BRAND_RULES.md (for example PathAble
 * Blue with white, or Shilling Silver with PathAble Blue). An empty label draws
 * a plain tile, for images that object-fit crops.
 */
export function placeholderImage(
  width: number,
  height: number,
  label: string,
  background = '#dde2e8',
  foreground = '#00365c',
): string {
  const escaped = label
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const fontSize = Math.round(
    Math.max(
      16,
      Math.min(height / 6, (width * 0.9) / (label.length * 0.6 || 1)),
    ),
  )
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="${background}"/>` +
    `${label ? `<text x="50%" y="50%" fill="${foreground}" font-family="sans-serif" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">${escaped}</text>` : ''}` +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
