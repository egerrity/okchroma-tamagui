/**
 * The Astryx map (docs/map-astryx.md): Astryx color token -> okchroma name, as the build's
 * rows spell it (no `--`). apps/web-astryx reads dist/theme.<brand>.ts through this table.
 * Astryx names by duty and so does the okchroma role layer (okchroma's tokens/semantic.css),
 * so most rows are that layer's own assignments.
 *
 * Not mapped, so they stay at Astryx's defaults: `--color-on-dark` and
 * `--color-on-light` (mode-invariant absolutes, which the CSS emission has no row
 * for); cyan, orange, pink, purple and teal (consumer-picked decoration on Badge,
 * Token, Icon and Card, not roles); the syntax and data-viz tokens.
 */

import { INDICATOR_LEVELS } from './map/display.ts';

/** Astryx hue families that carry a role, and the okchroma family for each. */
const HUE_FAMILY = {
  red: 'critical', // FieldStatus and ChatComposer paint error text with text-red
  green: 'positive', // and success text with text-green
  yellow: 'warning', // and warning text with text-yellow
  blue: 'info', // the engine's own blue signal
  gray: 'neutral', // the Switch track
} as const;

function hueRows(): Record<string, string> {
  const rows: Record<string, string> = {};
  for (const [hue, family] of Object.entries(HUE_FAMILY)) {
    rows[`--color-background-${hue}`] = `${family}-chalk-11`;
    rows[`--color-border-${hue}`] = `${family}-chalk-15`;
    rows[`--color-icon-${hue}`] = `${family}-pen-70`;
    rows[`--color-text-${hue}`] = `${family}-pen-70`;
  }
  return rows;
}

export const ASTRYX_TO_OKCHROMA: Record<string, string> = {
  // The stamp is never text. Astryx paints this one token as text (the check and
  // radio indicators, Step, Icon, MetadataList, sortable table headers), as the
  // focus ring and as a ground outside buttons, so it takes the brand's text stop
  // with paper-0 on it. A filled Button maps individually (ASTRYX_BUTTON_MAP).
  '--color-accent': 'brand-pencil-47',
  '--color-on-accent': 'paper-0',
  '--color-accent-muted': 'brand-paper-3',
  '--color-text-accent': 'brand-pen-70',
  '--color-icon-accent': 'brand-highlighter-26',
  // The subtle tier's enabled ground: highlighter-26 at a rung, so it composes
  // over any paper the way Astryx's translucent neutral fill does.
  '--color-neutral': 'neutral-subtle-bg-enabled',

  // Astryx's body -> surface -> card -> popover ladder onto the elevation planes.
  '--color-background-body': 'surface-low',
  '--color-background-surface': 'surface-mid',
  '--color-background-card': 'surface-mid',
  '--color-background-popover': 'surface-high',
  '--color-background-muted': 'surface-dim',
  '--color-background-inverted': 'neutral-pen-70',
  '--color-background-error-inverted': 'critical-pencil-47',
  '--color-overlay': 'scrim',
  // Pole-at-alpha state layers over any ground. Pressed takes the rung that reads
  // as a step past hover rather than the nearest percentage.
  '--color-overlay-hover': 'alpha-away-from-bg-08',
  '--color-overlay-pressed': 'alpha-away-from-bg-16',

  '--color-text-primary': 'neutral-pen-70',
  '--color-text-secondary': 'neutral-pencil-47',
  // A color, not an opacity: Astryx consumes disabled text as a color in 14
  // components. The 3:1 stop is the floor disabled text is held to.
  '--color-text-disabled': 'neutral-highlighter-26',
  '--color-icon-primary': 'neutral-pen-70',
  '--color-icon-secondary': 'neutral-pencil-47',
  '--color-icon-disabled': 'neutral-highlighter-26',

  // Astryx asks one token to be both the status text and the status fill;
  // pencil-47 is the text stop that also serves as the emphasis fill, and paper-0
  // is its on-text. The destructive Button's fill maps individually
  // (ASTRYX_BUTTON_MAP). The muted grounds sit on paper-3 so that
  // neutral-pencil-47, which Astryx writes on them, stays on a paper it is
  // cleared against.
  '--color-success': 'positive-pencil-47',
  '--color-success-muted': 'positive-paper-3',
  '--color-on-success': 'paper-0',
  '--color-error': 'critical-pencil-47',
  '--color-error-muted': 'critical-paper-3',
  '--color-on-error': 'paper-0',
  '--color-warning': 'warning-pencil-47',
  '--color-warning-muted': 'warning-paper-3',
  '--color-on-warning': 'paper-0',

  // The emphasized border is the one that has to be seen (form controls), so it
  // rides the stop that carries the 3:1 non-text requirement.
  '--color-border': 'neutral-chalk-11',
  '--color-border-emphasized': 'neutral-highlighter-26',
  '--color-skeleton': 'neutral-chalk-15',
  '--color-track': 'neutral-chalk-15',
  '--color-shadow': 'shadow-08',
  // The mode-flipping pole Astryx mixes into every hover color.
  '--color-tint-hover': 'pen-100',
  // Astryx rings every control with this token, which its base sheet defines at the
  // document root as the accent; a custom property resolves where it is defined, so the
  // ring would freeze to the page's accent unless the theme sets the token itself. The
  // brand's 3:1 stop keeps Astryx's habit of a brand ring on a stop legal for a non-text
  // indicator, so the ring moves with the brand.
  '--focus-outline-color': 'brand-highlighter-26',

  ...hueRows(),
};

/**
 * Buttons map individually (docs/map-astryx.md): a filled button is its family's
 * solid tier, the stamp with its own on-text, its own hover and pressed fills and
 * its edge, the stamp edge the gate raises when the fill sits close to the page and
 * transparent otherwise, while the token the rest of the page paints stays on the
 * text stop above. The Astryx theme takes these as component overrides scoped to
 * the Button.
 */
export const ASTRYX_BUTTON_MAP: Record<
  'primary' | 'destructive',
  {fill: string; hover: string; pressed: string; on: string; edge: string}
> = {
  primary: {
    fill: 'brand-solid-bg-enabled',
    hover: 'brand-solid-bg-hover',
    pressed: 'brand-solid-bg-pressed',
    on: 'brand-solid-fg',
    edge: 'brand-solid-border',
  },
  destructive: {
    fill: 'critical-solid-bg-enabled',
    hover: 'critical-solid-bg-hover',
    pressed: 'critical-solid-bg-pressed',
    on: 'critical-solid-fg',
    edge: 'critical-solid-border',
  },
};

/**
 * The table's row states map individually too. A row is a transparent ground, so its
 * hover and its open state take the brand's hint tier rungs, highlighter-26 at an
 * opacity, in place of Astryx's pole-at-alpha overlays; the theme sets them as the
 * Table's own overlay variables inside its scope, so the rest of Astryx keeps its overlays.
 */
export const ASTRYX_TABLE_MAP = {
  rowHover: 'brand-hint-bg-hover',
  rowActive: 'brand-hint-bg-selected',
} as const;

const brandRow = (row: string | undefined, level: string, part: string) => {
  if (row === undefined) {
    throw new Error(`the indicator level ${level} has no ${part} row`);
  }
  return row.replace('<family>', 'brand');
};

/**
 * The avatar's three levels are the tag chip's (INDICATOR_LEVELS, docs/map.md) on the
 * brand family: the stamp with its on-text and edge, chalk with the pen, paper with the
 * pencil and a chalk edge. An avatar carries initials, so the stamp is legal on it. The
 * Avatar selects a level with `data-level`, the attribute the theme's selectors read.
 */
export const ASTRYX_AVATAR_LEVELS: Record<
  keyof typeof INDICATOR_LEVELS,
  {fill: string; on: string; edge: string}
> = {
  stamp: {
    fill: brandRow(INDICATOR_LEVELS.stamp.background, 'stamp', 'fill'),
    on: brandRow(INDICATOR_LEVELS.stamp.color, 'stamp', 'on'),
    edge: brandRow(INDICATOR_LEVELS.stamp.borderColor, 'stamp', 'edge'),
  },
  strong: {
    fill: brandRow(INDICATOR_LEVELS.strong.background, 'strong', 'fill'),
    on: brandRow(INDICATOR_LEVELS.strong.color, 'strong', 'on'),
    edge: brandRow(INDICATOR_LEVELS.strong.borderColor, 'strong', 'edge'),
  },
  default: {
    fill: brandRow(INDICATOR_LEVELS.default.background, 'default', 'fill'),
    on: brandRow(INDICATOR_LEVELS.default.color, 'default', 'on'),
    edge: brandRow(INDICATOR_LEVELS.default.borderColor, 'default', 'edge'),
  },
};
