import type { Profile } from '../core/types';
import { largerTargets } from './adaptations';

export const voiceCommandProfile: Profile = {
  id: 'voice-command',
  label: 'Voice Command',
  description: 'Enlarges and spaces out interactive elements so voice-driven targeting is reliable.',
  category: 'motor',
  htmlAttribute: 'data-awcag-voice-command',
  rules: [...largerTargets, { cssVar: '--awcag-control-spacing', value: '0.4em', tier: 'accessibility' }],
};
