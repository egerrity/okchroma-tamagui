// Prints the use_figma script that writes okchroma's interaction register into the file as one
// collection, `role` (the owner's name), whose modes are the register's families and whose variables are its
// generic rows, so an instance picks a family by mode the way a component picks it by
// `data-family` in interactionCss. Solid and text rows alias the roster variables the plugin
// wrote and resolve light or dark through them. The rows the engine composes (a family's tint at
// an opacity rung) collapse to one row, `tint`: the state-layer components bind it and carry the
// rung on their paint, since the plugin API cannot write a compose-color expression. Web code
// syntax is the generic name (`var(--solid-bg-hover)`); `tint` has none, being composed in CSS.
// The ladder, the rung each tier takes per state, is a second single-mode collection whose rows
// alias the plugin's opacity numbers, so a state layer binds tint and a ladder row and nothing
// is typed in.
//
//   node scripts/figma/interaction.ts [--from <path to an okchroma dist-lib/index.mjs>]
//
// --from runs a build other than the installed one; the register arrived in okchroma 0.6.0.
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { root, figmaPath } from './lib.ts'

const fromIdx = process.argv.indexOf('--from')
const spec = fromIdx > -1 ? pathToFileURL(process.argv[fromIdx + 1]).href : 'okchroma'
const ok = await import(spec)
if (!ok.interactionRows) throw new Error(`the okchroma at ${spec} has no interaction register (0.6.0 or later)`)

const brand = JSON.parse(readFileSync(new URL('src/tokens/brand.json', pathToFileURL(root)), 'utf8'))
const theme = ok.resolveTheme({ primaryHex: brand.primaryHex, name: brand.slug, secondaryHex: brand.secondaryHex, secondaryStyle: brand.secondaryStyle })
const tokens = ok.themeTokens({
  slug: brand.slug, displayName: brand.name, brand: theme.themed, secondary: theme.secondary?.scale ?? null,
  secondaryStyle: theme.secondary?.style, neutralLevel: brand.neutralLevel, ctaEscape: false, linkHex: null, ctaBorder: true,
})

const FAMILIES = ok.INTERACTION_FAMILIES as string[]
const ROWS = ok.INTERACTION_ROWS as string[]
const rowPath = (row: string) => { const m = /^(solid|subtle|hint)-(.+)$/.exec(row); return m ? `${m[1]}/${m[2]}` : row }
const scopesOf = (row: string) =>
  /border$/.test(row) ? ['STROKE_COLOR'] : /(^|-)fg(-|$)/.test(row) ? ['TEXT_FILL', 'SHAPE_FILL'] : ['FRAME_FILL', 'SHAPE_FILL']
const pathOf = (cssName: string, where: string) => {
  const p = figmaPath(cssName)
  if (!p) throw new Error(`interaction: no Figma path for ${cssName} (${where})`)
  return p
}

// per row: the alias per family (light and dark agree on the target by construction). The rows
// the engine composes (a family's tint at an opacity rung) collapse to one row, `tint`, aliased
// to the tint itself: the rung lives on the state layer's paint in Figma, and in the composed
// name in CSS, so those seven rows are not written and are reported for the owner to retire.
type Row = { name: string; css: string | null; scopes: string[]; aliases: string[]; description: string }
const rows: Row[] = []
const composed: string[] = []
const rungs = new Map<string, string>()
for (const row of ROWS) {
  const aliases: string[] = []
  let isComposed = false
  for (const family of FAMILIES) {
    const light = new Map<string, string>(ok.interactionRows(family, 'light', tokens)).get(row)!
    const dark = new Map<string, string>(ok.interactionRows(family, 'dark', tokens)).get(row)!
    let m: RegExpExecArray | null
    if ((m = /^var\(\s*(--[a-z0-9-]+)\s*\)$/.exec(light))) {
      if (dark !== light) throw new Error(`interaction: ${family} ${row} aliases differently per mode (${light} / ${dark})`)
      aliases.push(pathOf(m[1], `${family} ${row}`))
    } else if ((m = /^rgba\(.*,\s*([\d.]+)\s*\)$/.exec(light))) {
      isComposed = true
      rungs.set(row, ok.opacityVarName(Math.round(Number(m[1]) * 100)) as string)
    } else throw new Error(`interaction: unrecognized value "${light}" (${family} ${row})`)
  }
  if (isComposed) { composed.push(rowPath(row)); continue }
  rows.push({ name: rowPath(row), css: `--${row}`, scopes: scopesOf(row), aliases, description: 'the family’s row, aliased to the roster' })
}
rows.push({
  name: 'tint', css: null, scopes: ['FRAME_FILL', 'SHAPE_FILL'],
  aliases: FAMILIES.map((family) => pathOf('--' + ok.interactionTintName(family), `${family} tint`)),
  description: 'the family’s tint: highlighter-26, or the pole for neutral-strong and neutral-inverse. A state layer binds it and puts the rung on the paint (' +
    [...rungs.entries()].map(([r, o]) => `${rowPath(r)} ${o}`).join(', ') + '); in CSS the register composes the same, as --subtle-bg-hover and the rest.',
})
// the ladder: the rung each translucent tier takes per state, one single-mode collection, each
// row an alias to the plugin's opacity number (a percentage, as Figma reads an opacity binding);
// a null rung is the transparent rest, a literal 0
type LadderRow = { name: string; alias: string | null; description: string }
const ladder: LadderRow[] = []
for (const tier of ['subtle', 'hint'] as const) for (const state of ok.INTERACTION_STATES as string[]) {
  const rung = (ok.INTERACTION_LADDER as Record<string, Record<string, number | null>>)[tier][state]
  ladder.push({ name: `${tier}/${state}`, alias: rung === null ? null : (ok.opacityTokenPath(rung) as string), description: `INTERACTION_LADDER.${tier}.${state}: ${rung === null ? 'null, the transparent rest' : ok.opacityVarName(rung)}` })
}
console.error(`interaction: ${rows.length} rows × ${FAMILIES.length} family modes; tint replaces ${composed.length} composed rows (${composed.join(', ')}); ladder ${ladder.length} rows`)

process.stdout.write(`// GENERATED by scripts/figma/interaction.ts from okchroma's interaction register. Paste into use_figma.
const NAME = 'role' // the owner's name for the register's collection
const FAMILIES = ${JSON.stringify(FAMILIES)}
const ROWS = ${JSON.stringify(rows)}
const collections = await figma.variables.getLocalVariableCollectionsAsync()
const vars = await figma.variables.getLocalVariablesAsync()
const collById = new Map(collections.map((c) => [c.id, c]))
const byName = new Map()
for (const v of vars) { const prev = byName.get(v.name); if (!prev || collById.get(v.variableCollectionId).name === 'theme') byName.set(v.name, v) }
const isExpression = (val) => !!(val && typeof val === 'object' && val.type === 'VARIABLE_EXPRESSION')

// an earlier print of the register as a Light/Dark collection is removed if nothing was built on
// it, and set aside as "role (light-dark)" if the owner had hand-authored expressions in it
let coll = collections.find((c) => c.name === NAME)
let setAside = null
if (coll && !coll.modes.some((m) => m.name === FAMILIES[0])) {
  const old = vars.filter((v) => v.variableCollectionId === coll.id)
  const hand = old.filter((v) => Object.values(v.valuesByMode).some(isExpression)).map((v) => v.name)
  if (hand.length) { coll.name = NAME + ' (light-dark)'; setAside = { name: coll.name, handAuthored: hand } } else coll.remove()
  coll = null
}
if (!coll) { coll = figma.variables.createVariableCollection(NAME); coll.renameMode(coll.modes[0].modeId, FAMILIES[0]) }
const modeId = {}
for (const f of FAMILIES) { let m = coll.modes.find((x) => x.name === f); modeId[f] = m ? m.modeId : coll.addMode(f) }
const fresh = await figma.variables.getLocalVariablesAsync()
const mine = new Map(fresh.filter((v) => v.variableCollectionId === coll.id).map((v) => [v.name, v]))
const missing = [], created = [], updated = [], kept = []
for (const r of ROWS) {
  let v = mine.get(r.name)
  if (v) updated.push(r.name); else { v = figma.variables.createVariable(r.name, coll, 'COLOR'); created.push(r.name) }
  FAMILIES.forEach((f, i) => {
    const target = byName.get(r.aliases[i])
    if (!target) { missing.push(r.aliases[i]); return }
    if (isExpression(v.valuesByMode[modeId[f]])) { kept.push(r.name + ' @ ' + f); return }
    v.setValueForMode(modeId[f], figma.variables.createVariableAlias(target))
  })
  v.scopes = r.scopes
  if (r.css) v.setVariableCodeSyntax('WEB', 'var(' + r.css + ')')
  v.description = r.description
}
// rows this script no longer writes, left for the owner to retire once nothing binds to them
const RETIRED = ${JSON.stringify(composed)}
const retiredPresent = RETIRED.filter((n) => mine.has(n))
// the ladder
const LADDER = ${JSON.stringify(ladder)}
let lad = collections.find((c) => c.name === 'ladder')
if (!lad) { lad = figma.variables.createVariableCollection('ladder'); lad.renameMode(lad.modes[0].modeId, 'Value') }
const ladMode = lad.modes[0].modeId
const ladMine = new Map((await figma.variables.getLocalVariablesAsync()).filter((v) => v.variableCollectionId === lad.id).map((v) => [v.name, v]))
const ladderMissing = []
let ladderWritten = 0
for (const r of LADDER) {
  let v = ladMine.get(r.name) || figma.variables.createVariable(r.name, lad, 'FLOAT')
  if (r.alias) { const t = byName.get(r.alias); if (!t) { ladderMissing.push(r.alias); continue } v.setValueForMode(ladMode, figma.variables.createVariableAlias(t)) } else v.setValueForMode(ladMode, 0)
  v.scopes = ['OPACITY']
  v.description = r.description
  ladderWritten++
}
return { collectionId: coll.id, modes: coll.modes.map((m) => m.name), created: created.length, updated: updated.length, keptExpressions: kept.length, missing: [...new Set(missing)], retiredPresent, setAside, ladder: { collectionId: lad.id, written: ladderWritten, missing: ladderMissing } }
`)
