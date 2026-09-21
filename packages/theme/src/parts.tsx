// The two exceptions under decision 6, each one line of style and no prop of its own
// (decision 15), and the components the kit does not ship. Every other component is
// Tamagui's, used as it comes.
import { Button as KitButton, Input as KitInput, styled, withStaticProperties } from 'tamagui'
import { disabledOpacity } from '../dist/brands.ts'
import { MIN_WIDTH } from './map/foundations.ts'

// The kit's own size variant, wrapped below so a button keeps the kit's height, padding
// and gap at a key, takes the library's least width at that key, and stays a pill: the
// kit's variant would otherwise hand back the control corner from its size key.
const kitSize = (KitButton as any).staticConfig.variants.size
const minWidthAt = (val: unknown) => MIN_WIDTH[String(val).replace('$', '') as keyof typeof MIN_WIDTH]

// The kit rests a Button's border on transparent and reads the theme only on hover. The
// stamp's edge is always rendered, so the resting border reads the theme too; disabled is
// the engine's opacity on the component, which no theme key can carry; the label reads
// the button font role, medium weight, which the kit would otherwise take from body; a
// button is a pill at every size (the size variant below); and a disabled button is inert, since the kit's own pointer-events rule does not reach the web
// element and the web hover style is CSS, which the kit's runtime gate cannot stop.
export const Button = withStaticProperties(
  styled(KitButton, {
    borderColor: '$borderColor',
    fontFamily: '$button',
    disabledStyle: { opacity: disabledOpacity },
    variants: {
      size: { ...kitSize, '...size': (val: any, extras: any) => ({ ...kitSize['...size'](val, extras), borderRadius: '$full', minWidth: minWidthAt(val) }) },
      // a toggle shown on: the ground the theme names for a selected control
      selected: { true: { backgroundColor: '$backgroundSelected' } },
      disabled: { true: { pointerEvents: 'none', focusable: false } },
    } as const,
    // the kit pre-expands its own default size, so the default is restated here to run the wrapper
    defaultVariants: { size: '$true' },
  }),
  { Text: KitButton.Text, Icon: KitButton.Icon },
)

// The kit colors the placeholder only through this prop; the theme names the key.
export const Input = styled(KitInput, { placeholderTextColor: '$placeholderColor' })

// The components the kit does not ship, one file each under parts/ (decision 25).
export { Chip, IndicatorChip } from './parts/chip.tsx'
