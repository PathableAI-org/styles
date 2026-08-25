/**
 * Internal CSS color value validation.
 *
 * A dependency-free, environment-independent predicate used by `createTheme`
 * to reject non-color strings. It reads no DOM, canvas, `getComputedStyle`, or
 * any other browser global and is deliberately conservative: modern color
 * functions that require color-space parsing (`lab()`, `lch()`, `oklch()`,
 * `color()`, `color-mix()`, …) are not accepted.
 *
 * @see specs/059-default-theme-create-theme/contracts/color-validation.md
 */

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

// A number or percentage channel (`0`, `0.5`, `29%`, `100%`, `-.5`, …).
const NUM = String.raw`[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:%)?`
// A number that must end with `%` — for saturation, lightness, whiteness,
// and blackness channels that only accept percentages (CSS Spec § 8.1).
const PCT = String.raw`[+-]?(?:\d+(?:\.\d+)?|\.\d+)%`
// A hue with an optional angle unit (`210`, `210deg`, `0.5turn`, `3.14rad`, …).
const HUE = String.raw`[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:deg|rad|grad|turn)?`

const FUNCTION_PATTERNS: RegExp[] = [
  // rgb()/rgba() — legacy comma syntax.
  new RegExp(`^rgb\\(\\s*${NUM}\\s*,\\s*${NUM}\\s*,\\s*${NUM}\\s*\\)$`, 'i'),
  new RegExp(
    `^rgba\\(\\s*${NUM}\\s*,\\s*${NUM}\\s*,\\s*${NUM}\\s*,\\s*${NUM}\\s*\\)$`,
    'i',
  ),
  // rgb()/rgba() — modern space syntax with optional `/ alpha`.
  new RegExp(
    `^rgba?\\(\\s*${NUM}\\s+${NUM}\\s+${NUM}(?:\\s*/\\s*${NUM})?\\s*\\)$`,
    'i',
  ),
  // hsl()/hsla() — legacy comma syntax. Saturation and lightness must be %.
  new RegExp(`^hsl\\(\\s*${HUE}\\s*,\\s*${PCT}\\s*,\\s*${PCT}\\s*\\)$`, 'i'),
  new RegExp(
    `^hsla\\(\\s*${HUE}\\s*,\\s*${PCT}\\s*,\\s*${PCT}\\s*,\\s*${NUM}\\s*\\)$`,
    'i',
  ),
  // hsl()/hsla() — modern space syntax with optional `/ alpha`.
  new RegExp(
    `^hsla?\\(\\s*${HUE}\\s+${PCT}\\s+${PCT}(?:\\s*/\\s*${NUM})?\\s*\\)$`,
    'i',
  ),
  // hwb() — comma and space syntax. Whiteness and blackness must be %.
  new RegExp(
    `^hwb\\(\\s*${HUE}\\s*,\\s*${PCT}\\s*,\\s*${PCT}(?:\\s*,\\s*${NUM})?\\s*\\)$`,
    'i',
  ),
  new RegExp(
    `^hwb\\(\\s*${HUE}\\s+${PCT}\\s+${PCT}(?:\\s*/\\s*${NUM})?\\s*\\)$`,
    'i',
  ),
]

const NAMED_COLORS = new Set([
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'black',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'rebeccapurple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'transparent',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen',
])

/**
 * Returns true only for trimmed, non-empty strings that match the accepted CSS
 * color subset: hex, `rgb()`/`rgba()`, `hsl()`/`hsla()`, `hwb()`, and the
 * standard CSS named-color keywords. Pure and deterministic — no DOM or
 * browser globals are consulted.
 */
export function isValidCssColor(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (trimmed === '') return false
  if (HEX_RE.test(trimmed)) return true
  if (NAMED_COLORS.has(trimmed.toLowerCase())) return true
  return FUNCTION_PATTERNS.some((pattern) => pattern.test(trimmed))
}
