// Display: the chips. The tag chip (IndicatorChip) has a hierarchy, and hierarchy is real
// color: the family's scale stops, the same stop in both modes. The button chip (Chip) has
// no hierarchy: off, it wears the neutral tag's default look; on, it is the family's stamp.
// Opacity is for interaction: the stamp takes its own hover and pressed fills; a real fill's
// interaction rung is an engine matter (decision 28), so the off chip rests on its fill.
// Seven color families; the pole families have no chalk.
import { type KeyMap, same, BORDER_KEYS, COLOR_KEYS } from './keys.ts'

/** `<family>_indicator-<level>`: the tag chip's three levels */
export const INDICATOR_LEVELS: Readonly<Record<'stamp' | 'strong' | 'default', KeyMap>> = {
  stamp: { background: '<family>-stamp-fill', color: '<family>-stamp-on', borderColor: '<family>-stamp-edge' },
  strong: { background: '<family>-chalk-11', color: '<family>-pen-58', borderColor: '<family>-chalk-20' },
  default: { background: '<family>-paper-3', color: '<family>-pencil-47', borderColor: '<family>-chalk-15' },
}
export const LEVEL_NAMES = Object.keys(INDICATOR_LEVELS) as (keyof typeof INDICATOR_LEVELS)[]

/** `<family>_chip`: the button chip, off on the neutral tag's default look, on on the family's stamp */
export const INTERACTIVE_CHIP: KeyMap = {
  background: 'neutral-paper-3',
  backgroundHover: 'neutral-paper-3',
  backgroundPress: 'neutral-paper-3',
  backgroundFocus: 'neutral-paper-3',
  ...same(COLOR_KEYS, 'neutral-pencil-47'),
  ...same(BORDER_KEYS, 'neutral-chalk-15'),
  backgroundSelected: '<family>-stamp-fill',
  backgroundSelectedHover: '<family>-stamp-fill-hover',
  backgroundSelectedPress: '<family>-stamp-fill-pressed',
  colorSelected: '<family>-stamp-on',
  borderColorSelected: '<family>-stamp-edge',
}
