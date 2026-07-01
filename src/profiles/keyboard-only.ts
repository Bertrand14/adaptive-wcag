import type { Profile } from '../core/types';

export const keyboardOnlyProfile: Profile = {
  id: 'keyboard-only',
  label: 'Keyboard Only',
  description: 'Makes the focused element impossible to miss for people who never use a mouse.',
  category: 'motor',
  htmlAttribute: 'data-awcag-keyboard-only',
  rules: [
    // 'safety' tier: without a visible focus indicator a keyboard-only
    // user can't tell where they are at all, which is a harder blocker
    // than any other profile's more modest focus styling — so this
    // wins over simplifiedFocus's 2px/solid default when both are active.
    { cssVar: '--awcag-focus-outline-width', value: '4px', tier: 'safety' },
    { cssVar: '--awcag-focus-outline-style', value: 'solid', tier: 'safety' },
  ],
};
