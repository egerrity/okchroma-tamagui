import type { AppConfig } from './config.ts'

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
