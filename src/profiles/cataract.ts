import type { Profile } from '../core/types';
import { strongerBorders } from './adaptations';

export const cataractProfile: Profile = {
  id: 'cataract',
  label: 'Cataract',
  description: 'Boosts contrast and text size, and reinforces borders, for eyes that struggle with low-contrast content.',
  category: 'vision',
  htmlAttribute: 'data-awcag-cataract',
  rules: [
    // 'readability' tier, deliberately lower than low-vision's
    // 'accessibility' tier for the same variables: this profile's boost
    // is a subset of what low-vision already provides, so low-vision's
    // stronger values win if both are active.
    { cssVar: '--awcag-font-scale', value: '1.2', tier: 'readability' },
    { cssVar: '--awcag-visual-filter', value: 'contrast(1.2) saturate(1.05)', tier: 'readability' },
    ...strongerBorders,
  ],
};
