import type { Profile } from '../core/types';
import { reducedMotion, comfortableSpacing, largerTargets } from './adaptations';

export const seniorProfile: Profile = {
  id: 'senior',
  label: 'Senior',
  description: 'A gentle combination of larger text, better contrast, bigger controls, and less motion.',
  category: 'aging',
  htmlAttribute: 'data-awcag-senior',
  rules: [
    { cssVar: '--awcag-font-scale', value: '1.2', tier: 'readability' },
    { cssVar: '--awcag-visual-filter', value: 'contrast(1.15) saturate(1.05)', tier: 'readability' },
    ...largerTargets,
    ...reducedMotion,
    ...comfortableSpacing,
  ],
};
