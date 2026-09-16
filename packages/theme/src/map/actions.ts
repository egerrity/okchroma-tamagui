// Actions: the family edge themes and the four tiers a control takes. `<family>` is the
// family's slug and `<tint>` the name the register's translucent rows ride (the family's
// highlighter-26, the pole for the two pole families); build.ts expands both per family.
// The kit reads `borderColor` on every Button at rest (parts.tsx), so only the tiers that
// draw an edge name one: the stamp's gated edge and the outline's tint. `transparent` is
// the one keyword the map may hold: it names the absence of a paint.
import { type KeyMap, same, BORDER_KEYS, COLOR_KEYS } from './keys.ts'

/** `<family>`: edges only. The focus ring stays the base's neutral highlighter everywhere. */
export const FAMILY_EDGE: KeyMap = same(BORDER_KEYS, '<tint>')

/** `<family>_solid`, `<family>_subtle`, `<family>_hint`, `<family>_outline`: the register's rows */
export const TIERS: Readonly<Record<'solid' | 'subtle' | 'hint' | 'outline', KeyMap>> = {
  solid: {
    background: '<family>-solid-bg-enabled',
    backgroundHover: '<family>-solid-bg-hover',
    backgroundPress: '<family>-solid-bg-pressed',
    backgroundFocus: '<family>-solid-bg-enabled',
    ...same(COLOR_KEYS, '<family>-solid-fg'),
    ...same(BORDER_KEYS, '<family>-solid-border'),
  },
  subtle: {
    background: '<family>-subtle-bg-enabled',
    backgroundHover: '<family>-subtle-bg-hover',
    backgroundPress: '<family>-subtle-bg-pressed',
    backgroundFocus: '<family>-subtle-bg-enabled',
    ...same(COLOR_KEYS, '<family>-fg'),
    ...same(BORDER_KEYS, 'transparent'),
  },
  hint: {
    background: '<family>-hint-bg-enabled',
    backgroundHover: '<family>-hint-bg-hover',
    backgroundPress: '<family>-hint-bg-pressed',
    backgroundFocus: '<family>-hint-bg-enabled',
    ...same(COLOR_KEYS, '<family>-fg-on-hint'),
    ...same(BORDER_KEYS, 'transparent'),
  },
  outline: {
    background: '<family>-hint-bg-enabled',
    backgroundHover: '<family>-hint-bg-hover',
    backgroundPress: '<family>-hint-bg-pressed',
    backgroundFocus: '<family>-hint-bg-enabled',
    ...same(COLOR_KEYS, '<family>-fg-on-hint'),
    ...same(BORDER_KEYS, '<tint>'),
  },
}
