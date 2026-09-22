import { test } from 'node:test'
import assert from 'node:assert/strict'
import { addDays, addMonths, daysInMonth, weekday, monthGrid, startOfWeek, pick, pickFrom, nextEnd, position, validate, presets, localeInfo, parse, formatField, formatLong, iso, plain, daysBetween } from './model.ts'

test('arithmetic ignores daylight saving', () => {
  assert.equal(iso(addDays(plain(2026, 3, 7), 1)), '2026-03-08')   // US clocks change 2026-03-08
  assert.equal(iso(addDays(plain(2026, 3, 8), 1)), '2026-03-09')
  assert.equal(iso(addDays(plain(2026, 10, 25), 1)), '2026-10-26') // EU clocks change 2026-10-25
  assert.equal(daysBetween(plain(2026, 3, 1), plain(2026, 4, 1)), 31)
  assert.equal(iso(addDays(plain(2026, 1, 1), -1)), '2025-12-31')
})
test('months and leap years', () => {
  assert.equal(daysInMonth(2024, 2), 29); assert.equal(daysInMonth(2026, 2), 28); assert.equal(daysInMonth(2100, 2), 28)
  assert.equal(iso(addMonths(plain(2026, 1, 31), 1)), '2026-02-28')
  assert.equal(iso(addMonths(plain(2026, 1, 15), -1)), '2025-12-15')
  assert.equal(weekday(plain(2026, 9, 22)), 2) // a Tuesday
})
test('the month grid follows the first day of the week', () => {
  const sun = monthGrid(2026, 9, 0), mon = monthGrid(2026, 9, 1)
  assert.equal(sun.length, 6); assert.equal(sun[0].filter(c => c === null).length, 2) // 1 Sep 2026 is a Tuesday
  assert.equal(mon[0].filter(c => c === null).length, 1)
  assert.equal(iso(sun[0][2]!), '2026-09-01'); assert.equal(iso(mon[0][1]!), '2026-09-01')
  assert.equal(iso(startOfWeek(plain(2026, 9, 22), 0)), '2026-09-20')
  assert.equal(iso(startOfWeek(plain(2026, 9, 22), 1)), '2026-09-21')
})
test('the pick rules: start, end, swap, restart, one day', () => {
  const a = plain(2026, 9, 10), b = plain(2026, 9, 20)
  let r = pick({ start: null, end: null }, b, 'range'); assert.deepEqual(r, { start: b, end: null })
  r = pick(r, a, 'range'); assert.deepEqual(r, { start: a, end: b })            // end picked first swaps
  r = pick(r, plain(2026, 9, 15), 'range'); assert.deepEqual(r, { start: plain(2026, 9, 15), end: null }) // restart
  r = pick(r, plain(2026, 9, 15), 'range'); assert.deepEqual(r, { start: plain(2026, 9, 15), end: plain(2026, 9, 15) }) // one day
  assert.deepEqual(pick({ start: a, end: null }, b, 'single'), { start: b, end: b })
})
test('a pick from a field sets that end: from the start it restarts, from the end it replaces or swaps', () => {
  const a = plain(2026, 9, 10), b = plain(2026, 9, 20), c = plain(2026, 9, 25)
  assert.deepEqual(pickFrom({ start: a, end: b }, c, 'range', 'end'), { start: a, end: c })                              // a later end replaces
  assert.deepEqual(pickFrom({ start: a, end: b }, plain(2026, 9, 5), 'range', 'end'), { start: plain(2026, 9, 5), end: a }) // an earlier end swaps
  assert.deepEqual(pickFrom({ start: a, end: b }, c, 'range', 'start'), { start: c, end: null })                         // from the start, restart
  assert.deepEqual(pickFrom({ start: null, end: null }, c, 'range', 'end'), { start: c, end: null })                     // no start yet: the pick is the start
  assert.deepEqual(pickFrom({ start: a, end: b }, c, 'single', 'end'), { start: c, end: c })
  assert.deepEqual(pickFrom({ start: a, end: null }, c, 'range', null), pick({ start: a, end: null }, c, 'range'))
})
test('positions inside, at the ends, and in preview', () => {
  const r = { start: plain(2026, 9, 10), end: plain(2026, 9, 20) }
  assert.equal(position(r, plain(2026, 9, 10)), 'start'); assert.equal(position(r, plain(2026, 9, 20)), 'end')
  assert.equal(position(r, plain(2026, 9, 15)), 'inside'); assert.equal(position(r, plain(2026, 9, 21)), null)
  assert.equal(position({ start: plain(2026, 9, 10), end: plain(2026, 9, 10) }, plain(2026, 9, 10)), 'single')
  const half = { start: plain(2026, 9, 10), end: null }
  assert.equal(position(half, plain(2026, 9, 10)), 'single')
  assert.equal(position(half, plain(2026, 9, 15), plain(2026, 9, 20)), 'preview')
  assert.equal(position(half, plain(2026, 9, 20), plain(2026, 9, 20)), 'end')
  assert.equal(position(half, plain(2026, 9, 5), plain(2026, 9, 5)), 'start')   // hovering before the start
  assert.equal(position(half, plain(2026, 9, 10), plain(2026, 9, 5)), 'end')
})
test('validation names the problem by field', () => {
  const b = { min: plain(2026, 1, 1), max: plain(2026, 12, 31) }
  assert.deepEqual(validate({ start: plain(2026, 9, 20), end: plain(2026, 9, 10) }, { start: true, end: true }, b), { end: 'end-before-start' })
  assert.deepEqual(validate({ start: plain(2025, 9, 20), end: null }, { start: true, end: false }, b), { start: 'before-min', end: 'format' })
  assert.deepEqual(validate({ start: plain(2026, 9, 1), end: plain(2027, 1, 1) }, { start: true, end: true }, b), { end: 'after-max' })
  assert.deepEqual(validate({ start: plain(2026, 9, 1), end: plain(2026, 9, 1) }, { start: true, end: true }, b), {})
})
test('presets from a January day cross the year', () => {
  const p = Object.fromEntries(presets(plain(2026, 1, 5)).map(x => [x.key, x.range]))
  assert.deepEqual(p['last-7'], { start: plain(2025, 12, 30), end: plain(2026, 1, 5) })
  assert.deepEqual(p['last-month'], { start: plain(2025, 12, 1), end: plain(2025, 12, 31) })
  assert.deepEqual(p['this-month'], { start: plain(2026, 1, 1), end: plain(2026, 1, 5) })
  assert.deepEqual(p['year'], { start: plain(2026, 1, 1), end: plain(2026, 1, 5) })
})
test('locale facts and the field format', () => {
  const us = localeInfo('en-US'), gb = localeInfo('en-GB'), de = localeInfo('de-DE')
  assert.equal(us.firstDay, 0); assert.equal(gb.firstDay, 1); assert.equal(de.firstDay, 1)
  assert.deepEqual(us.order, ['m', 'd', 'y']); assert.deepEqual(gb.order, ['d', 'm', 'y']); assert.deepEqual(de.order, ['d', 'm', 'y'])
  assert.equal(us.pattern, 'MM/DD/YYYY'); assert.equal(gb.pattern, 'DD/MM/YYYY'); assert.equal(de.pattern, 'DD.MM.YYYY')
  assert.equal(formatField(plain(2026, 9, 2), us), '09/02/2026'); assert.equal(formatField(plain(2026, 9, 2), gb), '02/09/2026')
  assert.equal(us.weekdaysShort[0], 'Sun'); assert.equal(us.months[8], 'September')
  assert.equal(formatLong(plain(2026, 9, 22), us), 'Tuesday, September 22, 2026')
})
test('parsing follows the locale, accepts ISO, rejects nonsense', () => {
  const us = localeInfo('en-US'), gb = localeInfo('en-GB')
  assert.deepEqual(parse('9/2/2026', us), plain(2026, 9, 2)); assert.deepEqual(parse('9/2/2026', gb), plain(2026, 2, 9))
  assert.deepEqual(parse('9/2/26', us), plain(2026, 9, 2)); assert.deepEqual(parse('2026-09-02', gb), plain(2026, 9, 2))
  assert.deepEqual(parse('22.9.2026', gb), plain(2026, 9, 22)); assert.deepEqual(parse('  22 9 2026 ', gb), plain(2026, 9, 22))
  assert.equal(parse('31/02/2026', gb), null); assert.equal(parse('13/1/2026', us), null); assert.equal(parse('9/2/026', us), null)
  assert.equal(parse('tomorrow', us), null); assert.equal(parse('', us), null); assert.equal(parse('9/2', us), null)
})
test('the end the next pick sets follows the pick rules', () => {
  const a = plain(2026, 9, 10), b = plain(2026, 9, 20)
  const none = { start: null, end: null }, open = { start: a, end: null }, full = { start: a, end: b }
  assert.equal(nextEnd(none, 'range', null), 'start'); assert.equal(nextEnd(open, 'range', null), 'end'); assert.equal(nextEnd(full, 'range', null), 'start')
  assert.equal(nextEnd(full, 'range', 'start'), 'start')                 // opened from Start: the pick is the new start
  assert.equal(nextEnd(open, 'range', 'end'), 'end'); assert.equal(nextEnd(none, 'range', 'end'), 'start') // from End with no start, the pick is the start
  assert.equal(nextEnd(none, 'single', null), 'start'); assert.equal(nextEnd(full, 'single', 'end'), 'start')
  // the rule agrees with the pick itself
  for (const [r, f] of [[none, null], [open, null], [full, null], [full, 'start'], [open, 'end'], [none, 'end']] as const) {
    const picked = pickFrom(r, plain(2026, 9, 15), 'range', f)
    assert.equal(nextEnd(r, 'range', f), picked.end ? 'end' : 'start')
  }
})
