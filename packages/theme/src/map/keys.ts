// Shared by the map's groups: the key lists Tamagui reads in sets, and the helper that
// gives one engine name to every key in a set.
export type KeyMap = Readonly<Record<string, string>>

export const same = (keys: readonly string[], name: string): KeyMap =>
  Object.fromEntries(keys.map(k => [k, name]))

export const BORDER_KEYS = ['borderColor', 'borderColorHover', 'borderColorPress', 'borderColorFocus'] as const
export const COLOR_KEYS = ['color', 'colorHover', 'colorPress', 'colorFocus'] as const
