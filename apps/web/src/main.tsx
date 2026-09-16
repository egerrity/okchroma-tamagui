// The web app's entry. The brand is `?brand=<name>` in the address, else VITE_BRAND, else
// the first brand in brands.ts; the theme is the map's unless `?theme=stock` (or
// VITE_THEME_SOURCE=stock), the baseline. Only the chosen module is imported, since
// createTamagui registers globally.
import { createRoot } from 'react-dom/client'
import { App } from './App'

const params = new URL(location.href).searchParams
const source = params.get('theme') ?? import.meta.env.VITE_THEME_SOURCE
const asked = params.get('brand') ?? import.meta.env.VITE_BRAND
const { isBrand } = await import('@poc/theme/config')
const brand = isBrand(asked) ? asked : undefined
const config = source === 'stock' ? (await import('@poc/theme/stock')).config : (await import('@poc/theme/config')).createConfig(brand)

createRoot(document.getElementById('root')!).render(<App config={config} stock={source === 'stock'} brand={brand} />)
