export function createDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(2000, 0, 1))
  date.setUTCFullYear(year, month, day)
  return date
}

export function parseISODate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  const [year, month, day] = value.split('-').map(Number)
  const date = createDate(year, month - 1, day)
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null
}

export function toISODate(date: Date) {
  const year = String(date.getUTCFullYear()).padStart(4, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDisplayDate(value?: string) {
  const date = parseISODate(value)
  return date
    ? `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')}/${date.getUTCFullYear()}`
    : ''
}

export function parseDisplayDate(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null

  return parseISODate(`${match[3]}-${match[1]}-${match[2]}`)
}

export function addDays(date: Date, amount: number) {
  const next = new Date(date.getTime())
  next.setUTCDate(next.getUTCDate() + amount)
  return next
}

export function addMonths(date: Date, amount: number) {
  const next = createDate(date.getUTCFullYear(), date.getUTCMonth(), 1)
  next.setUTCMonth(next.getUTCMonth() + amount)
  return next
}

export function addYears(date: Date, amount: number) {
  return createDate(date.getUTCFullYear() + amount, date.getUTCMonth(), 1)
}

export function addMonthsPreservingDay(date: Date, amount: number) {
  const targetMonth = addMonths(date, amount)
  const day = Math.min(
    date.getUTCDate(),
    lastDayOfMonth(targetMonth).getUTCDate(),
  )
  return createDate(
    targetMonth.getUTCFullYear(),
    targetMonth.getUTCMonth(),
    day,
  )
}

export function addYearsPreservingDay(date: Date, amount: number) {
  const targetYear = date.getUTCFullYear() + amount
  const day = Math.min(
    date.getUTCDate(),
    lastDayOfMonth(createDate(targetYear, date.getUTCMonth(), 1)).getUTCDate(),
  )
  return createDate(targetYear, date.getUTCMonth(), day)
}

export function firstDayOfMonth(date: Date) {
  return createDate(date.getUTCFullYear(), date.getUTCMonth(), 1)
}

export function firstDayOfWeek(date: Date) {
  return addDays(date, -date.getUTCDay())
}

export function lastDayOfMonth(date: Date) {
  return addDays(
    createDate(date.getUTCFullYear(), date.getUTCMonth() + 1, 1),
    -1,
  )
}

export function constrainDate(
  date: Date,
  minValue?: string,
  maxValue?: string,
) {
  const minDate = parseISODate(minValue)
  const maxDate = parseISODate(maxValue)
  if (minDate && date < minDate) return minDate
  if (maxDate && date > maxDate) return maxDate
  return date
}
