// Shared by the Figma scripts: what the stylesheets read, what tokens.css says each name is worth
// in each mode, how a CSS name maps to the path okchroma's plugin writes, and the foundations as
// Figma variables. The Figma side is never trusted from memory: every generated script re-reads
// the file by name and reports, and IDs are never stored for okchroma's variables.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DISABLED_OPACITY } from 'okchroma'

export const root = fileURLToPath(new URL('../../', import.meta.url))
const read = (p: string) => readFileSync(join(root, p), 'utf8')

// ── tokens.css, read as the roster check reads it ─────────────────────────────────────────────
// Top-level blocks keyed by selector. The first declaration of a name wins, so the sRGB value
// stands and the display-p3 override behind @supports does not.
type Table = Map<string, string>
const LIGHT_SELECTORS = ['[data-brand="kitchen"]', ':root', '[data-brand]']
const DARK_SELECTORS = [
  '[data-brand="kitchen"][data-theme="dark"]',
  ':root[data-theme="dark"], [data-theme="dark"]',
  '[data-brand][data-theme="dark"]',
]
export function cssTables(): { light: Table; dark: Table } {
  const css = read('src/styles/tokens.css')
  const blocks = new Map<string, [string, string][]>()
  for (const m of css.matchAll(/^([^\s/{}][^{\n]*)\{([\s\S]*?)^\}/gm)) {
    const sel = m[1].trim()
    const decls = [...m[2].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)].map((d): [string, string] => [`--${d[1]}`, d[2].trim()])
    blocks.set(sel, [...(blocks.get(sel) ?? []), ...decls])
  }
  const table = (sels: string[]) => {
    const out: Table = new Map()
    for (const s of sels) for (const [n, v] of blocks.get(s) ?? []) if (!out.has(n)) out.set(n, v)
    return out
  }
  return { light: table(LIGHT_SELECTORS), dark: table(DARK_SELECTORS) }
}

// A color as `rrggbb` or `rrggbb@alpha`, the form the generated scripts also produce from Figma.
function normalize(v: string): string {
  let m: RegExpMatchArray | null
  if ((m = v.match(/^#([0-9a-f]{6})$/i))) return m[1].toLowerCase()
  if ((m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/))) {
    const h = (n: string) => Number(n).toString(16).padStart(2, '0')
    const a = m[4] === undefined ? 1 : Number(m[4])
    return h(m[1]) + h(m[2]) + h(m[3]) + (a < 1 ? '@' + a : '')
  }
  if (v === 'transparent') return 'ffffff@0'
  return v
}
export function resolveCss(name: string, mode: 'light' | 'dark', t = cssTables(), depth = 0): string {
  const v = (mode === 'dark' ? t.dark.get(name) : undefined) ?? t.light.get(name)
  if (v === undefined) return '?undeclared'
  const a = v.match(/^var\(\s*(--[a-z0-9-]+)/)
  if (a) return depth > 12 ? '?loop' : resolveCss(a[1], mode, t, depth + 1)
  // a composition: black or a color at an opacity rung, rgb(r g b / var(--opacity-NNN))
  const c = v.match(/^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*var\(\s*(--[a-z0-9-]+)\s*\)\s*\)$/)
  if (c) {
    const alpha = Number(resolveCss(c[4], mode, t, depth + 1))
    const h = (n: string) => Number(n).toString(16).padStart(2, '0')
    return h(c[1]) + h(c[2]) + h(c[3]) + (alpha < 1 ? '@' + alpha : '')
  }
  return normalize(v)
}

// ── What the stylesheets read ────────────────────────────────────────────────────────────────
// Every var(--x) in the component stylesheets, the base sheet and the site, kept when tokens.css
// declares it; the foundations are kitchenUI's own and are listed by foundationVars().
export function namesRead(t = cssTables()): string[] {
  const files = (dir: string): string[] =>
    readdirSync(join(root, dir)).flatMap((e) => {
      const rel = join(dir, e)
      return statSync(join(root, rel)).isDirectory() ? files(rel) : /\.(css|tsx)$/.test(rel) ? [rel] : []
    })
  const src = [...files('src/components'), 'src/styles/base.css', 'site/site.css', ...files('site/components')].map(read).join('\n')
  return [...new Set([...src.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((m) => m[1]))].filter((n) => t.light.has(n)).sort()
}

// ── CSS name → the path okchroma's plugin writes ─────────────────────────────────────────────
// The plugin nests the stamp (`stamp/fill`), puts the primary under `brand/primary`, the
// secondary under `brand/alt`, the planes and alphas under `system/`, and the link trio under
// `system/link/default`. check.ts confirms every mapped path exists, so a plugin that renames
// fails the check rather than the build.
export const ROLE_COLLECTION = 'theme' // the collection the plugin writes the role layer to
const STAMP: Record<string, string> = {
  'stamp-fill': 'stamp/fill',
  'stamp-fill-hover': 'stamp/fill-hover',
  'stamp-fill-pressed': 'stamp/fill-pressed',
  'stamp-edge': 'stamp/edge',
  'stamp-on': 'stamp/on',
}
const leaf = (l: string) => STAMP[l] ?? l
export function figmaPath(cssName: string): string | undefined {
  const n = cssName.replace(/^--/, '')
  let m: RegExpExecArray | null
  if ((m = /^surface-(dim|low|mid|high)$/.exec(n))) return `system/surface/${m[1]}`
  if (n === 'scrim' || n === 'abs-black-060') return 'system/alpha/abs-black-060'
  if ((m = /^shadow-(04|08|12)$/.exec(n))) return `system/alpha/shadow-${m[1]}`
  if ((m = /^link(-inverse)?(?:-(hover|pressed))?$/.exec(n))) return `system/link/${m[1] ? 'inverse' : 'default'}/${m[2] ?? 'enabled'}`
  if (n === 'disabled-opacity') return 'disabled-opacity' // kitchenUI's, in its foundations collection
  if (n === 'alpha-transparent') return 'system/alpha/transparent'
  if (n === 'pen-100' || n === 'paper-0') return `neutral/${n}` // the poles, which the plugin files under the neutral
  if ((m = /^brand-alt-(.+)$/.exec(n))) return `brand/alt/${leaf(m[1])}`
  if ((m = /^brand-(.+)$/.exec(n))) return `brand/primary/${leaf(m[1])}`
  if ((m = /^(neutral|critical|warning|positive|info)-(.+)$/.exec(n))) return `${m[1]}/${leaf(m[2])}`
  return undefined
}

// ── The foundations as Figma variables ───────────────────────────────────────────────────────
// Figma keeps a FLOAT variable as a 32-bit float: a value written as 12.8 reads back as
// 12.800000190734863. Anything that shows or compares a value rounds first.
// One per token in foundations.json, scoped by role, Web code syntax the CSS name. Figma cannot
// load the reader's system stack, so one family stands in per font token: Inter for text is the
// owner's placeholder, expected to change. Leading is a ratio; Figma binds line height in px, so
// it stays hidden and the text styles carry the product. Motion and elevation are not variables:
// nothing in Figma animates, and elevation is two effect styles bound to okchroma's shadows.
export type FigmaVar = { name: string; css: string; type: 'FLOAT' | 'STRING'; value: number | string; scopes: string[] }
const FONT_STAND_IN: Record<string, string> = { sans: 'Inter', mono: 'Roboto Mono' }
const REM = 16
export function foundationVars(): FigmaVar[] {
  const source = JSON.parse(read('src/tokens/foundations.json')) as Record<string, Record<string, { $type: string; $value: unknown }>>
  const vars: FigmaVar[] = []
  const add = (group: string, key: string, type: FigmaVar['type'], value: number | string, scopes: string[]) =>
    vars.push({ name: `${group}/${key}`, css: `--${group}-${key}`, type, value, scopes })
  const px = (v: { value: number; unit: string }) => (v.unit === 'rem' ? v.value * REM : v.value)
  for (const [group, node] of Object.entries(source)) {
    if (group.startsWith('$')) continue
    for (const [key, t] of Object.entries(node)) {
      if (key.startsWith('$')) continue
      const v = t.$value as never
      switch (group) {
        case 'font': add(group, key, 'STRING', FONT_STAND_IN[key] ?? (v as string[])[0], ['FONT_FAMILY']); break
        case 'type': add(group, key, 'FLOAT', px(v), ['FONT_SIZE']); break
        case 'leading': add(group, key, 'FLOAT', v as number, []); break
        case 'weight': add(group, key, 'FLOAT', v as number, ['FONT_WEIGHT']); break
        case 'space': add(group, key, 'FLOAT', px(v), ['GAP', 'WIDTH_HEIGHT']); break
        case 'radius': add(group, key, 'FLOAT', px(v), ['CORNER_RADIUS']); break
        case 'elevation': case 'duration': case 'ease': break
        default: throw new Error(`figma foundations: no Figma emit for group "${group}"`)
      }
    }
  }
  return vars
}

// okchroma's disabled opacity is 0.38 in CSS. A Figma opacity binding reads a FLOAT as a
// percentage, so the variable holds 38; the code syntax still says var(--disabled-opacity).
export function disabledOpacityVar(): FigmaVar {
  return { name: 'disabled-opacity', css: '--disabled-opacity', type: 'FLOAT', value: DISABLED_OPACITY * 100, scopes: ['OPACITY'] }
}

// ── JS shared by the generated scripts: find a variable by name, resolve a color per mode ────
// Both of the plugin's collections declare `system/surface/*`; the role collection is preferred.
export const RESOLVER_JS = `
const collections = await figma.variables.getLocalVariableCollectionsAsync()
const vars = await figma.variables.getLocalVariablesAsync()
const collById = new Map(collections.map((c) => [c.id, c]))
const byId = new Map(vars.map((v) => [v.id, v]))
const byName = new Map()
for (const v of vars) {
  const prev = byName.get(v.name)
  if (!prev || collById.get(v.variableCollectionId).name === ${JSON.stringify(ROLE_COLLECTION)}) byName.set(v.name, v)
}
const modeColl = collections.find((c) => c.modes.some((m) => m.name === 'Light') && c.modes.some((m) => m.name === 'Dark'))
const modeIdOf = (name) => modeColl.modes.find((m) => m.name === name).modeId
const hex = (c) => {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0')
  return h(c.r) + h(c.g) + h(c.b) + (c.a !== undefined && c.a < 1 ? '@' + Math.round(c.a * 100) / 100 : '')
}
// a value: a literal, an alias, or a compose-color expression (a base color at an opacity),
// which the API reads but a script cannot write; the owner authors those by hand
const evalValue = (val, modeName, depth) => {
  if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') return resolveRgba(byId.get(val.id), modeName, depth + 1)
  if (val && typeof val === 'object' && val.type === 'VARIABLE_EXPRESSION' && val.expressionFunction === 'COMPOSE_COLOR') {
    const [base, opacity] = val.expressionArguments.map((a) => evalValue(a && a.value !== undefined ? a.value : a, modeName, depth + 1))
    if (!base || typeof base !== 'object') return null
    const alpha = typeof opacity === 'number' ? (opacity > 1 ? opacity / 100 : opacity) : base.a
    return { r: base.r, g: base.g, b: base.b, a: alpha }
  }
  if (val && typeof val === 'object' && 'r' in val) return val
  return val
}
const resolveRgba = (v, modeName, depth = 0) => {
  if (!v || depth > 12) return null
  const coll = collById.get(v.variableCollectionId)
  const mid = modeColl && coll.id === modeColl.id ? modeIdOf(modeName) : (coll.modes.find((m) => m.name === modeName) || coll.modes[0]).modeId
  return evalValue(v.valuesByMode[mid], modeName, depth)
}
const resolve = (v, modeName) => {
  const r = resolveRgba(v, modeName)
  if (r && typeof r === 'object' && 'r' in r) return hex(r)
  return r === null || r === undefined ? '?' : String(r)
}
`
