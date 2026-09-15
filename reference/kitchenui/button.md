# Button

Round 3, 2026-09-05. Wraps Base UI `Button` from `@base-ui/react/button`, a single element.
This record is the source the docs page and the semantic-layer decision are written from
(decisions 5 and 10).

## Parts

| Part | Attribute | What it is |
|---|---|---|
| root | `data-part="button"` | Base UI's element, a native `<button>` unless `render` replaces it. |

No inner parts yet. An icon, when a component needs one, is `data-part="button-icon"`.

## Variants

One axis, `data-variant`: `fill` (the call to action, on okchroma's stamp fill) and
`outline` (a text-style call to action on the ground, with the required border). One
size. Nothing more until something needs it. Variant names say what a thing looks like,
never its rank: primary and secondary are okchroma's words for the two brand families
(decision 11).

## States and the token each reads

| State | Selected by | fill | outline |
|---|---|---|---|
| rest | | background `--brand-stamp-fill`, text `--brand-stamp-on`, edge `--brand-stamp-edge` | background `transparent`, text `--brand-pen-58`, border `--brand-highlighter-26` |
| hover | `:hover`, not disabled | background `--brand-stamp-fill-hover` | background `--brand-chalk-8` |
| pressed | `:active`, not disabled | background `--brand-stamp-fill-pressed` | background `--brand-chalk-11` |
| focus | `:focus-visible` | outline `--brand-highlighter-26`, 2px, offset 2px | same |
| disabled | `[data-disabled]` (Base UI) | `opacity: var(--disabled-opacity)` | same |

Shape, from the foundations: padding `--space-50` by `--space-100`, `--radius-8` (the
control level), `--type-100`, `--weight-600`, `--leading-150`. The 1.5px edge is always
drawn so the box never shifts.

The outline's text holds at pen-58 in every state and only the ground steps, chalk-8
then chalk-11: pen-58 is the stop okchroma clears against the chalks, where
pencil-47 on chalk-8 measures 4.25:1 (owner's ruling, 2026-09-06; in Figma, `focused`
is a property on every state rather than a state of its own).

## Hand-built beyond Base UI

The variant axis, every state's look, the always-drawn edge, the focus ring, the shape.
Base UI supplied the element, its role and keyboard semantics, `data-disabled`,
`focusableWhenDisabled`, `nativeButton`, and `render`.

## Learning log

Round 3 rows in `docs/learning-log.md`.
