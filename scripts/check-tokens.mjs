// The check (docs/plan.md): the color law, held against the generated themes and the
// apps. Exit 1 on any violation, every violation listed.
//
//   A. Every dist/theme.<brand>.ts is a projection of the map: every value equals the engine's
//      value for the engine name the transcription records, in that mode, for that brand's
//      elections; light and dark declare the same key set; every register family has its edge
//      theme and four tier themes; every value is a hex, an rgba() or transparent; every brand
//      declares the same theme names and keys.
//   B. App and screen code writes no color literal in a style prop, and every `$` reference
//      is a theme key or a stock token name.
//   C. A theme prop on a Button ends in a tier: solid, subtle, hint or outline. A Chip and a
//      DayCell name a color family, never a theme.
//   D. Nothing imports the theme builder.
//   E. The native date picker's tint, the family's pen-70, reads as text on the dialog's plane
//      at 4.5 to 1 in both modes and carries, at 4.5 to 1, the label each platform draws on it,
//      in every brand and family (docs/date-picker.md, decision 33). iOS picks that label by
//      the tint's luma on the sRGB values as written, black above 0.8 and white otherwise, so
//      the tint also keeps a margin from that line; Android draws the theme's inverse text,
//      white in light and black in dark.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveTheme, themeTokens, interactionTokens, INTERACTION_FAMILIES } from 'okchroma'

const root = fileURLToPath(new URL('../', import.meta.url))
const violations = []
const fail = (s) => violations.push(s)

const { BRANDS, BRAND_NAMES, PROFILE } = await import('../packages/theme/src/brands.ts')
const { byBrand, families } = await import('../packages/theme/dist/brands.ts')

// ── A. the projection, per brand ──────────────────────────────────────────────
const normalize = (v) => v.replace(/^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\/\s*([\d.%]+)\s*\)$/, (_m, r, g, b, a) =>
  `rgba(${r}, ${g}, ${b}, ${String(a).endsWith('%') ? Number(a.slice(0, -1)) / 100 : Number(a)})`)
const grammar = /^(#[0-9a-fA-F]{6}|rgba\(\d+, \d+, \d+, [\d.]+\)|transparent)$/
let keyset = null
for (const brand of BRAND_NAMES) {
  const e = BRANDS[brand]
  const file = byBrand[brand]
  if (!file) { fail(`A: ${brand} has no dist/theme.${brand}.ts; run npm run tokens`); continue }
  const { themes, sources } = file
  const t = resolveTheme({ primaryHex: e.primaryHex, name: brand, secondaryHex: e.secondaryHex ?? null, secondaryStyle: e.secondaryStyle, deriveSecondary: !e.secondaryHex, contrastProfile: PROFILE })
  const engine = interactionTokens(themeTokens({
    slug: brand, displayName: brand, brand: t.themed, secondary: t.secondary?.scale ?? null,
    secondaryStyle: t.secondary?.style ?? e.secondaryStyle, neutralLevel: e.neutralLevel, ctaEscape: e.ctaEscape,
    linkHex: e.linkHex ?? null, ctaBorder: e.ctaBorder, contrastProfile: PROFILE,
  }))
  for (const [name, keys] of Object.entries(themes)) {
    const mode = name.startsWith('dark') ? 'dark' : 'light'
    const src = sources[name]
    if (!src) { fail(`A: ${brand}: ${name} has no recorded sources`); continue }
    for (const [k, v] of Object.entries(keys)) {
      const engineName = src[k]
      if (!engineName) { fail(`A: ${brand}: ${name}.${k} records no engine name`); continue }
      const expected = engineName === 'transparent' ? 'transparent' : engine[mode][engineName]
      if (expected === undefined) fail(`A: ${brand}: ${name}.${k} names ${engineName}, which the engine does not emit`)
      else if (normalize(expected) !== v) fail(`A: ${brand}: ${name}.${k} is ${v}; the engine's ${engineName} in ${mode} is ${normalize(expected)}`)
      if (!grammar.test(v)) fail(`A: ${brand}: ${name}.${k} = ${v} is not a hex, an rgba() or transparent`)
    }
  }
  const lightNames = Object.keys(themes).filter(n => n.startsWith('light')).map(n => n.slice('light'.length))
  const darkNames = Object.keys(themes).filter(n => n.startsWith('dark')).map(n => n.slice('dark'.length))
  for (const n of lightNames) {
    if (!darkNames.includes(n)) fail(`A: ${brand}: light${n} has no dark counterpart`)
    else {
      const lk = Object.keys(themes[`light${n}`]).sort().join(','), dk = Object.keys(themes[`dark${n}`]).sort().join(',')
      if (lk !== dk) fail(`A: ${brand}: light${n} and dark${n} declare different keys`)
    }
  }
  for (const n of darkNames) if (!lightNames.includes(n)) fail(`A: ${brand}: dark${n} has no light counterpart`)
  for (const f of INTERACTION_FAMILIES) {
    if (!families.includes(f)) fail(`A: the register family ${f} is missing from dist/brands.ts`)
    for (const suffix of ['', '_solid', '_subtle', '_hint', '_outline']) if (!themes[`light_${f}${suffix}`]) fail(`A: ${brand}: light_${f}${suffix} is missing`)
    if (f !== 'neutral-strong' && f !== 'neutral-inverse')
      for (const level of ['stamp', 'strong', 'default']) if (!themes[`light_${f}_indicator-${level}`]) fail(`A: ${brand}: light_${f}_indicator-${level} is missing`)
  }
  // every brand declares the same theme names and keys, so one brand's type stands for all
  const ks = Object.entries(themes).map(([n, keys]) => n + ':' + Object.keys(keys).sort().join(',')).sort().join('|')
  if (keyset === null) keyset = ks
  else if (ks !== keyset) fail(`A: ${brand} declares a different theme or key set from ${BRAND_NAMES[0]}`)
}
const themes = byBrand[BRAND_NAMES[0]].themes

// ── E. the native picker's tint carries the label each platform draws ────────
const luminance = (hex) => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const contrast = (a, b) => { const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05) }
// iOS chooses the selected-today label from the tint's luma on the sRGB values as written, no
// linearizing: black above the line, white at or below it. The system's own rule, read from its
// code and promised nowhere (decision 33); the margin is what a stop must keep from the line.
const IOS_LABEL_LINE = 0.8
const IOS_LABEL_MARGIN = 0.05
const luma = (hex) => { const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const labelName = (label) => (label === '#ffffff' ? 'white' : 'black')
for (const brand of BRAND_NAMES) {
  for (const mode of ['light', 'dark']) {
    const plane = byBrand[brand].themes[mode]['surface-high']
    for (const f of INTERACTION_FAMILIES.filter(f => f !== 'neutral-strong' && f !== 'neutral-inverse')) {
      const hex = byBrand[brand].themes[mode][`${f}-pen-70`]
      if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) { fail(`E: ${brand}: ${mode} ${f}-pen-70 is missing or not an opaque hex`); continue }
      const asText = contrast(hex, plane)
      if (asText < 4.5) fail(`E: ${brand}: ${f}-pen-70 on surface-high in ${mode} is ${asText.toFixed(2)} to 1, under 4.5`)
      const l = luma(hex)
      if (Math.abs(l - IOS_LABEL_LINE) < IOS_LABEL_MARGIN) fail(`E: ${brand}: ${f}-pen-70 in ${mode} has luma ${l.toFixed(3)}, within ${IOS_LABEL_MARGIN} of the iOS label line at ${IOS_LABEL_LINE}`)
      const iosLabel = l > IOS_LABEL_LINE ? '#000000' : '#ffffff'
      const androidLabel = mode === 'light' ? '#ffffff' : '#000000'
      const labels = iosLabel === androidLabel ? [[iosLabel, 'both platforms draw']] : [[iosLabel, 'iOS draws'], [androidLabel, 'Android draws']]
      for (const [label, who] of labels) {
        const under = contrast(hex, label)
        if (under < 4.5) fail(`E: ${brand}: the ${labelName(label)} label ${who} on ${f}-pen-70 in ${mode} is ${under.toFixed(2)} to 1, under 4.5`)
      }
    }
  }
}

// ── B, C, D. the code ────────────────────────────────────────────────────────
const files = []
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist' || e.startsWith('.')) continue
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(tsx?|mjs|js)$/.test(e)) files.push(p)
  }
}
for (const d of ['apps', 'packages']) walk(join(root, d))
const themeKeys = new Set(Object.keys(themes.light))
const colorFamilies = INTERACTION_FAMILIES.filter(f => f !== 'neutral-strong' && f !== 'neutral-inverse')
const tokenRef = /^\$(\d+(\.\d+)?|true|body|heading|button|xxs|xs|sm|md|lg|chip|full|icon|content)$/

for (const p of files) {
  const rel = relative(root, p)
  // the map and the generator are data and its projection, not styled code
  if (rel.endsWith('map.ts') || rel.includes('/map/') || rel.endsWith('build.ts') || rel.endsWith('brands.ts')) continue
  const src = readFileSync(p, 'utf8')
  const code = src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
  for (const m of code.matchAll(/(["'`])(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|color-mix\(|oklch\()/g))
    fail(`B: ${rel} writes a color literal: ${m[2]}…`)
  for (const m of code.matchAll(/["'`{]\$([a-zA-Z][\w-]*)["'`}]/g)) {
    const ref = `$${m[1]}`
    if (!tokenRef.test(ref) && !themeKeys.has(m[1])) fail(`B: ${rel} reads ${ref}, which no theme declares`)
  }
  for (const m of code.matchAll(/<Button\b[^>]*?\btheme=(?:"([^"]*)"|\{`([^`]*)`\})/gs)) {
    const value = m[1] ?? m[2]
    if (!/_(solid|subtle|hint|outline)$|_\$\{tier\}$/.test(value)) fail(`C: ${rel} gives a Button theme="${value}", which names no tier`)
  }
  // a Chip and a DayCell pick their own tier theme (parts/chip.tsx, parts/date/DayCell.tsx); the call site names the family
  for (const m of code.matchAll(/<(Chip|DayCell)(?![\w.])((?:[^>]|=>)*)>/gs)) {
    const fam = m[2].match(/\bfamily=(?:"([^"]*)"|\{[^}]*\})/)
    if (!fam) fail(`C: ${rel} gives a ${m[1]} no family`)
    else if (fam[1] !== undefined && !colorFamilies.includes(fam[1])) fail(`C: ${rel} gives a ${m[1]} family="${fam[1]}", which names no color family`)
  }
  if (/@tamagui\/theme-builder|\bcreateThemes\b/.test(code)) fail(`D: ${rel} reaches for the theme builder`)
}

if (violations.length) {
  console.error(`check: ${violations.length} violation${violations.length === 1 ? '' : 's'}`)
  for (const v of violations) console.error('  ' + v)
  process.exit(1)
}
console.log(`check: ok. ${BRAND_NAMES.length} brands x ${Object.keys(themes).length} themes hold the map; ${files.length} files obey the law.`)
