// Code: packages/theme/src/parts/chip.tsx. Figma: the Chip and IndicatorChip sets on the
// print page. Chip: Tier = the variant's Tier; State=selected maps to the selected prop;
// State=disabled to disabled. IndicatorChip: Size=sm maps to size="xxs".
import { Chip, IndicatorChip } from '@poc/theme/parts'

export const Filter = () => <Chip theme="brand_outline">Unread</Chip>
export const FilterOn = () => (
  <Chip theme="brand_outline" selected aria-pressed>
    {'✓ Unread'}
  </Chip>
)
export const Action = () => <Chip theme="brand_solid">Apply</Chip>
export const Indicator = () => (
  <IndicatorChip theme="positive">
    <IndicatorChip.Text>Paid</IndicatorChip.Text>
  </IndicatorChip>
)
export const IndicatorSmall = () => (
  <IndicatorChip theme="neutral" size="xxs">
    <IndicatorChip.Text>Draft</IndicatorChip.Text>
  </IndicatorChip>
)
