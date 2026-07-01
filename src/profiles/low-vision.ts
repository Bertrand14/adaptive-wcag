import type { Profile } from '../core/types';
import { largerTargets } from './adaptations';

export const lowVisionProfile: Profile = {
  id: 'low-vision',
  label: 'Low Vision',
  description: 'Improves readability through larger text, stronger contrast, and bigger targets.',
  category: 'vision',
  htmlAttribute: 'data-awcag-low-vision',
  rules: [
    // Higher tier than dyslexia's/migraine's/visual-fatigue's/cataract's
    // rules for the same variables: when several profiles disagree here,
    // legibility for low vision wins because unreadable text is a harder
    // blocker than reading comfort or visual comfort.
    { cssVar: '--awcag-font-scale', value: '1.35', tier: 'accessibility' },
    { cssVar: '--awcag-visual-filter', value: 'contrast(1.3) saturate(1.1)', tier: 'accessibility' },
    { cssVar: '--awcag-icon-scale', value: '1.4', tier: 'accessibility' },
    ...largerTargets,
  ],
};
