// Code: packages/theme/src/screen.tsx (the dialog). Figma: the Dialog component on the
// print page. Colors come from the DialogOverlay and DialogContent sub-themes; nothing is
// set on the screen. The dialog is controlled and opened by a real Button (decision 17).
import { useRef, useState } from 'react'
import { Dialog, type TamaguiElement } from 'tamagui'
import { Button } from '@poc/theme/parts'

export const Example = () => {
  const [open, setOpen] = useState(false)
  const opener = useRef<TamaguiElement>(null)
  return (
    <>
      <Button ref={opener} theme="critical_hint" onPress={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        Delete account
      </Button>
      <Dialog modal open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay transition="quick" />
          <Dialog.Content transition="quick" onCloseAutoFocus={e => { e.preventDefault(); opener.current?.focus?.() }}>
            <Dialog.Title>Delete this account?</Dialog.Title>
            <Dialog.Description>The account and its mail are removed.</Dialog.Description>
            <Dialog.Close asChild="except-style">
              <Button theme="critical_solid">Delete</Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}
