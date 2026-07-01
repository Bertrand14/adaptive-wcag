import type { AdaptationRule } from '../core/types';

/**
 * Reusable rule bundles shared by several profiles. Extracted here
 * instead of duplicated per profile once a rule's exact values (not
 * just its intent) are shared by more than one profile — see
 * migraine/visual-fatigue/cognitive-difficulties/autism, which all
 * want identical motion suppression.
 */

// 'safety' tier: uncontrolled motion is a vestibular/migraine/seizure
// trigger, not merely an aesthetic preference, so it outranks any
// profile that would re-enable animations for visual polish.
export const reducedMotion: AdaptationRule[] = [
  { cssVar: '--awcag-animation-duration', value: '0.001ms', tier: 'safety' },
  { cssVar: '--awcag-transition-duration', value: '0.001ms', tier: 'safety' },
];

export const simplifiedFocus: AdaptationRule[] = [
  { cssVar: '--awcag-focus-outline-width', value: '2px', tier: 'accessibility' },
  { cssVar: '--awcag-focus-outline-style', value: 'solid', tier: 'accessibility' },
];

// Milder than dyslexia's own line-height/paragraph-spacing rules:
// dyslexia needs a stronger adjustment for text tracking, this is the
// gentler "give reading some room to breathe" baseline shared by
// profiles that are about fatigue/overload rather than a reading
// disorder.
export const comfortableSpacing: AdaptationRule[] = [
  { cssVar: '--awcag-line-height', value: '1.5', tier: 'readability' },
  { cssVar: '--awcag-paragraph-spacing', value: '1.2em', tier: 'readability' },
];

// Shared by any profile that wants controls/elements to not rely on
// subtle color/weight differences alone (color blindness, cataract,
// voice command) as well as by largerTargets below.
export const strongerBorders: AdaptationRule[] = [{ cssVar: '--awcag-border-width', value: '2px', tier: 'accessibility' }];

// WCAG 2.5.5 target size recommendation. Shared by every profile whose
// concern is "hard to hit small controls" rather than "hard to see" —
// tremor and keyboard-only define their own stronger overrides instead
// of this baseline where 44px isn't enough.
export const largerTargets: AdaptationRule[] = [
  { cssVar: '--awcag-control-min-size', value: '44px', tier: 'accessibility' },
  ...strongerBorders,
];
