import type { Profile } from '../core/types';
import { reducedMotion, simplifiedFocus, comfortableSpacing } from './adaptations';

export const cognitiveDifficultiesProfile: Profile = {
  id: 'cognitive-difficulties',
  label: 'Cognitive Difficulties',
  description: 'Reduces distractions and visual noise to ease concentration and reading.',
  category: 'cognitive',
  // The engine can't know which elements on an arbitrary site are
  // "secondary" or safely hideable, so it never attempts to restructure
  // the page. This attribute is still set on <html> while the profile
  // is active, so a site owner who wants deeper simplification (e.g.
  // hiding a promo banner) can opt in with their own rule:
  // `html[data-awcag-cognitive-difficulties] .promo { display: none }`.
  htmlAttribute: 'data-awcag-cognitive-difficulties',
  rules: [...reducedMotion, ...simplifiedFocus, ...comfortableSpacing],
};
