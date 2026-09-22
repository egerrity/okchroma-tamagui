// The web calendar: a grid to the pattern (docs/date-picker.md, the contract). One tab stop
// on the focused day; arrow keys move by day and week, Page keys by month and, with Shift,
// by year, Home and End to the ends of the week; crossing a month turns the page. Two
// months side by side when the window allows, else one. The preview of a range follows
// the pointer, or the focused day when the keyboard moves it.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Paragraph, SizableText, XStack, YStack, isWeb, type TamaguiElement } from 'tamagui'
import { Button } from '../../parts.tsx'
import type { ColorFamily } from '../chip.tsx'
import { DayCell } from './DayCell.tsx'
import {
  type Bounds, type Locale, type Mode, type PlainDate, type Range, type Weekday, type Which,
  addDays, addMonths, compare, equal, formatLong, formatMonth, iso, monthGrid, outOfBounds, pickFrom, position, sameMonth, startOfMonth, startOfWeek, today as deviceToday,
} from './model.ts'

export type CalendarProps = {
  family: ColorFamily
  locale: Locale
  mode: Mode
  value: Range
  onChange: (r: Range) => void
  bounds: Bounds
  /** the id of the heading that names the grid */
  labelId: string
  /** the id of the instructions the grid is described by */
  describedById: string
  /** spoken once, politely: a month turned, a range completed */
  announce: (text: string) => void
  /** true once the calendar opened: the focused day takes focus */
  autoFocus?: boolean
  /** the field whose button opened the calendar: it opens on that end's date, and the first pick sets that end */
  from?: Which
}

const TWO_MONTHS_FROM = 640

export function Calendar({ family, locale, mode, value, onChange, bounds, labelId, describedById, announce, autoFocus, from }: CalendarProps) {
  const todayDate = useMemo(() => deviceToday(), [])
  const initial = from === 'end' ? value.end ?? value.start ?? todayDate : value.start ?? todayDate
  const [focused, setFocused] = useState<PlainDate>(initial)
  const [view, setView] = useState<PlainDate>(startOfMonth(initial))
  // the end the first pick sets, from the field that opened the calendar; the range rules take over after it
  const [armed, setArmed] = useState<Which | null>(from ?? null)
  const [hover, setHover] = useState<PlainDate | null>(null)
  const [byKeyboard, setByKeyboard] = useState(false)
  // the phone has a `window` with no size and no listeners, so the width rule is web's
  const [months, setMonths] = useState(() => (isWeb && window.innerWidth >= TWO_MONTHS_FROM ? 2 : 1))
  const cells = useRef(new Map<string, TamaguiElement>())
  const wantFocus = useRef(!!autoFocus)

  useEffect(() => {
    if (!isWeb) return
    const onResize = () => setMonths(window.innerWidth >= TWO_MONTHS_FROM ? 2 : 1)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // the focused day takes DOM focus after a keyboard move, and once on open
  useEffect(() => {
    if (!wantFocus.current) return
    wantFocus.current = false
    const el = cells.current.get(iso(focused)) as unknown as HTMLElement | undefined
    el?.focus?.()
  })

  const visible = useMemo(() => Array.from({ length: months }, (_, i) => addMonths(view, i)), [view, months])
  const shown = (p: PlainDate) => visible.some(v => sameMonth(v, p))

  const moveFocus = useCallback((next: PlainDate) => {
    setFocused(next)
    setByKeyboard(true)
    wantFocus.current = true
    if (!shown(next)) {
      setView(startOfMonth(next))
      announce(formatMonth(next, locale))
    }
  }, [visible, locale, announce])

  const turn = (n: number) => {
    const next = addMonths(view, n)
    setView(next)
    announce(months === 2 ? `${formatMonth(next, locale)} and ${formatMonth(addMonths(next, 1), locale)}` : formatMonth(next, locale))
    if (!sameMonth(focused, next) && !(months === 2 && sameMonth(focused, addMonths(next, 1)))) setFocused({ ...next, d: Math.min(focused.d, 28) })
  }

  const onKeyDown = (e: any) => {
    const k: string = e.key
    let next: PlainDate | null = null
    if (k === 'ArrowLeft') next = addDays(focused, -1)
    else if (k === 'ArrowRight') next = addDays(focused, 1)
    else if (k === 'ArrowUp') next = addDays(focused, -7)
    else if (k === 'ArrowDown') next = addDays(focused, 7)
    else if (k === 'Home') next = startOfWeek(focused, locale.firstDay)
    else if (k === 'End') next = addDays(startOfWeek(focused, locale.firstDay), 6)
    else if (k === 'PageUp') next = addMonths(focused, e.shiftKey ? -12 : -1)
    else if (k === 'PageDown') next = addMonths(focused, e.shiftKey ? 12 : 1)
    if (!next) return
    e.preventDefault()
    moveFocus(next)
  }

  const choose = (day: PlainDate) => {
    const next = pickFrom(value, day, mode, armed)
    setArmed(null)
    onChange(next)
    setFocused(day)
    if (next.start && next.end) announce(mode === 'single' ? `Selected ${formatLong(next.start, locale)}` : `Selected ${formatLong(next.start, locale)} to ${formatLong(next.end, locale)}`)
    else if (next.start) announce(`Start ${formatLong(next.start, locale)}. Choose the end.`)
  }

  const preview = mode === 'range' && value.start && !value.end ? (hover ?? (byKeyboard ? focused : null)) : null
  const weekdays: Weekday[] = Array.from({ length: 7 }, (_, i) => ((locale.firstDay + i) % 7) as Weekday)

  return (
    <YStack gap="$3">
      <XStack alignItems="center" justifyContent="space-between">
        <Button size="$sm" theme="neutral_hint" aria-label="Previous month" onPress={() => turn(-1)}>{'‹'}</Button>
        <Paragraph id={labelId} fontWeight="500" aria-live="off">
          {visible.map(v => formatMonth(v, locale)).join(' – ')}
        </Paragraph>
        <Button size="$sm" theme="neutral_hint" aria-label="Next month" onPress={() => turn(1)}>{'›'}</Button>
      </XStack>
      <XStack gap="$6" flexWrap="wrap" role="grid" aria-labelledby={labelId} aria-describedby={describedById} aria-multiselectable={mode === 'range'} onKeyDown={onKeyDown} onMouseLeave={() => setHover(null)}>
        {visible.map(month => (
          <YStack key={iso(month)} role="rowgroup">
            <XStack role="row">
              {weekdays.map(w => (
                <YStack key={w} role="columnheader" aria-label={locale.weekdaysLong[w]} width="$sm" height="$xs" alignItems="center" justifyContent="center">
                  <SizableText size="$xs" color="$neutral-pencil-47" aria-hidden>{locale.weekdaysShort[w]}</SizableText>
                </YStack>
              ))}
            </XStack>
            {monthGrid(month.y, month.m, locale.firstDay).map((row, r) => (
              <XStack key={r} role="row">
                {row.map((day, c) => {
                  // the grid's cell role is not in the kit's role union, though the DOM knows it
                  if (!day) return <YStack key={c} role={'gridcell' as any} width="$sm" height="$sm" />
                  const pos = position(value, day, preview)
                  const isToday = equal(day, todayDate)
                  const off = outOfBounds(day, bounds) !== null
                  const isFocused = equal(day, focused)
                  const state = [pos === 'single' ? 'selected' : pos === 'start' ? 'start of range' : pos === 'end' ? 'end of range' : pos === 'inside' ? 'in range' : pos === 'preview' ? 'would be in range' : null, isToday ? 'today' : null, off ? 'unavailable' : null].filter(Boolean).join(', ')
                  return (
                    <YStack key={c} role={'gridcell' as any} aria-selected={pos === 'start' || pos === 'end' || pos === 'single' || pos === 'inside' ? true : undefined}>
                      <DayCell
                        family={family}
                        ref={(el: TamaguiElement | null) => { if (el) cells.current.set(iso(day), el); else cells.current.delete(iso(day)) }}
                        place={pos}
                        today={isToday}
                        unavailable={off}
                        tabIndex={isFocused ? 0 : -1}
                        aria-label={state ? `${formatLong(day, locale)}, ${state}` : formatLong(day, locale)}
                        aria-current={isToday ? 'date' : undefined}
                        onPress={() => { if (!off) choose(day) }}
                        {...({ onHoverIn: () => { setHover(day); setByKeyboard(false) } } as object)}
                        onFocus={() => setFocused(day)}
                      >
                        {String(day.d)}
                      </DayCell>
                    </YStack>
                  )
                })}
              </XStack>
            ))}
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}
