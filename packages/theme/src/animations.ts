// The animation driver on web: CSS transitions. Names the kit's parts ask for by default.
import { createAnimations } from '@tamagui/animations-css'

export const animations = createAnimations({
  quick: 'ease-in 100ms',
  medium: 'ease-in 200ms',
  slow: 'ease-in 300ms',
  bouncy: 'ease-in 200ms',
  lazy: 'ease-in 300ms',
})
