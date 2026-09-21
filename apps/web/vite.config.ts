// Vite for the web app. Tamagui's plugin supplies the defines its packages read; its own
// module resolution is disabled because it would alias react-native to react-native-web,
// which this proof avoids (decision 1). Where a package still names react-native on the
// web, it resolves to Tamagui's own shim. The optimizing compiler's extraction is off: this
// proof claims the theme's mechanics, not the compiler's output, and every style is applied
// at runtime, which is what the checks read back. The compiler still bundles a config to
// load its options, so it is given compiler.ts, a default export the apps never import.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tamaguiPlugin } from '@tamagui/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    tamaguiPlugin({
      config: '../../packages/theme/src/compiler.ts',
      components: ['tamagui'],
      disableWatchTamaguiConfig: true,
      disableResolveConfig: true,
      disableExtraction: true,
    }),
  ],
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.mjs', '.web.js', '.tsx', '.ts', '.mjs', '.js', '.json'],
    alias: { 'react-native': '@tamagui/fake-react-native' },
  },
})
