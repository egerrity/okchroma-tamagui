---
applyTo: "packages/theme/**"
---

The theme package projects `docs/map.md` through okchroma. `src/map.ts` is the table as
data; `src/build.ts` resolves every engine name per mode with `themeTokens` and
`interactionTokens`, once per brand in `src/brands.ts`, and writes `dist/theme.<brand>.ts`
and `dist/brands.ts`. Everything under `dist/` is generated and is never edited by hand. A value that is not an engine name is a bug in the map, not a thing to
patch in the output. `src/config.ts` passes the generated themes to `createTamagui` with
Tamagui's stock v5 tokens for space, size, radius and z-index, which this repository does
not own. The theme builder is never imported.
