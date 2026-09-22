// The date range picker's model (docs/date-picker.md): calendar days as year, month and
// day, never instants, so arithmetic cannot skip or double a day across a daylight-saving
// change. The only instants are UTC midnights made for arithmetic and for Intl formatting,
// which reads them back in UTC. Locale facts come from Intl; the fallback for the first
// day of the week covers engines without week information.
export type PlainDate = { readonly y: number; readonly m: number; readonly d: number }
export type Range = { readonly start: PlainDate | null; readonly end: PlainDate | null }
export type Mode = 'range' | 'single'
/** 0 is Sunday, as Date.getUTCDay counts */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

const DAY = 86_400_000

export const plain = (y: number, m: number, d: number): PlainDate => ({ y, m, d })
export const compare = (a: PlainDate, b: PlainDate): number => a.y - b.y || a.m - b.m || a.d - b.d
export const equal = (a: PlainDate | null, b: PlainDate | null): boolean => !!a && !!b && compare(a, b) === 0
export const toUTC = (p: PlainDate): number => Date.UTC(p.y, p.m - 1, p.d)
export const fromUTC = (ms: number): PlainDate => {
  const t = new Date(ms)
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }
}
export const iso = (p: PlainDate): string => `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`
export const addDays = (p: PlainDate, n: number): PlainDate => fromUTC(toUTC(p) + n * DAY)
export const daysBetween = (a: PlainDate, b: PlainDate): number => Math.round((toUTC(b) - toUTC(a)) / DAY)
export const daysInMonth = (y: number, m: number): number => new Date(Date.UTC(y, m, 0)).getUTCDate()
export const weekday = (p: PlainDate): Weekday => new Date(toUTC(p)).getUTCDay() as Weekday
export const addMonths = (p: PlainDate, n: number): PlainDate => {
  const i = p.y * 12 + (p.m - 1) + n
  const y = Math.floor(i / 12), m = (i % 12) + 1
  return { y, m, d: Math.min(p.d, daysInMonth(y, m)) }
}
export const startOfMonth = (p: PlainDate): PlainDate => ({ y: p.y, m: p.m, d: 1 })
export const endOfMonth = (p: PlainDate): PlainDate => ({ y: p.y, m: p.m, d: daysInMonth(p.y, p.m) })
export const sameMonth = (a: PlainDate, b: PlainDate): boolean => a.y === b.y && a.m === b.m
/** the device's calendar day, read once from a local clock */
export const today = (now: Date = new Date()): PlainDate => ({ y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() })
/** the local Date the system picker takes and gives; only ever compared by its calendar fields */
export const toLocalDate = (p: PlainDate): Date => new Date(p.y, p.m - 1, p.d)
export const fromLocalDate = (t: Date): PlainDate => ({ y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() })
export const clampDate = (p: PlainDate, min: PlainDate | null, max: PlainDate | null): PlainDate =>
  min && compare(p, min) < 0 ? min : max && compare(p, max) > 0 ? max : p

// ── the month grid ──────────────────────────────────────────────────────────
/** six rows of seven: the month's days in place, null where the cell is empty */
export function monthGrid(y: number, m: number, firstDay: Weekday): (PlainDate | null)[][] {
  const lead = (weekday({ y, m, d: 1 }) - firstDay + 7) % 7
  const n = daysInMonth(y, m)
  const cells: (PlainDate | null)[] = []
  for (let i = 0; i < lead; i++) cells.push(null)
  for (let d = 1; d <= n; d++) cells.push({ y, m, d })
  while (cells.length < 42) cells.push(null)
  const rows: (PlainDate | null)[][] = []
  for (let r = 0; r < 6; r++) rows.push(cells.slice(r * 7, r * 7 + 7))
  return rows
}
/** the first day of the week that holds p, for Home and End */
export const startOfWeek = (p: PlainDate, firstDay: Weekday): PlainDate => addDays(p, -((weekday(p) - firstDay + 7) % 7))

// ── the range rules (docs/date-picker.md) ───────────────────────────────────
export const EMPTY: Range = { start: null, end: null }
export const complete = (r: Range): r is { start: PlainDate; end: PlainDate } => !!r.start && !!r.end

/** a pick in the grid: start, then end, swapping when the end comes first; a pick on a complete range restarts */
export function pick(range: Range, date: PlainDate, mode: Mode): Range {
  if (mode === 'single') return { start: date, end: date }
  if (!range.start || range.end) return { start: date, end: null }
  return compare(date, range.start) < 0 ? { start: date, end: range.start } : { start: range.start, end: date }
}
/** a typed value for one end; the other end stays, and a typed end before the start is kept for validation to name */
export const setEnd = (range: Range, which: 'start' | 'end', date: PlainDate | null): Range =>
  which === 'start' ? { start: date, end: range.end } : { start: range.start, end: date }

export type Position = 'start' | 'end' | 'single' | 'inside' | 'preview' | null
/** where a day stands in the range; `hover` is the day the end would be, while the end is being chosen */
export function position(range: Range, date: PlainDate, hover: PlainDate | null = null): Position {
  const { start, end } = range
  if (start && end) {
    if (equal(start, end) && equal(date, start)) return 'single'
    if (equal(date, start)) return 'start'
    if (equal(date, end)) return 'end'
    if (compare(date, start) > 0 && compare(date, end) < 0) return 'inside'
    return null
  }
  if (start && !end) {
    if (equal(date, start)) return hover && compare(hover, start) < 0 ? 'end' : hover && compare(hover, start) > 0 ? 'start' : 'single'
    if (hover) {
      const lo = compare(hover, start) < 0 ? hover : start, hi = lo === hover ? start : hover
      if (equal(date, hover)) return compare(hover, start) < 0 ? 'start' : 'end'
      if (compare(date, lo) > 0 && compare(date, hi) < 0) return 'preview'
    }
  }
  return null
}

export type Bounds = { min?: PlainDate | null; max?: PlainDate | null }
export const outOfBounds = (p: PlainDate, b: Bounds): 'before-min' | 'after-max' | null =>
  b.min && compare(p, b.min) < 0 ? 'before-min' : b.max && compare(p, b.max) > 0 ? 'after-max' : null

export type Problem = 'format' | 'before-min' | 'after-max' | 'end-before-start'
/** the problems a typed range has, by field; a field that failed to parse reports `format` */
export function validate(range: Range, parsed: { start: boolean; end: boolean }, b: Bounds): { start?: Problem; end?: Problem } {
  const out: { start?: Problem; end?: Problem } = {}
  if (!parsed.start) out.start = 'format'
  else if (range.start) { const o = outOfBounds(range.start, b); if (o) out.start = o }
  if (!parsed.end) out.end = 'format'
  else if (range.end) {
    const o = outOfBounds(range.end, b)
    if (o) out.end = o
    else if (range.start && compare(range.end, range.start) < 0) out.end = 'end-before-start'
  }
  return out
}

// ── presets ─────────────────────────────────────────────────────────────────
export type Preset = { key: string; label: string; range: Range }
/** the statement periods, from today: the last 7 and 30 days end today; this month and the year run to today */
export function presets(t: PlainDate): Preset[] {
  const lastMonth = addMonths(startOfMonth(t), -1)
  return [
    { key: 'last-7', label: 'Last 7 days', range: { start: addDays(t, -6), end: t } },
    { key: 'last-30', label: 'Last 30 days', range: { start: addDays(t, -29), end: t } },
    { key: 'this-month', label: 'This month', range: { start: startOfMonth(t), end: t } },
    { key: 'last-month', label: 'Last month', range: { start: lastMonth, end: endOfMonth(lastMonth) } },
    { key: 'year', label: 'Year to date', range: { start: { y: t.y, m: 1, d: 1 }, end: t } },
  ]
}
export const sameRange = (a: Range, b: Range): boolean => equal(a.start, b.start) && equal(a.end, b.end)

// ── locale ──────────────────────────────────────────────────────────────────
export type Locale = {
  tag: string
  firstDay: Weekday
  /** short and long weekday names, indexed by Weekday */
  weekdaysShort: string[]
  weekdaysLong: string[]
  /** long month names, indexed by month minus one */
  months: string[]
  /** the order of the numeric fields when this locale writes a date */
  order: ('y' | 'm' | 'd')[]
  separator: string
  /** the format written beside the field, in the locale's order */
  pattern: string
}
// regions whose week starts on Sunday or Saturday, for engines without week information
const SUNDAY = new Set(['US', 'CA', 'JP', 'BR', 'MX', 'IL', 'IN', 'KR', 'PH', 'ZA', 'AU', 'HK', 'TW', 'SA', 'AR', 'CO', 'PE', 'VE', 'PR', 'DO'])
const SATURDAY = new Set(['AE', 'EG', 'IQ', 'JO', 'KW', 'LY', 'OM', 'QA', 'SD', 'SY', 'BH', 'DZ'])
export const deviceLocale = (): string => {
  try { return Intl.DateTimeFormat().resolvedOptions().locale } catch { return 'en-US' }
}
export function localeInfo(tag: string = deviceLocale()): Locale {
  let firstDay: Weekday | null = null
  try {
    const loc: any = new Intl.Locale(tag)
    const info = typeof loc.getWeekInfo === 'function' ? loc.getWeekInfo() : loc.weekInfo
    if (info && typeof info.firstDay === 'number') firstDay = (info.firstDay % 7) as Weekday
  } catch {}
  if (firstDay === null) {
    let region = ''
    try { region = (new Intl.Locale(tag).maximize().region ?? '').toUpperCase() } catch {}
    firstDay = SATURDAY.has(region) ? 6 : SUNDAY.has(region) ? 0 : 1
  }
  const sunday = Date.UTC(2023, 0, 1) // a Sunday
  const shortF = new Intl.DateTimeFormat(tag, { weekday: 'short', timeZone: 'UTC' })
  const longF = new Intl.DateTimeFormat(tag, { weekday: 'long', timeZone: 'UTC' })
  const monthF = new Intl.DateTimeFormat(tag, { month: 'long', timeZone: 'UTC' })
  const weekdaysShort = Array.from({ length: 7 }, (_, i) => shortF.format(sunday + i * DAY))
  const weekdaysLong = Array.from({ length: 7 }, (_, i) => longF.format(sunday + i * DAY))
  const months = Array.from({ length: 12 }, (_, i) => monthF.format(Date.UTC(2023, i, 1)))
  const parts = new Intl.DateTimeFormat(tag, { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' }).formatToParts(Date.UTC(2023, 10, 22))
  const order = parts.filter(p => p.type === 'year' || p.type === 'month' || p.type === 'day').map(p => p.type[0] as 'y' | 'm' | 'd')
  const lit = parts.find(p => p.type === 'literal')?.value.trim() ?? '/'
  const separator = lit || '/'
  const pattern = order.map(o => ({ y: 'YYYY', m: 'MM', d: 'DD' })[o]).join(separator)
  return { tag, firstDay, weekdaysShort, weekdaysLong, months, order: order.length === 3 ? order : ['m', 'd', 'y'], separator, pattern }
}

/** the numeric form the field shows, in the locale's order, ASCII digits, two-digit day and month */
export function formatField(p: PlainDate, loc: Locale): string {
  const part = { y: String(p.y), m: String(p.m).padStart(2, '0'), d: String(p.d).padStart(2, '0') }
  return loc.order.map(o => part[o]).join(loc.separator)
}
/** the full spoken name of a day, for a cell's accessible name */
export const formatLong = (p: PlainDate, loc: Locale): string =>
  new Intl.DateTimeFormat(loc.tag, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(toUTC(p))
/** a short readable date for announcements and messages */
export const formatShort = (p: PlainDate, loc: Locale): string =>
  new Intl.DateTimeFormat(loc.tag, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(toUTC(p))
export const formatMonth = (p: PlainDate, loc: Locale): string => `${loc.months[p.m - 1]} ${p.y}`

/** typed text to a day: the ISO form, or three numbers in the locale's order; a two-digit year is this century */
export function parse(text: string, loc: Locale): PlainDate | null {
  const s = text.trim()
  if (!s) return null
  const isoM = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s)
  let y: number, m: number, d: number
  if (isoM) [y, m, d] = [Number(isoM[1]), Number(isoM[2]), Number(isoM[3])]
  else {
    const nums = s.split(/[\/.\-\s]+/)
    if (nums.length !== 3 || nums.some(n => !/^\d{1,4}$/.test(n))) return null
    const at = (k: 'y' | 'm' | 'd') => Number(nums[loc.order.indexOf(k)])
    y = at('y'); m = at('m'); d = at('d')
    const yText = nums[loc.order.indexOf('y')]
    if (yText.length <= 2) y += 2000
    else if (yText.length === 3) return null
  }
  if (m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null
  return { y, m, d }
}
