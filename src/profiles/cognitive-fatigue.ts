import type { Profile } from '../core/types';
import { reducedMotion, comfortableSpacing } from './adaptations';

export const cognitiveFatigueProfile: Profile = {
  id: 'cognitive-fatigue',
  label: 'Cognitive Fatigue',
  description: 'Removes motion and adds spacing to reduce mental load during long sessions.',
  category: 'cognitive',
  htmlAttribute: 'data-awcag-cognitive-fatigue',
  rules: [...reducedMotion, ...comfortableSpacing],
};
