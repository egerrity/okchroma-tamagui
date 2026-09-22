// The two chips the kit does not ship, built the way the kit builds its own: a styled
// frame with a name so the map's sub-themes find it, and its text. Decision 25.
import { forwardRef } from 'react'
import { Button as KitButton, SizableText, XStack, styled, withStaticProperties, type TamaguiElement } from 'tamagui'
import { disabledOpacity, type families } from '../../dist/brands.ts'

/** the seven color families; the pole families have no chalk and no chip */
export type ColorFamily = Exclude<(typeof families)[number], `neutral-${string}`>

// The button chip: a filter or an action on a family, a soft square on the chip corner,
// small. It is the kit's Button under another shape, so press, hover, focus and the
// keyboard are the kit's. Off it is the neutral stamp and on it is the family's stamp, and
// the stamp is the solid tier, so `selected` picks the theme, `neutral_solid` or
// `<family>_solid`, and each side hovers and presses on its own stamp (decisions 29, 31).
// Sizes: `$xs` (the default) and `$xxs`, the two chip heights.
const ChipFrame = styled(KitButton, {
  name: 'Chip',
  size: '$xs',
  borderRadius: '$chip',
  borderColor: '$borderColor',
  fontFamily: '$button',
  disabledStyle: { opacity: disabledOpacity },
  variants: {
    // inert when disabled, for the reason the Button part gives
    disabled: { true: { pointerEvents: 'none', focusable: false } },
  } as const,
})
type ChipFrameProps = React.ComponentProps<typeof ChipFrame>
export type ChipProps = Omit<ChipFrameProps, 'theme'> & {
  /** the family whose stamp the chip wears while it is on */
  family: ColorFamily
  /** on: the family's stamp; off: the neutral stamp */
  selected?: boolean
}
const ChipComponent = forwardRef<TamaguiElement, ChipProps>(function Chip({ family, selected, ...rest }, ref) {
  return <ChipFrame ref={ref} theme={selected ? `${family}_solid` : 'neutral_solid'} {...rest} />
})
export const Chip = withStaticProperties(ChipComponent, { Text: KitButton.Text, Icon: KitButton.Icon })

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
