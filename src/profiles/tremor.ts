import type { Profile } from '../core/types';

export const tremorProfile: Profile = {
  id: 'tremor',
  label: 'Tremor',
  description: 'Uses extra-large, well-spaced controls for hands that can\'t reliably hit a small target.',
  category: 'motor',
  htmlAttribute: 'data-awcag-tremor',
  rules: [
    // 'safety' tier: a control too small to reliably hit isn't just
    // inconvenient here, it's the actual blocker this profile exists to
    // remove — so its target size always wins over motor-disability's
    // more moderate 44px baseline when both are active.
    { cssVar: '--awcag-control-min-size', value: '56px', tier: 'safety' },
    { cssVar: '--awcag-border-width', value: '2px', tier: 'accessibility' },
  ],
};
