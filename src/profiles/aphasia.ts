import type { Profile } from '../core/types';
import { reducedMotion, simplifiedFocus } from './adaptations';

export const aphasiaProfile: Profile = {
  id: 'aphasia',
  label: 'Aphasia',
  description: 'Removes visual distractions and motion to ease comprehension.',
  category: 'reading',
  // Rewriting content into simpler language or adding pictograms needs
  // the site's own content and can't be done generically — this
  // attribute is exposed so a site owner can opt in to that themselves,
  // the same pattern used by the Cognitive Difficulties profile.
  htmlAttribute: 'data-awcag-aphasia',
  rules: [...reducedMotion, ...simplifiedFocus],
};
