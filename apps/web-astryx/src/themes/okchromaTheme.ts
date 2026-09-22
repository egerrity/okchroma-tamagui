import {defineTheme} from '@astryxdesign/core/theme';
import {byBrand, type brandNames} from '@poc/theme/dist/brands';
import {ASTRYX_TO_OKCHROMA} from '@poc/theme/map-astryx';

export type BrandName = (typeof brandNames)[number];

/**
 * okchroma's rows for one brand, the same build the Tamagui apps mount
 * (packages/theme/dist/theme.<brand>.ts, engine names per mode), mapped onto Astryx's
 * names as [light, dark] tuples by docs/map-astryx.md.
 */
export function buildOkchromaTheme(brand: BrandName) {
  const light = byBrand[brand].themes.light as Record<string, string>;
  const dark = byBrand[brand].themes.dark as Record<string, string>;
  const tokens: Record<string, [string, string]> = {};
  for (const [astryxName, okchromaName] of Object.entries(ASTRYX_TO_OKCHROMA)) {
    const l = light[okchromaName];
    const d = dark[okchromaName];
    if (l === undefined || d === undefined) {
      throw new Error(`the build emits no "${okchromaName}" (mapped from ${astryxName})`);
    }
    tokens[astryxName] = [l, d];
  }
  return defineTheme({name: `okchroma-${brand}`, tokens});
}
