// The baseline: Tamagui's stock v5 themes, tokens and fonts on the same screen. What the
// components look like before the seed and before the owner's foundations. Mounted instead
// of config.ts, never with it.
import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v5'
import { animations } from './animations'

export const config = createTamagui({ ...defaultConfig, animations })
export default config
