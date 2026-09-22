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
23. 2026-09-16. **The foundations are owned; decision 12 is retired.**
    `packages/theme/src/map/foundations.ts` carries the owner's type ladder and roles, the
    spacers, the control heights and the radii as data, read from the design
    documentation; `shared.ts` builds Tamagui's tokens and fonts from it in place of the
    stock set. The kit resolves a control's height, padding, corner and text from one key
    across size, space, radius and font, so the named keys `xs sm md lg` live in all four
    beside the numeric ladder. Three font roles: body (400), heading (500, 600 from 40 up),
    button (500). The family is one constant, Noto Sans here in place of the product's own
    face, loaded from Google Fonts on web and Expo's font package on native. The kit's
    baseline (`stock.ts`) keeps its own tokens and fonts, so the toggle still compares
    against Tamagui as shipped.
24. 2026-09-16. **The map is grouped the way the design files group.** `src/map/` holds
    `containers.ts` (the page, its planes, text, edges, the focus ring, the shadow, the
    dialog's parts), `actions.ts` (the family edges and the four tiers), `inputs.ts` (the
    field's edges) and `foundations.ts` (the non-color tokens); `map.ts` re-exports them so
    the generator, the check and the print keep one import. `docs/map.md` carries the same
    sections. A new component's rows go in its group; a rule shared by a group is edited
    once and every member follows.
25. 2026-09-16. **The chips, the first components the kit does not ship.** Two, from the
    design files: the interactive chip (a filter or an action) and the indicator chip (a
    label that takes no press). Each is a styled frame with a name so the map's sub-themes
    find it, and its text, in `packages/theme/src/parts/chip.tsx`. The interactive chip is
    the kit's Button under a pill at the `xs` size, so press, hover, focus and the keyboard
    are the kit's; it takes a tier like a Button and a `selected` prop that holds the
    register's selected rung, which is what a filter chip keeps while it is on, so every
    tier now declares `backgroundSelected`. The indicator chip takes a family and reads
    the new `display` group: the subtle ground, the family's `fg`, the family's chalk as a
    faint edge; it exists for the seven color families, since the pole families have no
    chalk. A small size, `xxs`, joins the foundations for it. Both print as sets; the
    interactive chip's family is the role collection's mode, the indicator's too.
26. 2026-09-21. **Tiers, hierarchy and shape are three things; the shapes come from the
    core library.** The register's tiers are solid, subtle and hint. A button's hierarchy is
    its family inside the solid tier: brand, then brand-alt, then neutral, with critical for
    a destructive action. Outline and ghost are shapes on the hint tier, so decision 14's
    word "tier" for the outline is superseded; the map's `outline` entry stays as it is,
    the hint rows plus an edge. Subtle is the ground a selected or active thing keeps,
    never a resting button; the screen's neutral buttons moved to `neutral_solid`. The
    shapes were read from the core library's button and chips pages: a button is a pill, a
    chip is a soft square on its own corner (`chip` in the radius ladder), and a control at
    the `xs` height carries the same label size and padding as the chips, which the type
    and space ladders now hold at that key. The chips' two heights are the library's two
    chip sizes, `xs` the larger and `xxs` the smaller. The print follows.
27. 2026-09-21. **The roster un-mixes the register, the hierarchy and the chips; a chip's
    level is real color.** Per family the roster shows three things apart: the register's
    interaction levels as grounds, solid, subtle and hint through their four rungs with the
    tier's own text on each; the button hierarchy as buttons, primary on solid, outline and
    ghost on hint, and the toggle shown on, which is the subtle tier; and the same four
    disabled. Subtle is no longer offered as a button on its own. The chips take a level in
    place of a tier, and a level is the family's scale stops, the same stop in both modes:
    stamp is the stamp's fill, edge and on-text; strong is chalk-11 under pen-58 with a
    chalk-20 edge; default is paper-3 under pencil-47 with a chalk-15 edge, the owner's
    numbers. Opacity is for interaction: the stamp level takes the stamp's hover and pressed
    fills, and a selected chip on any level takes the subtle tier's resting ground. The
    strong and default levels rest on their fill under hover and press, because a real fill
    has no interaction rung in the register; that is an engine question and stays open
    here. The indicator chip reads the same levels, so its component sub-theme is gone. The
    print follows: the role collection gains the stops as rows, family by mode, and the
    chip sets are Level by State and Level by Size.
28. 2026-09-21. **Two chips, two rules; the toggle is the outline shape.** The button chip
    has no hierarchy: off, it wears the neutral tag's default look, paper-3 under pencil-47
    with a chalk-15 edge; on, it is the family's stamp, fill, edge and on-text, with the
    stamp's own hover and pressed fills. `<Chip theme="brand_chip" selected>`. The tag chip,
    the indicator, carries decision 27's hierarchy, stamp, strong and default, as
    `<family>_indicator-<level>`, and decision 27's `_chip-<level>` names are gone. A toggle
    button is the outline shape, the family's highlighter-26 as its edge, and on it keeps
    the subtle tier's resting ground: the hint and outline tiers' `backgroundSelected` rows
    moved there, and the Button part gained `selected`. The roster's toggle and button chip
    flip on press. The print's Chip set is Selected by State, its off side bound to the
    neutral roster directly.
29. 2026-09-21. **The button chip is a stamp on both sides.** Off, it is the neutral stamp,
    fill, edge and on-text with the neutral stamp's hover and pressed fills; on, it is the
    family's stamp with its own. Decision 28 had the off side on the neutral tag's default
    look, resting under hover and press; the owner's reading is that the chip is the stamp
    in neutral until it is chosen, so its interaction is the engine's stamp interaction and
    nothing rests. The print's off side binds the neutral stamp's roster variables by state.
    A selected Button hovers and presses on the selected ladder too, so the tiers declare
    `backgroundSelectedHover` and `backgroundSelectedPress`, and the printed Button set is
    Kind by State, primary, outline, ghost and toggle, in place of Tier by State.
30. 2026-09-21. **The print reproduces the owner's Figma model.** The `role` collection,
    the `ladder` collection and the `tint` row are gone. The print writes the `color
    family` collection as the owner keeps it by hand: the scale and the stamp group as they
    read under the neutral, one mode per color family, each row aliasing the plugin's
    variable, the two poles aliasing the neutral's. The pole families have no scale and get
    no mode; a black or white control binds `pen-100` or `paper-0` itself. Interaction is
    the owner's three state-layer components, `state-layer/solid`, `subtle` and `hint`:
    solid is the stamp by state, subtle and hint are the family's highlighter-26 with the
    layer's opacity bound to the plugin's own `utility/opacity` ladder at the register's
    rung, so a rung change in the engine flows through on the next print. A host places one
    instance stretched over its ground and binds its edge and text to `color family` rows;
    the family is the mode on the host, and the button chip's off variant sets neutral on
    itself. Figma and code say the same names: the map's `<family>-<leaf>` is the
    collection's `<leaf>` by mode; the register's family-agnostic names stay in CSS, where
    the state layer is a scope rather than a component.
31. 2026-09-22. **The button chip is the solid tier by family.** Every `<family>_chip`
    theme held the neutral stamp beside the family's stamp, and both halves were the solid
    tier already: the off side equalled `neutral_solid` and the on side `<family>_solid`, key
    for key, in every brand and both modes. The `_chip` themes are gone. A Chip takes a
    `family`, and `selected` picks its theme, `neutral_solid` off and `<family>_solid` on; the
    chip carries no selected keys, and the base theme drops `colorSelected` and
    `borderColorSelected`, which nothing read but the chip. This is decision 30's rule read
    back into code: the chip's off and on are a change of family, the mode on the print's
    host, not a state layer. The toggle keeps its selected keys and variant, because its on
    state is a rung on the same family, which no tier theme pairs with the outline edge.
32. 2026-09-22. **The date range picker, input first.** The extended component is a date
    range picker with a single-date mode, built through the component path and held by the
    same check: two labelled fields with the format beside them, preset ranges as button
    chips, and a calendar as an aid that is never required. The fields alone complete a
    range; that is the first line of its accessibility contract. The aid splits by platform
    the way the animation driver does: on web a calendar dialog built to the grid pattern,
    one tab stop with arrow, Page, Home and End keys; on native the system's inline picker,
    because touch and VoiceOver are tuned for it, tinted with the family's pen-70 in both
    modes. The picker takes one color and draws a selected day as tint-colored text, and a
    selected today as a label on a solid circle of it, white on a dark tint and black on a
    light one; pen-70 is a text stop that holds white in light and flips the label in dark,
    in every brand and family, so both drawings pass in both modes and no stop moves between
    modes. Range first because a range model degrades to a single date and the
    reverse retrofit does not. No map row is added: a day is the neutral hint tier, today the
    neutral outline, the ends the family stamp, the inside the selected ground. Typed entry is
    a plain field, not segments. No package on web; the system picker's module on native,
    which Expo Go already carries. The rules a picker follows that no screen shows are in
    `docs/date-picker.md`.
33. 2026-09-22. **The picker's tint stays pen-70; the label rule is the system's; the role
    waits for Android.** The question left open under decision 32 was whether the system
    picker's label flip, white on a dark tint and black on a light one, is designed or
    incidental. Apple's documentation for the calendar view, the date picker, its inline style,
    the tint color and the Human Interface Guidelines say nothing about it; the one Apple
    statement found, a 2021 forum reply from a frameworks engineer, calls a white tint
    unsupported "due to the nature of the white-text in the Calendar", so no flip existed then.
    The rule was read from UIKit in the iOS 26.5 simulator runtime: a private default on the
    calendar view's platform metrics sets the selected-today label black when the tint's luma,
    Rec. 709 weights on the sRGB values as written, times alpha, is above 0.8, and white
    otherwise; the selected day's text and today's number are the tint itself. Deliberate code,
    not a promise, and it has moved once already. Through the built themes, pen-70 in dark
    sits at luma 0.875 to 0.921, every label black, 0.075 above the line; in light at 0.134 to
    0.205, every label white; pen-58 in dark straddles the line, which is why the pencil failed.
    Android was settled the same day: the community picker takes no color from a prop on
    Android; its dialog reads the app theme, written at build time by the picker's config
    plugin, so a development build and never Expo Go, one accent per app. The framework dialog
    draws the circle in the control-activated color and its label in the theme's inverse text,
    white in light and black in dark; the Material dialog draws primary and on-primary. No
    flip, and no per-family or per-instance tint. Four options were weighed. The closest system
    color and the default tint fail the 4.5 to 1 line on Apple's own documented values, none of
    the thirteen holds it in both modes on our plane and the default blue's white label reads
    4.0 in light and 3.6 in dark, and both are brand-blind, so they are out. Pen-70 stays the
    value on both platforms. Rule E now holds the rule itself: the label each platform draws,
    at 4.5 to 1, and a margin of 0.05 from the iOS line, so a stop that drifts toward it fails
    the build before a release moves it. A named engine role for the picker's tint is deferred
    until an Android development build exists, because Android dictates its shape: brand-level,
    a fill and an on-color per mode, exported through the picker's config plugin, with the
    per-family tint on iOS an extra the role does not promise; an engine addition, recorded
    here and not patched in this repo. The alternative that needs no platform rule remains our
    own cells on native, at the cost of the system picker's VoiceOver and touch tuning. The
    probe that reads the rule out of any installed runtime is a scratch tool; promoting it
    beside the check is open.
34. 2026-09-22. **The web calendar is an anchored popover, not a modal dialog.** The owner
    judged the calendar dialog on web and asked for two things: freedom on its size, and a
    way to open it without an overlay. The size was an accident: the kit's dialog panel
    sizes to its widest child, the one-line keyboard instruction, so on a wide window the
    panel was as wide as that sentence. On web the calendar now opens in the kit's Popover,
    anchored below the Calendar button and aligned to its leading edge, flipping above when
    the window has no room below and shifting to stay inside it; no scrim, the page stays in
    view, an outside press closes it, Escape closes it, focus lands on the day on open,
    returns to the button on Escape or Done and goes to the control an outside press went
    to, and Tab cycles inside. The instructions take no width of their own and stretch to
    the calendar's, so the panel is as wide as its months; a window too short for the months
    caps the panel at the room the popper reports and scrolls it, and a window with room on
    neither side shifts it over its button. It is a dialog by role and not modal, so
    contract line 6 holds as written, with the web lines added. Three kit traps were found
    on the way and are in `docs/plan.md`: the popper's floating element carries a dialog
    role of its own, a press under the popover root counts as inside, and the focus trap
    holds until the panel is gone. Native keeps the kit's dialog around the system picker: the container splits by
    platform at the field, the way the calendar already does. The popover's panel is the
    popper's frame, so the map gains a `PopperContent` theme reading the dialog panel's
    rows, plane, edge and shadow, no new color. Two things are open: under the one-month
    width a bottom sheet is the honest small-screen form, and the kit's Adapt can turn the
    popover into one when a sheet has its theme rows; and the print's dialog panel stands
    for the popover's until a set is cut. Foreclosed: opening the calendar on focus of a
    field, which decision 32 rules out; the popover opens from the button alone.
35. 2026-09-22. **Each field carries its own calendar button, attached.** The owner judged
    the popover on web and found one thing confusing: the calendar had to be reached from a
    button standing off to the side, when it belongs to the field. Two placements were
    weighed. Overlaid inside the field's box, the convention most people know, the button
    would share the field's hit area, borrow its padding and have to fit its focus ring
    inside the field's border. Attached, butted to the field's trailing edge and sharing its
    height and edge, it reads as part of the field and stays its own box, which is what the
    ARIA Authoring Practices date picker example does and what the kit's own copy-paste date
    picker does. Attached won. Each field now ends in a `neutral_outline` Button, square
    where they meet and the field's corner outside, one shared edge, a calendar glyph drawn
    in the theme's text color so no icon set is needed. Its name is Choose start date, or
    Choose end date, and once a date is set Change start date and the date, so a screen
    reader hears the pick confirmed; on web the name also shows as a tooltip on hover. The
    calendar opens on that field's date and its first pick sets that field's end: from
    Start, the pick is the new start and the end is chosen next; from End, the pick is the
    new end, swapping if it comes before the start; the range rules take over after it,
    on both platforms, held by a model test. The standalone Calendar button is gone, so the
    tab order runs start, its button, end, its button, then the presets, two stops instead
    of one. Contract line 5 now reads from a field's own button. Foreclosed: an overlay
    inside the field, and opening the calendar from the field's text or its focus. Open: the
    kit's Tooltip, which would give the name on keyboard focus too, waits until its trigger
    is known not to wrap the button the way the dialog's does (decision 17).

36. 2026-09-22. **The calendar dialog's heading names the end the next pick sets.** The native
    aid is the system's inline picker, which shows one selected day, so a dialog named Choose a
    period promised what the control could not show. The owner weighed the PoC's own grid on
    native and set it aside on its accessibility cost, VoiceOver names and states, focus on open,
    announcements, 44-point targets and Dynamic Type, all owed by hand, and chose the copy. The
    heading is Choose a start date or Choose an end date, by `nextEnd` in the model, the rule
    `pickFrom` already applies: the field that opened the calendar until its pick, then the start
    when there is no start or the range is complete, else the end. The field holds the armed end
    and passes it live, so the heading and the pick read one value. One rule on both platforms,
    so one file holds the copy; the lines that repeated it, "Choose the start, then the end" and
    the picker's own "Choose the start" and "Choose the end", are gone, and the picker's line only
    confirms what is set. Held by a model test that checks the rule against the pick itself.
    Foreclosed: nothing; the grid on native stays the alternative decision 33 names, hers to
    resurrect. Open: the shots in `docs/shots/` after the owner's look.

37. 2026-09-22. **Both calendar aids ship on native, the PoC's own grid first.** The comparison
    exhibit put the PoC's grid, the web calendar's file, inside the native dialog beside the
    system picker on a toggle. The owner keeps both: the grid is the default aid, so the dialog
    that asks for a period shows one, and the system picker stays behind the toggle as the
    baseline the grid is judged against, its tint rule (decision 33) intact. Two things the port
    needed: the grid's resize listener is web-only, since the phone's `window` has no listeners;
    and the day label carries the frame's theme itself, since on iOS the frame's theme did not
    reach the label's `$color`. The verdict on the grid, and its accessibility work (VoiceOver
    names and states, focus on open, announcements through the platform's call, 44-point cells,
    Dynamic Type), is deferred: the owner finishes on another machine. Foreclosed: nothing.
    Open: the week starts on Monday in the grid, from the model's locale on Hermes, and on
    Sunday in the system picker; the light shots; the accessibility list.

38. 2026-09-22. **Astryx is the web renderer, Tamagui the native one, one build feeds both.**
    The owner's goal is one okchroma system on two renderers, pointed at the Figma library:
    Astryx on web for the breadth of its components, Tamagui on native. The Astryx proof of
    concept moves in as `apps/web-astryx`, reading `dist/theme.<brand>.ts`, the rows by engine
    name the build already writes before the Tamagui keys are applied, through the Astryx map,
    `packages/theme/src/map-astryx.ts`, with its reasoning in `docs/map-astryx.md`. No engine
    call of its own, no copy of the brands: a brand reads the same value for the same name on
    both renderers, and the check's rules A and D already fit it. The seed input the proof had
    is dropped: a new hex is a brand and a build, never a literal, the discipline the repository
    keeps. `apps/web` stays as the same-file control for native until the grid verdict is in.
    The four rulings on the map (the accent as the stamp with the fork owed, disabled text as a
    color, the muted grounds on paper-3, hue families only where Astryx assigns a role) stand
    as recorded in the map's doc. Foreclosed: a runtime engine in the web app. Open: the
    check's rule for the Astryx map; the copied page template, which the check reads as this
    proof's code although it is reference; Code Connect's platform labels for the print; the
    shots of the Astryx exhibits in both modes.
