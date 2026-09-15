// The animation driver on native: React Native's Animated, which runs in Expo Go with no
// native module. Metro picks this file over animations.ts by its platform extension.
import { createAnimations } from '@tamagui/animations-react-native'

export const animations = createAnimations({
  quick: { type: 'timing', duration: 100 },
  medium: { type: 'timing', duration: 200 },
  slow: { type: 'timing', duration: 300 },
  bouncy: { type: 'timing', duration: 200 },
  lazy: { type: 'timing', duration: 300 },
})
