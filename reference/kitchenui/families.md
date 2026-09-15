# Family design rules

Written 2026-09-05, when the owner asked for the whole Base UI roster to be built while
away and judged in bulk on return (decision 12). Components are built by family. The
first member of a family sets its rules here; every later member follows them; a member
that needs an exception records it in its own record beside its files. A ruling on one
member is applied to its siblings. Rules that every component shares come first.

The roster, by family (Base UI 1.8, its 37 components):

- **Form controls:** Button, Field with Input, Fieldset, Form, Number Field, OTP Field,
  Checkbox, Checkbox Group, Radio and Radio Group, Switch, Slider, Toggle, Toggle Group,
  Select, Combobox, Autocomplete.
- **Popups:** Tooltip, Popover, Preview Card, Dialog, Alert Dialog, Drawer, Menu, Context
  Menu, Menubar, Navigation Menu, Toast. The lists that Select, Combobox and Autocomplete
  open follow the popup rules too.
- **Disclosure and navigation:** Collapsible, Accordion, Tabs, Toolbar, Scroll Area,
  Separator.
- **Display:** Avatar, Progress, Meter.

Base UI's four utilities (CSP provider, direction provider, mergeProps, useRender) are
not components and have no page.

## Every component

- **Grammar.** One `data-part` per part, named `component` on the root and
  `component-part` inside, Base UI's own part names in kebab case where they exist
  (docs/cascade.md, 3). Variants say what a thing looks like, never its rank (decision 11).
  State is Base UI's attributes plus the platform's pseudo-classes; no state classes.
  Collapsible, rendered:

  ```html
  <div data-part="collapsible">
    <button data-part="collapsible-trigger" data-panel-open>
      Details
      <svg data-part="collapsible-icon" />
    </button>
    <div data-part="collapsible-panel">...</div>
  </div>
  ```

  `trigger` and `panel` are Base UI's own words for those parts; the chevron is ours, since
  Base UI has none. `data-panel-open` is Base UI's and the stylesheet reads it where it sits.
- **Shape.** A control is 2.5rem tall: `--type-100` at `--leading-150` plus `--space-50`
  above and below. Radius by nesting level: `--radius-4` inside a control, `--radius-8` on
  a control, `--radius-12` on a surface, `--radius-full` for pills and round things. Where
  a component has an edge it is 1.5px and always drawn, so nothing shifts between states.
- **Color.** By instrument (docs/cascade.md, 4): grounds read the planes and papers, text
  reads pencil and pen, interactive backgrounds and decorative borders read chalks,
  required borders and icons and focus rings read highlighter, the call to action reads the
  stamp, signals read their own family. The brand family is the default; `brand-alt`
  appears only when a component asks for a second color.
- **Focus.** `:focus-visible` draws a 2px outline in `--brand-highlighter-26`, offset 2px, the
  same on every component. A control that is invalid draws it in `--critical-highlighter-26`.
- **Disabled.** `opacity: var(--disabled-opacity)` on the component and nothing else; hover
  and pressed looks are suppressed with `:not([data-disabled])`.
- **Icons.** lucide (decision 13), rendered as `data-part="component-icon"`, sized `1em`
  by the stylesheet so they follow the text, colored by `currentColor`, hidden from
  assistive technology.
- **Motion.** Transitions, never keyframe animations, because Base UI notes a transition
  can be cancelled midway (decision 14). State changes and small popups take
  `--duration-120`; large surfaces (dialogs, drawers, panels opening) take
  `--duration-200`; everything uses `--ease-out`. Reduced motion zeroes both durations in
  the base layer. The one exception is an indeterminate indicator, which has no end state.
- **Record and exhibit.** Every component has `<name>.md` beside its files (decision 10)
  and a page under `site/components`, registered in `site/components/registry.tsx`.

## Form controls

Set by Button (round 3) and Field with Input (round 4).

- **Every control lives in a Field.** Label above the control, then the control, then the
  description, then the error. Label: `--type-100`, `--weight-600`, `--neutral-pen-70`.
  Description: `--type-80`, `--neutral-pencil-47`. Error: `--type-80`, `--critical-pencil-47`.
  Parts stack with `--space-25` between them. Checkables put the label beside the control
  instead, with `--space-50` between.
- **Text entry** (Input, Number Field, OTP Field, the Select trigger, the Combobox and
  Autocomplete inputs): one rule, in `field.css`, whose selector list names every
  text-entry part; a sibling adds its part there and says so in its record. Background
  `--surface-high`, text `--neutral-pen-70`, placeholder
  `--neutral-pencil-47`, edge `--neutral-highlighter-26` (the accessibility border, 3:1), `--radius-8`,
  padding `0 var(--space-75)`, height 2.5rem. Focused (`data-focused`): edge
  `--brand-highlighter-26` plus the focus ring. Invalid (`data-invalid`): edge
  `--critical-highlighter-26`, and the ring in the same. No hover change on a text field.
- **Checkables** (Checkbox, Radio, Switch, Toggle): unchecked background `--surface-high`
  with edge `--neutral-highlighter-26`; hover `--brand-chalk-8` behind, edge
  `--brand-highlighter-26`. Checked (`data-checked` or `data-pressed`): background
  `--brand-stamp-fill`, mark `--brand-stamp-on`, edge `--brand-stamp-edge`; hover and
  pressed step the stamp's fills. Checkbox and Radio are 1.25rem; Checkbox is
  `--radius-4`, Radio and Switch `--radius-full`. The Switch thumb reads
  `--neutral-highlighter-26` unchecked and `--brand-stamp-on` checked, and slides with
  `--duration-120`.
- **Lists that pick a value** (Select, Combobox, Autocomplete; Menu items share this):
  the popup surface from the popup family, items `padding: var(--space-50) var(--space-75)`,
  `--radius-4`, text `--neutral-pen-70`. Highlighted (`data-highlighted`): background
  `--brand-chalk-8`. Selected (`data-selected`): text `--brand-pen-58` and a check
  icon. The list is as wide as its trigger through Base UI's `--anchor-width` and no
  taller than `--available-height`.
- **Text-style calls to action** (the outline button, Toggle) hold their text at
  `--brand-pen-58` in every state; only the ground steps, `--brand-chalk-8` on hover
  and `-11` when pressed. pen-58 is the stop okchroma clears against the chalks;
  pencil-47 on chalk-8 is 4.25:1 (owner, 2026-09-06).
- **Toggle and Toggle Group** look like the outline button; pressed (`data-pressed`) is the
  outline button's pressed look, held.
- **Slider:** track `--neutral-chalk-11`, `--space-25` tall, `--radius-full`;
  indicator `--brand-stamp-fill`; thumb 1.25rem, `--surface-high`, edge
  `--brand-highlighter-26`, with the focus ring.
- **Buttons inside fields** (steppers, clear, open) are icon-only, 2rem square,
  `--radius-4`, no edge, hover `--neutral-chalk-8`.
- **On the exhibit,** the live field is required and validates on blur, so the error shows
  itself when you click in and out; an invalid one and a disabled one stand beside it.

## Popups

Set by Tooltip and Popover; Dialog adds the backdrop.

- **Surface:** background `--surface-high`, edge 1px `--neutral-chalk-11`, `--radius-12`,
  `--elevation-2`, padding `--space-100`. Menus and lists pad `--space-25` and let items
  carry their own padding. Height is capped at `var(--available-height)` where Base UI
  provides it.
- **Tooltip is the inverted exception:** background `--neutral-pen-70`, text
  `--neutral-paper-1`, `--radius-8`, padding `var(--space-25) var(--space-50)`,
  `--type-80`, no edge, `--elevation-1`.
- **Motion:** `transition: opacity, transform` at `--duration-120` `--ease-out`;
  `data-starting-style` and `data-ending-style` set `opacity: 0` and `transform:
  scale(0.96)` from `var(--transform-origin)`. Dialogs take `--duration-200`; a Drawer
  slides from its side instead of scaling.
- **Backdrop** (Dialog, Alert Dialog, Drawer): `--scrim`, okchroma's alias for
  `--abs-black-060`, black at 60% in both modes. It fades with `--duration-200`.
- **Offsets:** popups sit 8px from their anchor (`sideOffset={8}`, the `--space-50` size as a
  number, since Base UI takes a number).
- **Close buttons** are icon-only, 2rem square, `--radius-8`, no edge, hover
  `--neutral-chalk-8`, placed top right.
- **Titles** are `--type-125`, `--weight-600`; descriptions `--neutral-pencil-47`. Actions sit at
  the end, right-aligned, `--space-50` apart, the fill button last.
- **Separators** inside menus are 1px `--neutral-chalk-11` with `--space-25` above and below.
- **Toast** uses the surface, stacks at the bottom right, and carries a close button; a
  toast with a type shows its signal family's `highlighter-26` as a 3px edge on the start side.

## Disclosure and navigation

Set by Collapsible and Tabs.

- **Triggers** (Collapsible, Accordion): full width, `padding: var(--space-75) 0`,
  `--weight-600`, text `--neutral-pen-70`; a chevron icon at the end turns 180° with
  `--duration-120` when `data-panel-open`. Hover: text `--brand-pen-58`.
- **Panels:** open and close by height, using Base UI's `--collapsible-panel-height` and
  `--accordion-panel-height`, at `--duration-200`; content pads `0 0 var(--space-75)`.
- **Accordion items** are separated by 1px `--neutral-chalk-11`.
- **Tabs:** the list has a 1px `--neutral-chalk-11` bottom edge; a tab is
  `padding: var(--space-50) var(--space-75)`, text `--neutral-pencil-47`, hover `--neutral-pen-70`;
  the active tab (`data-active`) is `--brand-pen-58` with the indicator, a 2px
  `--brand-highlighter-26` line placed by Base UI's `--active-tab-left` and `--active-tab-width`
  and moved with `--duration-120`. Panels pad `var(--space-100) 0`.
- **Toolbar:** a row with `--space-25` between items; its buttons and toggles use the
  Toggle look; its separators are 1px `--neutral-chalk-11`, 1.5rem tall.
- **Scroll Area:** the scrollbar is `--space-50` wide, its thumb `--neutral-chalk-20`
  and `--radius-full`, visible while scrolling or hovering (`data-scrolling`,
  `data-hovering`) and faded with `--duration-120` otherwise.
- **Separator:** 1px `--neutral-chalk-11`.

## Display

Set by Avatar and Progress.

- **Avatar:** 2.5rem, `--radius-full`, the image covers; the fallback is
  `--brand-chalk-11` with initials in `--brand-pen-58`, `--weight-600`.
- **Progress:** track `--neutral-chalk-11`, `--space-50` tall, `--radius-full`;
  indicator `--brand-stamp-fill`, its width moved with `--duration-200`. Indeterminate
  slides a segment back and forth, the one keyframe animation in the system. Label and
  value are `--type-80`, `--neutral-pencil-47`.
- **Meter:** the same track; the value bar `--brand-highlighter-26`, since a meter reports a
  measurement rather than a call to action.

## Exceptions, by member

Where a member bent a family rule, with the reason. Each is also in the member's record.

- **Switch:** the thumb is `--neutral-highlighter-26` unchecked and `--brand-stamp-on` checked,
  not `--surface-high`, which would vanish on the unchecked track.
- **Number Field, Combobox, Autocomplete (with an input group):** focus is `:focus-within`
  on the box, because the element that holds focus is the bare input inside it.
- **Slider:** the focus ring is drawn on the thumb with `:has(:focus-visible)`, because the
  hidden range input inside it holds focus.
- **Select's trigger:** shows its focus edge with `:focus-visible` and while
  `[data-popup-open]`, not `:focus`, because it is a button.
- **Tooltip:** the inverted surface, `--neutral-pen-70` with `--neutral-paper-1` text.
- **Progress, indeterminate:** a keyframe animation, since there is no end state.
- **Toast:** the kinds are kitchenUI's names (`success`, `error`, `warning`, `info`,
  `loading`), each mapped to a signal family's highlighter; Base UI marks whatever string it
  is given.
- **No stylesheet of their own,** their parts living in a sibling's selector lists: Input
  (field.css), Alert Dialog (dialog.css), Context Menu (select.css and menu.css), Menubar
  (menu.css), Meter (progress.css).
- **Shared rules hosted by a first member:** text entry in field.css; the pick-a-value list
  in select.css, which the menus also use; the popup surface in popover.css, which Preview
  Card uses; the scrim, title, description and close in dialog.css, which Drawer uses; the
  trigger row and panel in collapsible.css, which Accordion uses.

## In Figma

Set by the Foundations page and Button (the Figma round, `docs/plan.md`).

- **Binding.** Every fill, stroke, radius, padding, gap and opacity is bound to the okchroma
  variable or the foundation the record names; nothing is typed in. Text takes the text
  style for its size and weight. `npm run check:figma` holds this.
- **Focus ring.** For solid containers (buttons, checkables, triggers): CSS `outline` has no Figma form: a `focus-ring` layer, absolutely
  positioned 2px outside the box with a 2px outside stroke bound to
  `brand/primary/highlighter-26`, or `critical/highlighter-26` when invalid, so the variant keeps its
  size. Its own State.
- **Disabled opacity** is the variable `disabled-opacity`, which holds 38: Figma reads an
  opacity binding as a percentage, where CSS reads 0.38.
- **Disabled.** Opacity bound to `disabled-opacity` on the variant's root, nothing else, as
  in CSS.
- **Motion is the prototype.** Each state variant carries reactions: `rest` goes to `hover`
  while hovering and to `pressed` while pressing, `hover` to `pressed` while pressing, back
  on release, in a smart-animate transition of `--duration-120` with `--ease-out`
  (`--duration-200` for large surfaces). The values are typed in, since a reaction cannot
  bind a variable. Keyboard focus has no prototype trigger, so `focused` is toggled by hand;
  disabled has no reactions. Entering and leaving are not variants.
- **Focus as a state, where it is the control's own state.** A text-entry control is
  focused or not, has no hover look, and its edge changes: there `state=focused` is a
  variant (and `invalid focused` beside it), which a click reaction can reach. Where focus
  composes with other states (Button, the checkables), it is the `focused` boolean.
- **Popups.** Placed, not anchored; the 8px offset is noted on the page. Dialog and Drawer
  carry a backdrop frame bound to `system/alpha/abs-black-060`.
- **Text entry.** One `Input` component that Number Field, OTP Field, the Select trigger,
  Combobox and Autocomplete instance, as `field.css` is one rule.
- **Base UI's inline variables** (`--anchor-width`, `--available-*`, the active tab's box,
  panel heights, swipe movements) are fixed values, the token named in the layer's
  description.
- **P3 overrides** are not carried; Figma variables are sRGB.
- **Figma-only axes.** Where a look depends on the value rather than on a state attribute,
  Figma gets an axis the CSS does not have: `content` (value, placeholder) on the text
  controls and Select, `multiple` (no, yes) on Combobox, `form` (input, group) on
  Autocomplete, `pressed` (off, on) on Toggle, `checked` on the checkables. Values are
  lowercase words that say what shows.
- **Shared pieces are their own sets.** `input` (the text-entry look), `select-item` and
  `select-popup` (the pick-a-value list and its surface), `number-field-stepper` (the
  icon-only button inside a field) are built once and instanced by the members whose CSS
  shares the rule, as the stylesheets share it. Combobox’s and Autocomplete’s clear and
  trigger are drawn in place with the stepper’s look.
- **Specimen values are typed in** where CSS computes them: a switch track of 36×20 with a
  2px inset, a number input 60px wide, a slider at 40% of 320px, a combobox at 360px so
  two chips and the buttons fit one line. Each page’s documentation frame names them.
- **Names.** Everything lowercase (owner, 2026-09-06). A set is named as its root
  `data-part` (`button`); a variant is `variant=fill, state=hover`; parts are named by their
  `data-part`; pages are lowercase. Text style names are provisional until the form
  controls are built (followups).
- **Focus is a property, not a state.** `:focus-visible` composes with hover and pressed in
  CSS, so in Figma `focused` is a boolean that shows the `focus-ring` layer on every
  variant a user can focus: not on disabled, since a disabled control leaves the tab order
  (Toolbar's items, focusable when disabled by Base UI's default, are the exception)
  (owner, 2026-09-06).
- **State layers, since the 0.6.0 register (owner, 2026-09-11).** Hover, pressed and
  selected are not variants. A control places one instance of `state-layer/solid`,
  `/subtle` or `/hint` (the `utilities` page) stretched over its ground, its radius
  overridden to the host's; the layer's own variants carry the interaction as prototype
  reactions, the fill `role/tint` and the layer opacity the okchroma rung
  (`ladder/<tier>/<state>`). Solid under a stamped ground (the fill button, a checked
  checkable): `role/solid/bg-enabled`, `-hover`, `-pressed`. Hint over a bare ground (the
  outline button, an unchecked checkable, a list item, the stepper, the slider thumb).
  Subtle on a ground that already carries the tint (a chip). A set keeps rest, disabled and
  the control's own states (checked, invalid, open, selected) with the `focused` boolean;
  every set's description ends with a paragraph for agents and designers saying where the
  interaction lives and what not to add.
- **The family is the `role` mode.** A component binds `role/fg`, `role/fg-strong`,
  `role/border`, `role/solid/*` and takes its family from the mode: brand by default, set
  on a page, a frame or an instance. A component whose stylesheet names one family pins the
  mode on its root (`number-field-stepper` is neutral). Validity is not a family: the
  invalid edge and ring stay direct `critical/highlighter-26` bindings.
- **The size is the `size` mode.** sm, md (default), lg. Rows are grouped by the thing they
  size (`button/*`, `input/*`, `checkable/*`, `item/*`, `field/*`, `switch/*`) and alias
  the foundations; line heights and the switch's arithmetic are derived rows, written by
  `npm run figma:size` from the rows they follow. Nothing in a component is a typed-in
  size except a specimen value.
- **The focus ring is a set.** `focus-ring` (`color=brand|critical, radius=8|4|full`), an
  instance stretched over the host behind `focused`, or shown outright where focus is a
  state. The stepper keeps a stroke: its CSS ring sits inside the box.
- **Where a hover changes text, not ground.** A state layer moves a ground; it cannot recolor
  a label. The preview-card link, the collapsible trigger and the tab, whose hover is a
  text change, keep hover (and pressed) as variants wired as reactions; the tab's hover
  variant carries its ground's rung statically.
- **Shared pieces beyond the form controls.** `popup-close` (popover page) is every popup's
  close; `menu-item` and `menu-popup` (menu page) carry Context Menu; the dialog's
  `kind=alert` carries Alert Dialog; Progress's page carries Meter. Compositions
  (`collapsible`, `accordion`, `tabs`, `toolbar`, `menubar`, `navigation-menu`) instance
  their sets and expose what a designer edits.
- **Specimens** show what the CSS composes: a dialog over its scrim, a drawer in a viewport,
  a stack of three toasts, a menubar open. They are frames, not components.
- **A role row for what changes with the family; the roster stop for what does not** (owner,
  2026-09-11). A checkable's unchecked ground and edge (`system/surface/high`,
  `neutral/highlighter-26`) and every control's invalid edge and ground
  (`critical/highlighter-26`, `critical/paper-3`) are the same in all nine families, so they
  bind to the roster directly and are not rows of `role`; checked is `role/solid/*`, text is
  `role/fg`. Validity is a state (`state=invalid`), never the `role` mode: switching the mode
  to critical would drag the stamp, the mark and the tint with it, which `data-invalid`
  in CSS does not do.
- **A text box focuses by its own edge** (owner, 2026-09-11). A control that already draws an
  edge (the text-entry look: input, number field group, select trigger, combobox and
  autocomplete groups) does not take the ring outside; its edge reads 3px centered on the box
  in the brand highlighter, critical when invalid: the 1.5px border and a 1.5px outline at
  offset 0 mirroring it, so the box never grows. In Figma the focused and open variants
  carry a 3px center stroke and no `focus-ring` instance. The ring outside stays for solid containers, where it
  clears the fill.
