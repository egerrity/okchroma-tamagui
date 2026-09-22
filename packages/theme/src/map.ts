// docs/map.md as data, grouped the way the design files group things: containers, actions,
// inputs, display, and the non-color foundations. Nothing here is a color; build.ts resolves each
// name per mode and per brand. A new component's rows go in the group it belongs to.
export type { KeyMap } from './map/keys.ts'
export { BASE, DIALOG, POPOVER } from './map/containers.ts'
export { FAMILY_EDGE, TIERS } from './map/actions.ts'
export { INPUT } from './map/inputs.ts'
export { INDICATOR_LEVELS, LEVEL_NAMES } from './map/display.ts'
