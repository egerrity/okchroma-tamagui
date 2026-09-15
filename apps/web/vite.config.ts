// Vite for the web app. Tamagui's plugin supplies the defines its packages read; its own
// module resolution is disabled because it would alias react-native to react-native-web,
// which this proof avoids (decision 1). Where a package still names react-native on the
// web, it resolves to Tamagui's own shim.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tamaguiPlugin } from '@tamagui/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    tamaguiPlugin({
      config: '../../packages/theme/src/config.ts',
      components: ['tamagui'],
      disableWatchTamaguiConfig: true,
      disableResolveConfig: true,
    }),
  ],
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.mjs', '.web.js', '.tsx', '.ts', '.mjs', '.js', '.json'],
    alias: { 'react-native': '@tamagui/fake-react-native' },
  },
})
