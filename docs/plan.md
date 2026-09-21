# Plan

Written 2026-09-15 for the owner and for the coding agent in the repository where this is
built. Everything needed is in this repository or reachable from `AGENTS.md`.

## What it proves

One okchroma seed in, a complete light and dark system out on web and on native, on
Tamagui's own components, with the contrast requirements solved by the engine during
generation, built by a designer and an agent with no engineer. The claim is the
mechanics, not the look of a finished product and not an installable package.

The exhibit is one screen, on web and in Expo Go, light and dark on a toggle, with
Tamagui's stock theme on a second toggle as the baseline (`docs/exhibit.md`). The final
step is a Figma print of the roster bound to okchroma's variables, mapped to code with
Code Connect.

## Decisions

`docs/decisions.md`, twelve of them, dated. In one line each: Tamagui alone, web from the
DOM without react-native-web; Material UI on web only if the accessibility checklist fails
inside a Tamagui component; the claim is the mechanics; its own repository; the map is
hand-written and agreed before code; theme only, no wrappers; Button, Input, Dialog; the
Figma print from generated Plugin API code; kitchenUI as copied reference; five rules on
day one; WCAG; the non-color foundations owned as data (decision 23).

## The repository

```
.github/copilot-instructions.md      the rules and commands
.github/instructions/theme.instructions.md   the theme package's rule
AGENTS.md                            pointers to the external contracts
docs/                                plan, map, exhibit, decisions, checklist, adding-a-component, shots/
reference/kitchenui/                 copied reference, not maintained
packages/theme/
  src/brands.ts                      one object per client: the elections (decision 22)
  src/map/                           docs/map.md as data: containers, actions, inputs, display, foundations
  src/map.ts                         re-exports the groups
  src/build.ts                       the map through the engine, once per brand
  dist/theme.<brand>.ts, dist/brands.ts   GENERATED; committed so a clone runs before regenerating
  src/config.ts                      createConfig(brand): the brand's themes on the owner's foundations
  src/compiler.ts                    the default export Tamagui's compiler bundles; nothing at runtime imports it
  src/stock.ts                       the baseline: @tamagui/config/v5 as is
  src/parts.tsx                      the two one-line extensions (decision 15) and the parts index
  src/parts/chip.tsx                 the chips the kit does not ship (decision 25)
  src/screen.tsx, src/roster.tsx     the exhibit, shared by both apps
apps/web                             Vite + @tamagui/vite-plugin, port 8350
apps/native                          Expo, run in Expo Go, port 8081
scripts/check-tokens.mjs             the check
scripts/figma/print.ts               generates the Plugin API code for the print
scripts/figma/lib.ts                 the path the extended plugin writes each name under
scripts/figma/plugin/                the development-plugin wrapper for that code
figma/*.snippet.tsx                  Code Connect examples, pasted in the Dev Mode UI
```

A build is one brand: `VITE_BRAND` on web, `EXPO_PUBLIC_BRAND` on native, or `?brand=` in
a web address, defaulting to the first entry in `brands.ts`; the web toolbar reloads into
any brand. The stock baseline is one flag, `THEME_SOURCE=stock` (`VITE_THEME_SOURCE` on
web, `EXPO_PUBLIC_THEME_SOURCE` on native), which makes the app import `stock.ts` instead
of `config.ts`; only one config ever runs, since `createTamagui` registers globally. On
web the same switch is `?theme=stock`, and `?mode=light` or `?mode=dark` sets the opening
mode, so a screenshot needs no click. Same screen, same code, any client.

## The check

`npm run check`, run first by `npm run build`:

- A. Every `dist/theme.<brand>.ts` is a projection of the map under that brand's
  elections: every value resolves to the engine name the transcription records; light and
  dark declare the same key set; every register family has its edge theme and its four
  tier themes; every brand declares the same theme names and keys.
- B. App and screen code: no hex, `rgb`, `hsl`, named-color or `color-mix` literal in a
  style prop; every `$` reference is a key the theme declares; no opacity on a color.
- C. A `theme=` on a Button ends in `_solid`, `_subtle` or `_hint`.
- D. Nothing imports `@tamagui/theme-builder` or calls `createThemes`.

## The Figma step

1. Run okchroma's extended plugin in the file with the real seed on the WCAG lane; it
   writes the variables.
2. `scripts/figma/plugin/code.js` is the print, generated and committed (decision 20), so
   nothing runs on that machine. It writes the owner's Figma model (decision 30): the
   `color family` collection, the scale and the stamp group by family mode; the three
   state-layer sets, solid, subtle and hint, their opacity bound to the plugin's opacity
   ladder; and one component set per roster member, each host carrying one stretched
   state-layer instance with its edge and text bound to `color family` rows, light and
   dark on the file's mode toggle.
3. Run the code through the Figma MCP server where it is available; where it is not, load
   `scripts/figma/plugin` as a development plugin, which is the same code in a manifest.
4. Connect each printed set in Dev Mode's Code Connect UI, pasting the matching snippet
   from `figma/` as the example (decision 19). No command runs on that machine.

## The contingency

Decision 2. The trigger is a failure in `docs/checklist-web-a11y.md` that lives inside a
Tamagui component and that no map row can fix. The consequence: the web app takes
Material UI for that component set under a Material 3 role map, native stays Tamagui, and
the shared-API goal is given up on web and said so in the decisions. Until then Material
UI is not installed and not planned.

## Order of work

1. Standards and the map (this repository's day-one files).
2. The theme package: generator, generated themes, config, the check green.
3. Both apps rendering the Button row in both modes. Four checks at this step, each
   recorded in the decisions: whether Tamagui accepts hyphens in theme keys and sub-theme
   names (it does, on both platforms); whether the `Input` component sub-theme is picked
   up (it is); which key the dialog overlay reads (`$background` on a named part, decision
   13); whether `defaultProps` holds the Button's resting edge and the disabled opacity
   (it does not; decision 15).
4. Input and Dialog; the screen and the roster page; the stock toggle; the accessibility
   checklist with a real keyboard; screenshots into `docs/shots/`.
5. The Figma print and Code Connect, from the machine with the file.

## Verification

- `npm run tokens && npm run check && npm run typecheck` green in every workspace.
- Web, both modes, the stock toggle: every color on screen read back from the DOM as a
  theme variable; the checklist passed.
- Native in Expo Go, both modes: screenshots of the screen and the roster.
- No `dist/theme.<brand>.ts` holds a value that is not the engine's for the recorded name.

## Traps

- Do not alias `react-native` to `react-native-web` in Vite; the kit shims it. A kit
  component that needs the alias is a finding against decision 1.
- Expo's Metro in a workspace needs `watchFolders` and `nodeModulesPaths` for the packages.
- Tamagui in Expo Go runs on the React Native animation driver, not a native module.
- `expo start --ios` exits if the simulator's first boot times out; serve and open apart.
- React is pinned once in the root `overrides`, or npm resolves react-dom ahead of Expo's
  pinned React.
- Native cannot evaluate CSS color functions; the engine's rung rows are literals per
  mode, and the generator writes the slash syntax the engine's system tokens use as the
  comma syntax React Native parses. Same color, one grammar.
- Node below 22.18 strips types only behind `--experimental-strip-types`; the scripts pass
  it, and relative imports in files Node runs spell their `.ts` extension.
- A file with a `.native.ts` twin is imported without an extension, or Metro loads the
  web file on native (decision 18).
- In the Figma Plugin API, opacity on a paint bound to a variable is not kept; a rung goes
  on a layer's opacity (decision 21). Screenshots taken inside a script render after the
  script ends, so mode-dependent shots are taken with the screenshot tool between calls.
- Tamagui 2 names the animation prop `transition`; `animation` does not type.
- `Dialog.Trigger asChild` renders its child as a span with a button role; open dialogs
  from a real Button with the controlled API, and return focus on close through the
  content's `onCloseAutoFocus`, since the kit only focuses a `Dialog.Trigger` (decision 17).
- The kit's Input passes `placeholderTextColor` through to the DOM and React warns about
  it in development. The warning is the kit's; the color is right.
- Tamagui's compiler bundles the module the Vite plugin's `config` option names and reads
  its default export. `config.ts` has none by design, since only one config may run, so
  the plugin is pointed at `compiler.ts`, a default export nothing at runtime imports, and
  extraction is off. Pointed at `config.ts` it fails on every file with "Cannot convert
  undefined or null to object" and "Must provide components"; the app still renders,
  because the theme is applied at runtime, but the log is all noise.
- Comments say why the code is as it is, in the present tense, with no date.

## Not in scope

Wrappers, more than three components, spacing and type ownership, a docs site, an MCP
server or skill, npm publishing, a shared monorepo, bare React Native, Material UI unless
the trigger fires, any change to the engine.
