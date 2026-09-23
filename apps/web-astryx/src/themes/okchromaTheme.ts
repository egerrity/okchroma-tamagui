import {defineTheme} from '@astryxdesign/core/theme';
import {byBrand, type brandNames} from '@poc/theme/dist/brands';
import {ASTRYX_BUTTON_MAP, ASTRYX_TO_OKCHROMA} from '@poc/theme/map-astryx';

export type BrandName = (typeof brandNames)[number];

/**
 * okchroma's rows for one brand, the same build the Tamagui apps mount
 * (packages/theme/dist/theme.<brand>.ts, engine names per mode), mapped onto Astryx's
 * names as [light, dark] tuples by docs/map-astryx.md. The Button maps individually:
 * its fills arrive as theme-local tokens and land on the Button through Astryx's own
 * component overrides, so the page-level tokens stay on the text stops.
 */
export function buildOkchromaTheme(brand: BrandName) {
  const light = byBrand[brand].themes.light as Record<string, string>;
  const dark = byBrand[brand].themes.dark as Record<string, string>;
  const pair = (okchromaName: string, use: string): [string, string] => {
    const l = light[okchromaName];
    const d = dark[okchromaName];
    if (l === undefined || d === undefined) {
      throw new Error(`the build emits no "${okchromaName}" (mapped from ${use})`);
    }
    return [l, d];
  };
  const tokens: Record<string, [string, string]> = {};
  for (const [astryxName, okchromaName] of Object.entries(ASTRYX_TO_OKCHROMA)) {
    tokens[astryxName] = pair(okchromaName, astryxName);
  }
  const localTokens: Record<string, [string, string]> = {};
  const button: Record<string, Record<string, string | Record<string, string>>> = {};
  for (const [variant, rows] of Object.entries(ASTRYX_BUTTON_MAP)) {
    const local = (part: keyof typeof rows) => {
      const name = `--okchroma-button-${variant}-${part}`;
      localTokens[name] = pair(rows[part], `button ${variant} ${part}`);
      return `var(${name})`;
    };
    // Astryx's Button draws no border of its own, so the edge is a border it did not
    // have; one pixel, transparent where the build says so, keeps the geometry the same
    // for every brand, the way the kit reads borderColor on every Tamagui Button at rest.
    button[`variant:${variant}`] = {
      backgroundColor: local('fill'),
      color: local('on'),
      border: `1px solid ${local('edge')}`,
      ':hover': {backgroundColor: local('hover')},
      ':active': {backgroundColor: local('pressed')},
    };
  }
  return defineTheme({
    name: `okchroma-${brand}`,
    tokens,
    localTokens,
    components: {button},
  });
}
