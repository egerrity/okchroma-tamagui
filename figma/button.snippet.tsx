// Code: packages/theme/src/parts.tsx (Button). Figma: the Button set on the print page.
// Kind = the variant's Kind property: primary is the solid tier, outline and ghost are
// shapes on the hint tier, toggle is the outline shape with `selected` while it is on.
// State=disabled maps to the disabled prop. The family is the first half of the theme.
import { Button } from '@poc/theme/parts'

export const Primary = () => <Button theme="brand_solid">Label</Button>
export const Outline = () => <Button theme="brand_outline">Label</Button>
export const Ghost = () => <Button theme="brand_hint">Label</Button>
export const ToggleOn = () => (
  <Button theme="brand_outline" selected aria-pressed>
    {'\u2713 Label'}
  </Button>
)
export const Disabled = () => (
  <Button theme="brand_solid" disabled>
    Label
  </Button>
)
