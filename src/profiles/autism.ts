import type { Profile } from '../core/types';
import { reducedMotion, simplifiedFocus } from './adaptations';

export const autismProfile: Profile = {
  id: 'autism',
  label: 'Autism Spectrum',
  description: 'Reduces cognitive overload by stabilizing layouts and limiting visual effects.',
  category: 'cognitive',
  htmlAttribute: 'data-awcag-autism',
  rules: [...reducedMotion, ...simplifiedFocus],
};
