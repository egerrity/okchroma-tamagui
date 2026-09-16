// The two exceptions under decision 6, each one line of style and no prop of its own
// (decision 15), and the components the kit does not ship. Every other component is
// Tamagui's, used as it comes.
import { Button as KitButton, Input as KitInput, styled, withStaticProperties } from 'tamagui'
import { disabledOpacity } from '../dist/brands.ts'

// The kit rests a Button's border on transparent and reads the theme only on hover. The
// stamp's edge is always rendered, so the resting border reads the theme too; disabled is
// the engine's opacity on the component, which no theme key can carry; and the label reads
// the button font role, medium weight, which the kit would otherwise take from body.
export const Button = withStaticProperties(
  styled(KitButton, { borderColor: '$borderColor', fontFamily: '$button', disabledStyle: { opacity: disabledOpacity } }),
  { Text: KitButton.Text, Icon: KitButton.Icon },
)

// The kit colors the placeholder only through this prop; the theme names the key.
export const Input = styled(KitInput, { placeholderTextColor: '$placeholderColor' })

// The components the kit does not ship, one file each under parts/ (decision 25).
export { Chip, IndicatorChip } from './parts/chip.tsx'
