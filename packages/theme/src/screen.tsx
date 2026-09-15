// The exhibit's screen (docs/exhibit.md): one account form, rendered by both apps from
// this file. Every color arrives through the theme prop or a `$` reference to a theme key;
// nothing is tuned here.
import { useRef, useState } from 'react'
import { Card, Dialog, H2, Label, Paragraph, XStack, YStack, type TamaguiElement } from 'tamagui'
import { Button, Input } from './parts.tsx'

export function Screen() {
  // The dialog is controlled and opened by a real Button, so keyboard activation is the
  // browser's own; the kit's Dialog.Trigger with asChild renders its child as a span with a
  // button role instead. On close the kit focuses its trigger ref, which nothing sets here,
  // so the close handler returns focus to the button itself (decision 17).
  const [open, setOpen] = useState(false)
  const opener = useRef<TamaguiElement>(null)
  return (
    <YStack gap="$4" padding="$4" maxWidth={560} width="100%">
      <H2>Account</H2>
      <Paragraph>
        Update the name on this account and the address that receives its mail. Changes
        apply the next time you sign in.
      </Paragraph>

      <Card padding="$4" gap="$4" backgroundColor="$surface-mid" borderWidth={1} borderColor="$neutral-chalk-11" borderRadius="$4">
        <YStack gap="$2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" />
        </YStack>
        <YStack gap="$2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" theme="critical" defaultValue="not an address" aria-invalid />
          <Paragraph theme="critical_hint" size="$3">Enter an email address.</Paragraph>
        </YStack>
      </Card>

      <XStack gap="$3" flexWrap="wrap">
        <Button theme="brand_solid">Save</Button>
        <Button theme="brand-alt_solid">Preview</Button>
        <Button theme="neutral_subtle">Cancel</Button>
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
            <Dialog.Title size="$7">Delete this account?</Dialog.Title>
            <Dialog.Description>
              The account and its mail are removed. This cannot be undone.
            </Dialog.Description>
            <XStack gap="$3" justifyContent="flex-end">
              <Dialog.Close asChild>
                <Button theme="neutral_subtle">Keep it</Button>
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
