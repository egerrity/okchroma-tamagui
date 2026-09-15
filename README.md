# okchroma-tamagui

A proof of concept: one okchroma seed in, a light and dark system out on web and on
native, on Tamagui's own components, with the contrast requirements solved by the engine
during generation. The theme is the product; no component is wrapped.

Start with `docs/plan.md`. The agent's rules are in `.github/copilot-instructions.md`.

```
npm install
npm run tokens       # docs/map.md through the engine -> packages/theme/dist/theme.ts
npm run check        # the color law, held against the theme and the apps
npm run typecheck
npm run web          # Vite on http://localhost:8350 (?mode=dark, ?theme=stock, #roster)
scripts/start-ios.sh # Expo dev server on 8081; then open the app in Expo Go:
xcrun simctl openurl booted exp://127.0.0.1:8081
npm run figma:print  # the Figma print as a development plugin (scripts/figma/plugin/README.md)
```

The seed lives in one place, `packages/theme/src/seed.ts`.

Node 22.6 or newer. The generator, the check and the print run TypeScript through Node's
type stripping; the scripts pass the flag it needs on 22.x, where it is not yet the default.
