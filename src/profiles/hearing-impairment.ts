import type { Profile } from '../core/types';

export const hearingImpairmentProfile: Profile = {
  id: 'hearing-impairment',
  label: 'Hearing Impairment',
  description: 'Makes native video captions and visual notifications (ARIA live regions/alerts) easier to notice.',
  category: 'hearing',
  // Purely structural: styles native <video> captions (::cue) and
  // standard ARIA live-region/alert/status roles. Highlighting a site's
  // own custom transcript markup would need to know its class names,
  // which the engine can't assume, so that part of the original vision
  // is intentionally left out rather than guessed at.
  htmlAttribute: 'data-awcag-hearing-impairment',
  rules: [],
};
