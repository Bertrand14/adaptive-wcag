import type { Profile } from '../core/types';
import { reducedMotion, simplifiedFocus } from './adaptations';

export const memoryDifficultiesProfile: Profile = {
  id: 'memory-difficulties',
  label: 'Memory Difficulties',
  description: 'Keeps the interface still and predictable: no motion, consistent focus landmarks.',
  category: 'cognitive',
  htmlAttribute: 'data-awcag-memory-difficulties',
  rules: [...reducedMotion, ...simplifiedFocus],
};
