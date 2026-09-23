import {defineTheme} from '@astryxdesign/core/theme';
import {byBrand} from '@poc/theme/dist/brands';
import type {BrandName} from './okchromaTheme';

/**
 * The baseline: Meta's expression of the seed. Astryx's own generator over its defaults,
 * seeded with the brand's hex (Material HCT, 4.5:1 by tone spacing, the neutrals tinted
 * from the seed); the status colors are convention-bound and stay at Astryx's defaults.
 */
export function buildAstryxSeedTheme(brand: BrandName) {
  return defineTheme({name: `astryx-${brand}`, color: {accent: byBrand[brand].SEED}});
}
