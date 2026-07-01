import type { Profile } from '../core/types';
import { reducedMotion } from './adaptations';

export const photophobiaProfile: Profile = {
  id: 'photophobia',
  label: 'Photophobia',
  description: 'Softens brightness, saturation, and motion for light-sensitive eyes.',
  category: 'vision',
  htmlAttribute: 'data-awcag-photophobia',
  rules: [
    ...reducedMotion,
    // Same lower tier as migraine's/visual-fatigue's rule for this
    // variable: comfort never wins over another active profile's need
    // for stronger contrast to read at all.
    { cssVar: '--awcag-visual-filter', value: 'brightness(0.9) saturate(0.8) contrast(0.95)', tier: 'visual-effects' },
  ],
};
