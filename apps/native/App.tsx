// The native app: the exhibit under the theme, light and dark on a toggle. The brand is
// EXPO_PUBLIC_BRAND, else the first in brands.ts; the config is the map's unless
// EXPO_PUBLIC_THEME_SOURCE=stock, the baseline. Only the chosen module runs, since
// createTamagui registers globally.
import { useState } from 'react'
import { ScrollView, useColorScheme } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useFonts, NotoSans_400Regular, NotoSans_500Medium, NotoSans_600SemiBold } from '@expo-google-fonts/noto-sans'
import { TamaguiProvider, Theme, XStack, YStack } from 'tamagui'
import { Button } from '@poc/theme/parts'
import { Screen, type CalendarAid } from '@poc/theme/screen'
import { Roster } from '@poc/theme/roster'

const config =
  process.env.EXPO_PUBLIC_THEME_SOURCE === 'stock'
    ? require('@poc/theme/stock').config
    : (() => { const m = require('@poc/theme/config'); const b = process.env.EXPO_PUBLIC_BRAND; return m.createConfig(m.isBrand(b) ? b : undefined) })()

export function App() {
  // the faces the fonts' `face` map names; until they load the system font stands in
  const [fontsLoaded] = useFonts({ NotoSans_400Regular, NotoSans_500Medium, NotoSans_600SemiBold })
  const system = useColorScheme()
  const [mode, setMode] = useState<'light' | 'dark'>(system === 'dark' ? 'dark' : 'light')
  const [page, setPage] = useState<'screen' | 'roster'>('screen')
  // the calendar aid (docs/exhibit.md): the PoC's own grid first, the system picker behind the toggle (decision 37)
  const [aid, setAid] = useState<CalendarAid>('own')
  if (!fontsLoaded) return null
  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme={mode}>
        <Theme name={mode}>
          <YStack flex={1} backgroundColor="$background">
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
              <XStack gap="$2" padding="$4" paddingBottom={0}>
                <Button size="$sm" theme="neutral_subtle" onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
                  {mode === 'dark' ? 'Light' : 'Dark'}
                </Button>
                <Button size="$sm" theme="neutral_hint" onPress={() => setPage(page === 'screen' ? 'roster' : 'screen')}>
                  {page === 'screen' ? 'Roster' : 'Screen'}
                </Button>
                <Button size="$sm" theme="neutral_hint" onPress={() => setAid(aid === 'system' ? 'own' : 'system')}>
                  {aid === 'system' ? 'Own calendar' : 'System calendar'}
                </Button>
              </XStack>
              <ScrollView>{page === 'screen' ? <Screen aid={aid} /> : <Roster />}</ScrollView>
            </SafeAreaView>
          </YStack>
        </Theme>
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}
