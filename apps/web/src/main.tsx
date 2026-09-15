// The web app's entry. The config is the map's unless `?theme=stock` (or
// VITE_THEME_SOURCE=stock), the baseline; only the chosen module is imported, since
// createTamagui registers globally.
import { createRoot } from 'react-dom/client'
import { App } from './App'

const source = new URL(location.href).searchParams.get('theme') ?? import.meta.env.VITE_THEME_SOURCE
const { config } = source === 'stock' ? await import('@poc/theme/stock') : await import('@poc/theme/config')

createRoot(document.getElementById('root')!).render(<App config={config} stock={source === 'stock'} />)
