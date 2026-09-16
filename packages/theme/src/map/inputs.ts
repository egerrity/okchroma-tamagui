// Inputs: the field's edges, resting and focused, and the invalid family. Tamagui looks up
// `<mode>_<theme>_Input` for a component named Input, so a plain `<Input>` reads the first
// and `<Input theme="critical">` the second. Same keys; only the edge rows differ.
import type { KeyMap } from './keys.ts'

export const INPUT: Readonly<Record<'Input' | 'critical_Input', KeyMap>> = {
  Input: {
    background: 'surface-high',
    color: 'neutral-pen-70',
    placeholderColor: 'neutral-pencil-47',
    borderColor: 'neutral-highlighter-26',
    borderColorHover: 'neutral-highlighter-26',
    borderColorFocus: 'brand-highlighter-26',
    outlineColor: 'brand-highlighter-26',
  },
  critical_Input: {
    background: 'surface-high',
    color: 'neutral-pen-70',
    placeholderColor: 'neutral-pencil-47',
    borderColor: 'critical-highlighter-26',
    borderColorHover: 'critical-highlighter-26',
    borderColorFocus: 'critical-highlighter-26',
    outlineColor: 'critical-highlighter-26',
  },
}
