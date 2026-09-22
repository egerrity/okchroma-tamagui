import {defineTheme} from '@astryxdesign/core/theme';
import {byBrand} from '@poc/theme/dist/brands';
import type {BrandName} from './okchromaTheme';

/** The baseline: Astryx's own generator over core defaults, seeded with the brand's hex. */
export function buildAstryxSeedTheme(brand: BrandName) {
  return defineTheme({name: `astryx-${brand}`, color: {accent: byBrand[brand].SEED}});
}
