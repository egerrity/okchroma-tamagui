# Adding a component

The path a component takes into this system, written from the chips (decision 25), for
the owner and for the coding agent on the machine with the design files. A component the
kit ships needs steps 1, 3 and 5 at most; a component the kit does not ship needs all
five. Nothing in the path decides a color: every value is an engine name in the map, and
the check holds it.

## 1. Its rows, in the map's group

Decide which group the component belongs to the way the design files group it:
`containers`, `actions`, `inputs`, `display`. Then decide what it reads.

- If it reads what a tier already gives (ground, hover, pressed, selected, text, edge), it
  needs no rows: it takes `theme="<family>_<tier>"` like a Button. The interactive chip is
  this case.
- If it reads something of its own, it gets a component sub-theme in its group's file: a
  small object of Tamagui keys to engine names, expanded per family by the generator
  when it says `<family>`. The tag chip's levels are this case (`map/display.ts`). Add the
  same rows to `docs/map.md` under the group.
- If it needs a key no theme declares yet, add the key to the base theme in
  `map/containers.ts` too, so the check can see it (the chip's `backgroundSelected`).

Then `npm run tokens && npm run check`.

## 2. Its part

A file under `packages/theme/src/parts/`, exported from `parts.tsx`. A part is a styled
frame with a `name` (that is how the sub-theme finds it) and, if it has text, a styled
text. Build it on the closest kit component when one exists, so press, hover, focus and
the keyboard are the kit's: the interactive chip is the kit's Button under a pill. Shape
comes from the foundations' keys (`$xs`, `$chip`), color only from theme keys
(`$background`, `$color`, `$borderColor`). A prop that changes color maps to a theme key
(`selected` to `$backgroundSelected`); it never names a color.

## 3. Its place in the exhibit

Put it on the screen where it would be used, and on the roster page once per family, so
it is judged in context and in every family. `npm run check && npm run typecheck`, then
look, on web and on native.

## 4. Its set in the print

In `scripts/figma/print.ts`, a block like the Chip's: one component per variant, a host
frame whose edge and text bind `color family` rows (family by mode) and that carries one
stretched state-layer instance for its ground; a component that takes no press binds its
fill directly. Regenerate both forms (`README.md` in `scripts/figma/plugin/`) and
commit them. Run the print in the file; it skips sets that already exist, so a changed set
is removed by hand first.

## 5. Its snippet

`figma/<name>.snippet.tsx`: the code a designer pastes into Code Connect's UI for the set,
one export per variant worth showing.

## The prompt for the coding agent

Fill the angle brackets; send as one message; keep the report line.

```
Read .github/copilot-instructions.md, docs/map.md and docs/adding-a-component.md. Those
and docs/decisions.md are the whole context; do not read the engine's source or search
the web.

Add <component>, a component the kit does not ship, following docs/adding-a-component.md
step by step. Its group is <group>. It reads <what it reads: a tier, or these keys to
these engine names>. Its part is built on <the kit component, or a stack>. Place it on the
screen at <where> and on the roster once per family. Add its set to the print and its
snippet. This message is the yes for those files and nothing else.

After each step run the command the guide names and stop on the first failure with its
lines pasted; do not patch a value. Report in at most ten lines: the files touched, the
generator's summary line, the check's result, the typecheck's result, and any line the
run printed that docs/plan.md's Traps section does not already name.
```
