import figma from '@figma/code-connect/react'
import { Button } from '@poc/theme/parts'

// The Button set: Tier x State. The family is the role collection's mode on the instance;
// in code it is the first half of the theme prop.
figma.connect(Button, 'https://www.figma.com/design/FILE_KEY?node-id=BUTTON_SET', {
  props: {
    tier: figma.enum('Tier', { solid: 'solid', subtle: 'subtle', hint: 'hint', outline: 'outline' }),
    disabled: figma.enum('State', { disabled: true }),
    label: figma.textContent('Label'),
  },
  example: ({ tier, disabled, label }) => (
    <Button theme={`brand_${tier}`} disabled={disabled}>
      {label}
    </Button>
  ),
})
