import { describe, expect, it } from 'vitest';
import { reducedMotion, simplifiedFocus, comfortableSpacing } from '../src/profiles/adaptations';
import { autismProfile } from '../src/profiles/autism';
import { migraineProfile } from '../src/profiles/migraine';
import { visualFatigueProfile } from '../src/profiles/visual-fatigue';
import { cognitiveDifficultiesProfile } from '../src/profiles/cognitive-difficulties';

function hasAllRules(profile: { rules: { cssVar: string; value: string; tier: string }[] }, module: { cssVar: string; value: string; tier: string }[]) {
  return module.every((rule) => profile.rules.some((r) => r.cssVar === rule.cssVar && r.value === rule.value && r.tier === rule.tier));
}

describe('shared adaptation modules', () => {
  it('reducedMotion is composed identically by every profile that uses it', () => {
    for (const profile of [autismProfile, migraineProfile, visualFatigueProfile, cognitiveDifficultiesProfile]) {
      expect(hasAllRules(profile, reducedMotion)).toBe(true);
    }
  });

  it('simplifiedFocus is composed identically by autism and cognitive difficulties', () => {
    for (const profile of [autismProfile, cognitiveDifficultiesProfile]) {
      expect(hasAllRules(profile, simplifiedFocus)).toBe(true);
    }
  });

  it('comfortableSpacing is composed identically by visual fatigue and cognitive difficulties', () => {
    for (const profile of [visualFatigueProfile, cognitiveDifficultiesProfile]) {
      expect(hasAllRules(profile, comfortableSpacing)).toBe(true);
    }
  });
});
