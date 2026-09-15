import figma from '@figma/code-connect/react'
import { Input } from '@poc/theme/parts'

// The Input set: State. Focus is the platform's; invalid is the critical family on the edge.
figma.connect(Input, 'https://www.figma.com/design/FILE_KEY?node-id=INPUT_SET', {
  props: {
    invalid: figma.enum('State', { invalid: true }),
  },
  example: ({ invalid }) => <Input placeholder="Placeholder" theme={invalid ? 'critical' : undefined} aria-invalid={invalid} />,
})
