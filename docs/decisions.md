# Decisions

Dated. A decision changes what gets built; an exception to a rule is appended here with
the rule it serves. Code cites a decision by number, never by date.

1. 2026-09-15. **Shape.** Tamagui alone: one component source, web rendered from the DOM
   without react-native-web. `@tamagui/core` depends on nothing from react-native-web, and
   the `tamagui` kit shims `react-native` on web with `@tamagui/fake-react-native`. The
   engineers' objection to a single package was react-native-web; this avoids it.
2. 2026-09-15. **Contingency.** Material UI on web opens only when the roster fails the web
   accessibility checklist (`docs/checklist-web-a11y.md`) inside a Tamagui component and
   the theme cannot fix it. Then the web app takes Material UI for that component set under
   a Material 3 role map; native stays Tamagui; the shared-API goal is given up on web and
   said so. Until the trigger fires this is not a second plan.
3. 2026-09-15. **The claim.** The mechanics: one seed, both platforms, no engineer. Not the
   look of a finished product and not an installable package.
4. 2026-09-15. **Where it lives.** Its own repository, npm workspaces, independent of any
   existing code. Moving into a shared monorepo later is a folder move.
5. 2026-09-15. **The map.** `docs/map.md` is written by hand, agreed in full before any
   code, and transcribed by the generator. An agent never decides a color.
6. 2026-09-15. **Ownership.** Theme only. Tamagui's components under the theme, picked by
   the `theme` prop. A wrapper only when a rule needs enforcing that a theme cannot hold.
7. 2026-09-15. **Roster and exhibit.** Button, Input, Dialog. One screen on web and in Expo
   Go, light and dark on a toggle, Tamagui's stock theme on a second toggle as the
   baseline; a roster page of every family by tier for judging.
8. 2026-09-15. **Figma.** The print runs from generated Plugin API code, through the Figma
   MCP server where it is available and inside a development plugin where it is not.
   Variables come from okchroma's extended plugin on the WCAG lane. Code Connect maps the
   Figma sets to the `theme` prop.
9. 2026-09-15. **Reference.** Four kitchenUI files are copied under `reference/kitchenui/`
   at a named commit and not maintained.
10. 2026-09-15. **Standards.** The five rules in `.github/copilot-instructions.md`, and only
    those, on day one.
11. 2026-09-15. **Lane.** WCAG. No APCA number anywhere in the repository.
12. 2026-09-15. **Non-color tokens.** Space, size, radius, z-index and fonts ride Tamagui's
    stock v5 tokens and are not owned by this repository. Color is the only owned axis.
13. 2026-09-15. **Dialog parts are themed, not styled.** The kit's overlay and content are
    named parts (`DialogOverlay`, `DialogContent`) that read `$background`, `$borderColor`
    and `$shadowColor`, so each gets a component sub-theme in the map. No style prop on the
    screen names a dialog color.
14. 2026-09-15. **Outline is a tier; every Button reads its theme's edge at rest.** The kit
    rests a Button's border on transparent and reads the theme only on hover, which would
    drop the stamp's gated edge at rest. The config's `defaultProps` makes every Button read
    `$borderColor` at rest. A per-theme edge cannot then serve only the kit's outlined
    variant, so the translucent tiers name `transparent` for their edge rows and `outline`
    is a fourth tier: the hint rows with the family's tint as the required border. The
    kit's `variant="outlined"` is not used. `transparent` is the one keyword the map holds.
15. 2026-09-15. **Two one-line extensions, no wrapper API.** The config's `defaultProps`
    merge below the kit's own variant styles and never reach the element (probed on the
    roster page: the resting edge and the placeholder color both stayed the kit's). A
    `styled()` extension does reach it. So `packages/theme/src/parts.tsx` exports a `Button`
    that reads `$borderColor` at rest and carries the engine's disabled opacity, and an
    `Input` that reads `$placeholderColor`. Each adds a style, never a prop; the screen
    imports them from `@poc/theme/parts` instead of `tamagui`. These are the exceptions
    decision 6 allows, and the only ones.
16. 2026-09-15. **`transition`, not `animation`.** Tamagui 2 names the prop `transition`;
    the screen uses it on the dialog's overlay and content.
17. 2026-09-15. **The dialog is controlled, not triggered.** `Dialog.Trigger` with `asChild`
    renders its child as a span with a button role, the kit's own Button included (probed
    on web). Whether that span opens on Enter and Space could not be settled here: the
    automated browser's key events activate no button at all, not even a plain native one.
    The screen opens the dialog from a real Button through `open` and `onOpenChange`, the
    kit's controlled API, with `aria-haspopup` and `aria-expanded` on the button, so
    activation is the browser's own and depends on no kit code. On close the kit focuses
    its trigger ref, which only a `Dialog.Trigger` sets, so the content's
    `onCloseAutoFocus` cancels that default and focuses the button itself. With trusted
    key events through Chrome's debugging protocol every keyboard line then passes:
    Enter and Space open, Tab and Shift+Tab stay inside, Escape closes and returns focus.
18. 2026-09-15. **Platform-split imports are extensionless.** `shared.ts` imported
    `./animations.ts` with the extension spelled out, and Metro then loaded the CSS driver
    on native (the panel's `y` motion threw as a unitless `translateY`, and the overlay's
    exit called `getComputedStyle`). Metro picks `animations.native.ts` only for an
    extensionless import. The repository's other `.ts`-spelled imports have no platform
    twin and stay as they are.
19. 2026-09-16. **Code Connect through its UI, not its CLI.** On the machine with the file,
    every package run is a security question, and the CLI's current major dropped the
    framework parsers the earlier `.figma.tsx` files relied on. The printed sets are
    connected in Dev Mode's Code Connect UI by hand, with the snippets in `figma/` pasted as
    the examples; the package is not installed.
20. 2026-09-16. **The print's generated code is committed.** It binds variables by name and
    carries no seed, so `scripts/figma/plugin/code.js` travels ready to import as a
    development plugin; no Node run is needed on the machine with the file.
21. 2026-09-16. **A rung is a ground layer's opacity, never a bound paint's.** The print was
    dry-run on a scratch file against a stand-in of the extended plugin's `theme`
    collection. A paint bound to a variable does not keep its opacity through the Plugin
    API (it read back at 1 and rendered solid), while a layer's own opacity always renders.
    So a translucent tier is a `ground` rectangle stretched behind the label, its fill
    bound to the family's tint at full strength and the rung as the layer's opacity; the
    solid tier fills the frame directly. Verified in Light and Dark, and family-by-mode on
    instances.
22. 2026-09-16. **Brands, not a seed.** `packages/theme/src/brands.ts` holds one object per
    client with the elections the extended plugin's panel offers: the brand hex, an exact
    second family or a derived one, the neutral level, the stamp escape, a link seed, the
    stamp edge. The generator emits every brand's hundred themes to its own file and an
    index; a build picks one brand (`?brand=` on web, `EXPO_PUBLIC_BRAND` on native) and the
    same screen renders as that client. The check holds every brand against its own
    elections and holds all brands to one theme and key set, so one brand's type stands for
    all. The Figma print is unchanged: it binds by name.
