// The config an app mounts: docs/map.md as Tamagui themes, for one brand. createTamagui
// registers the config globally, so an app calls createConfig once, and imports this module
// or stock.ts, never both. The two rules a theme cannot hold live in parts.tsx (decision 15).
import { createTamagui } from 'tamagui'
import { byBrand, defaultBrand, type brandNames } from '../dist/brands.ts'
import { shared } from './shared.ts'

export type BrandName = (typeof brandNames)[number]
type DefaultThemes = (typeof byBrand)[typeof defaultBrand]['themes']

export const isBrand = (b: unknown): b is BrandName => typeof b === 'string' && b in byBrand

/** every brand's themes share one key set, held by the check, so one brand's type stands for all */
export function createConfig(brand: BrandName = defaultBrand) {
  return createTamagui({ ...shared, themes: byBrand[brand].themes as unknown as DefaultThemes })
}

export type AppConfig = ReturnType<typeof createConfig>
