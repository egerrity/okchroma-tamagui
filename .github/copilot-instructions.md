# okchroma-tamagui

A proof of concept: one okchroma seed themes Tamagui on web and on native. The theme is
the product. Tamagui's components are used as they come, picked by the `theme` prop; no
component is wrapped. Read `docs/plan.md` first, then `docs/map.md`.

## Rules

1. Every color is an engine name through the map. Never a hex, an `rgb()`, a named color, a
   `color-mix()`, or an opacity applied to a color. `npm run check` holds this and the build
   runs it first.
2. `docs/map.md` is the only source of theme values. `packages/theme/src/map.ts` is that
   table as data and `packages/theme/src/build.ts` projects it through okchroma's
   `themeTokens` and `interactionTokens` into `packages/theme/dist/`, once per brand in
   `packages/theme/src/brands.ts`. A theme value
   that is not in the map is added to the map first, as an engine name, then generated.
   Tamagui's theme builder (`createThemes`, `@tamagui/theme-builder`) is never used: it
   derives colors, and the engine already solved them.
3. One grammar for the `theme` prop. `<family>` sets edges only; `<family>_solid`,
   `<family>_subtle`, `<family>_hint` and `<family>_outline` set grounds, text and edge. A
   Button always takes a tier and never the kit's `variant="outlined"`; outline is a tier.
   An Input takes `critical` when invalid and nothing otherwise. A stamp (the solid tier)
   is never used for text.
4. The same key reads the same engine name in light and in dark. Theming moves the values;
   nothing swaps a reference by mode.
5. No wrapper component until a rule needs one that a theme cannot hold. The two that
   exist are in `packages/theme/src/parts.tsx` (decision 15): import `Button` and `Input`
   from `@poc/theme/parts`, everything else from `tamagui`. A new exception is recorded in
   `docs/decisions.md` with the rule it enforces before it is written.

## What the engine promises

okchroma's consumer contract is `docs/agents.md` in the okchroma repository. In short:
text reads `pencil-47`, `pen-58` or `pen-70`, or `stamp-on` over a stamp fill; states on
a paper are the family's `highlighter-26` at an opacity rung, which the interaction
register names as `subtle` and `hint` rows; the WCAG conformance of every stop is stated in
its description and is not re-checked here. The lane is WCAG. No APCA number appears in
this repository.

## Commands

```
npm run tokens      # regenerate packages/theme/dist/ from the map and every brand in brands.ts
npm run check       # the color law; exit 1 lists every violation
npm run typecheck   # every workspace
npm run web         # Vite, http://localhost:8350
scripts/start-ios.sh && xcrun simctl openurl booted exp://127.0.0.1:8081
npm run figma:print # generate the Plugin API code for the Figma print
```

## How work is done

- Exhibit first. `docs/exhibit.md` says what is judged and on what surface. Nothing is
  tuned in a component; a change is a map edit, then `npm run tokens`, then the check.
- Explain a change before making it: what, where, how. Then wait for yes.
- A decision is appended to `docs/decisions.md` the day it is made, dated. A comment in code
  says why the code is as it is, in the present tense, and carries no date.
- No employer name, no personal name, no absolute home path in any file.
- Screenshots of the exhibit go in `docs/shots/`, both platforms, both modes.
