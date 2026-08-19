/**
 * Composes class strings in the fixed merge order:
 * required component classes → resolved semantic classes → consumer className.
 *
 * Each source may be a string, `undefined`, or `null`. Empty/undefined/null
 * sources are filtered out. Returns `undefined` when all sources are empty.
 *
 * Example:
 *   mergeClasses("pathable-card", widthClass("full"), consumerClassName)
 *   // → "pathable-card pathable-width-full my-custom"
 */
export function mergeClasses(
  ...sources: (string | undefined | null)[]
): string | undefined {
  const filtered = sources.filter(
    (s): s is string => typeof s === 'string' && s.length > 0,
  )
  return filtered.length > 0 ? filtered.join(' ') : undefined
}
