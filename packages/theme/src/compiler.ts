// The config Tamagui's compiler bundles. The compiler reads a module's default export and
// the apps build theirs per brand at runtime (decision 22), so config.ts has no default:
// evaluating one at import time would register a second config, and only one may run. This
// module exists for the compiler's bundling step alone; nothing at runtime imports it, and
// the web app turns extraction off, so what the compiler learns here changes no output.
import { createConfig } from './config.ts'

export default createConfig()
