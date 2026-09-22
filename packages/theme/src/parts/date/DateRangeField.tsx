// The date range picker, input first (decision 32, docs/date-picker.md): two labelled
// fields with the format beside them, the presets as button chips, and the calendar as an
// aid behind a button, never required and never opened by focus. The fields parse in the
// locale's order and report a problem on the field it belongs to. The calendar is a dialog;
// what it holds differs by platform (Calendar.tsx, Calendar.native.tsx).
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, Label, Paragraph, SizableText, XStack, YStack, isWeb, type TamaguiElement } from 'tamagui'
import { Button, Chip, Input } from '../../parts.tsx'
import type { ColorFamily } from '../chip.tsx'
import { Calendar } from './Calendar'
import {
  type Bounds, type Mode, type PlainDate, type Problem, type Range,
  EMPTY, formatField, formatLong, formatShort, localeInfo, parse, presets as presetsFor, sameRange, setEnd, today as deviceToday, validate,
} from './model.ts'

export type DateRangeFieldProps = {
  /** the root of every id the field's parts carry */
  id: string
  /** the group's name, read before the fields */
  label: string
  family?: ColorFamily
  mode?: Mode
  value: Range
  onChange: (r: Range) => void
  bounds?: Bounds
  /** a locale tag; the device's when absent */
  locale?: string
  /** the preset periods, on by default for a range */
  presets?: boolean
}
type Which = 'start' | 'end'

export function DateRangeField({ id, label, family = 'brand', mode = 'range', value, onChange, bounds = {}, locale: tag, presets = true }: DateRangeFieldProps) {
  const loc = useMemo(() => localeInfo(tag), [tag])
  const todayDate = useMemo(() => deviceToday(), [])
  const presetList = useMemo(() => presetsFor(todayDate), [todayDate])
  const [text, setText] = useState({ start: value.start ? formatField(value.start, loc) : '', end: value.end ? formatField(value.end, loc) : '' })
  const [parsedOk, setParsedOk] = useState({ start: true, end: true })
  const [problems, setProblems] = useState<{ start?: Problem; end?: Problem }>({})
  const [open, setOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const opener = useRef<TamaguiElement>(null)

  // a value set by the calendar or a preset writes the fields in the canonical form
  useEffect(() => {
    setText({ start: value.start ? formatField(value.start, loc) : '', end: value.end ? formatField(value.end, loc) : '' })
    setParsedOk({ start: true, end: true })
    setProblems(validate(value, { start: true, end: true }, bounds))
  }, [value.start, value.end, loc])

  const announce = (t: string) => setAnnouncement(prev => (prev === t ? t + '​' : t))

  const commit = (which: Which) => {
    const raw = text[which]
    const parsed: PlainDate | null = raw.trim() ? parse(raw, loc) : null
    const ok = !raw.trim() || parsed !== null
    const okNow = { ...parsedOk, [which]: ok }
    setParsedOk(okNow)
    const next = ok ? setEnd(value, which, parsed) : value
    setProblems(validate(next, okNow, bounds))
    if (ok && !sameRange(next, value)) onChange(next)
  }

  const message = (p: Problem): string =>
    p === 'format' ? `Enter a date as ${loc.pattern}`
    : p === 'before-min' ? `Enter a date on or after ${formatShort(bounds.min!, loc)}`
    : p === 'after-max' ? `Enter a date on or before ${formatShort(bounds.max!, loc)}`
    : `Enter an end on or after the start, ${formatShort(value.start!, loc)}`

  const choose = (r: Range) => {
    onChange(r)
    if (r.start && r.end) announce(mode === 'single' ? `Selected ${formatLong(r.start, loc)}` : `Selected ${formatLong(r.start, loc)} to ${formatLong(r.end, loc)}`)
  }

  const legendId = `${id}-legend`, hintId = `${id}-format`, monthId = `${id}-month`, instructionsId = `${id}-instructions`
  const field = (which: Which) => {
    const fieldId = `${id}-${which}`, errorId = `${id}-${which}-error`
    const problem = problems[which]
    return (
      <YStack key={which} gap="$2" flex={1} minWidth={150}>
        <Label htmlFor={fieldId} size="$sm" lineHeight="$sm">{mode === 'single' ? 'Date' : which === 'start' ? 'Start' : 'End'}</Label>
        <Input
          id={fieldId}
          value={text[which]}
          onChangeText={(t: string) => setText(s => ({ ...s, [which]: t }))}
          onBlur={() => commit(which)}
          onSubmitEditing={() => commit(which)}
          theme={problem ? 'critical' : undefined}
          aria-invalid={problem ? true : undefined}
          aria-describedby={[hintId, problem ? errorId : null].filter(Boolean).join(' ')}
          inputMode="numeric"
          autoComplete="off"
          placeholder={loc.pattern}
        />
        {problem && <Paragraph id={errorId} theme="critical_hint" size="$sm">{message(problem)}</Paragraph>}
      </YStack>
    )
  }

  return (
    <YStack gap="$3" role="group" aria-labelledby={legendId}>
      <YStack gap="$1">
        <Paragraph id={legendId} size="$sm" fontWeight="500">{label}</Paragraph>
        <SizableText id={hintId} size="$xs" color="$neutral-pencil-47">Format {loc.pattern}</SizableText>
      </YStack>
      <XStack gap="$3" flexWrap="wrap" alignItems="flex-start">
        {field('start')}
        {mode === 'range' && field('end')}
        <YStack gap="$2">
          <SizableText size="$sm" lineHeight="$sm" aria-hidden opacity={0}>{'​'}</SizableText>
          <Button ref={opener} theme="neutral_outline" onPress={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
            Calendar
          </Button>
        </YStack>
      </XStack>
      {presets && mode === 'range' && (
        <XStack gap="$2" flexWrap="wrap">
          {presetList.map(p => (
            <Chip key={p.key} family={family} selected={sameRange(value, p.range)} aria-pressed={sameRange(value, p.range)} onPress={() => choose(p.range)}>
              {p.label}
            </Chip>
          ))}
        </XStack>
      )}
      {isWeb && (
        <SizableText aria-live="polite" aria-atomic position="absolute" width={1} height={1} overflow="hidden" opacity={0}>
          {announcement}
        </SizableText>
      )}
      <Dialog modal open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" transition="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <Dialog.Content
            key="content"
            transition="quick"
            gap="$4"
            maxWidth="94%"
            enterStyle={{ opacity: 0, y: 8 }}
            exitStyle={{ opacity: 0, y: 8 }}
            // on web the calendar focuses its day; on close, focus returns to the button that opened it (decision 17)
            onOpenAutoFocus={event => { if (isWeb) event.preventDefault() }}
            onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus?.() }}
          >
            <Dialog.Title size="$5">{mode === 'single' ? 'Choose a date' : 'Choose a period'}</Dialog.Title>
            <Dialog.Description size="$sm">{mode === 'single' ? 'Or type the date in the field.' : 'Or type the dates in the fields.'}</Dialog.Description>
            <Paragraph id={instructionsId} size="$sm">
              {isWeb
                ? mode === 'single'
                  ? 'Arrow keys move between days, Page Up and Page Down between months, Home and End to the ends of the week. Enter chooses. Escape closes.'
                  : 'Arrow keys move between days, Page Up and Page Down between months, Home and End to the ends of the week. Enter chooses the start, then the end. Escape closes.'
                : mode === 'single' ? 'Choose a day.' : 'Choose the start, then the end.'}
            </Paragraph>
            <Calendar family={family} locale={loc} mode={mode} value={value} onChange={choose} bounds={bounds} labelId={monthId} describedById={instructionsId} announce={announce} autoFocus={isWeb} />
            <XStack gap="$3" justifyContent="flex-end">
              <Button theme="neutral_hint" onPress={() => choose(EMPTY)}>Clear</Button>
              <Dialog.Close asChild>
                <Button theme="neutral_solid">Done</Button>
              </Dialog.Close>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
