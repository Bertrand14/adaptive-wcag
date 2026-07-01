import type { Profile } from '../core/types';
import { comfortableSpacing, largerTargets } from './adaptations';

export const macularDegenerationProfile: Profile = {
  id: 'macular-degeneration',
  label: 'Macular Degeneration',
  description: 'Enlarges text and controls and adds breathing room for central vision loss.',
  category: 'vision',
  htmlAttribute: 'data-awcag-macular-degeneration',
  rules: [
    // Same tier as low-vision's font-scale: both represent a genuine
    // acuity blocker, not a comfort preference, so either can win a
    // conflict depending on activation order.
    { cssVar: '--awcag-font-scale', value: '1.3', tier: 'accessibility' },
    ...comfortableSpacing,
    ...largerTargets,
  ],
};
