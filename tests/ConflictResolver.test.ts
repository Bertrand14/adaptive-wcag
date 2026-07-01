import { describe, expect, it } from 'vitest';
import { resolveConflicts } from '../src/core/ConflictResolver';
import type { Profile } from '../src/core/types';
import { dyslexiaProfile } from '../src/profiles/dyslexia';
import { lowVisionProfile } from '../src/profiles/low-vision';
import { autismProfile } from '../src/profiles/autism';
import { migraineProfile } from '../src/profiles/migraine';
import { visualFatigueProfile } from '../src/profiles/visual-fatigue';
import { cognitiveDifficultiesProfile } from '../src/profiles/cognitive-difficulties';

describe('resolveConflicts', () => {
  it('returns no variables when no profile is active', () => {
    expect(resolveConflicts([])).toEqual({});
  });

  it('applies the only rule for a single active profile', () => {
    const resolved = resolveConflicts([dyslexiaProfile]);
    expect(resolved['--awcag-font-scale']).toBe('1.1');
  });

  it('reproduces the documented example: safety beats an aesthetic preference for motion', () => {
    // Mirrors docs/project.md's conflict example: Autism (disabled,
    // safety) vs. a hypothetical "general" profile (enabled, aesthetics).
    const generalProfile: Profile = {
      id: 'general',
      label: 'General',
      description: 'test-only profile',
      category: 'cognitive',
      htmlAttribute: 'data-awcag-general',
      rules: [{ cssVar: '--awcag-animation-duration', value: '300ms', tier: 'aesthetics' }],
    };

    const resolved = resolveConflicts([generalProfile, autismProfile]);
    expect(resolved['--awcag-animation-duration']).toBe('0.001ms');
  });

  it('order of activation does not change the winner', () => {
    const a = resolveConflicts([dyslexiaProfile, lowVisionProfile]);
    const b = resolveConflicts([lowVisionProfile, dyslexiaProfile]);
    expect(a).toEqual(b);
  });

  it('picks the higher-priority tier when both profiles set the same variable', () => {
    // low-vision's font-scale rule is tier "accessibility" (40),
    // dyslexia's is tier "readability" (30): accessibility must win.
    const resolved = resolveConflicts([dyslexiaProfile, lowVisionProfile]);
    expect(resolved['--awcag-font-scale']).toBe('1.35');
    expect(resolved['--awcag-visual-filter']).toBe('contrast(1.3) saturate(1.1)');
  });

  it('legibility beats comfort: low vision\'s contrast boost wins over migraine\'s softened filter', () => {
    const resolved = resolveConflicts([migraineProfile, lowVisionProfile]);
    expect(resolved['--awcag-visual-filter']).toBe('contrast(1.3) saturate(1.1)');
  });

  it('migraine and visual fatigue share the exact same reducedMotion values', () => {
    const resolved = resolveConflicts([migraineProfile, visualFatigueProfile]);
    expect(resolved['--awcag-animation-duration']).toBe('0.001ms');
    expect(resolved['--awcag-transition-duration']).toBe('0.001ms');
  });

  it('cognitive difficulties composes reducedMotion, simplifiedFocus, and comfortableSpacing', () => {
    const resolved = resolveConflicts([cognitiveDifficultiesProfile]);
    expect(resolved['--awcag-animation-duration']).toBe('0.001ms');
    expect(resolved['--awcag-focus-outline-width']).toBe('2px');
    expect(resolved['--awcag-line-height']).toBe('1.5');
  });

  it('keeps the first profile rule on an exact tier tie', () => {
    const first: Profile = {
      id: 'first',
      label: 'First',
      description: '',
      category: 'cognitive',
      htmlAttribute: 'data-awcag-first',
      rules: [{ cssVar: '--awcag-shared', value: 'from-first', tier: 'readability' }],
    };
    const second: Profile = {
      id: 'second',
      label: 'Second',
      description: '',
      category: 'cognitive',
      htmlAttribute: 'data-awcag-second',
      rules: [{ cssVar: '--awcag-shared', value: 'from-second', tier: 'readability' }],
    };

    expect(resolveConflicts([first, second])['--awcag-shared']).toBe('from-first');
    expect(resolveConflicts([second, first])['--awcag-shared']).toBe('from-second');
  });
});
