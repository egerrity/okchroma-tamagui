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
  // The stamp is the CTA fill. Astryx also paints this one token as text (the
  // check and radio indicators, Step, Icon, MetadataList, sortable table headers)
  // and as the focus ring; the stamp carries no text promise there, and Astryx
  // derives hover and pressed itself by mixing tint-hover in, so stamp-fill-hover
  // and stamp-fill-pressed have no slot to land in.
  '--color-accent': 'brand-stamp-fill',
  '--color-on-accent': 'brand-stamp-on',
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
  // is its on-text. The muted grounds sit on paper-3 so that neutral-pencil-47,
  // which Astryx writes on them, stays on a paper it is cleared against.
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

  ...hueRows(),
};
