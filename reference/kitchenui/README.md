# Reference: kitchenUI

Files copied from the kitchenUI repository (https://github.com/egerrity/kitchenUI) at
commit 46469c5. They are reference, not source: nothing here is built, imported or kept
current. kitchenUI is a design system on Base UI's DOM primitives colored by okchroma; its
CSS does not transfer to Tamagui, its rules do.

- `cascade.md`: the color law (section 4) every stylesheet there obeys. The check in this
  repository holds the same law against Tamagui theme objects and style props.
- `families.md`: the design rules per component family, and where members bent them.
- `button.md`, `dialog.md`: the records: parts, states, and the token each state reads.
  The map in `docs/map.md` derives its Button and Dialog rows from these.
- `figma/`: the Figma print scripts. They generate Plugin API code from the repository's
  tokens and paste it into a Plugin API runner; `scripts/figma/print.ts` here follows the
  same pattern against the engine's structured emit instead of a stylesheet.
