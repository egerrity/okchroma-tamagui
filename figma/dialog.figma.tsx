import figma from '@figma/code-connect/react'
import { Dialog } from 'tamagui'
import { Button } from '@poc/theme/parts'

// The Dialog: overlay on the scrim, panel on surface-high. The theme's DialogOverlay and
// DialogContent sub-themes color the kit's parts; nothing is set on the screen.
figma.connect(Dialog, 'https://www.figma.com/design/FILE_KEY?node-id=DIALOG', {
  props: { open: figma.boolean('Open') },
  example: ({ open }) => (
    <Dialog modal open={open}>
      <Dialog.Portal>
        <Dialog.Overlay transition="quick" />
        <Dialog.Content transition="quick">
          <Dialog.Title>Delete this account?</Dialog.Title>
          <Dialog.Description>The account and its mail are removed.</Dialog.Description>
          <Dialog.Close asChild="except-style">
            <Button theme="critical_solid">Delete</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  ),
})
