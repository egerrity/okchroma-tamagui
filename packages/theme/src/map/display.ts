// Display: the tag chip (IndicatorChip). It has a hierarchy, and hierarchy is real color:
// the family's scale stops, the same stop in both modes. Seven color families; the pole
// families have no chalk. The button chip (Chip) has no rows here: off it is the neutral
// stamp and on it is the family's stamp, and the stamp is the solid tier, so the chip takes
// `neutral_solid` or `<family>_solid` (decision 31).
import type { KeyMap } from './keys.ts'

/** `<family>_indicator-<level>`: the tag chip's three levels */
export const INDICATOR_LEVELS: Readonly<Record<'stamp' | 'strong' | 'default', KeyMap>> = {
  stamp: { background: '<family>-stamp-fill', color: '<family>-stamp-on', borderColor: '<family>-stamp-edge' },
  strong: { background: '<family>-chalk-11', color: '<family>-pen-58', borderColor: '<family>-chalk-20' },
  default: { background: '<family>-paper-3', color: '<family>-pencil-47', borderColor: '<family>-chalk-15' },
}
export const LEVEL_NAMES = Object.keys(INDICATOR_LEVELS) as (keyof typeof INDICATOR_LEVELS)[]

