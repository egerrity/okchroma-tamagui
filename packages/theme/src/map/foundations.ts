// The non-color foundations, as data: the type roles, the spacers, the control heights and
// the radii, read from the owner's design documentation and fed into Tamagui's tokens and
// fonts by shared.ts. Keys are what the kit looks up: a control's `size` key is read in
// size (its height), space (its horizontal padding) and radius, and in the font (its text),
// so the named keys `xs sm md lg` exist in all four. The numeric keys are the type ladder
// the kit's headings use (`$10` down to `$5`) and the spacer numbers the documentation uses.

/** the family; the owner's product uses Matter, which cannot be shipped here, so the fallback stands in */
export const FAMILY = 'Noto Sans'

/** the type ladder: size in px, keyed the way the kit's headings expect */
export const TYPE = {
  1: 12, 2: 14, 3: 15, 4: 18, 5: 20, 6: 26, 7: 32, 8: 40, 9: 48, 10: 72,
  xxs: 14, xs: 14, sm: 14, md: 15, lg: 18, true: 15,
} as const

/** display and heading sizes lead at 1.25, text at 1.5 */
export const LEADING = { display: 1.25, text: 1.5 } as const
const isDisplay = (px: number) => px >= 20

/** the roles: weight and tracking per family, per size */
export const ROLES = {
  body: { weight: (px: number) => (px <= 12 ? '500' : '400'), tracking: () => -0.1 },
  heading: {
    weight: (px: number) => (px >= 40 ? '600' : '500'),
    tracking: (px: number) => (px >= 72 ? -2 : px >= 40 ? 0 : px >= 32 ? -2 : px >= 26 ? -1.5 : px >= 15 ? -1 : -0.1),
  },
  /** the label on a control: the body ladder at medium weight */
  button: { weight: () => '500', tracking: () => -0.1 },
} as const

/** the spacers, keyed by the documentation's own numbers; the named keys are control paddings */
export const SPACE = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 10: 40, 12: 48, 16: 64,
  xxs: 8, xs: 12, sm: 12, md: 16, lg: 24, true: 16,
} as const

/** a button's least width at each size key (`true` is the kit's default, md); the chips have none */
export const MIN_WIDTH = { xs: 80, sm: 96, md: 112, lg: 128, true: 112 } as const

/** control heights (xxs is the small chip), plus the icon size and the content width */
export const SIZE = {
  xxs: 24, xs: 32, sm: 40, md: 48, lg: 56, true: 48,
  icon: 24, content: 720,
} as const

/** one corner for controls, the chip's own, and the pill */
export const RADIUS = {
  0: 0, 1: 4, 2: 8, 3: 12,
  xxs: 8, xs: 8, sm: 8, md: 8, lg: 8, chip: 6, full: 10000, true: 8,
} as const

/** the kit's layering, its stock values; the kit requires the control names here too */
export const ZINDEX = { 0: 0, 1: 100, 2: 200, 3: 300, 4: 400, 5: 500, xxs: 100, xs: 100, sm: 200, md: 300, lg: 400, true: 300 } as const
