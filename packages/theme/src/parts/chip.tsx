// The two chips the kit does not ship, built the way the kit builds its own: a styled
// frame with a name so the map's sub-themes find it, and its text. Decision 25.
import { Button as KitButton, SizableText, XStack, styled, withStaticProperties } from 'tamagui'
import { disabledOpacity } from '../../dist/brands.ts'

// The button chip: a filter or an action on a family (`theme="brand_chip"`), a soft square
// on the chip corner, small. It is the kit's Button under another shape, so press, hover,
// focus and the keyboard are the kit's. Off it wears the theme's resting rows; `selected`
// moves it onto the theme's selected rows, the family's stamp, with the stamp's own hover
// and press. Sizes: `$xs` (the default) and `$xxs`, the two chip heights.
const ChipFrame = styled(KitButton, {
  name: 'Chip',
  size: '$xs',
  borderRadius: '$chip',
  borderColor: '$borderColor',
  fontFamily: '$button',
  disabledStyle: { opacity: disabledOpacity },
  variants: {
    selected: {
      true: {
        backgroundColor: '$backgroundSelected',
        color: '$colorSelected',
        borderColor: '$borderColorSelected',
        hoverStyle: { backgroundColor: '$backgroundSelectedHover' },
        pressStyle: { backgroundColor: '$backgroundSelectedPress' },
      },
    },
    // inert when disabled, for the reason the Button part gives
    disabled: { true: { pointerEvents: 'none', focusable: false } },
  } as const,
})
export const Chip = withStaticProperties(ChipFrame, { Text: KitButton.Text, Icon: KitButton.Icon })

// The tag chip: a label that shows a state and takes no press, on a level
// (`theme="positive_indicator-strong"`); the map's display group gives its ground, text and edge.
const IndicatorFrame = styled(XStack, {
  name: 'IndicatorChip',
  alignItems: 'center',
  justifyContent: 'center',
  height: '$xs',
  paddingHorizontal: '$xs',
  borderRadius: '$chip',
  borderWidth: 1,
  backgroundColor: '$background',
  borderColor: '$borderColor',
  variants: {
    size: {
      xs: { height: '$xs', paddingHorizontal: '$xs' },
      xxs: { height: '$xxs', paddingHorizontal: '$xxs' },
    },
  } as const,
})
const IndicatorText = styled(SizableText, {
  name: 'IndicatorChipText',
  fontFamily: '$button',
  size: '$xs',
  color: '$color',
  userSelect: 'none',
})
export const IndicatorChip = withStaticProperties(IndicatorFrame, { Text: IndicatorText })
