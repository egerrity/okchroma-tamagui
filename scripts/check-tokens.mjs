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
//   C. A theme prop on a Button ends in a tier: solid, subtle, hint or outline.
//   D. Nothing imports the theme builder.
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
  }
  // every brand declares the same theme names and keys, so one brand's type stands for all
  const ks = Object.entries(themes).map(([n, keys]) => n + ':' + Object.keys(keys).sort().join(',')).sort().join('|')
  if (keyset === null) keyset = ks
  else if (ks !== keyset) fail(`A: ${brand} declares a different theme or key set from ${BRAND_NAMES[0]}`)
}
const themes = byBrand[BRAND_NAMES[0]].themes

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
const tokenRef = /^\$(\d+(\.\d+)?|true|body|heading|button|xs|sm|md|lg|full|icon|content)$/

for (const p of files) {
  const rel = relative(root, p)
  if (rel.endsWith('map.ts') || rel.endsWith('build.ts') || rel.endsWith('brands.ts')) continue
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
  if (/@tamagui\/theme-builder|\bcreateThemes\b/.test(code)) fail(`D: ${rel} reaches for the theme builder`)
}

if (violations.length) {
  console.error(`check: ${violations.length} violation${violations.length === 1 ? '' : 's'}`)
  for (const v of violations) console.error('  ' + v)
  process.exit(1)
}
console.log(`check: ok. ${BRAND_NAMES.length} brands x ${Object.keys(themes).length} themes hold the map; ${files.length} files obey the law.`)
