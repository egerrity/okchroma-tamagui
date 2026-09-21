// Prints the Plugin API script that puts the roster into a Figma file whose variables
// okchroma's extended plugin has already written. Two things are printed:
//
//   1. The interaction register as one collection, `role`, whose modes are the families and
//      whose variables are the register's generic rows. Alias rows point at the plugin's
//      variables; the rows the engine composes (a family's tint at an opacity rung) collapse
//      to one row, `tint`, and the rung rides the paint's opacity, since the Plugin API cannot
//      write a compose-color expression. A `ladder` collection carries the rungs as numbers.
//   2. Component sets on a page of their own: Button (Kind x State, bound to `role` rows so
//      an instance picks its family by the collection's mode, the way the theme prop does in
//      code), Chip (Selected x State: off bound to the neutral roster, on to the stamp rows)
//      and IndicatorChip (Level x Size on the scale stops the levels read), Input (State,
//      bound to the roster), and Dialog (overlay and panel).
//
//   node scripts/figma/print.ts          plugin form: logs the summary and closes with one line of it
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
// the scale stops the chip levels read, family by mode; the pole families have none
const STOP_ROWS = [
  { name: 'paper-3', scopes: ['FRAME_FILL', 'SHAPE_FILL'], description: 'The family\u2019s paper-3, the default chip\u2019s ground.' },
  { name: 'chalk-11', scopes: ['FRAME_FILL', 'SHAPE_FILL', 'STROKE_COLOR'], description: 'The family\u2019s chalk-11, the strong chip\u2019s ground.' },
  { name: 'chalk-15', scopes: ['STROKE_COLOR'], description: 'The family\u2019s chalk-15, the default chip\u2019s edge.' },
  { name: 'chalk-20', scopes: ['STROKE_COLOR'], description: 'The family\u2019s chalk-20, the strong chip\u2019s edge.' },
  { name: 'pencil-47', scopes: ['TEXT_FILL'], description: 'The family\u2019s pencil-47, the default chip\u2019s text.' },
  { name: 'pen-58', scopes: ['TEXT_FILL'], description: 'The family\u2019s pen-58, the strong chip\u2019s text.' },
]
for (const r of STOP_ROWS) {
  rows.push({
    name: r.name,
    css: null,
    scopes: r.scopes,
    aliases: FAMILIES.map(f => {
      if (f === 'neutral-strong' || f === 'neutral-inverse') return 'system/alpha/transparent'
      const p = figmaPath(`${f}-${r.name}`)
      if (!p) throw new Error(`no plugin path for ${f}-${r.name}`)
      return p
    }),
    description: r.description + ' The pole families have none.',
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

// what each Button variant binds: Kind x State. The hierarchy is the family inside the
// solid tier; outline and ghost are shapes on the hint tier; the toggle is the outline shape
// on the subtle tier's ladder while it is on (decision 26).
const KINDS = { primary: 'solid', outline: 'outline', ghost: 'hint', toggle: 'outline' } as const
const KIND_NAMES = Object.keys(KINDS) as (keyof typeof KINDS)[]
const STATES = ['enabled', 'hover', 'pressed', 'disabled'] as const
const buttonVariants = KIND_NAMES.flatMap(kind =>
  STATES.map(state => {
    const tier = KINDS[kind]
    const s = state === 'disabled' ? 'enabled' : state
    const ground =
      tier === 'solid'
        ? { row: `solid-bg-${s}`, opacity: 1 }
        : { row: 'tint', opacity: ladder.find(l => l.name === `${kind === 'toggle' ? 'subtle' : 'hint'}/${s}`)!.value }
    const text = tier === 'solid' ? 'solid-fg' : 'fg-on-hint'
    const stroke = tier === 'solid' ? 'solid-border' : tier === 'outline' ? 'tint' : null
    return { kind, state, ground, text, stroke, opacity: state === 'disabled' ? Number(tokens.light['disabled-opacity']) : 1 }
  }),
)
// the button chip: Selected x State. Off is the neutral stamp, bound to the roster directly;
// on is the family's stamp through the role rows; each side takes its stamp's own hover and
// pressed fills.
const CHIP_STATES = ['enabled', 'hover', 'pressed', 'disabled'] as const
const chipVariants = [false, true].flatMap(on =>
  CHIP_STATES.map(state => ({
    on,
    state,
    ground: on
      ? { row: state === 'hover' ? 'solid-bg-hover' : state === 'pressed' ? 'solid-bg-pressed' : 'solid-bg-enabled' }
      : { path: figmaPath(state === 'hover' ? 'neutral-stamp-fill-hover' : state === 'pressed' ? 'neutral-stamp-fill-pressed' : 'neutral-stamp-fill') },
    text: on ? { row: 'solid-fg' } : { path: figmaPath('neutral-stamp-on') },
    stroke: on ? { row: 'solid-border' } : { path: figmaPath('neutral-stamp-edge') },
    opacity: state === 'disabled' ? Number(tokens.light['disabled-opacity']) : 1,
  })),
)
// the tag chip: Level x Size on the stops the display group names (mirrored here as role rows)
const LEVELS = {
  stamp: { fill: 'solid-bg-enabled', text: 'solid-fg', stroke: 'solid-border' },
  strong: { fill: 'chalk-11', text: 'pen-58', stroke: 'chalk-20' },
  default: { fill: 'paper-3', text: 'pencil-47', stroke: 'chalk-15' },
} as const
const LEVEL_NAMES = Object.keys(LEVELS) as (keyof typeof LEVELS)[]
const indicatorVariants = LEVEL_NAMES.flatMap(level =>
  [{ size: 'md', height: 32 }, { size: 'sm', height: 24 }].map(s => ({ level, ...s, ground: LEVELS[level].fill, text: LEVELS[level].text, stroke: LEVELS[level].stroke })),
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
const CHIP = ${JSON.stringify(chipVariants)}
const INDICATOR = ${JSON.stringify(indicatorVariants)}
const FAMILIES = ${JSON.stringify(FAMILIES)}
const ROWS = ${JSON.stringify(rows)}
const LADDER = ${JSON.stringify(ladder)}
const BUTTON = ${JSON.stringify(buttonVariants)}
const INPUT = ${JSON.stringify(inputVariants)}
const PATHS = ${JSON.stringify(paths)}

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
// A missing variable is reported in the summary by whoever looked it up; the paint it would
// have bound stays an unbound black so the print finishes and the summary can be read.
const solid = variable => variable
  ? { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, boundVariables: { color: { type: 'VARIABLE_ALIAS', id: variable.id } } }
  : { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }
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

// Button: Kind x State (primary, outline, ghost, toggle shown on), family by the role collection's mode on the instance
if (existingSet('Button')) summary.skipped.push('Button set exists; left as is')
else {
  const comps = []
  for (const v of BUTTON) {
    const c = figma.createComponent(); c.name = 'Kind=' + v.kind + ', State=' + v.state
    const f = frame('button', 100, 40, 16); f.cornerRadius = 10000
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
  set.description = 'Family is the role collection\\'s mode on the instance. In code: primary theme="<family>_solid", outline "<family>_outline", ghost "<family>_hint", toggle "<family>_outline" with selected while on.'
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

// Chip: the button chip, Selected x State, a soft square on the chip corner; off is the neutral stamp, on the family's stamp by the role collection's mode
if (existingSet('Chip')) summary.skipped.push('Chip set exists; left as is')
else {
  const comps = []
  const paint = ref => ref.row ? roleVar[ref.row] : themeVar(ref.path)
  for (const v of CHIP) {
    const c = figma.createComponent(); c.name = 'Selected=' + (v.on ? 'on' : 'off') + ', State=' + v.state
    const f = frame('chip', 80, 32, 12); f.cornerRadius = 6; f.paddingTop = f.paddingBottom = 4
    f.fills = [solid(paint(v.ground))]
    f.strokes = [solid(paint(v.stroke))]
    f.appendChild(text(v.on ? '✓ Label' : 'Label', 'Medium', paint(v.text))); f.children[f.children.length - 1].fontSize = 14
    c.appendChild(f); c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO'
    c.fills = []; c.opacity = v.opacity
    comps.push(c)
  }
  const set = figma.combineAsVariants(comps, page); set.name = 'Chip'
  set.layoutMode = 'VERTICAL'; set.itemSpacing = 12; set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 16
  set.description = 'The button chip: off on the neutral stamp, on on the family\\'s stamp, the family by the role collection\\'s mode. In code: <Chip theme="<family>_chip" selected>.'
  summary.created.push('Chip set (' + comps.length + ' variants)')
}

// IndicatorChip: the tag chip, Level x Size, on the level's stops; family by the role collection's mode
if (existingSet('IndicatorChip')) summary.skipped.push('IndicatorChip set exists; left as is')
else {
  const comps = []
  for (const v of INDICATOR) {
    const c = figma.createComponent(); c.name = 'Level=' + v.level + ', Size=' + v.size
    const f = frame('indicator', 80, v.height, v.size === 'sm' ? 8 : 12); f.cornerRadius = 6; f.paddingTop = f.paddingBottom = 4
    f.fills = []
    f.fills = [solid(roleVar[v.ground])]
    f.strokes = [solid(roleVar[v.stroke])]
    f.appendChild(text('Label', 'Medium', roleVar[v.text])); f.children[f.children.length - 1].fontSize = 14
    c.appendChild(f); c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO'
    c.fills = []
    comps.push(c)
  }
  const set = figma.combineAsVariants(comps, page); set.name = 'IndicatorChip'
  set.layoutMode = 'VERTICAL'; set.itemSpacing = 12; set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 16
  set.description = 'The indicator chip, a label that takes no press. Family is the role collection\\'s mode. In code: <IndicatorChip theme="<family>_indicator-<level>">.'
  summary.created.push('IndicatorChip set (' + comps.length + ' variants)')
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

// Both forms declare the summary outside the printed body and run the body under try, so an
// error ends the run with the summary still reported instead of a plugin that never closes.
const summaryDecl = `const summary = { created: [], updated: [], skipped: [], missing: [], error: null }`
const summaryLine = `'print: created ' + summary.created.length + ', updated ' + summary.updated.length + ', skipped ' + summary.skipped.length + ', missing ' + summary.missing.length + (summary.error ? ', stopped on an error' : '') + '; details in the console'`
const out = mcp
  ? `// GENERATED by scripts/figma/print.ts (MCP form). Paste into the Figma MCP server's script runner.\n${summaryDecl}\ntry {${body}\n} catch (e) { summary.error = String((e && e.stack) || e) }\nreturn summary\n`
  : `// GENERATED by scripts/figma/print.ts (plugin form). Save as scripts/figma/plugin/code.js and load that folder as a development plugin.\n(async () => {\n${summaryDecl}\ntry {${body}\n} catch (e) { summary.error = String((e && e.stack) || e) }\nconsole.log('okchroma-tamagui print', JSON.stringify(summary, null, 1))\nfigma.closePlugin(${summaryLine})\n})()\n`
process.stdout.write(out)
process.stderr.write(`print: ${rows.length} role rows, ${ladder.length} ladder rows, ${buttonVariants.length} Button, ${chipVariants.length} Chip, ${indicatorVariants.length} IndicatorChip, ${inputVariants.length} Input variants, ${mcp ? 'MCP' : 'plugin'} form\n`)
