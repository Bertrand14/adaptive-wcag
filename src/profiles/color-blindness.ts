import type { Profile } from '../core/types';
import { simplifiedFocus, strongerBorders } from './adaptations';

export const colorBlindnessProfile: Profile = {
  id: 'color-blindness',
  label: 'Color Blindness',
  description: 'Stops relying on color alone: underlines links and strengthens borders and focus outlines.',
  category: 'vision',
  // "Additional icons where possible" from the original vision needs
  // markup knowledge the engine doesn't have, so it's left out rather
  // than faked. What's here (underlines, borders, focus) works on any
  // site regardless of markup.
  htmlAttribute: 'data-awcag-color-blindness',
  rules: [...strongerBorders, ...simplifiedFocus],
};
