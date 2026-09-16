// Prints the Plugin API script that puts the roster into a Figma file whose variables
// okchroma's extended plugin has already written. Two things are printed:
//
//   1. The interaction register as one collection, `role`, whose modes are the families and
//      whose variables are the register's generic rows. Alias rows point at the plugin's
//      variables; the rows the engine composes (a family's tint at an opacity rung) collapse
//      to one row, `tint`, and the rung rides the paint's opacity, since the Plugin API cannot
//      write a compose-color expression. A `ladder` collection carries the rungs as numbers.
//   2. Component sets on a page of their own: Button (Tier x State, bound to `role` rows so
//      an instance picks its family by the collection's mode, the way the theme prop does in
//      code), Input (State, bound to the roster), and Dialog (overlay and panel).
//
//   node scripts/figma/print.ts          plugin form: ends with figma.closePlugin(summary)
//   node scripts/figma/print.ts --mcp    MCP form: ends with `return summary`
//
// Nothing is destroyed: a set or collection that already exists is updated or left alone and
// reported. Run through the Figma MCP server, or save the plugin form as
// scripts/figma/plugin/code.js and load that folder as a development plugin.
import {
  INTERACTION_FAMILIES,
  INTERACTION_LADDER,
  INTERACTION_ROWS,
  interactionRows,
  interactionTintName,
  resolveTheme,
  themeTokens,
  interactionTokens,
  type InteractionRow,
} from 'okchroma'
import { figmaPath } from './lib.ts'
import { BRANDS, DEFAULT_BRAND, PROFILE } from '../../packages/theme/src/brands.ts'

const mcp = process.argv.includes('--mcp')

// The print binds by name, so any brand's emission gives the same script; the default's is read.
const e = BRANDS[DEFAULT_BRAND]
const theme = resolveTheme({ primaryHex: e.primaryHex, name: DEFAULT_BRAND, secondaryHex: e.secondaryHex ?? null, secondaryStyle: e.secondaryStyle, deriveSecondary: !e.secondaryHex, contrastProfile: PROFILE })
const tokens = interactionTokens(
  themeTokens({
    slug: DEFAULT_BRAND,
    displayName: DEFAULT_BRAND,
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

const FAMILIES = [...INTERACTION_FAMILIES]
const isRung = (row: InteractionRow) => /^(subtle|hint)-bg-/.test(row)
const aliasTarget = (family: string, row: InteractionRow): string => {
  // interactionRows gives the alias rows as var(--name); the name is what the plugin wrote
  const pair = interactionRows(family, 'light', tokens).find(([r]) => r === row)
  const m = pair && /^var\(--([^)]+)\)$/.exec(pair[1])
  if (!m) throw new Error(`${family}-${row} is not an alias row`)
  const path = figmaPath(m[1])
  if (!path) throw new Error(`no plugin path for ${m[1]}`)
  return path
}

type Row = { name: string; css: string | null; scopes: string[]; aliases: string[]; description: string }
const rows: Row[] = []
for (const row of INTERACTION_ROWS) {
  if (isRung(row)) continue
  const isText = /^(fg|solid-fg)/.test(row)
  rows.push({
    name: row,
    css: `--${row}`,
    scopes: isText ? ['TEXT_FILL'] : row === 'solid-border' ? ['STROKE_COLOR'] : ['FRAME_FILL', 'SHAPE_FILL'],
    aliases: FAMILIES.map(f => aliasTarget(f, row)),
    description: `The register's ${row} row; the mode picks the family.`,
  })
}
rows.push({
  name: 'tint',
  css: null,
  scopes: ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR'],
  aliases: FAMILIES.map(f => {
    const p = figmaPath(interactionTintName(f))
    if (!p) throw new Error(`no plugin path for the tint of ${f}`)
    return p
  }),
  description: 'The family’s highlighter-26, or the pole for the pole families: the layer every subtle, hint and outline ground is made of, at a rung from the ladder.',
})
const ladder = (['subtle', 'hint'] as const).flatMap(tier =>
  (['enabled', 'hover', 'pressed', 'selected'] as const).map(state => ({
    name: `${tier}/${state}`,
    value: (INTERACTION_LADDER[tier][state] ?? 0) / 100,
  })),
)

// what each Button variant binds, per tier and state
const TIERS = ['solid', 'subtle', 'hint', 'outline'] as const
const STATES = ['enabled', 'hover', 'pressed', 'disabled'] as const
const buttonVariants = TIERS.flatMap(tier =>
  STATES.map(state => {
    const s = state === 'disabled' ? 'enabled' : state
    const ground =
      tier === 'solid'
        ? { row: `solid-bg-${s}`, opacity: 1 }
        : { row: 'tint', opacity: ladder.find(l => l.name === `${tier === 'outline' ? 'hint' : tier}/${s}`)!.value }
    const text = tier === 'solid' ? 'solid-fg' : tier === 'subtle' ? 'fg' : 'fg-on-hint'
    const stroke = tier === 'solid' ? 'solid-border' : tier === 'outline' ? 'tint' : null
    return { tier, state, ground, text, stroke, opacity: state === 'disabled' ? Number(tokens.light['disabled-opacity']) : 1 }
  }),
)
const inputVariants = [
  { state: 'enabled', stroke: figmaPath('neutral-highlighter-26') },
  { state: 'focus', stroke: figmaPath('brand-highlighter-26') },
  { state: 'invalid', stroke: figmaPath('critical-highlighter-26') },
]
const paths = {
  surfaceHigh: figmaPath('surface-high'),
  scrim: figmaPath('scrim'),
  chalk: figmaPath('neutral-chalk-11'),
  text: figmaPath('neutral-pen-70'),
  placeholder: figmaPath('neutral-pencil-47'),
}

const body = `
const PAGE = 'okchroma-tamagui print'
const FAMILIES = ${JSON.stringify(FAMILIES)}
const ROWS = ${JSON.stringify(rows)}
const LADDER = ${JSON.stringify(ladder)}
const BUTTON = ${JSON.stringify(buttonVariants)}
const INPUT = ${JSON.stringify(inputVariants)}
const PATHS = ${JSON.stringify(paths)}
const summary = { created: [], updated: [], skipped: [], missing: [] }

const collections = await figma.variables.getLocalVariableCollectionsAsync()
const vars = await figma.variables.getLocalVariablesAsync()
const collById = new Map(collections.map(c => [c.id, c]))
const byName = new Map()
for (const v of vars) { const prev = byName.get(v.name); if (!prev || collById.get(v.variableCollectionId).name === 'theme') byName.set(v.name, v) }
const isExpression = val => !!(val && typeof val === 'object' && val.type === 'VARIABLE_EXPRESSION')

// ── 1. the register as the \`role\` collection, one mode per family ──────────
let role = collections.find(c => c.name === 'role')
if (!role) { role = figma.variables.createVariableCollection('role'); role.renameMode(role.modes[0].modeId, FAMILIES[0]); summary.created.push('collection role') }
const modeId = {}
for (const f of FAMILIES) { const m = role.modes.find(x => x.name === f); modeId[f] = m ? m.modeId : role.addMode(f) }
const mine = new Map((await figma.variables.getLocalVariablesAsync()).filter(v => v.variableCollectionId === role.id).map(v => [v.name, v]))
const roleVar = {}
for (const r of ROWS) {
  let v = mine.get(r.name)
  if (v) summary.updated.push('role/' + r.name); else { v = figma.variables.createVariable(r.name, role, 'COLOR'); summary.created.push('role/' + r.name) }
  roleVar[r.name] = v
  FAMILIES.forEach((f, i) => {
    const target = byName.get(r.aliases[i])
    if (!target) { summary.missing.push(r.aliases[i]); return }
    if (isExpression(v.valuesByMode[modeId[f]])) { summary.skipped.push('role/' + r.name + ' @ ' + f + ' (hand-authored)'); return }
    v.setValueForMode(modeId[f], figma.variables.createVariableAlias(target))
  })
  v.scopes = r.scopes
  if (r.css) v.setVariableCodeSyntax('WEB', 'var(' + r.css + ')')
  v.description = r.description
}
let lad = collections.find(c => c.name === 'ladder')
if (!lad) { lad = figma.variables.createVariableCollection('ladder'); lad.renameMode(lad.modes[0].modeId, 'Value'); summary.created.push('collection ladder') }
const ladMine = new Map((await figma.variables.getLocalVariablesAsync()).filter(v => v.variableCollectionId === lad.id).map(v => [v.name, v]))
for (const r of LADDER) {
  const v = ladMine.get(r.name) || figma.variables.createVariable(r.name, lad, 'FLOAT')
  v.setValueForMode(lad.modes[0].modeId, r.value)
  v.scopes = ['OPACITY']
  v.description = 'The rung this tier takes in this state, as the opacity of a tint layer.'
}

// ── 2. the component sets on their own page ─────────────────────────────────
let page = figma.root.children.find(p => p.name === PAGE)
if (!page) { page = figma.createPage(); page.name = PAGE; summary.created.push('page ' + PAGE) }
await figma.setCurrentPageAsync(page)
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })

// A plain paint with the binding written in. Opacity is never put on a bound paint: the
// Plugin API does not keep it reliably. A rung rides a ground layer's own opacity instead
// (see ground below), which the renderer always honors.
const solid = variable => ({ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, boundVariables: { color: { type: 'VARIABLE_ALIAS', id: variable.id } } })
// a translucent ground: a rectangle stretched behind the frame's content, the tint bound at
// full strength and the rung as the layer's opacity
const ground = (parent, variable, opacity) => {
  const r = figma.createRectangle(); r.name = 'ground'; parent.insertChild(0, r)
  r.layoutPositioning = 'ABSOLUTE'; r.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' }
  r.x = 0; r.y = 0; r.resize(parent.width, parent.height); r.cornerRadius = parent.cornerRadius
  r.fills = [solid(variable)]; r.opacity = opacity
  return r
}
const themeVar = path => { const v = byName.get(path); if (!v) summary.missing.push(path); return v }
const text = (chars, style, variable) => {
  const t = figma.createText(); t.fontName = { family: 'Inter', style }; t.characters = chars; t.fontSize = 15
  if (variable) t.fills = [solid(variable)]
  return t
}
// text that fills its parent's width and wraps
const paragraph = (parent, chars, style, variable) => {
  const t = text(chars, style, variable); parent.appendChild(t)
  t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'
  return t
}
const frame = (name, w, h, padding) => {
  const f = figma.createFrame(); f.name = name; f.resize(w, h)
  f.layoutMode = 'HORIZONTAL'; f.primaryAxisAlignItems = 'CENTER'; f.counterAxisAlignItems = 'CENTER'
  f.paddingLeft = f.paddingRight = padding; f.paddingTop = f.paddingBottom = padding * 0.6
  f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.cornerRadius = 8; f.itemSpacing = 8
  f.strokeWeight = 1; f.strokes = []
  return f
}
const existingSet = name => page.children.find(n => n.type === 'COMPONENT_SET' && n.name === name)

// Button: Tier x State, family by the role collection's mode on the instance
if (existingSet('Button')) summary.skipped.push('Button set exists; left as is')
else {
  const comps = []
  for (const v of BUTTON) {
    const c = figma.createComponent(); c.name = 'Tier=' + v.tier + ', State=' + v.state
    const f = frame('button', 100, 40, 16)
    f.fills = []
    if (v.stroke) f.strokes = [solid(roleVar[v.stroke])]
    f.appendChild(text('Label', 'Medium', roleVar[v.text]))
    // the solid tier fills the frame itself; a translucent tier gets a ground layer at its rung
    if (v.ground.opacity === 1) f.fills = [solid(roleVar[v.ground.row])]
    else if (v.ground.opacity > 0) ground(f, roleVar[v.ground.row], v.ground.opacity)
    c.appendChild(f); c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO'
    c.fills = []; c.opacity = v.opacity
    comps.push(c)
  }
  const set = figma.combineAsVariants(comps, page); set.name = 'Button'
  set.layoutMode = 'VERTICAL'; set.itemSpacing = 12; set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 16
  set.description = 'Family is the role collection\\'s mode on the instance. In code: theme="<family>_<tier>".'
  summary.created.push('Button set (' + comps.length + ' variants)')
}

// Input: State, bound to the roster
if (existingSet('Input')) summary.skipped.push('Input set exists; left as is')
else {
  const comps = []
  for (const v of INPUT) {
    const c = figma.createComponent(); c.name = 'State=' + v.state
    const f = frame('input', 240, 40, 12); f.primaryAxisSizingMode = 'FIXED'; f.resize(240, 40); f.primaryAxisAlignItems = 'MIN'
    const bg = themeVar(PATHS.surfaceHigh); if (bg) f.fills = [solid(bg)]
    const stroke = themeVar(v.stroke); if (stroke) { f.strokes = [solid(stroke)]; f.strokeWeight = v.state === 'enabled' ? 1 : 1.5 }
    const ph = themeVar(v.state === 'invalid' ? PATHS.text : PATHS.placeholder)
    f.appendChild(text(v.state === 'invalid' ? 'not an address' : 'Placeholder', 'Regular', ph))
    c.appendChild(f); c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO'
    c.fills = []
    comps.push(c)
  }
  const set = figma.combineAsVariants(comps, page); set.name = 'Input'
  set.layoutMode = 'VERTICAL'; set.itemSpacing = 12; set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 16
  set.description = 'In code: <Input> and <Input theme="critical"> for the invalid state; focus is the platform\\'s.'
  summary.created.push('Input set (' + comps.length + ' variants)')
}

// Dialog: overlay and panel
if (page.children.some(n => n.type === 'COMPONENT' && n.name === 'Dialog')) summary.skipped.push('Dialog exists; left as is')
else {
  const c = figma.createComponent(); c.name = 'Dialog'; c.resize(600, 400)
  const overlay = figma.createRectangle(); overlay.name = 'overlay'; overlay.resize(600, 400)
  const scrim = themeVar(PATHS.scrim); if (scrim) overlay.fills = [solid(scrim)]
  c.appendChild(overlay)
  const panel = frame('panel', 360, 160, 24); panel.layoutMode = 'VERTICAL'; panel.primaryAxisAlignItems = 'MIN'; panel.counterAxisAlignItems = 'MIN'
  panel.primaryAxisSizingMode = 'AUTO'; panel.counterAxisSizingMode = 'FIXED'; panel.resize(360, 160); panel.cornerRadius = 12; panel.itemSpacing = 12
  const bg = themeVar(PATHS.surfaceHigh); if (bg) panel.fills = [solid(bg)]
  const edge = themeVar(PATHS.chalk); if (edge) panel.strokes = [solid(edge)]
  const ink = themeVar(PATHS.text)
  c.fills = []
  c.appendChild(panel); panel.x = 120; panel.y = 120
  paragraph(panel, 'Delete this account?', 'Semi Bold', ink)
  paragraph(panel, 'The account and its mail are removed. This cannot be undone.', 'Regular', ink)
  c.description = 'Overlay on the scrim, panel on surface-high with the chalk-11 edge; in code, Tamagui\\'s Dialog under the DialogOverlay and DialogContent themes.'
  summary.created.push('Dialog component')
}
summary.missing = [...new Set(summary.missing)]
`

const out = mcp
  ? `// GENERATED by scripts/figma/print.ts (MCP form). Paste into the Figma MCP server's script runner.\n${body}\nreturn summary\n`
  : `// GENERATED by scripts/figma/print.ts (plugin form). Save as scripts/figma/plugin/code.js and load that folder as a development plugin.\n(async () => {${body}\nfigma.closePlugin(JSON.stringify(summary))\n})()\n`
process.stdout.write(out)
process.stderr.write(`print: ${rows.length} role rows, ${ladder.length} ladder rows, ${buttonVariants.length} Button variants, ${inputVariants.length} Input variants, ${mcp ? 'MCP' : 'plugin'} form\n`)
