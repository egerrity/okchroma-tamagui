// What both configs share: Tamagui's stock v5 tokens, media and shorthands, a system font,
// and the animation driver. None of this is owned here (decision 12); color is.
import { tokens, media, shorthands, settings, createSystemFont } from '@tamagui/config/v5'
// Extensionless on purpose: Metro resolves animations.native.ts for native only when the
// import does not spell the extension; with `.ts` spelled out it loads the CSS driver there.
import { animations } from './animations'

const body = createSystemFont()

export const shared = {
  tokens,
  fonts: { body, heading: body },
  media,
  shorthands,
  animations,
  // Long-form style props are allowed: the kit's docs and the screen read as CSS does.
  settings: { ...settings, defaultFont: 'body' as const, onlyAllowShorthands: false as const },
}
