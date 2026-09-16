// Code: packages/theme/src/parts.tsx (Button). Figma: the Button set on the print page.
// Tier = the variant's Tier property; State=disabled maps to the disabled prop.
import { Button } from '@poc/theme/parts'

export const Example = () => <Button theme="brand_solid">Label</Button>
export const Subtle = () => <Button theme="brand_subtle">Label</Button>
export const Hint = () => <Button theme="brand_hint">Label</Button>
export const Outline = () => <Button theme="brand_outline">Label</Button>
export const Disabled = () => (
  <Button theme="brand_solid" disabled>
    Label
  </Button>
)
