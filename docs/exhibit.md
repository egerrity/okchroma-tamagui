# Exhibit

Written before the first build. The exhibit is the judging surface; nothing is kept until
it is judged here.

## What is judged

That one seed yields a coherent light and dark system on both platforms on Tamagui's own
components: the register's three tiers, the elevation planes, the form control's edges and
the dialog's scrim and panel reading as one system, with no value tuned in a component.

## Surface

- **The screen.** One account form: a heading, body text, a card on `surface-mid`, an Input
  with an invalid state beside a valid one, a row of Buttons, the solid hierarchy by
  family (`brand_solid` Save, `brand-alt_solid` Preview, `neutral_solid` Go back,
  `critical_solid` Cancel) then an outline on hint (`brand_outline`) and a disabled solid,
  and a Dialog trigger. The
  same file renders on web and on native.
- **The roster page.** Per family, three things apart: the register's interaction levels
  as grounds through their rungs with `Aa` on each, the button hierarchy as buttons with
  the same four disabled, the button chip off and on, and the tag chip's levels. For judging
  the map row by row.
- **The date range** (`docs/date-picker.md`). On the screen, a Statement period pair in the
  card: two fields, each with its calendar button attached, the presets, and the calendar
  judged open: on web a popover anchored below the field's button with no scrim, sized to
  its months; on native the dialog.
  On the roster, one row per color family of the day cell in its states, day, today, start,
  inside, end and disabled, abutting as a band. Native shows the fields, the presets and
  the system picker in the dialog.
- **The demo screen.** The screen with the Statement period block out: `?demo` on web,
  `EXPO_PUBLIC_DEMO=1` on native, where the aid toggle goes with it. The demo shows the kit's
  own components; the picker's accessibility work (decision 37) is open, so it stays off
  camera. The exhibit itself is unchanged.
- Web: Vite on port 8350. Native: Expo Go on an iPhone simulator.

- **The Astryx web app** (`apps/web-astryx`, `docs/map-astryx.md`). Astryx's own
  components under the Astryx map, one brand at a time (`?brand=`), beside Astryx's own
  generator seeded with the brand's hex as the baseline. Three exhibits: the Button set
  (primary, secondary, ghost, destructive, enabled and disabled) in two panels grouped by
  candidate; Astryx's Filterable Table page template whole, the candidate on a toggle, the
  roster in one realistic screen; and the pairing, this app beside the Tamagui apps on the
  same brand, judged for one system across two renderers. Dark on dark; light behind the
  toggle; `?view=`, `?candidate=`, `?mode=`.
- **The native aid, compared.** The Statement period's calendar on the phone, two ways on a
  top-row toggle: the system's inline picker, the shipped aid (decision 32), and the PoC's
  own grid, the web calendar's file verbatim inside the same dialog, so the band and its ends
  show on the phone as they do in the web popover. Judged for whether the period reads and
  whether it feels native; the system picker is the baseline. Nothing about the grid is tuned
  for the phone here: 40-point cells as on web, no announcements on iOS, the keyboard grid
  absent. A pick for the grid opens the accessibility work as its price, not this exhibit.

## Ground and grouping

The page rests on `surface-low`. Dark is judged on a dark canvas; light sits behind a
toggle, never beside it. Tamagui's stock v5 theme sits behind a second toggle on the same
code, the baseline: what the components look like before the seed.

## How the owner answers

Keep or change, per map row. A change edits `docs/map.md`; the generator and the check
re-run; the exhibit is judged again. A value that looks wrong and has no map row to change
is a question for the engine, recorded, not patched here.

## Record

Screenshots in `docs/shots/`, named `<surface>-<platform>-<mode>.png`.

**2026-09-15, seed `#E93D82` (the brand named `poc` since decision 22).** Web from Vite on 8350 through a headless browser at 640
wide: `screen-web-light`, `screen-web-dark`, `roster-web-light`, `roster-web-dark`, and
the baseline `screen-web-stock-light`, `screen-web-stock-dark`. Native from Expo Go on an
iPhone 17 Pro simulator: `screen-native-light`, `screen-native-dark`,
`roster-native-light`, `roster-native-dark`, `dialog-native-light`. Every color on screen
was read back from the DOM on web as the engine's value for the recorded name; native
shows the same values from the same file. Unjudged: the owner has not yet answered per row.

**2026-09-22, brand `eggplant` (`#431C5B`, exact second family `#4BCD3E`), okchroma 0.6.1,
after decision 31.** Web from Vite on 8350 through headless Chrome at 640 wide, the first
1000 pixels of the page: `screen-web-light`, `screen-web-dark`, `roster-web-light`,
`roster-web-dark`, and the baseline `screen-web-stock-light`, `screen-web-stock-dark`.
Native from Expo Go on an iPhone 17 Pro simulator: `screen-native-light`,
`screen-native-dark`, `roster-native-light` and `roster-native-dark` (framed at the brand
family, whose rows fill a phone screen), `dialog-native-light`, `dialog-native-dark`. Read
back: on web, every button chip, toggle and tag on the roster by computed style in both
modes; on native, by pixel against the generated theme, on the screen, the brand family's
roster rows and the dialog in both modes. Every value is the engine's for the recorded
name, with one exception recorded in `docs/plan.md` Traps: on iOS a selected Button takes
the root theme's selected ground. These files replace the 2026-09-15 set under the same
names; that set stays in the history. Unjudged: the owner has not yet answered per row.

**2026-09-22, later, brand `eggplant`, okchroma 0.6.1, decision 32, the date range picker.**
Web from headless Chrome at 640 wide: `screen-web-light`, `screen-web-dark` and the stock
baseline, now 1300 tall so the Statement period block and its presets are in frame;
`roster-web-light`, `roster-web-dark`, with the date range band under each color family;
`picker-web-light`, `picker-web-dark`, the calendar dialog open at 900 wide with a range
across two months. Native from Expo Go on an iPhone 17 Pro simulator: `period-native-light`,
`period-native-dark`, the fields and presets in the card; `picker-native-light`,
`picker-native-dark`, the dialog holding the system picker with a picked range;
`roster-native-light`, `roster-native-dark` at the brand family, with the band. Read back:
on web, the contract's 37 checks in both modes under trusted key events
(`docs/checklist-web-a11y.md`), and the band's six states in every family by computed
style; on native, the picker's tint by pixel in both modes and both of its selected
drawings. Unjudged: the owner has not yet answered per row.

**2026-09-22, late, brand `eggplant`, okchroma 0.6.1, decision 34, the calendar as a popover.**
Web from headless Chrome at 900 by 1600: `picker-web-light`, `picker-web-dark`, the calendar
open as a popover below its button, sized to its two months, a range across two months, the
page in view behind it and no scrim. Read back: the contract's lines in both modes under
trusted key and mouse events, 42 checks each (`docs/checklist-web-a11y.md`): one element
with the dialog role, labelled, not modal; anchored to the button, above or below, inside
the window; the panel 618 wide at 900; the ground over the page clear; six Tabs stay
inside; a press on the start field closes it and leaves focus on the field; Escape closes
and returns focus to the button; the panel the high plane. At 400 by 800, one month, the
panel shifts over its field and stays inside the window, read back by rectangle; the
bottom sheet remains the small-screen form to build. Native unchanged in its path, the
dialog around the system picker; the screen re-shot after the change renders the fields
with their values. These files replace the 2026-09-22 `picker-web-*` pair under the same
names; that pair stays in the history. Unjudged: the owner has not yet answered per row.

**2026-09-22, later still, brand `eggplant`, okchroma 0.6.1, decision 35, the attached
calendar buttons.** Web from headless Chrome at 900 by 1600: `picker-web-light`,
`picker-web-dark`, each field ending in its calendar button, the popover open from the
start's button below the field with a range across two months. Read back: the contract's
lines in both modes, 46 checks each (`docs/checklist-web-a11y.md`), the button attached by
rectangle and computed corner, named for its field and confirming the date once set; at
400 by 800, one month, inside the window, by rectangle. Native from Expo Go on an iPhone 17
Pro simulator, the screen re-shot: the two fields stacked, each with its button attached
and the glyph drawn in the text color; the dialog path unchanged. These files replace the
earlier 2026-09-22 `picker-web-*` pair under the same names; that pair stays in the
history. Unjudged: the owner has not yet answered per row.

**2026-09-22, latest, brand `eggplant`, okchroma 0.6.1, decision 37, the native aid compared.**
Native from the iOS simulator (iPhone 17 Pro), dark, on a cold bundle: `grid-native-dark`, the
PoC's grid in the dialog with the range 9 to 18, and `picker-native-dark`, the system picker
under the heading of decision 36. Seen: the band and its ends as in the web popover, once the
label carried the frame's theme itself (on iOS the frame's theme did not reach the label's
`$color`) and the grid's resize listener was made web-only (the phone's `window` has no
listeners). The grid starts the week on Monday, from the model's locale on Hermes; the system
picker starts on Sunday. Cells are 40 points, as on web; nothing is announced on iOS. The
owner keeps both aids and puts the grid first; the verdict on the grid, the light shots and
the accessibility work continue on another machine.

**2026-09-22, brands `poc` (`#E93D82`) and `eggplant`, okchroma 0.6.1, decision 38, Astryx on
web.** From Vite on 5177 in the app's browser pane at 800 wide, dark, light behind the
toggle. The Button set: the okchroma panel carries the stamp with its on-text on primary,
the neutral subtle tier on secondary, the critical pencil-47 on destructive; the Astryx
generator's panel carries its own accent, its neutral tinted from the seed, and the same
fixed red on destructive under both seeds, since its generator leaves the status colors at
defaults. The Filterable Table page renders whole under the Astryx map with no console or
server errors, the stamp on New job, the compact layout at that width. The pairing: the
app's values for `eggplant` matched `dist/theme.eggplant.ts` name for name on a sample of
26, the green second family included; the Tamagui screen shows brand-alt on its Preview
button and Astryx has no slot for it. Shots owed: the Button panels and the table, both
modes.
