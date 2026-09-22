// The map through the engine, once per brand. One brand's elections in; every theme in
// docs/map.md out, each key holding the engine's value for the recorded name in light and
// in dark. This file projects: it never parses CSS and never invents a value. Each
// `dist/theme.<brand>.ts` records, beside its themes, the engine name every key came from,
// which is what the check verifies; `dist/brands.ts` indexes them.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  resolveTheme,
  themeTokens,
  interactionTokens,
  INTERACTION_FAMILIES,
  interactionTintName,
} from 'okchroma'
import { BRANDS, BRAND_NAMES, DEFAULT_BRAND, PROFILE, type Election } from './brands.ts'
import { BASE, FAMILY_EDGE, TIERS, INPUT, DIALOG, INDICATOR_LEVELS, LEVEL_NAMES, type KeyMap } from './map.ts'

/** the seven color families: the pole families carry no chalk, so no tag chip */
const COLOR_FAMILIES = INTERACTION_FAMILIES.filter(f => f !== 'neutral-strong' && f !== 'neutral-inverse')

type Mode = 'light' | 'dark'
const MODES: readonly Mode[] = ['light', 'dark']
const TIER_NAMES = ['solid', 'subtle', 'hint', 'outline'] as const

// ── 1. the engine's emission for one brand, as one object per mode ───────────
export function engineFor(brand: string, e: Election) {
  const theme = resolveTheme({
    primaryHex: e.primaryHex,
    name: brand,
    secondaryHex: e.secondaryHex ?? null,
    secondaryStyle: e.secondaryStyle,
    deriveSecondary: !e.secondaryHex,
    contrastProfile: PROFILE,
  })
  return interactionTokens(
    themeTokens({
      slug: brand,
      displayName: brand,
      brand: theme.themed,
      secondary: theme.secondary?.scale ?? null,
      secondaryStyle: theme.secondary?.style ?? e.secondaryStyle,
      neutralLevel: e.neutralLevel,
      ctaEscape: e.ctaEscape,
      linkHex: e.linkHex ?? null,
      ctaBorder: e.ctaBorder,
      contrastProfile: PROFILE,
    }),
  )
}

// React Native's color parser reads `rgba(r, g, b, a)` and not the slash grammar the
// engine's system tokens use. Same color, one grammar, so both platforms parse it.
export const normalize = (v: string): string =>
  v.replace(/^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\/\s*([\d.%]+)\s*\)$/, (_m, r, g, b, a) => {
    const alpha = String(a).endsWith('%') ? Number(String(a).slice(0, -1)) / 100 : Number(a)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  })
const isColor = (v: string) => /^(#|rgb|rgba|hsl|oklch|color\(|transparent)/.test(v)

// ── 2. expand the map per family ─────────────────────────────────────────────
const expand = (map: KeyMap, family: string): KeyMap =>
  Object.fromEntries(
    Object.entries(map).map(([k, name]) => [
      k,
      name.replaceAll('<family>', family).replaceAll('<tint>', interactionTintName(family)),
    ]),
  )

/** theme name -> key -> engine name; the transcription the check reads back. Same for every brand. */
export function sourcesFor(colorNames: string[]): Record<string, KeyMap> {
  const sources: Record<string, KeyMap> = {}
  for (const mode of MODES) {
    sources[mode] = { ...Object.fromEntries(colorNames.map(n => [n, n])), ...BASE }
    for (const family of INTERACTION_FAMILIES) {
      sources[`${mode}_${family}`] = expand(FAMILY_EDGE, family)
      for (const tier of TIER_NAMES) sources[`${mode}_${family}_${tier}`] = expand(TIERS[tier], family)
    }
    for (const family of COLOR_FAMILIES)
      for (const level of LEVEL_NAMES) sources[`${mode}_${family}_indicator-${level}`] = expand(INDICATOR_LEVELS[level], family)
    for (const [name, map] of Object.entries({ ...INPUT, ...DIALOG })) sources[`${mode}_${name}`] = map
  }
  return sources
}

// ── 3. write ──────────────────────────────────────────────────────────────────
const here = dirname(fileURLToPath(import.meta.url))
const dist = join(here, '..', 'dist')
mkdirSync(dist, { recursive: true })

let disabledOpacity: number | null = null
const counts: string[] = []
for (const brand of BRAND_NAMES) {
  const e = BRANDS[brand]
  const all = engineFor(brand, e)
  const colorNames = all.names.filter(n => isColor(all.light[n]))
  const resolve = (name: string, mode: Mode): string => {
    if (name === 'transparent') return name
    const v = all[mode][name]
    if (v === undefined || String(v).includes('undefined')) throw new Error(`${brand}: the engine emits no ${mode} value for ${name}`)
    if (!isColor(v)) throw new Error(`${brand}: ${name} is not a color (${v}); the map may only name colors`)
    return normalize(v)
  }
  const sources = sourcesFor(colorNames)
  const themes: Record<string, Record<string, string>> = {}
  for (const [themeName, map] of Object.entries(sources)) {
    const mode = themeName.startsWith('dark') ? 'dark' : 'light'
    themes[themeName] = Object.fromEntries(Object.entries(map).map(([k, name]) => [k, resolve(name, mode)]))
  }
  const d = Number(all.light['disabled-opacity'])
  if (!Number.isFinite(d)) throw new Error(`${brand}: the engine emits no disabled-opacity`)
  disabledOpacity = d
  const out = [
    `// GENERATED by packages/theme/src/build.ts from docs/map.md through okchroma. Do not edit.`,
    `// brand ${brand}, seed ${e.primaryHex}, lane ${PROFILE}`,
    `export const BRAND = ${JSON.stringify(brand)}`,
    `export const SEED = ${JSON.stringify(e.primaryHex)}`,
    `export const themes = ${JSON.stringify(themes, null, 2)} as const`,
    '/** theme -> key -> the engine name the value came from */',
    `export const sources = ${JSON.stringify(sources, null, 2)} as const`,
    '',
  ].join('\n')
  writeFileSync(join(dist, `theme.${brand}.ts`), out)
  counts.push(`${brand} ${Object.keys(themes).length}`)
}

const index = [
  '// GENERATED by packages/theme/src/build.ts. Do not edit. One entry per brand in brands.ts.',
  ...BRAND_NAMES.map(b => `import * as ${ident(b)} from './theme.${b}.ts'`),
  `export const byBrand = { ${BRAND_NAMES.map(b => `${JSON.stringify(b)}: ${ident(b)}`).join(', ')} } as const`,
  `export const brandNames = ${JSON.stringify(BRAND_NAMES)} as const`,
  `export const defaultBrand = ${JSON.stringify(DEFAULT_BRAND)} as const`,
  `export const families = ${JSON.stringify([...INTERACTION_FAMILIES])} as const`,
  `export const disabledOpacity = ${disabledOpacity}`,
  '',
].join('\n')
writeFileSync(join(dist, 'brands.ts'), index)
function ident(b: string) { return 'brand_' + b.replace(/[^a-zA-Z0-9]/g, '_') }

console.log(`brands: ${BRAND_NAMES.length} (${counts.join(', ')} themes), default ${DEFAULT_BRAND}`)
