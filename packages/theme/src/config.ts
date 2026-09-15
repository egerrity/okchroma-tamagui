// The config both apps mount: docs/map.md as Tamagui themes. createTamagui registers the
// config globally, so an app imports this module or stock.ts, never both. The two rules a
// theme cannot hold live in parts.tsx (decision 15), not here: the config's defaultProps
// merge below the kit's own variant styles and never reach the element.
import { createTamagui } from 'tamagui'
import { themes } from '../dist/theme.ts'
import { shared } from './shared.ts'

export const config = createTamagui({ ...shared, themes })

export type AppConfig = typeof config
export default config
