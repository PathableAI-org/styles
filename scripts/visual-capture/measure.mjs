/**
 * Pixel comparison and contrast measurement for the visual capture.
 *
 * `diffRgba` and `collectContrast` run inside the browser page, so each is
 * self-contained: it uses only its arguments and browser globals, and is
 * injected with its source text. The other functions run in Node and are what
 * the tests exercise; `collectContrast` repeats their maths because it cannot
 * import them.
 */

/**
 * The pixel suite's comparison threshold (THRESHOLD in
 * packages/styles/scripts/test-pixels.mjs): a pixel differs when its YIQ
 * colour distance exceeds this fraction of the largest possible distance.
 */
export const DIFF_THRESHOLD = 0.01

/**
 * Compare two RGBA buffers of the same size. Writes a difference image into
 * `out` (differing pixels red, others a faded grey copy of `a`) and returns
 * the number of differing pixels. Each pixel is blended over white, then
 * compared by its squared YIQ distance (Kotsarenko and Ramos), against
 * `threshold` squared times the largest distance, 35215.
 */
export function diffRgba(a, b, out, width, height, threshold) {
  const limit = 35215 * threshold * threshold
  let count = 0
  for (let i = 0; i < width * height * 4; i += 4) {
    const aa = a[i + 3] / 255
    const ba = b[i + 3] / 255
    const r1 = 255 + (a[i] - 255) * aa
    const g1 = 255 + (a[i + 1] - 255) * aa
    const b1 = 255 + (a[i + 2] - 255) * aa
    const r2 = 255 + (b[i] - 255) * ba
    const g2 = 255 + (b[i + 1] - 255) * ba
    const b2 = 255 + (b[i + 2] - 255) * ba
    const y =
      (r1 - r2) * 0.29889531 + (g1 - g2) * 0.58662247 + (b1 - b2) * 0.11448223
    const iq =
      (r1 - r2) * 0.59597799 - (g1 - g2) * 0.2741761 - (b1 - b2) * 0.32180189
    const q =
      (r1 - r2) * 0.21147017 - (g1 - g2) * 0.52261711 + (b1 - b2) * 0.31114694
    const delta = 0.5053 * y * y + 0.299 * iq * iq + 0.1957 * q * q
    if (delta > limit) {
      count++
      out[i] = 255
      out[i + 1] = 0
      out[i + 2] = 0
      out[i + 3] = 255
    } else {
      const grey = 255 - (255 - (r1 * 0.299 + g1 * 0.587 + b1 * 0.114)) * 0.1
      out[i] = grey
      out[i + 1] = grey
      out[i + 2] = grey
      out[i + 3] = 255
    }
  }
  return count
}

/** Parse a computed `rgb()` or `rgba()` colour into `[r, g, b, a]`, or `null`. */
export function parseCssColor(value) {
  const match = /^rgba?\(([^)]+)\)$/.exec(value.trim())
  if (!match) return null
  const parts = match[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number)
  if (parts.length < 3 || parts.some(Number.isNaN)) return null
  return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1]
}

/** Blend colour `top` (with alpha) over opaque `bottom`. */
export function composite(top, bottom) {
  const alpha = top[3]
  return [0, 1, 2]
    .map((i) => top[i] * alpha + bottom[i] * (1 - alpha))
    .concat(1)
}

/** WCAG relative luminance of an opaque `[r, g, b]`. */
export function relativeLuminance([r, g, b]) {
  const channel = (value) => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** WCAG contrast ratio of two opaque colours, rounded to two decimals. */
export function contrastRatio(foreground, background) {
  const [light, dark] = [
    relativeLuminance(foreground),
    relativeLuminance(background),
  ].sort((x, y) => y - x)
  return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100
}

/** WCAG large text: at least 18 pt (24 px), or 14 pt (18.66 px) and bold. */
export function isLargeText(fontSizePx, fontWeight) {
  return fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700)
}

/** The AA minimum for text of that size. */
export function minimumRatio(large) {
  return large ? 3 : 4.5
}

/**
 * Collect text and focus-indicator contrast in the current page. Groups text
 * by colour pair and size class, so a page of identical labels is one row.
 * Marks a row `needsSample` when its background is an image or gradient, or a
 * colour is not in `rgb()` form, because computed styles cannot give the
 * colour behind the text then.
 */
export function collectContrast() {
  const doc = globalThis.document
  const getStyle = (element) => globalThis.getComputedStyle(element)
  const parse = (value) => {
    const match = /^rgba?\(([^)]+)\)$/.exec(String(value).trim())
    if (!match) return null
    const parts = match[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number)
    if (parts.length < 3 || parts.some(Number.isNaN)) return null
    return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1]
  }
  const blend = (top, bottom) =>
    [0, 1, 2].map((i) => top[i] * top[3] + bottom[i] * (1 - top[3])).concat(1)
  const luminance = ([r, g, b]) => {
    const channel = (value) => {
      const c = value / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
  }
  const ratio = (fg, bg) => {
    const [light, dark] = [luminance(fg), luminance(bg)].sort((x, y) => y - x)
    return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100
  }
  const hex = (rgb) =>
    `#${rgb
      .slice(0, 3)
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')}`
  const describe = (element) => {
    const id = element.id ? `#${element.id}` : ''
    const classes = [...element.classList].slice(0, 2).map((c) => `.${c}`)
    return `${element.tagName.toLowerCase()}${id}${classes.join('')}`
  }
  const backgroundBehind = (element) => {
    const layers = []
    let needsSample = false
    for (let node = element; node; node = node.parentElement) {
      const style = getStyle(node)
      if (style.backgroundImage && style.backgroundImage !== 'none') {
        needsSample = true
      }
      const colour = parse(style.backgroundColor)
      if (!colour) {
        needsSample = true
        continue
      }
      if (colour[3] > 0) layers.push(colour)
      if (colour[3] >= 1) break
    }
    let result = [255, 255, 255, 1]
    for (const layer of layers.reverse()) result = blend(layer, result)
    return { colour: result, needsSample }
  }
  const visible = (element) => {
    const style = getStyle(element)
    const box = element.getBoundingClientRect()
    return (
      box.width > 0 &&
      box.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      Number(style.opacity) > 0
    )
  }

  const rows = new Map()
  for (const element of doc.body.querySelectorAll('*')) {
    const ownText = [...element.childNodes]
      .filter((node) => node.nodeType === 3)
      .map((node) => node.textContent.trim())
      .join(' ')
      .trim()
    if (!ownText || !visible(element)) continue
    const style = getStyle(element)
    const background = backgroundBehind(element)
    const parsed = parse(style.color)
    const foreground = parsed ? blend(parsed, background.colour) : null
    const size = parseFloat(style.fontSize)
    const weight = Number(style.fontWeight) || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const key = foreground
      ? `${hex(foreground)}|${hex(background.colour)}|${large}`
      : `unparsed|${style.color}|${large}`
    const row = rows.get(key) ?? {
      kind: 'text',
      foreground: foreground ? hex(foreground) : style.color,
      background: hex(background.colour),
      ratio: foreground ? ratio(foreground, background.colour) : null,
      large,
      minimum: large ? 3 : 4.5,
      needsSample: background.needsSample || !foreground,
      count: 0,
      example: { element: describe(element), text: ownText.slice(0, 40) },
    }
    row.count++
    row.needsSample ||= background.needsSample
    rows.set(key, row)
  }

  const focused = doc.activeElement
  const focus = []
  if (focused && focused !== doc.body) {
    const style = getStyle(focused)
    const outline = parse(style.outlineColor)
    const width = parseFloat(style.outlineWidth) || 0
    const background = backgroundBehind(focused.parentElement ?? focused)
    if (style.outlineStyle !== 'none' && width > 0 && outline) {
      const colour = blend(outline, background.colour)
      focus.push({
        kind: 'focus',
        element: describe(focused),
        indicator: `outline ${width}px ${hex(colour)}`,
        background: hex(background.colour),
        ratio: ratio(colour, background.colour),
        minimum: 3,
        needsSample: background.needsSample,
      })
    } else {
      focus.push({
        kind: 'focus',
        element: describe(focused),
        indicator:
          style.boxShadow && style.boxShadow !== 'none'
            ? `box-shadow ${style.boxShadow}`
            : 'none found in computed styles',
        background: hex(background.colour),
        ratio: null,
        minimum: 3,
        needsSample: true,
      })
    }
  }

  return [...rows.values(), ...focus]
}
