// The date range picker, input first (decision 32, docs/date-picker.md): two labelled
// fields with the format beside them, each with its calendar button attached to its
// trailing edge (decision 35), the presets as button chips, and the calendar as an aid
// behind those buttons, never required and never opened by focus. The fields parse in the
// locale's order and report a problem on the field it belongs to. The calendar is a dialog
// by role; on web it is a popover anchored to the button that opened it, not modal, with no
// scrim (decision 34), on native the kit's dialog. What it holds differs by platform too
// (Calendar.tsx, Calendar.native.tsx).
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, H2, Label, Paragraph, Popover, SizableText, XStack, YStack, isWeb, type TamaguiElement } from 'tamagui'
import { Button, Chip, Input } from '../../parts.tsx'
import type { ColorFamily } from '../chip.tsx'
import { Calendar } from './Calendar'
import {
  type Bounds, type Mode, type PlainDate, type Problem, type Range, type Which,
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

/** the calendar glyph on a field's button, drawn in the theme's text color so it needs no icon set */
function CalendarGlyph() {
  return (
    <YStack width={16} height={16} borderWidth={1.5} borderColor="$color" borderRadius={3} overflow="hidden" aria-hidden>
      <YStack height={4} backgroundColor="$color" />
      <XStack flex={1} alignItems="center" justifyContent="center" gap={2}>
        <YStack width={3} height={3} borderRadius={1} backgroundColor="$color" />
        <YStack width={3} height={3} borderRadius={1} backgroundColor="$color" />
        <YStack width={3} height={3} borderRadius={1} backgroundColor="$color" />
      </XStack>
    </YStack>
  )
}

export function DateRangeField({ id, label, family = 'brand', mode = 'range', value, onChange, bounds = {}, locale: tag, presets = true }: DateRangeFieldProps) {
  const loc = useMemo(() => localeInfo(tag), [tag])
  const todayDate = useMemo(() => deviceToday(), [])
  const presetList = useMemo(() => presetsFor(todayDate), [todayDate])
  const [text, setText] = useState({ start: value.start ? formatField(value.start, loc) : '', end: value.end ? formatField(value.end, loc) : '' })
  const [parsedOk, setParsedOk] = useState({ start: true, end: true })
  const [problems, setProblems] = useState<{ start?: Problem; end?: Problem }>({})
  // the field whose button opened the calendar, or none
  const [open, setOpen] = useState<Which | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const startOpener = useRef<TamaguiElement>(null), endOpener = useRef<TamaguiElement>(null)
  const openerOf = (which: Which) => (which === 'start' ? startOpener : endOpener)
  // the button the calendar was last opened from: focus returns to it on close
  const lastOpened = useRef<Which>('start')
  // the control a press outside the popover went to, when that press closed it: focus lands there, not on the button
  const pressedOutside = useRef<HTMLElement | null>(null)

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

  const openFrom = (which: Which) => { lastOpened.current = which; setOpen(which) }

  const legendId = `${id}-legend`, hintId = `${id}-format`, monthId = `${id}-month`, instructionsId = `${id}-instructions`
  const titleId = `${id}-title`, descriptionId = `${id}-description`
  const title = mode === 'single' ? 'Choose a date' : 'Choose a period'
  const description = mode === 'single' ? 'Or type the date in the field.' : 'Or type the dates in the fields.'
  const instructions = isWeb
    ? mode === 'single'
      ? 'Arrow keys move between days, Page Up and Page Down between months, Home and End to the ends of the week. Enter chooses. Escape closes.'
      : 'Arrow keys move between days, Page Up and Page Down between months, Home and End to the ends of the week. Enter chooses the start, then the end. Escape closes.'
    : mode === 'single' ? 'Choose a day.' : 'Choose the start, then the end.'
  const endName = (which: Which) => (mode === 'single' ? 'date' : which === 'start' ? 'start date' : 'end date')
  // the button's name says what it does and, once a date is set, confirms it
  const buttonName = (which: Which) => (value[which] ? `Change ${endName(which)}, ${formatLong(value[which]!, loc)}` : `Choose ${endName(which)}`)

  // the panel's width is the calendar's: the instructions take no width of their own and stretch to it
  const body = (which: Which, done: React.ReactNode) => (
    <>
      <Paragraph id={instructionsId} size="$sm" {...(isWeb ? { width: 0, minWidth: '100%' } : {})}>{instructions}</Paragraph>
      <Calendar family={family} locale={loc} mode={mode} value={value} onChange={choose} bounds={bounds} labelId={monthId} describedById={instructionsId} announce={announce} autoFocus={isWeb} from={which} />
      <XStack gap="$3" justifyContent="flex-end">
        <Button theme="neutral_hint" onPress={() => choose(EMPTY)}>Clear</Button>
        {done}
      </XStack>
    </>
  )

  // The field's calendar button, attached to its trailing edge: square where they meet, the
  // field's corner outside, one shared edge, the theme's text color for the glyph. On web the
  // name also shows as a tooltip on hover.
  const calendarButton = (which: Which) => (
    <Button
      ref={openerOf(which)}
      theme="neutral_outline"
      aria-label={buttonName(which)}
      aria-haspopup="dialog"
      aria-expanded={open === which}
      onPress={() => openFrom(which)}
      minWidth={0}
      paddingHorizontal="$3"
      borderTopLeftRadius={0}
      borderBottomLeftRadius={0}
      borderTopRightRadius="$true"
      borderBottomRightRadius="$true"
      marginLeft={-1}
      {...((isWeb ? { title: buttonName(which) } : {}) as object)}
    >
      <CalendarGlyph />
    </Button>
  )

  // The web container. The popover root holds only the field's button, so a press anywhere
  // else in the field is outside it and closes the calendar. The dialog role and its names
  // go on one element of ours, the panel, because the kit's content passes a role to two
  // nested elements; the popper's own is stripped once mounted.
  const popoverFrom = (which: Which) => (
    <Popover open={open === which} onOpenChange={o => (o ? openFrom(which) : setOpen(null))} placement="bottom-start" offset={8} allowFlip stayInFrame={{ padding: 8, crossAxis: true }}>
      <Popover.Anchor asChild>{calendarButton(which)}</Popover.Anchor>
      <Popover.Content
        unstyled
        trapFocus
        transition="quick"
        enterStyle={{ opacity: 0, y: 8 }}
        exitStyle={{ opacity: 0, y: 8 }}
        // the calendar focuses its day; on close, focus returns to the button that opened it (decision 17),
        // or to the control an outside press went to, since the trap holds focus until the panel is gone
        onOpenAutoFocus={event => event.preventDefault()}
        onInteractOutside={event => { const target = (event as unknown as { detail?: { originalEvent?: Event } }).detail?.originalEvent?.target as HTMLElement | null; pressedOutside.current = target?.closest?.('input,button,a,[tabindex]') ?? null }}
        onCloseAutoFocus={event => { event.preventDefault(); const pressed = pressedOutside.current; pressedOutside.current = null; ((pressed as unknown as TamaguiElement | null) ?? openerOf(which).current)?.focus?.() }}
      >
        <YStack
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          ref={(el: TamaguiElement | null) => { (el as unknown as HTMLElement | null)?.parentElement?.closest('[role=dialog]')?.removeAttribute('role') }}
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$true"
          padding="$true"
          elevation="$true"
          gap="$4"
          // the popper writes the room it has into a variable; a window too short for the months scrolls the panel instead of losing it
          {...({ maxWidth: '94vw', maxHeight: 'var(--tamagui-popper-available-height)', overflow: 'auto' } as object)}
        >
          <H2 id={titleId} size="$5">{title}</H2>
          <Paragraph id={descriptionId} size="$sm">{description}</Paragraph>
          {body(which, <Button theme="neutral_solid" onPress={() => setOpen(null)}>Done</Button>)}
        </YStack>
      </Popover.Content>
    </Popover>
  )

  const field = (which: Which) => {
    const fieldId = `${id}-${which}`, errorId = `${id}-${which}-error`
    const problem = problems[which]
    return (
      <YStack key={which} gap="$2" flex={1} minWidth={200}>
        <Label htmlFor={fieldId} size="$sm" lineHeight="$sm">{mode === 'single' ? 'Date' : which === 'start' ? 'Start' : 'End'}</Label>
        <XStack alignItems="stretch">
          <Input
            id={fieldId}
            flex={1}
            minWidth={0}
            borderTopRightRadius={0}
            borderBottomRightRadius={0}
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
          {isWeb ? popoverFrom(which) : calendarButton(which)}
        </XStack>
        {problem && <Paragraph id={errorId} theme="critical_hint" size="$sm">{message(problem)}</Paragraph>}
      </YStack>
    )
  }

  const group = (
    <YStack gap="$3" role="group" aria-labelledby={legendId}>
      <YStack gap="$1">
        <Paragraph id={legendId} size="$sm" fontWeight="500">{label}</Paragraph>
        <SizableText id={hintId} size="$xs" color="$neutral-pencil-47">Format {loc.pattern}</SizableText>
      </YStack>
      <XStack gap="$3" flexWrap="wrap" alignItems="flex-start">
        {field('start')}
        {mode === 'range' && field('end')}
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
    </YStack>
  )
  if (!isWeb)
    return (
      <>
        {group}
        <Dialog modal open={open !== null} onOpenChange={o => { if (!o) setOpen(null) }}>
          <Dialog.Portal>
            <Dialog.Overlay key="overlay" transition="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
            <Dialog.Content
              key="content"
              transition="quick"
              gap="$4"
              maxWidth="94%"
              enterStyle={{ opacity: 0, y: 8 }}
              exitStyle={{ opacity: 0, y: 8 }}
              // on close, focus returns to the button that opened it (decision 17)
              onCloseAutoFocus={event => { event.preventDefault(); openerOf(lastOpened.current).current?.focus?.() }}
            >
              <Dialog.Title size="$5">{title}</Dialog.Title>
              <Dialog.Description size="$sm">{description}</Dialog.Description>
              {body(
                lastOpened.current,
                <Dialog.Close asChild>
                  <Button theme="neutral_solid">Done</Button>
                </Dialog.Close>,
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </>
    )
  return group
}
