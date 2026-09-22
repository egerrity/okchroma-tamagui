import {fileURLToPath} from 'node:url';
import react from '@vitejs/plugin-react';
import {astryxStylex} from '@astryxdesign/build/vite';
import {defineConfig} from 'vite';

// Vite for the Astryx web app. Astryx's plugin compiles the library from source into its
// own CSS layers and this app's StyleX (the copied page template carries some) into the
// product layer; the precompiled astryx.css is the other path and is not imported with it.
// No Tamagui here: the app reads the build's rows (dist/theme.<brand>.ts) as plain data.
// The plugin aliases `@astryxdesign/core` to `<rootDir>/node_modules/@astryxdesign/core/src`
// and defaults rootDir to the working directory; the workspace hoists the packages to the
// repository root, so that is the root it is given.
const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  plugins: [...astryxStylex({rootDir: repoRoot}), react()],
});
