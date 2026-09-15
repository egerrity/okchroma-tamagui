// The native app: the exhibit under the theme, light and dark on a toggle. The config is
// the map's unless EXPO_PUBLIC_THEME_SOURCE=stock, the baseline; only the chosen module
// runs, since createTamagui registers globally.
import { useState } from 'react'
import { ScrollView, useColorScheme } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { TamaguiProvider, Theme, XStack, YStack } from 'tamagui'
import { Button } from '@poc/theme/parts'
import { Screen } from '@poc/theme/screen'
import { Roster } from '@poc/theme/roster'

const { config } =
  process.env.EXPO_PUBLIC_THEME_SOURCE === 'stock' ? require('@poc/theme/stock') : require('@poc/theme/config')

export function App() {
  const system = useColorScheme()
  const [mode, setMode] = useState<'light' | 'dark'>(system === 'dark' ? 'dark' : 'light')
  const [page, setPage] = useState<'screen' | 'roster'>('screen')
  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme={mode}>
        <Theme name={mode}>
          <YStack flex={1} backgroundColor="$background">
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
              <XStack gap="$2" padding="$4" paddingBottom={0}>
                <Button size="$3" theme="neutral_subtle" onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
                  {mode === 'dark' ? 'Light' : 'Dark'}
                </Button>
                <Button size="$3" theme="neutral_hint" onPress={() => setPage(page === 'screen' ? 'roster' : 'screen')}>
                  {page === 'screen' ? 'Roster' : 'Screen'}
                </Button>
              </XStack>
              <ScrollView>{page === 'screen' ? <Screen /> : <Roster />}</ScrollView>
            </SafeAreaView>
          </YStack>
        </Theme>
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}
