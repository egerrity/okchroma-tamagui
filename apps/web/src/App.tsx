// The exhibit under the theme: light and dark on one toggle, the stock baseline behind a
// reload with `?theme=stock`, the roster on `#roster`, the brand behind a reload with
// `?brand=<name>`. The mode is top-level state: `?mode=dark` or `?mode=light` sets it (so a
// shot needs no click), the toggle writes it back to the address and to the browser's
// storage, and the brand and baseline reloads carry the address, so the mode survives them.
import { useState } from 'react'
import { TamaguiProvider, Theme, XStack, YStack, type TamaguiInternalConfig } from 'tamagui'
import { Button } from '@poc/theme/parts'
import { Screen } from '@poc/theme/screen'
import { Roster } from '@poc/theme/roster'
import { brandNames, defaultBrand } from '@poc/theme/dist/brands'

const prefersDark = () => matchMedia('(prefers-color-scheme: dark)').matches
type Mode = 'light' | 'dark'
const isMode = (m: unknown): m is Mode => m === 'dark' || m === 'light'
const storedMode = (): Mode | null => { try { const m = localStorage.getItem('mode'); return isMode(m) ? m : null } catch { return null } }
const rememberMode = (m: Mode) => {
  try { localStorage.setItem('mode', m) } catch {}
  const u = new URL(location.href); u.searchParams.set('mode', m); history.replaceState(null, '', u.toString())
}
const reloadWith = (edit: (p: URLSearchParams) => void) => { const u = new URL(location.href); edit(u.searchParams); location.href = u.toString() }

export function App({ config, stock, brand }: { config: TamaguiInternalConfig; stock: boolean; brand?: string }) {
  const asked = new URL(location.href).searchParams.get('mode')
  const [mode, setModeState] = useState<Mode>(isMode(asked) ? asked : storedMode() ?? (prefersDark() ? 'dark' : 'light'))
  const setMode = (m: Mode) => { setModeState(m); rememberMode(m) }
  const [page, setPage] = useState<'screen' | 'roster'>(location.hash === '#roster' ? 'roster' : 'screen')
  const current = brand ?? defaultBrand
  return (
    <TamaguiProvider config={config} defaultTheme={mode}>
      <Theme name={mode}>
        <YStack minHeight="100vh" backgroundColor="$background" alignItems="center">
          <XStack gap="$2" padding="$4" paddingBottom={0} width="100%" maxWidth={720} flexWrap="wrap">
            <Button size="$sm" theme="neutral_subtle" onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
              {mode === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <Button size="$sm" theme="neutral_hint" onPress={() => setPage(page === 'screen' ? 'roster' : 'screen')}>
              {page === 'screen' ? 'Roster' : 'Screen'}
            </Button>
            <Button size="$sm" theme="neutral_hint" onPress={() => reloadWith(p => (stock ? p.delete('theme') : p.set('theme', 'stock')))}>
              {stock ? 'okchroma theme' : 'Stock theme'}
            </Button>
          </XStack>
          {!stock && (
            <XStack gap="$2" padding="$4" paddingBottom={0} width="100%" maxWidth={720} flexWrap="wrap">
              {brandNames.map(b => (
                <Button key={b} size="$xs" theme={b === current ? 'neutral_solid' : 'neutral_hint'} onPress={() => reloadWith(p => p.set('brand', b))}>
                  {b}
                </Button>
              ))}
            </XStack>
          )}
          {page === 'screen' ? <Screen /> : <Roster />}
        </YStack>
      </Theme>
    </TamaguiProvider>
  )
}
