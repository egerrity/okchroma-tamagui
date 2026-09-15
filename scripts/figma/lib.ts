// What the print binds to: the path okchroma's extended plugin writes each engine name
// under, in its `theme` collection. Read from kitchenUI's Figma round (reference/kitchenui/
// figma/lib.ts) and kept to the names this repository's map uses.
const STAMP: Record<string, string> = {
  'stamp-fill': 'stamp/fill',
  'stamp-fill-hover': 'stamp/fill-hover',
  'stamp-fill-pressed': 'stamp/fill-pressed',
  'stamp-edge': 'stamp/edge',
  'stamp-on': 'stamp/on',
}
const leaf = (l: string) => STAMP[l] ?? l

/** the plugin's variable path for an engine name, or undefined when the plugin writes none */
export function figmaPath(engineName: string): string | undefined {
  const n = engineName.replace(/^--/, '')
  let m: RegExpExecArray | null
  if ((m = /^surface-(dim|low|mid|high)$/.exec(n))) return `system/surface/${m[1]}`
  if (n === 'scrim') return 'system/alpha/abs-black-060'
  if ((m = /^shadow-(04|08|12)$/.exec(n))) return `system/alpha/shadow-${m[1]}`
  if (n === 'alpha-transparent') return 'system/alpha/transparent'
  if (n === 'pen-100' || n === 'paper-0') return `neutral/${n}`
  if ((m = /^brand-alt-(.+)$/.exec(n))) return `brand/alt/${leaf(m[1])}`
  if ((m = /^brand-(.+)$/.exec(n))) return `brand/primary/${leaf(m[1])}`
  if ((m = /^(neutral|critical|warning|positive|info)-(.+)$/.exec(n))) return `${m[1]}/${leaf(m[2])}`
  return undefined
}
