// Code: packages/theme/src/parts.tsx (Input). Figma: the Input set on the print page.
// State=invalid maps to theme="critical" and aria-invalid; focus is the platform's.
import { Input } from '@poc/theme/parts'

export const Example = () => <Input placeholder="Placeholder" />
export const Invalid = () => <Input placeholder="Placeholder" theme="critical" aria-invalid />
