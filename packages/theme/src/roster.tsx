// The roster page (docs/exhibit.md): every register family by tier, for judging the map
// row by row. Each Button's text sits over its own ground, so the row reads as the demo's
// token cards do.
import { H4, Paragraph, XStack, YStack } from 'tamagui'
import { Button } from './parts.tsx'
import { families } from '../dist/brands.ts'

const TIERS = ['solid', 'subtle', 'hint', 'outline'] as const

export function Roster() {
  return (
    <YStack gap="$4" padding="$4" width="100%">
      <H4>Roster</H4>
      {families.map(family => (
        // The inverse family is for controls on an inverted ground, so its row sits on one:
        // the strong family's stamp, the pole used as a fill.
        <YStack
          key={family}
          gap="$2"
          padding={family === 'neutral-inverse' ? '$3' : 0}
          borderRadius="$4"
          backgroundColor={family === 'neutral-inverse' ? '$neutral-strong-solid-bg-enabled' : 'transparent'}
        >
          <Paragraph size="$2" theme={family === 'neutral-inverse' ? 'neutral-inverse_hint' : undefined}>{family}</Paragraph>
          <XStack gap="$2" flexWrap="wrap">
            {TIERS.map(tier => (
              <Button key={tier} theme={`${family}_${tier}`}>
                {tier}
              </Button>
            ))}
            <Button theme={`${family}_solid`} disabled>
              disabled
            </Button>
          </XStack>
        </YStack>
      ))}
    </YStack>
  )
}
