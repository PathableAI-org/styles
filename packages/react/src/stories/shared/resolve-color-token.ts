/** Resolves a colour custom property to the computed `rgb()` string. */
export function resolveColorToken(token: string): string {
  if (
    !getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  ) {
    throw new Error(`Story token ${token} is undefined`)
  }
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  document.body.append(probe)
  const value = getComputedStyle(probe).color
  probe.remove()
  return value
}
