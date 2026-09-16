# The map

okchroma's names onto Tamagui's theme keys. This table is the only source of theme values.
`packages/theme/src/map.ts` is the same table as data; `packages/theme/src/build.ts`
resolves every name per mode through the engine's `themeTokens` and `interactionTokens`
and writes one `packages/theme/dist/theme.<brand>.ts` per brand in `brands.ts`. The same key
holds the same name in light and
in dark. A Tamagui key the kit turns out to read that is not here gets a row here first,
as an engine name, never a literal in code.

## Base theme, `light` and `dark`

Keys the kit reads on anything not given a sub-theme.

| Tamagui key | okchroma name | Why |
|---|---|---|
| `background` | `surface-low` | the page's resting plane |
| `backgroundHover` | `neutral-hint-bg-hover` | a state on a paper is the highlighter at a rung |
| `backgroundPress` | `neutral-hint-bg-pressed` | the next rung |
| `backgroundFocus` | `neutral-hint-bg-enabled` | transparent; focus is the ring, not a ground |
| `color` | `neutral-pen-70` | body text |
| `colorHover`, `colorPress`, `colorFocus` | `neutral-pen-70` | text does not move on the base |
| `placeholderColor` | `neutral-pencil-47` | the lowest text stop |
| `borderColor`, `borderColorHover`, `borderColorPress`, `borderColorFocus` | `neutral-chalk-11` | a decorative edge: cards, panels |
| `outlineColor` | `neutral-highlighter-26` | the focus ring, cleared 3:1 on every paper |
| `shadowColor` | `shadow-08` | the engine's shadow recipe; shadows are dark |

The base theme also carries every color-valued engine name as a key under its own name
(`brand-stamp-fill`, `surface-high`, `scrim`, `neutral-pen-58`, and the rest), so screen
code can read `$surface-high` and the check can hold that every `$` reference exists.

## Family edge themes, `<family>`

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

## Tier themes, `<family>_solid`, `<family>_subtle`, `<family>_hint`, `<family>_outline`

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
| `color`, `colorHover`, `colorPress`, `colorFocus` | `<family>-solid-fg` | `<family>-fg` | `<family>-fg-on-hint` | `<family>-fg-on-hint` |
| `borderColor` and its hover, press, focus | `<family>-solid-border` | `transparent` | `transparent` | the family's tint |
| `outlineColor` | inherited | inherited | inherited | inherited |

Hint and outline text read `fg-on-hint` because the register names it so; if the exhibit
shows it under the bar on a hover rung, that is a finding for the engine's catalog, not a
change here.

## Input themes, `Input` and `critical_Input`

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

## Dialog themes, `DialogOverlay` and `DialogContent`

The kit's overlay and content are named parts that read `$background`, `$borderColor`
and `$shadowColor`, so each gets a component sub-theme (decision 13).

| Tamagui key | `DialogOverlay` | `DialogContent` |
|---|---|---|
| `background` | `scrim` | `surface-high` |
| `borderColor` | inherited | `neutral-chalk-11` |
| `shadowColor` | inherited | `shadow-08` |

## Shape rules a theme cannot hold

The stamp edge always renders (the kit gives every Button a border width of 1 but rests
its color on transparent), disabled is the engine's `disabled-opacity` on the component,
and the placeholder is colored only through a prop. The config's `defaultProps` do not
reach past the kit's variant styles; `packages/theme/src/parts.tsx` holds the two one-line
`styled()` extensions that do (decision 15). No other component is extended.
