// The baseline: Tamagui's stock v5 themes on the same tokens and the same screen. What the
// components look like before the seed. Mounted instead of config.ts, never with it.
import { createTamagui } from 'tamagui'
import { themes } from '@tamagui/config/v5'
import { shared } from './shared.ts'

export const config = createTamagui({ ...shared, themes })
export default config
