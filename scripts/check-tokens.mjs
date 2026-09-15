// The check (docs/plan.md): the color law, held against the generated themes and the
// apps. Exit 1 on any violation, every violation listed.
//
//   A. dist/theme.ts is a projection of the map: every value equals the engine's value for
//      the engine name the transcription records, in that mode; light and dark declare the
//      same key set; every register family has its edge theme and three tier themes; every
//      value is a hex, an rgba() or transparent.
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

const { themes, sources, families, SEED } = await import('../packages/theme/dist/theme.ts')
const { BRAND, PROFILE } = await import('../packages/theme/src/seed.ts')

// ── A. the projection ─────────────────────────────────────────────────────────
const t = resolveTheme({ primaryHex: SEED, name: BRAND, deriveSecondary: true, contrastProfile: PROFILE })
const engine = interactionTokens(themeTokens({
  slug: BRAND, displayName: 'PoC', brand: t.themed,
  secondary: t.secondary?.scale ?? null, secondaryStyle: t.secondary?.style, contrastProfile: PROFILE,
}))
const normalize = (v) => v.replace(/^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\/\s*([\d.%]+)\s*\)$/, (_m, r, g, b, a) =>
  `rgba(${r}, ${g}, ${b}, ${String(a).endsWith('%') ? Number(a.slice(0, -1)) / 100 : Number(a)})`)
const grammar = /^(#[0-9a-fA-F]{6}|rgba\(\d+, \d+, \d+, [\d.]+\)|transparent)$/

for (const [name, keys] of Object.entries(themes)) {
  const mode = name.startsWith('dark') ? 'dark' : 'light'
  const src = sources[name]
  if (!src) { fail(`A: ${name} has no recorded sources`); continue }
  for (const [k, v] of Object.entries(keys)) {
    const engineName = src[k]
    if (!engineName) { fail(`A: ${name}.${k} records no engine name`); continue }
    const expected = engineName === 'transparent' ? 'transparent' : engine[mode][engineName]
    if (expected === undefined) fail(`A: ${name}.${k} names ${engineName}, which the engine does not emit`)
    else if (normalize(expected) !== v) fail(`A: ${name}.${k} is ${v}; the engine's ${engineName} in ${mode} is ${normalize(expected)}`)
    if (!grammar.test(v)) fail(`A: ${name}.${k} = ${v} is not a hex, an rgba() or transparent`)
  }
}
const lightNames = Object.keys(themes).filter(n => n.startsWith('light')).map(n => n.slice('light'.length))
const darkNames = Object.keys(themes).filter(n => n.startsWith('dark')).map(n => n.slice('dark'.length))
for (const n of lightNames) {
  if (!darkNames.includes(n)) fail(`A: light${n} has no dark counterpart`)
  else {
    const lk = Object.keys(themes[`light${n}`]).sort().join(','), dk = Object.keys(themes[`dark${n}`]).sort().join(',')
    if (lk !== dk) fail(`A: light${n} and dark${n} declare different keys`)
  }
}
for (const n of darkNames) if (!lightNames.includes(n)) fail(`A: dark${n} has no light counterpart`)
for (const f of INTERACTION_FAMILIES) {
  if (!families.includes(f)) fail(`A: the register family ${f} is missing from dist/theme.ts`)
  for (const suffix of ['', '_solid', '_subtle', '_hint', '_outline']) if (!themes[`light_${f}${suffix}`]) fail(`A: light_${f}${suffix} is missing`)
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
const tokenRef = /^\$(\d+(\.\d+)?|true|body|heading)$/

for (const p of files) {
  const rel = relative(root, p)
  if (rel.endsWith('map.ts') || rel.endsWith('build.ts') || rel.endsWith('seed.ts')) continue
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
console.log(`check: ok. ${Object.keys(themes).length} themes hold the map; ${files.length} files obey the law.`)
