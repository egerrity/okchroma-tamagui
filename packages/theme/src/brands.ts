// Every client the proof of concept can be built for: one object per brand holding the
// elections okchroma's extended plugin offers in its panel. The generator emits every brand;
// a build picks one (VITE_BRAND on web, EXPO_PUBLIC_BRAND on native, `?brand=` in a web
// address), and the same screen renders as that client. The first entry is the default.
export type Election = {
  primaryHex: string
  /** an exact second family; when absent the engine derives a quiet companion from the brand hue */
  secondaryHex?: string
  secondaryStyle?: 'exact' | 'default' | 'outline'
  /** how much of the brand hue the neutral carries */
  neutralLevel?: 'default' | 'medium' | 'pure'
  /** the neutral stamp escape: the brand's call to action moves onto the neutral's strong pen when the brand sits on a signal */
  ctaEscape?: boolean
  /** a link seed; the engine resolves the link trio from it */
  linkHex?: string
  /** the gated stamp edge; on by default */
  ctaBorder?: boolean
}

export const PROFILE = 'wcag' as const

export const BRANDS: Record<string, Election> = {
  // a deep violet with an exact second family
  eggplant: { primaryHex: '#431C5B', secondaryHex: '#4BCD3E', secondaryStyle: 'exact' },
  // the arbitrary seed the exhibit was first verified on
  poc: { primaryHex: '#E93D82' },
  'bright-blue': { primaryHex: '#00BFFF' },
  // a light seed: the stamp edge's gate fires
  mint: { primaryHex: '#B3FFEE' },
  // sits on the critical signal
  red: { primaryHex: '#C72011' },
  // the same red with the neutral escape and a blue link seed
  'red-escape': { primaryHex: '#C72011', ctaEscape: true, linkHex: '#0000EE' },
  // sits on the warning signal
  amber: { primaryHex: '#478F1F' },
  // sits on the positive signal
  green: { primaryHex: '#219707' },
  // sits on the info signal
  violet: { primaryHex: '#6600FF' },
}

export type BrandName = keyof typeof BRANDS
export const BRAND_NAMES = Object.keys(BRANDS) as BrandName[]
export const DEFAULT_BRAND: BrandName = BRAND_NAMES[0]
