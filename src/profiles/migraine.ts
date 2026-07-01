import type { Profile } from '../core/types';
import { reducedMotion } from './adaptations';

export const migraineProfile: Profile = {
  id: 'migraine',
  label: 'Migraine',
  description: 'Reduces common migraine triggers: motion, harsh contrast, and bright light.',
  category: 'sensory',
  htmlAttribute: 'data-awcag-migraine',
  rules: [
    ...reducedMotion,
    // 'visual-effects' tier, deliberately lower than low-vision's or
    // dyslexia's --awcag-visual-filter rules: softening contrast for
    // comfort must lose to another active profile's need for stronger
    // contrast to keep content legible at all.
    { cssVar: '--awcag-visual-filter', value: 'contrast(0.92) saturate(0.85) brightness(0.97)', tier: 'visual-effects' },
  ],
};
