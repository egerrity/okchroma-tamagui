// The exhibit's screen (docs/exhibit.md): one account form, rendered by both apps from
// this file. Every color arrives through the theme prop or a `$` reference to a theme key;
// nothing is tuned here.
import { useMemo, useRef, useState } from 'react'
import { Card, Dialog, H2, Label, Paragraph, XStack, YStack, type TamaguiElement } from 'tamagui'
import { Button, Chip, DateRangeField, IndicatorChip, Input } from './parts.tsx'
import { EMPTY, today, type Range } from './parts/date/index.ts'
import type { CalendarAid } from './parts/date/DateRangeField.tsx'
export type { CalendarAid }

/** `aid`: the native calendar aid, the PoC's grid or the system picker (decision 37); web ignores it */
export function Screen({ aid }: { aid?: CalendarAid } = {}) {
  // The dialog is controlled and opened by a real Button, so keyboard activation is the
  // browser's own; the kit's Dialog.Trigger with asChild renders its child as a span with a
  // button role instead. On close the kit focuses its trigger ref, which nothing sets here,
  // so the close handler returns focus to the button itself (decision 17).
  const [open, setOpen] = useState(false)
  const opener = useRef<TamaguiElement>(null)
  // a multi-filter group of button chips: each one toggles on its own
  const [active, setActive] = useState<Set<string>>(() => new Set(['all']))
  const toggle = (key: string) => setActive(f => { const n = new Set(f); n.has(key) ? n.delete(key) : n.add(key); return n })
  const filters = [['all', 'All'], ['unread', 'Unread'], ['flagged', 'Flagged']] as const
  // the statement period: a range that ends no later than today (docs/date-picker.md)
  const [period, setPeriod] = useState<Range>(EMPTY)
  const bounds = useMemo(() => ({ max: today() }), [])
  return (
    <YStack gap="$4" padding="$4" maxWidth={720} width="100%">
      <H2>Account</H2>
      <Paragraph>
        Update the name on this account and the address that receives its mail. Changes
        apply the next time you sign in.
      </Paragraph>

      <XStack gap="$2" flexWrap="wrap" alignItems="center">
        {filters.map(([key, label]) => (
          <Chip key={key} family="brand" selected={active.has(key)} aria-pressed={active.has(key)} onPress={() => toggle(key)}>
            {active.has(key) ? `\u2713 ${label}` : label}
          </Chip>
        ))}
      </XStack>

      <XStack gap="$2" flexWrap="wrap" alignItems="center">
        <IndicatorChip theme="positive_indicator-strong"><IndicatorChip.Text>Paid</IndicatorChip.Text></IndicatorChip>
        <IndicatorChip theme="warning_indicator-strong"><IndicatorChip.Text>Pending</IndicatorChip.Text></IndicatorChip>
        <IndicatorChip theme="critical_indicator-strong"><IndicatorChip.Text>Failed</IndicatorChip.Text></IndicatorChip>
        <IndicatorChip theme="brand_indicator-strong" size="xxs"><IndicatorChip.Text>New</IndicatorChip.Text></IndicatorChip>
        <IndicatorChip theme="neutral_indicator-default" size="xxs"><IndicatorChip.Text>Draft</IndicatorChip.Text></IndicatorChip>
      </XStack>

      <Card padding="$4" gap="$4" backgroundColor="$surface-mid" borderWidth={1} borderColor="$neutral-chalk-11" borderRadius="$md">
        <YStack gap="$2">
          <Label htmlFor="name" size="$sm" lineHeight="$sm">Name</Label>
          <Input id="name" placeholder="Your name" />
        </YStack>
        <YStack gap="$2">
          <Label htmlFor="email" size="$sm" lineHeight="$sm">Email</Label>
          <Input id="email" theme="critical" defaultValue="not an address" aria-invalid />
          <Paragraph theme="critical_hint" size="$sm">Enter an email address.</Paragraph>
        </YStack>
        <DateRangeField id="period" label="Statement period" family="brand" value={period} onChange={setPeriod} bounds={bounds} aid={aid} />
      </Card>

      <XStack gap="$3" flexWrap="wrap">
        <Button theme="brand_solid">Save</Button>
        <Button theme="brand-alt_solid">Preview</Button>
        <Button theme="neutral_solid">Go back</Button>
        <Button theme="critical_solid">Cancel</Button>
        <Button theme="brand_outline">Learn more</Button>
        <Button theme="brand_solid" disabled>Saved</Button>
      </XStack>

      <Button ref={opener} theme="critical_hint" alignSelf="flex-start" onPress={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        Delete account
      </Button>
      <Dialog modal open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" transition="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <Dialog.Content
            key="content"
            transition="quick"
            gap="$4"
            width={360}
            maxWidth="90%"
            enterStyle={{ opacity: 0, y: 8 }}
            exitStyle={{ opacity: 0, y: 8 }}
            onCloseAutoFocus={event => {
              event.preventDefault()
              opener.current?.focus?.()
            }}
          >
            <Dialog.Title size="$5">Delete this account?</Dialog.Title>
            <Dialog.Description>
              The account and its mail are removed. This cannot be undone.
            </Dialog.Description>
            <XStack gap="$3" justifyContent="flex-end">
              <Dialog.Close asChild>
                <Button theme="neutral_solid">Keep it</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button theme="critical_solid">Delete</Button>
              </Dialog.Close>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
