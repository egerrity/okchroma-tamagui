// A day in the calendar grid (docs/date-picker.md): a square on the tier its place names. A
// day is the neutral hint tier, today the neutral outline, the ends of the range the
// family's stamp, the inside the family's selected ground, and the preview the family's
// hover rung. The band is the corner: square inside, rounded at the ends.
//
// It is built on the kit's Button.Frame, not the Button: the Button writes tabIndex 0 after
// its props, and a grid cell must be able to leave the tab order. The frame keeps the kit's
// button element, role, hover, press and focus ring; the text is the kit's own. Everything
// a state needs is a prop, never a variant, because on iOS a theme key inside a variant
// resolves against the root theme (docs/plan.md, Traps). An unavailable day stays
// focusable for the arrow keys and says so; it takes no pointer and no pick.
import { forwardRef } from 'react'
import { Button as KitButton, styled, type TamaguiElement } from 'tamagui'
import { disabledOpacity } from '../../../dist/brands.ts'
import type { ColorFamily } from '../chip.tsx'
import type { Position } from './model.ts'

const DayCellFrame = styled(KitButton.Frame, {
  name: 'DayCell',
  size: '$sm',
  width: '$sm',
  minWidth: 0,
  paddingHorizontal: 0,
  paddingVertical: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderColor: '$borderColor',
})
const DayCellText = styled(KitButton.Text, {
  name: 'DayCellText',
  size: '$sm',
  fontFamily: '$button',
  color: '$color',
})
type FrameProps = React.ComponentProps<typeof DayCellFrame>
export type DayCellProps = Omit<FrameProps, 'theme' | 'children'> & {
  /** the family whose range this cell may belong to */
  family: ColorFamily
  /** where the day stands in the range; null is a plain day. Named apart from the CSS position prop. */
  place: Position
  /** the device's day, marked with the neutral outline unless the range covers it */
  today?: boolean
  /** outside the bounds: dimmed, announced, focusable, not pickable */
  unavailable?: boolean
  children: string
}

const ENDS = { start: 'start', end: 'end', single: 'single' } as const

export const DayCell = forwardRef<TamaguiElement, DayCellProps>(function DayCell({ family, place, today, unavailable, children, ...rest }, ref) {
  const onStamp = place !== null && place in ENDS
  const inBand = place === 'inside' || place === 'preview'
  const theme = onStamp ? `${family}_solid` : inBand ? `${family}_hint` : today ? 'neutral_outline' : 'neutral_hint'
  // the inside of the range keeps the selected ground and climbs its own ladder on hover and press
  const ground =
    place === 'inside'
      ? { backgroundColor: '$backgroundSelected', hoverStyle: { backgroundColor: '$backgroundSelectedHover' }, pressStyle: { backgroundColor: '$backgroundSelectedPress' } }
      : place === 'preview'
        ? { backgroundColor: '$backgroundHover' }
        : {}
  const corners =
    inBand
      ? { borderRadius: 0 }
      : place === 'start'
        ? { borderTopLeftRadius: '$full', borderBottomLeftRadius: '$full', borderTopRightRadius: 0, borderBottomRightRadius: 0 }
        : place === 'end'
          ? { borderTopRightRadius: '$full', borderBottomRightRadius: '$full', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
          : { borderRadius: '$full' }
  const off = unavailable ? { opacity: disabledOpacity, pointerEvents: 'none' as const, 'aria-disabled': true } : {}
  return (
    <DayCellFrame ref={ref} theme={theme as any} {...(ground as any)} {...(corners as any)} {...(off as any)} {...rest}>
      {/* the label carries the theme itself: on iOS the frame's theme does not reach a child's `$color` (docs/plan.md, Traps) */}
      <DayCellText theme={theme as any}>{children}</DayCellText>
    </DayCellFrame>
  )
})
