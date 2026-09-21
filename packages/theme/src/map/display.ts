// Display: the chips. The tag chip (IndicatorChip) has a hierarchy, and hierarchy is real
// color: the family's scale stops, the same stop in both modes. The button chip (Chip) has
// no hierarchy: off, it is the neutral stamp; on, it is the family's stamp; each side takes
// its stamp's own hover and pressed fills, so interaction stays the engine's (decision 29).
// Seven color families; the pole families have no chalk.
import { type KeyMap, same, BORDER_KEYS, COLOR_KEYS } from './keys.ts'

/** `<family>_indicator-<level>`: the tag chip's three levels */
export const INDICATOR_LEVELS: Readonly<Record<'stamp' | 'strong' | 'default', KeyMap>> = {
  stamp: { background: '<family>-stamp-fill', color: '<family>-stamp-on', borderColor: '<family>-stamp-edge' },
  strong: { background: '<family>-chalk-11', color: '<family>-pen-58', borderColor: '<family>-chalk-20' },
  default: { background: '<family>-paper-3', color: '<family>-pencil-47', borderColor: '<family>-chalk-15' },
}
export const LEVEL_NAMES = Object.keys(INDICATOR_LEVELS) as (keyof typeof INDICATOR_LEVELS)[]

/** `<family>_chip`: the button chip, off on the neutral stamp, on on the family's stamp */
export const INTERACTIVE_CHIP: KeyMap = {
  background: 'neutral-stamp-fill',
  backgroundHover: 'neutral-stamp-fill-hover',
  backgroundPress: 'neutral-stamp-fill-pressed',
  backgroundFocus: 'neutral-stamp-fill',
  ...same(COLOR_KEYS, 'neutral-stamp-on'),
  ...same(BORDER_KEYS, 'neutral-stamp-edge'),
  backgroundSelected: '<family>-stamp-fill',
  backgroundSelectedHover: '<family>-stamp-fill-hover',
  backgroundSelectedPress: '<family>-stamp-fill-pressed',
  colorSelected: '<family>-stamp-on',
  borderColorSelected: '<family>-stamp-edge',
}
