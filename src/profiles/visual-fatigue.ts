import type { Profile } from '../core/types';
import { reducedMotion, comfortableSpacing } from './adaptations';

export const visualFatigueProfile: Profile = {
  id: 'visual-fatigue',
  label: 'Visual Fatigue',
  description: 'Eases eye strain on long reading sessions with softer contrast, larger text, and more breathing room.',
  category: 'sensory',
  htmlAttribute: 'data-awcag-visual-fatigue',
  rules: [
    ...reducedMotion,
    ...comfortableSpacing,
    { cssVar: '--awcag-font-scale', value: '1.15', tier: 'readability' },
    // Same lower tier as migraine's rule for the same variable: comfort
    // over legibility never wins when another active profile needs
    // stronger contrast to read at all.
    { cssVar: '--awcag-visual-filter', value: 'contrast(0.95) saturate(0.9) brightness(0.98)', tier: 'visual-effects' },
  ],
};
