// Containers: the page and its planes, body text, decorative edges, the focus ring, the
// shadow, and the dialog's parts. Every value is an engine token name; build.ts resolves
// each per mode. The base theme is the outermost container: what the kit reads on
// anything not given a sub-theme.
import { type KeyMap, same, BORDER_KEYS, COLOR_KEYS } from './keys.ts'

/** the base theme, `light` and `dark` */
export const BASE: KeyMap = {
  background: 'surface-low',
  backgroundHover: 'neutral-hint-bg-hover',
  backgroundPress: 'neutral-hint-bg-pressed',
  backgroundFocus: 'neutral-hint-bg-enabled',
  ...same(COLOR_KEYS, 'neutral-pen-70'),
  placeholderColor: 'neutral-pencil-47',
  ...same(BORDER_KEYS, 'neutral-chalk-11'),
  outlineColor: 'neutral-highlighter-26',
  shadowColor: 'shadow-08',
}

/** `DialogOverlay` and `DialogContent`: the kit's named dialog parts, which read `$background` */
export const DIALOG: Readonly<Record<'DialogOverlay' | 'DialogContent', KeyMap>> = {
  DialogOverlay: { background: 'scrim' },
  DialogContent: { background: 'surface-high', borderColor: 'neutral-chalk-11', shadowColor: 'shadow-08' },
}
