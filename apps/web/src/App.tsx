// The exhibit under the theme: light and dark on one toggle, the stock baseline behind a
// reload with `?theme=stock`, the roster on `#roster`. `?mode=dark` or `?mode=light` sets
// the opening mode so a shot can be taken without a click.
import { useState } from 'react'
import { TamaguiProvider, Theme, XStack, YStack, type TamaguiInternalConfig } from 'tamagui'
import { Button } from '@poc/theme/parts'
import { Screen } from '@poc/theme/screen'
import { Roster } from '@poc/theme/roster'

const prefersDark = () => matchMedia('(prefers-color-scheme: dark)').matches

export function App({ config, stock }: { config: TamaguiInternalConfig; stock: boolean }) {
  const asked = new URL(location.href).searchParams.get('mode')
  const [mode, setMode] = useState<'light' | 'dark'>(asked === 'dark' || asked === 'light' ? asked : prefersDark() ? 'dark' : 'light')
  const [page, setPage] = useState<'screen' | 'roster'>(location.hash === '#roster' ? 'roster' : 'screen')
  return (
    <TamaguiProvider config={config} defaultTheme={mode}>
      <Theme name={mode}>
        <YStack minHeight="100vh" backgroundColor="$background" alignItems="center">
          <XStack gap="$2" padding="$4" width="100%" maxWidth={560}>
            <Button size="$3" theme="neutral_subtle" onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
              {mode === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <Button size="$3" theme="neutral_hint" onPress={() => setPage(page === 'screen' ? 'roster' : 'screen')}>
              {page === 'screen' ? 'Roster' : 'Screen'}
            </Button>
            <Button size="$3" theme="neutral_hint" onPress={() => { location.search = stock ? '' : '?theme=stock' }}>
              {stock ? 'okchroma theme' : 'Stock theme'}
            </Button>
          </XStack>
          {page === 'screen' ? <Screen /> : <Roster />}
        </YStack>
      </Theme>
    </TamaguiProvider>
  )
}
