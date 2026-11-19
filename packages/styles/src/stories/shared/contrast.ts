/** Splits a computed `rgb()` or `rgba()` colour into its channels and alpha. */
export const parseComputedColor = (color: string) => {
  const channels = color.match(/[\d.]+/g)?.map(Number)

  if (!channels || channels.length < 3) {
    throw new Error(`Unable to parse computed color: ${color}`)
  }

  return {
    channels: channels.slice(0, 3),
    alpha: channels[3] ?? 1,
  }
}

/**
 * Returns the computed background colour of `element` or its nearest ancestor
 * whose background is opaque: the colour a focus outline drawn outside a
 * control is seen against, when called with the control's parent.
 */
export const findOpaqueBackground = (element: HTMLElement, view: Window) => {
  let current: HTMLElement | null = element

  while (current) {
    const background = view.getComputedStyle(current).backgroundColor

    if (parseComputedColor(background).alpha === 1) return background
    current = current.parentElement
  }

  throw new Error('No ancestor has an opaque background')
}

/** WCAG 2 relative luminance of a computed colour. */
export const relativeLuminance = (color: string) => {
  const { channels } = parseComputedColor(color)

  const [red, green, blue] = channels.map((channel) => {
    const value = channel / 255
    return value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

/** WCAG 2 contrast ratio between two computed colours. */
export const contrastRatio = (foreground: string, background: string) => {
  const lighter = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  )
  const darker = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  )
  return (lighter + 0.05) / (darker + 0.05)
}
