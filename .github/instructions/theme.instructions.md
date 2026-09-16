---
applyTo: "packages/theme/**"
---

The theme package projects `docs/map.md` through okchroma. `src/map/` holds the table as
data, one file per group (containers, actions, inputs, foundations) with `src/map.ts`
re-exporting them; `src/build.ts` resolves every engine name per mode with `themeTokens` and
`interactionTokens`, once per brand in `src/brands.ts`, and writes `dist/theme.<brand>.ts`
and `dist/brands.ts`. Everything under `dist/` is generated and is never edited by hand. A value that is not an engine name is a bug in the map, not a thing to
patch in the output. `src/config.ts` passes the generated themes to `createTamagui` with the
tokens and fonts `shared.ts` builds from `src/map/foundations.ts`, the only source of the
non-color values. The theme builder is never imported.
