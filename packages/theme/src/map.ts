// docs/map.md as data. Every value is an engine token name, or one of two placeholders the
// generator expands per family: `<family>` is the family's slug and `<tint>` is the name the
// register's translucent rows ride (the family's highlighter-26, the pole for the two pole
// families). Nothing here is a color; build.ts resolves each name per mode.

export type KeyMap = Readonly<Record<string, string>>

const same = (keys: readonly string[], name: string): KeyMap =>
  Object.fromEntries(keys.map(k => [k, name]))

const BORDER_KEYS = ['borderColor', 'borderColorHover', 'borderColorPress', 'borderColorFocus'] as const
const COLOR_KEYS = ['color', 'colorHover', 'colorPress', 'colorFocus'] as const

/** the base theme, `light` and `dark`: what the kit reads with no sub-theme */
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

/** `<family>`: edges only. The focus ring stays the base's neutral highlighter everywhere. */
export const FAMILY_EDGE: KeyMap = same(BORDER_KEYS, '<tint>')

/**
 * `<family>_solid`, `<family>_subtle`, `<family>_hint`, `<family>_outline`: the register's
 * rows. The kit reads `borderColor` on every Button at rest (config.ts), so only the tiers
 * that draw an edge name one: the stamp's gated edge, and the outline's tint, the family's
 * highlighter-26 as the required border of a text-style call to action (decision 14).
 * `transparent` is the one keyword the map may hold: it names the absence of a paint.
 */
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

/** `DialogOverlay` and `DialogContent`: the kit's named dialog parts, which read `$background` */
export const DIALOG: Readonly<Record<'DialogOverlay' | 'DialogContent', KeyMap>> = {
  DialogOverlay: { background: 'scrim' },
  DialogContent: { background: 'surface-high', borderColor: 'neutral-chalk-11', shadowColor: 'shadow-08' },
}

/** `Input` and `critical_Input`: the form control's edges, resting and focused */
export const INPUT: Readonly<Record<'Input' | 'critical_Input', KeyMap>> = {
  Input: {
    background: 'surface-high',
    color: 'neutral-pen-70',
    placeholderColor: 'neutral-pencil-47',
    borderColor: 'neutral-highlighter-26',
    borderColorHover: 'neutral-highlighter-26',
    borderColorFocus: 'brand-highlighter-26',
    outlineColor: 'brand-highlighter-26',
  },
  critical_Input: {
    background: 'surface-high',
    color: 'neutral-pen-70',
    placeholderColor: 'neutral-pencil-47',
    borderColor: 'critical-highlighter-26',
    borderColorHover: 'critical-highlighter-26',
    borderColorFocus: 'critical-highlighter-26',
    outlineColor: 'critical-highlighter-26',
  },
}
