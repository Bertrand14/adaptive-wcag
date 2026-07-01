import type { Profile } from '../core/types';
import { largerTargets, simplifiedFocus, comfortableSpacing } from './adaptations';

export const motorDisabilityProfile: Profile = {
  id: 'motor-disability',
  label: 'Motor Disability',
  description: 'Enlarges buttons, links, and form controls, and adds spacing between them.',
  category: 'motor',
  htmlAttribute: 'data-awcag-motor-disability',
  rules: [...largerTargets, ...simplifiedFocus, ...comfortableSpacing],
};
