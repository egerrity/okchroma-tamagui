// The two chips the kit does not ship, built the way the kit builds its own: a styled
// frame with a name so the map's sub-themes find it, and its text. Decision 25.
import { Button as KitButton, SizableText, XStack, styled, withStaticProperties } from 'tamagui'
import { disabledOpacity } from '../../dist/brands.ts'

// The interactive chip: a filter or an action, on a tier (`theme="brand_outline"`), a pill,
// small. It is the kit's Button under another shape, so press, hover, focus and the
// keyboard are the kit's. `selected` holds the register's selected rung while a filter is
// on. Sizes: `$xs` (the default) and `$xxs`.
const ChipFrame = styled(KitButton, {
  name: 'Chip',
  size: '$xs',
  borderRadius: '$full',
  borderColor: '$borderColor',
  fontFamily: '$button',
  disabledStyle: { opacity: disabledOpacity },
  variants: {
    selected: { true: { backgroundColor: '$backgroundSelected' } },
  } as const,
})
export const Chip = withStaticProperties(ChipFrame, { Text: KitButton.Text, Icon: KitButton.Icon })

// The indicator chip: a label that shows a state and takes no press, on a family
// (`theme="positive"`); the map's display group gives its ground, text and edge.
const IndicatorFrame = styled(XStack, {
  name: 'IndicatorChip',
  alignItems: 'center',
  justifyContent: 'center',
  height: '$xs',
  paddingHorizontal: '$xs',
  borderRadius: '$full',
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
