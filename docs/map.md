# The map

okchroma's names onto Tamagui's theme keys, grouped the way the design files group things:
containers, actions, inputs, then the non-color foundations (decision 24). This table is
the only source of theme values. `packages/theme/src/map/` is the same table as data, one
file per group; `packages/theme/src/build.ts`
resolves every name per mode through the engine's `themeTokens` and `interactionTokens`
and writes one `packages/theme/dist/theme.<brand>.ts` per brand in `brands.ts`. The same key
holds the same name in light and
in dark. A Tamagui key the kit turns out to read that is not here gets a row here first,
as an engine name, never a literal in code.

## Containers

The page and its planes, body text, decorative edges, the focus ring, the shadow, and
the dialog's parts. `packages/theme/src/map/containers.ts`.

### Base theme, `light` and `dark`

Keys the kit reads on anything not given a sub-theme.

| Tamagui key | okchroma name | Why |
|---|---|---|
| `background` | `surface-low` | the page's resting plane |
| `backgroundHover` | `neutral-hint-bg-hover` | a state on a paper is the highlighter at a rung |
| `backgroundPress` | `neutral-hint-bg-pressed` | the next rung |
| `backgroundFocus` | `neutral-hint-bg-enabled` | transparent; focus is the ring, not a ground |
| `backgroundSelected` | `neutral-hint-bg-selected` | the ground a control keeps while it is on |
| `color` | `neutral-pen-70` | body text |
| `colorHover`, `colorPress`, `colorFocus` | `neutral-pen-70` | text does not move on the base |
| `placeholderColor` | `neutral-pencil-47` | the lowest text stop |
| `borderColor`, `borderColorHover`, `borderColorPress`, `borderColorFocus` | `neutral-chalk-11` | a decorative edge: cards, panels |
| `outlineColor` | `neutral-highlighter-26` | the focus ring, cleared 3:1 on every paper |
| `shadowColor` | `shadow-08` | the engine's shadow recipe; shadows are dark |

The base theme also carries every color-valued engine name as a key under its own name
(`brand-stamp-fill`, `surface-high`, `scrim`, `neutral-pen-58`, and the rest), so screen
code can read `$surface-high` and the check can hold that every `$` reference exists.

### Dialog themes, `DialogOverlay` and `DialogContent`

The kit's overlay and content are named parts that read `$background`, `$borderColor`
and `$shadowColor`, so each gets a component sub-theme (decision 13).

| Tamagui key | `DialogOverlay` | `DialogContent` |
|---|---|---|
| `background` | `scrim` | `surface-high` |
| `borderColor` | inherited | `neutral-chalk-11` |
| `shadowColor` | inherited | `shadow-08` |

## Actions

The family edge themes and the four tiers a control takes. `packages/theme/src/map/actions.ts`.

### Family edge themes, `<family>`

For the nine register families: `neutral`, `brand`, `brand-alt`, `critical`, `warning`,
`positive`, `info`, `neutral-strong`, `neutral-inverse`. Edges only; everything else
inherits from the base. The family's tint is its `highlighter-26`; for the two pole
families it is the pole, as the register's own translucent rows ride it.

| Tamagui key | okchroma name |
|---|---|
| `borderColor`, `borderColorHover`, `borderColorPress`, `borderColorFocus` | the family's tint |

The focus ring is not a family matter: `outlineColor` stays the base's `neutral-highlighter-26`
on every tier, one ring everywhere. The Input themes are the exception, where the ring
mirrors the focused edge.

### Tier themes, `<family>_solid`, `<family>_subtle`, `<family>_hint`, `<family>_outline`

One per family per tier. A Button always takes a tier. The rows are the interaction
register's, per family. Every Button reads `borderColor` at rest (the config's
`defaultProps`, decision 14), so only the tiers that draw an edge name one: the stamp's
gated edge, and the outline's tint. `outline` is the hint tier with the family's
`highlighter-26` as the required border of a text-style call to action; the register has
no such row, but the owner's Figma register carries it as `border`. `transparent` is the
one keyword the map may hold: it names the absence of a paint, not a color.

| Tamagui key | `_solid` | `_subtle` | `_hint` | `_outline` |
|---|---|---|---|---|
| `background` | `<family>-solid-bg-enabled` | `<family>-subtle-bg-enabled` | `<family>-hint-bg-enabled` | `<family>-hint-bg-enabled` |
| `backgroundHover` | `<family>-solid-bg-hover` | `<family>-subtle-bg-hover` | `<family>-hint-bg-hover` | `<family>-hint-bg-hover` |
| `backgroundPress` | `<family>-solid-bg-pressed` | `<family>-subtle-bg-pressed` | `<family>-hint-bg-pressed` | `<family>-hint-bg-pressed` |
| `backgroundFocus` | `<family>-solid-bg-enabled` | `<family>-subtle-bg-enabled` | `<family>-hint-bg-enabled` | `<family>-hint-bg-enabled` |
| `backgroundSelected` | `<family>-solid-bg-enabled` | `<family>-subtle-bg-selected` | `<family>-subtle-bg-enabled` | `<family>-subtle-bg-enabled` |
| `backgroundSelectedHover` | `<family>-solid-bg-hover` | `<family>-subtle-bg-hover` | `<family>-subtle-bg-hover` | `<family>-subtle-bg-hover` |
| `backgroundSelectedPress` | `<family>-solid-bg-pressed` | `<family>-subtle-bg-pressed` | `<family>-subtle-bg-pressed` | `<family>-subtle-bg-pressed` |
| `color`, `colorHover`, `colorPress`, `colorFocus` | `<family>-solid-fg` | `<family>-fg` | `<family>-fg-on-hint` | `<family>-fg-on-hint` |
| `borderColor` and its hover, press, focus | `<family>-solid-border` | `transparent` | `transparent` | the family's tint |
| `outlineColor` | inherited | inherited | inherited | inherited |

Hint and outline text read `fg-on-hint` because the register names it so; if the exhibit
shows it under the bar on a hover rung, that is a finding for the engine's catalog, not a
change here.

## Inputs

The field's edges, resting and focused, and the invalid family. `packages/theme/src/map/inputs.ts`.

### Input themes, `Input` and `critical_Input`

Tamagui looks up `<mode>_<theme>_Input` for a component named Input, so a plain `<Input>`
reads the first and `<Input theme="critical">` reads the second. Same keys; only the edge
rows differ.

| Tamagui key | `Input` | `critical_Input` |
|---|---|---|
| `background` | `surface-high` | `surface-high` |
| `color` | `neutral-pen-70` | `neutral-pen-70` |
| `placeholderColor` | `neutral-pencil-47` | `neutral-pencil-47` |
| `borderColor`, `borderColorHover` | `neutral-highlighter-26` | `critical-highlighter-26` |
| `borderColorFocus`, `outlineColor` | `brand-highlighter-26` | `critical-highlighter-26` |

A form control's resting edge is a highlighter because it is a required border; the focus
edge is the brand's highlighter; invalid moves the edge rows to critical and nothing else.

## Display

The chips, on their levels. `packages/theme/src/map/display.ts`.

### The button chip, `<family>_chip`

For the seven color families; the pole families have no chalk. The button chip has no
hierarchy. Off, it is the neutral stamp; on, it is the family's stamp; each side takes its
stamp's own hover and pressed fills (decision 29). `<Chip theme="brand_chip" selected>`.

| Tamagui key | okchroma name |
|---|---|
| `background`, `backgroundFocus` | `neutral-stamp-fill` |
| `backgroundHover` | `neutral-stamp-fill-hover` |
| `backgroundPress` | `neutral-stamp-fill-pressed` |
| `color`, `colorHover`, `colorPress`, `colorFocus` | `neutral-stamp-on` |
| `borderColor`, `borderColorHover`, `borderColorPress`, `borderColorFocus` | `neutral-stamp-edge` |
| `backgroundSelected` | `<family>-stamp-fill` |
| `backgroundSelectedHover` | `<family>-stamp-fill-hover` |
| `backgroundSelectedPress` | `<family>-stamp-fill-pressed` |
| `colorSelected` | `<family>-stamp-on` |
| `borderColorSelected` | `<family>-stamp-edge` |

### The tag chip, `<family>_indicator-stamp`, `<family>_indicator-strong`, `<family>_indicator-default`

The tag chip's level is its hierarchy, and hierarchy is real color: the family's scale
stops, the same stop in both modes. `<IndicatorChip theme="positive_indicator-strong">`.

| Tamagui key | `_indicator-stamp` | `_indicator-strong` | `_indicator-default` |
|---|---|---|---|
| `background` | `<family>-stamp-fill` | `<family>-chalk-11` | `<family>-paper-3` |
| `color` | `<family>-stamp-on` | `<family>-pen-58` | `<family>-pencil-47` |
| `borderColor` | `<family>-stamp-edge` | `<family>-chalk-20` | `<family>-chalk-15` |

Both chips are shapes over their rows: the button chip is a Button under the chip corner
(decision 25), the tag chip a stack that takes no press.

## Shape rules a theme cannot hold

The stamp edge always renders (the kit gives every Button a border width of 1 but rests
its color on transparent), disabled is the engine's `disabled-opacity` on the component,
and the placeholder is colored only through a prop. The config's `defaultProps` do not
reach past the kit's variant styles; `packages/theme/src/parts.tsx` holds the two one-line
`styled()` extensions that do (decision 15). No other component is extended.

## Foundations (non-color)

`packages/theme/src/map/foundations.ts`, the only source of the non-color tokens
(decision 23). Values in px unless noted. The named keys are what a control's `size` prop
resolves in every group at once.

| Group | Keys | Values |
|---|---|---|
| Type ladder | `1` to `10` | 12, 14, 15, 18, 20, 26, 32, 40, 48, 72 |
| Type, control keys | `xxs xs sm md lg true` | 14, 14, 14, 15, 18, 15 |
| Leading | display (20 and up), text | 1.25, 1.5 |
| Roles | body, heading, button | body 400 (500 at 12), heading 500 (600 from 40), button 500 |
| Space | `0 1 2 3 4 6 10 12 16` | 0, 4, 8, 12, 16, 24, 40, 48, 64 |
| Space, control padding | `xxs xs sm md lg true` | 8, 12, 12, 16, 24, 16 |
| Size, control height | `xxs xs sm md lg true` | 24, 32, 40, 48, 56, 48 |
| Size, other | `icon content` | 24, 720 |
| Radius | `0 1 2 3`, `xxs xs sm md lg true`, `chip`, `full` | 0, 4, 8, 12; 8 everywhere; 6; 10000 |

The kit's headings read the numeric ladder from `$10` down to `$5`; a Paragraph reads
`$true`. A change here is a change to every component at once; a component whose shape
the documentation draws differently from the kit's default gets a part, never a token.
