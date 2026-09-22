// The roster page (docs/exhibit.md): per family, the register's interaction levels as
// grounds, the button hierarchy as buttons, the same hierarchy disabled, the button chip
// off and on, and the tag chip's levels. Each ground carries its own text, so a row reads
// as the demo's token cards do. The toggle and the button chip flip on press.
import { useState } from 'react'
import { H4, Paragraph, SizableText, XStack, YStack } from 'tamagui'
import { Button, Chip, IndicatorChip } from './parts.tsx'
import type { ColorFamily } from './parts/chip.tsx'
import { families } from '../dist/brands.ts'
import { LEVEL_NAMES } from './map/display.ts'

type Family = (typeof families)[number]
// the chips exist for the color families; the pole families have no chalk
const isColorFamily = (f: Family): f is ColorFamily => !f.startsWith('neutral-')

const TIERS = ['solid', 'subtle', 'hint'] as const
const STATES = ['enabled', 'hover', 'pressed', 'selected'] as const
// the text a tier's ground carries, per the register
const TEXT_ON = { solid: 'solid-fg', subtle: 'fg', hint: 'fg-on-hint' } as const
// the button hierarchy: a kind and the tier it takes; the toggle is the outline shape, shown on when pressed
const KINDS = [
  { kind: 'primary', tier: 'solid' },
  { kind: 'outline', tier: 'outline' },
  { kind: 'ghost', tier: 'hint' },
  { kind: 'toggle', tier: 'outline' },
] as const

const Label = ({ children }: { children: string }) => <Paragraph size="$xs">{children}</Paragraph>

export function Roster() {
  const [on, setOn] = useState<Record<string, boolean>>({})
  const flip = (key: string) => setOn(s => ({ ...s, [key]: !s[key] }))
  return (
    <YStack gap="$6" padding="$4" width="100%">
      <H4>Roster</H4>
      {families.map(family => (
        // The inverse family is for controls on an inverted ground, so its rows sit on one:
        // the strong family's stamp, the pole used as a fill.
        <YStack
          key={family}
          gap="$3"
          padding={family === 'neutral-inverse' ? '$3' : 0}
          borderRadius="$md"
          backgroundColor={family === 'neutral-inverse' ? '$neutral-strong-solid-bg-enabled' : 'transparent'}
          theme={family === 'neutral-inverse' ? 'neutral-inverse_hint' : undefined}
        >
          <Paragraph size="$sm" fontWeight="600">{family}</Paragraph>

          <Label>interaction levels</Label>
          <XStack gap="$4" flexWrap="wrap">
            {TIERS.map(tier => (
              <YStack key={tier} gap="$1">
                <Label>{tier}</Label>
                <XStack>
                  {STATES.map(state => (
                    <XStack
                      key={state}
                      width={56}
                      height="$xs"
                      alignItems="center"
                      justifyContent="center"
                      // the ground's key is composed at render; the check reads the register's rows by name
                      backgroundColor={`$${family}-${tier === 'solid' && state === 'selected' ? 'solid-bg-enabled' : `${tier}-bg-${state}`}` as any}
                    >
                      <SizableText size="$xs" fontFamily="$button" color={`$${family}-${TEXT_ON[tier]}`}>Aa</SizableText>
                    </XStack>
                  ))}
                </XStack>
              </YStack>
            ))}
          </XStack>

          <Label>button hierarchy</Label>
          <XStack gap="$2" flexWrap="wrap">
            {KINDS.map(({ kind, tier }) =>
              kind === 'toggle' ? (
                <Button key={kind} theme={`${family}_${tier}`} selected={!!on[family]} aria-pressed={!!on[family]} onPress={() => flip(family)}>
                  {on[family] ? '\u2713 toggle' : 'toggle'}
                </Button>
              ) : (
                <Button key={kind} theme={`${family}_${tier}`}>
                  {kind}
                </Button>
              ),
            )}
          </XStack>

          <Label>disabled</Label>
          <XStack gap="$2" flexWrap="wrap">
            {KINDS.map(({ kind, tier }) => (
              <Button key={kind} theme={`${family}_${tier}`} selected={kind === 'toggle'} aria-pressed={kind === 'toggle' ? true : undefined} disabled>
                {kind === 'toggle' ? '\u2713 toggle' : kind}
              </Button>
            ))}
          </XStack>

          {isColorFamily(family) && (
            <>
              <Label>button chip</Label>
              <XStack gap="$2" flexWrap="wrap" alignItems="center">
                <Chip family={family} selected={!!on[`${family}-chip`]} aria-pressed={!!on[`${family}-chip`]} onPress={() => flip(`${family}-chip`)}>
                  {on[`${family}-chip`] ? '\u2713 on' : 'off'}
                </Chip>
                <Chip family={family} selected>{'\u2713 on'}</Chip>
                <Chip family={family} disabled>disabled</Chip>
              </XStack>
              <Label>tag chip</Label>
              <XStack gap="$2" flexWrap="wrap" alignItems="center">
                {LEVEL_NAMES.map(level => (
                  <IndicatorChip key={level} theme={`${family}_indicator-${level}`}><IndicatorChip.Text>{level}</IndicatorChip.Text></IndicatorChip>
                ))}
              </XStack>
            </>
          )}
        </YStack>
      ))}
    </YStack>
  )
}
