// The native calendar: the system's inline date picker for the end being chosen, since touch
// and VoiceOver are tuned for it (decision 32). The picker takes one color, its tint, and
// draws a selected day as tint-colored text on a wash of the tint, and a selected day that
// is also today as a label on a solid circle of the tint; that label is white on a dark
// tint and flips to black on a light one. The tint is the family's pen-70: a text stop, so
// it reads on the plane in both modes; dark enough in light to hold white; light enough in
// dark, in every brand and family, to flip the label (docs/date-picker.md). The check's
// rule E holds the ratios. The range rules are the model's.
import DateTimePicker from '@react-native-community/datetimepicker'
import { useMemo } from 'react'
import { Paragraph, YStack, useTheme, useThemeName } from 'tamagui'
import type { ColorFamily } from '../chip.tsx'
import { type Bounds, type Locale, type Mode, type Range, formatLong, fromLocalDate, pick, toLocalDate, today as deviceToday } from './model.ts'

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
}

/** the picker's tint: the family's pen-70, the same stop in both modes (docs/date-picker.md) */
export const tintName = (family: ColorFamily) => `${family}-pen-70`

export function Calendar({ family, locale, mode, value, onChange, bounds }: CalendarProps) {
  const theme = useTheme()
  const scheme = useThemeName().startsWith('dark') ? 'dark' : 'light'
  const tint = (theme as any)[tintName(family)]?.val as string | undefined
  const todayDate = useMemo(() => deviceToday(), [])
  const choosingEnd = mode === 'range' && !!value.start && !value.end
  const shown = choosingEnd ? value.start! : value.end ?? value.start ?? todayDate
  return (
    <YStack gap="$2">
      <Paragraph size="$sm">
        {mode === 'single'
          ? value.start ? `Chosen: ${formatLong(value.start, locale)}` : 'Choose a date'
          : choosingEnd ? `Start ${formatLong(value.start!, locale)}. Choose the end.` : value.start && value.end ? `${formatLong(value.start, locale)} to ${formatLong(value.end, locale)}. Choose a day to start again.` : 'Choose the start'}
      </Paragraph>
      <DateTimePicker
        value={toLocalDate(shown)}
        mode="date"
        display="inline"
        accentColor={tint}
        themeVariant={scheme}
        locale={locale.tag}
        minimumDate={bounds.min ? toLocalDate(bounds.min) : undefined}
        maximumDate={bounds.max ? toLocalDate(bounds.max) : undefined}
        onChange={(_event, date) => { if (date) onChange(pick(value, fromLocalDate(date), mode)) }}
      />
    </YStack>
  )
}
