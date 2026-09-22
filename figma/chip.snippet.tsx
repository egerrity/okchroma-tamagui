// Code: packages/theme/src/parts/chip.tsx. Figma: the Chip and IndicatorChip sets on the
// print page. Chip is the button chip: Selected=on maps to the selected prop, State=disabled
// to disabled; off it is the neutral stamp, on it is the family's stamp, so the family is
// the `family` prop and the mode on the instance.
// IndicatorChip is the tag chip: Level = the variant's Level in the theme's second half;
// Size=sm maps to size="xxs".
import { Chip, IndicatorChip } from '@poc/theme/parts'

export const Filter = () => <Chip family="brand">Unread</Chip>
export const FilterOn = () => (
  <Chip family="brand" selected aria-pressed>
    {'\u2713 Unread'}
  </Chip>
)
export const TagStrong = () => (
  <IndicatorChip theme="positive_indicator-strong">
    <IndicatorChip.Text>Paid</IndicatorChip.Text>
  </IndicatorChip>
)
export const TagDefaultSmall = () => (
  <IndicatorChip theme="neutral_indicator-default" size="xxs">
    <IndicatorChip.Text>Draft</IndicatorChip.Text>
  </IndicatorChip>
)
export const TagStamp = () => (
  <IndicatorChip theme="brand_indicator-stamp">
    <IndicatorChip.Text>New</IndicatorChip.Text>
  </IndicatorChip>
)
