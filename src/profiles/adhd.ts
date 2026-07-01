import type { Profile } from '../core/types';
import { reducedMotion, simplifiedFocus, comfortableSpacing } from './adaptations';

export const adhdProfile: Profile = {
  id: 'adhd',
  label: 'ADHD',
  description: 'Removes distracting motion and highlights the focused element to support concentration.',
  category: 'cognitive',
  htmlAttribute: 'data-awcag-adhd',
  rules: [...reducedMotion, ...simplifiedFocus, ...comfortableSpacing],
};
