// What the map's config shares: the owner's foundations as Tamagui tokens and fonts
// (map/foundations.ts), the kit's media and shorthands, and the animation driver. Color is
// never here; it is the map's.
import { createFont, createTokens } from 'tamagui'
import { media, shorthands, settings } from '@tamagui/config/v5'
import { animations } from './animations'
import { FAMILY, TYPE, LEADING, ROLES, SPACE, SIZE, RADIUS, ZINDEX } from './map/foundations.ts'

const px = (v: number) => v
const isDisplay = (v: number) => v >= 20

// one font per role: the same ladder, the role's weight and tracking per size
const font = (role: keyof typeof ROLES) => {
  const sizes = Object.entries(TYPE) as Array<[string, number]>
  const family = FAMILY.replace(/\s+/g, '')
  return createFont({
    family: `${FAMILY}, -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
    size: Object.fromEntries(sizes.map(([k, v]) => [k, px(v)])),
    lineHeight: Object.fromEntries(sizes.map(([k, v]) => [k, Math.round(v * (isDisplay(v) ? LEADING.display : LEADING.text))])),
    weight: Object.fromEntries(sizes.map(([k, v]) => [k, ROLES[role].weight(v)])),
    letterSpacing: Object.fromEntries(sizes.map(([k, v]) => [k, ROLES[role].tracking(v)])),
    // native needs the loaded face per weight; the names are the ones the Expo font package registers
    face: {
      400: { normal: `${family}_400Regular` },
      500: { normal: `${family}_500Medium` },
      600: { normal: `${family}_600SemiBold` },
    },
  })
}

export const tokens = createTokens({
  color: {},
  space: SPACE,
  size: SIZE,
  radius: RADIUS,
  zIndex: ZINDEX,
})

export const shared = {
  tokens,
  fonts: { body: font('body'), heading: font('heading'), button: font('button') },
  media,
  shorthands,
  animations,
  // Long-form style props are allowed: the kit's docs and the screen read as CSS does.
  settings: { ...settings, defaultFont: 'body' as const, onlyAllowShorthands: false as const },
}
