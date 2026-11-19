/**
 * Offline example images for stories.
 *
 * Returns an SVG data URI, so a story renders the same on every run and
 * without network access. Never point a story at a remote image host.
 */
export function placeholderImage(
  width: number,
  height: number,
  label: string,
  background = '#e0e0e0',
  foreground = '#666666',
): string {
  const escaped = label
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const fontSize = Math.round(Math.min(width, height) / 8)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="${background}"/>` +
    `<text x="50%" y="50%" fill="${foreground}" font-family="sans-serif" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">${escaped}</text>` +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
