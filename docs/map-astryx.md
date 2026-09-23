# The Astryx map

Astryx (https://astryx.atmeta.com, Meta's open-source design system: MIT, React 19 +
StyleX, `@astryxdesign/core` 0.6.2, marked Beta) is the web renderer (decision 38); Tamagui
stays the native one. This file is the Astryx map's reasoning; the map itself is
`packages/theme/src/map-astryx.ts`, data the same way `src/map/` is, and `apps/web-astryx`
reads the build's rows (`dist/theme.<brand>.ts`, engine names per mode) through it. The
code is the source; this file carries the why.

## The integration surface (Astryx's side)

An Astryx theme is `defineTheme({tokens: {'--color-x': [light, dark]}})` from
`@astryxdesign/core/theme`; a tuple becomes `light-dark()`. Its bundled Butter theme sets
every color token that way, with no generator behind it. So the adapter is one table over the
build's rows, mapped onto Astryx's names. The engine is untouched, and the build is the one
the Tamagui apps mount, so a brand reads the same value for the same name on both renderers.

Astryx ships its own seed generator (`color: {accent}`; Material HCT; 4.5:1 by tone
spacing; the neutrals tinted from the seed; `--color-border-emphasized` bumped until it
clears 3:1; the status colors convention-bound and left at Astryx's defaults). Seeded with
the brand's hex it is Meta's expression of the seed, and the baseline every exhibit is
judged against (owner, decision 39).

## Astryx's color roster and how the components consume it

39 core tokens, 40 hue-family tokens (ten hues by background, border, icon, text), 14
syntax, about 60 data-viz. Consumption counted over `packages/core/src` at 423c87c:

- `--color-accent`: a ground in 13 sites, text in 8, a border in 3, the focus ring, and the
  base of every hover (`color-mix(accent, tint-hover 15%)`). One token, four duties.
- `--color-text-primary` (72 files) and `--color-text-secondary` (81) are the workhorses,
  text only. `--color-text-disabled` is consumed as a color in 14 components.
- `--color-success`, `--color-error`, `--color-warning`: ground and text and border (status
  dots, badges, progress; text in ChatToolCalls). The `*-muted` trio is ground only (Banner,
  FieldStatus), and FieldStatus writes secondary-weight text on it.
- `--color-neutral` is a translucent gray ground (Button secondary, Avatar, Badge, Kbd).
  `--color-overlay-hover` and `-pressed` are pole-at-alpha state layers (30 and 12 files).
- The ten hue families are a consumer-picked `color` axis on Badge, Token, Icon and Card.
  Three double as roles: FieldStatus and ChatComposer paint warning, error and success text
  with `--color-text-yellow/red/green`, and the Switch track is `--color-background-gray`.
- Button consumes accent, on-accent, border, error, on-error, neutral, text-primary.
  Variants: primary, secondary, ghost, destructive. Hover and pressed are derived by
  the component, not read from tokens.

## The four rulings (owner, decision 38)

1. **accent.** Astryx folds the CTA ground and the accent text into one token; okchroma
   separates them by law. Owner: this is a problem okchroma solves and Astryx reintroduces.
   Resolved without a fork by mapping the Button individually (decision 39, below): the
   token is the brand's text stop, `brand-pencil-47`, with `paper-0` on it, so the check and
   radio indicators, Step, Icon, MetadataList and the sortable table headers paint a text
   stop; the primary Button's fill is the brand's solid tier. The stamp is never text.
2. **text-disabled, neutral-highlighter-26.** Astryx needs a color there; the opacity-only
   stance on disabled is not a hard rule (owner). Adapter boundary only.
3. **The muted trio, paper-3.** Derived: neutral-pencil-47 is written on these grounds and
   is cleared against every family's papers, not their chalks. Owner: paper-3 is the more
   flexible, paper-5 is a candidate. A Banner-round question, not a Button one.
4. **Hue families.** Owner's test: are they assigned roles? Red, green, yellow and gray are
   (above); blue is the engine's own info hue. Those five get families. Cyan, orange, pink,
   purple and teal are decoration, not roles, so they are not signals and stay at Astryx's
   defaults, visibly unharmonized on Badge and Token.

## Buttons map individually

A filled button is its family's solid tier: the stamp with its own on-text, its own hover
and pressed fills and its edge (the stamp edge where the gate raises one, transparent
otherwise, drawn as a one-pixel border Astryx's Button does not have of its own), the rows
`ASTRYX_BUTTON_MAP` in `packages/theme/src/map-astryx.ts` names. The theme carries them as theme-local tokens and lands them on the Button through
Astryx's own component overrides (`components.button`, `variant:primary` and
`variant:destructive`), scoped to the Button under the theme's attribute, so the page-level
`--color-accent` and `--color-error` stay on the text stops for everything else Astryx
paints with them. Owner's rule (decision 39): red text is pencil-47, a red button fill is
the stamp, and the stamp is never used for text; a component whose fill needs the stamp
maps individually, as the Tamagui map's tiers do.

The rest of the map is the role layer's own assignments: fg-default, fg-subtle,
border-default, border-subtle, the elevation planes, the signal bg-emphasis on pencil-47
with paper-0 on top, the alpha-away-from-bg rungs for the state layers. The owner noted
okchroma's `tokens/semantic.css` is not fixed: an Astryx-specific alias layer can be cut to
fit, which is the productized form of this map (Astryx accepts `var()` references as token
values).

## Not mapped

`--color-on-dark` and `--color-on-light` (mode-invariant absolutes; the CSS emission has
no row for them), the five decorative hues, syntax, data-viz. Typography, radius and
motion are not color and are core defaults in both candidates.

## Parked

- Generating the five decorative hues from the engine. An engine question; hers.
- paper-3 against paper-5 for the muted grounds: a Banner exhibit.
- `astryx theme build` and `astryx theme targets --json` to lint and compile the theme for
  SSR once the map settles.

## Where it differs from the Tamagui map

The two maps were written apart and agree on the page ground (`surface-low`), body text
(`neutral-pen-70`), placeholder and secondary text (`neutral-pencil-47`), the decorative
edge (`neutral-chalk-11`), the input's 3:1 edge (`neutral-highlighter-26`), the shadow
(`shadow-08`), the scrim, the solid tier (the stamp with its on-text) and the subtle tier
(`<family>-subtle-bg-enabled`), and, since decision 39, the destructive button's ground, the
critical stamp on both. They differ in four rows, which follow from Astryx's structure.

| Role | Tamagui map | Astryx map | Note |
|---|---|---|---|
| focus ring | `neutral-highlighter-26` | the accent | Astryx's Button paints its ring with `--color-accent` in the component; only a fork moves it. |
| input ground | `surface-high` | `--color-background-surface`, `surface-mid` | one plane apart. |
| ghost text | `<family>-fg-on-hint` (`pencil-47`) | `--color-text-primary`, `pen-70` | Astryx's ghost is the body text stop. |
| chip text and edge | `pen-58`, `chalk-20` (indicator-strong) | `pen-70`, `chalk-15` (the hue families) | one stop apart each. |

## Owed

- The check's rule for this map: every name it cites exists in the build's rows, and
  `apps/web-astryx` writes no color literal of its own (the copied Astryx page template is
  reference, not this proof's styled code).
- The Figma print bound to two codebases through Code Connect's platform labels.
