// The native calendar: the system's inline date picker for the end being chosen, since touch
// and VoiceOver are tuned for it (decision 32). The picker takes one color, its tint, and
// draws a selected day as tint-colored text on a wash of the tint, and a selected day that
// is also today as a label on a solid circle of the tint; that label is white on a dark
// tint and black on a light one, by the system's own luma rule (decision 33). The tint is
// the family's pen-70: a text stop, so it reads on the plane in both modes; dark enough in
// light to hold white; light enough in dark, in every brand and family, to flip the label
// (docs/date-picker.md). The check's rule E holds the ratios and the margin from the rule's
// line. The range rules are the model's.
import DateTimePicker from '@react-native-community/datetimepicker'
import { useMemo } from 'react'
import { Paragraph, YStack, useTheme, useThemeName } from 'tamagui'
import type { ColorFamily } from '../chip.tsx'
import { type Bounds, type Locale, type Mode, type Range, type Which, formatLong, fromLocalDate, pickFrom, toLocalDate, today as deviceToday } from './model.ts'

export type CalendarProps = {
  family: ColorFamily
  locale: Locale
  mode: Mode
  value: Range
  onChange: (r: Range) => void
  bounds: Bounds
  labelId: string
  describedById: string
  announce: (text: string) => void
  autoFocus?: boolean
  /** the field whose button opened the calendar, until its pick: the picker opens on that end's date, and the pick sets that end */
  from?: Which | null
}

/** the picker's tint: the family's pen-70, the same stop in both modes (docs/date-picker.md) */
export const tintName = (family: ColorFamily) => `${family}-pen-70`

export function Calendar({ family, locale, mode, value, onChange, bounds, from }: CalendarProps) {
  const theme = useTheme()
  const scheme = useThemeName().startsWith('dark') ? 'dark' : 'light'
  const tint = (theme as any)[tintName(family)]?.val as string | undefined
  const todayDate = useMemo(() => deviceToday(), [])
  const choosingEnd = mode === 'range' && !!value.start && !value.end
  const shown = from === 'end' ? value.end ?? value.start ?? todayDate : value.start ?? todayDate
  // what is set so far; the dialog's heading says which end the next pick sets
  const status =
    mode === 'single'
      ? value.start ? `Chosen: ${formatLong(value.start, locale)}` : ''
      : choosingEnd ? `Start ${formatLong(value.start!, locale)}.` : value.start && value.end ? `${formatLong(value.start, locale)} to ${formatLong(value.end, locale)}.` : ''
  return (
    <YStack gap="$2">
      {status ? <Paragraph size="$sm">{status}</Paragraph> : null}
      <DateTimePicker
        value={toLocalDate(shown)}
        mode="date"
        display="inline"
        accentColor={tint}
        themeVariant={scheme}
        locale={locale.tag}
        minimumDate={bounds.min ? toLocalDate(bounds.min) : undefined}
        maximumDate={bounds.max ? toLocalDate(bounds.max) : undefined}
        onChange={(_event, date) => { if (date) onChange(pickFrom(value, fromLocalDate(date), mode, from ?? null)) }}
      />
    </YStack>
  )
}
