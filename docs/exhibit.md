# Exhibit

Written before the first build. The exhibit is the judging surface; nothing is kept until
it is judged here.

## What is judged

That one seed yields a coherent light and dark system on both platforms on Tamagui's own
components: the register's three tiers, the elevation planes, the form control's edges and
the dialog's scrim and panel reading as one system, with no value tuned in a component.

## Surface

- **The screen.** One account form: a heading, body text, a card on `surface-mid`, an Input
  with an invalid state beside a valid one, a row of Buttons (`brand_solid`,
  `brand-alt_solid`, `neutral_subtle`, `brand_hint` outlined), and a Dialog trigger. The
  same file renders on web and on native.
- **The roster page.** Every register family by tier, the Button in each state where the
  platform can show it, `Aa` text over each ground. For judging the map row by row.
- Web: Vite on port 8350. Native: Expo Go on an iPhone simulator.

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

**2026-09-15, seed `#E93D82`.** Web from Vite on 8350 through a headless browser at 640
wide: `screen-web-light`, `screen-web-dark`, `roster-web-light`, `roster-web-dark`, and
the baseline `screen-web-stock-light`, `screen-web-stock-dark`. Native from Expo Go on an
iPhone 17 Pro simulator: `screen-native-light`, `screen-native-dark`,
`roster-native-light`, `roster-native-dark`, `dialog-native-light`. Every color on screen
was read back from the DOM on web as the engine's value for the recorded name; native
shows the same values from the same file. Unjudged: the owner has not yet answered per row.
