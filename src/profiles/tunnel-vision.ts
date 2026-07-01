import type { Profile } from '../core/types';
import { comfortableSpacing } from './adaptations';

export const tunnelVisionProfile: Profile = {
  id: 'tunnel-vision',
  label: 'Tunnel Vision',
  description: 'Narrows content width and adds spacing so less needs to be scanned peripherally.',
  category: 'vision',
  htmlAttribute: 'data-awcag-tunnel-vision',
  rules: [
    // Reuses dyslexia's max-line-width variable: same mechanism (narrow
    // the reading column), different tier — this is a layout preference
    // here, not a reading-disorder requirement.
    { cssVar: '--awcag-max-line-width', value: '65ch', tier: 'layout' },
    ...comfortableSpacing,
  ],
};
