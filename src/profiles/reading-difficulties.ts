import type { Profile } from '../core/types';
import { comfortableSpacing } from './adaptations';

export const readingDifficultiesProfile: Profile = {
  id: 'reading-difficulties',
  label: 'Reading Difficulties',
  description: 'Improves text spacing, alignment, and size for readers who struggle without being dyslexic.',
  category: 'reading',
  htmlAttribute: 'data-awcag-reading-difficulties',
  rules: [
    ...comfortableSpacing,
    { cssVar: '--awcag-font-scale', value: '1.1', tier: 'readability' },
    { cssVar: '--awcag-text-align', value: 'left', tier: 'readability' },
  ],
};
