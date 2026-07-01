import { dyslexiaProfile } from './dyslexia';
import { lowVisionProfile } from './low-vision';
import { colorBlindnessProfile } from './color-blindness';
import { photophobiaProfile } from './photophobia';
import { cataractProfile } from './cataract';
import { macularDegenerationProfile } from './macular-degeneration';
import { tunnelVisionProfile } from './tunnel-vision';
import { readingDifficultiesProfile } from './reading-difficulties';
import { aphasiaProfile } from './aphasia';
import { autismProfile } from './autism';
import { adhdProfile } from './adhd';
import { cognitiveDifficultiesProfile } from './cognitive-difficulties';
import { cognitiveFatigueProfile } from './cognitive-fatigue';
import { memoryDifficultiesProfile } from './memory-difficulties';
import { motorDisabilityProfile } from './motor-disability';
import { tremorProfile } from './tremor';
import { keyboardOnlyProfile } from './keyboard-only';
import { voiceCommandProfile } from './voice-command';
import { hearingImpairmentProfile } from './hearing-impairment';
import { migraineProfile } from './migraine';
import { photosensitiveEpilepsyProfile } from './photosensitive-epilepsy';
import { visualFatigueProfile } from './visual-fatigue';
import { seniorProfile } from './senior';
import type { Profile } from '../core/types';

// Grouped to match the product's own taxonomy (Vision / Reading /
// Cognitive / Motor / Hearing / Sensory / Aging). Order only affects
// which profile wins on an exact tier tie in the ConflictResolver.
export const defaultProfiles: Profile[] = [
  // Vision
  lowVisionProfile,
  colorBlindnessProfile,
  photophobiaProfile,
  cataractProfile,
  macularDegenerationProfile,
  tunnelVisionProfile,
  // Reading
  dyslexiaProfile,
  readingDifficultiesProfile,
  aphasiaProfile,
  // Cognitive
  autismProfile,
  adhdProfile,
  cognitiveDifficultiesProfile,
  cognitiveFatigueProfile,
  memoryDifficultiesProfile,
  // Motor
  motorDisabilityProfile,
  tremorProfile,
  keyboardOnlyProfile,
  voiceCommandProfile,
  // Hearing
  hearingImpairmentProfile,
  // Sensory
  migraineProfile,
  photosensitiveEpilepsyProfile,
  visualFatigueProfile,
  // Aging
  seniorProfile,
];

export {
  dyslexiaProfile,
  lowVisionProfile,
  colorBlindnessProfile,
  photophobiaProfile,
  cataractProfile,
  macularDegenerationProfile,
  tunnelVisionProfile,
  readingDifficultiesProfile,
  aphasiaProfile,
  autismProfile,
  adhdProfile,
  cognitiveDifficultiesProfile,
  cognitiveFatigueProfile,
  memoryDifficultiesProfile,
  motorDisabilityProfile,
  tremorProfile,
  keyboardOnlyProfile,
  voiceCommandProfile,
  hearingImpairmentProfile,
  migraineProfile,
  photosensitiveEpilepsyProfile,
  visualFatigueProfile,
  seniorProfile,
};
