// Display: things that show a state and take no press. The indicator chip is a label on
// the family's subtle ground, its text on the family's `fg`, with the family's chalk as a
// faint edge. It exists for the seven color families; the pole families have no chalk.
// Tamagui looks up `<mode>_<family>_IndicatorChip` for the component named IndicatorChip,
// so `<IndicatorChip theme="positive">` picks the positive family's rows.
import type { KeyMap } from './keys.ts'

export const INDICATOR_CHIP: KeyMap = {
  background: '<family>-subtle-bg-enabled',
  color: '<family>-fg',
  borderColor: '<family>-chalk-11',
}
