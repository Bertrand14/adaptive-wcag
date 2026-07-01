import type { Profile } from '../core/types';

export const dyslexiaProfile: Profile = {
  id: 'dyslexia',
  label: 'Dyslexia',
  description: 'Improves reading comfort, text tracking, and reduces visual confusion.',
  category: 'reading',
  htmlAttribute: 'data-awcag-dyslexia',
  rules: [
    { cssVar: '--awcag-font-family', value: "'OpenDyslexic', 'Comic Sans MS', sans-serif", tier: 'readability' },
    { cssVar: '--awcag-letter-spacing', value: '0.12em', tier: 'readability' },
    { cssVar: '--awcag-word-spacing', value: '0.16em', tier: 'readability' },
    { cssVar: '--awcag-line-height', value: '1.6', tier: 'readability' },
    { cssVar: '--awcag-paragraph-spacing', value: '1.4em', tier: 'readability' },
    { cssVar: '--awcag-font-scale', value: '1.1', tier: 'readability' },
    { cssVar: '--awcag-max-line-width', value: '70ch', tier: 'readability' },
    { cssVar: '--awcag-text-align', value: 'left', tier: 'readability' },
    { cssVar: '--awcag-visual-filter', value: 'contrast(1.05) saturate(1.05)', tier: 'readability' },
  ],
};
