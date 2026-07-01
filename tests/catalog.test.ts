import { describe, expect, it } from 'vitest';
import { defaultProfiles } from '../src/profiles';
import { resolveConflicts } from '../src/core/ConflictResolver';
import { CATEGORY_LABELS } from '../src/core/types';

describe('default profile catalog', () => {
  it('has unique ids and unique html attributes', () => {
    const ids = defaultProfiles.map((p) => p.id);
    const attrs = defaultProfiles.map((p) => p.htmlAttribute);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(attrs).size).toBe(attrs.length);
  });

  it('every profile has a non-empty label and description', () => {
    for (const profile of defaultProfiles) {
      expect(profile.label.length).toBeGreaterThan(0);
      expect(profile.description.length).toBeGreaterThan(0);
    }
  });

  it('every htmlAttribute follows the data-awcag-<id> convention', () => {
    for (const profile of defaultProfiles) {
      expect(profile.htmlAttribute).toBe(`data-awcag-${profile.id}`);
    }
  });

  it('ships 23 built-in profiles', () => {
    expect(defaultProfiles.length).toBe(23);
  });

  it('every profile has a category with a known display label', () => {
    for (const profile of defaultProfiles) {
      expect(Object.keys(CATEGORY_LABELS)).toContain(profile.category);
    }
  });

  it('every category from CATEGORY_LABELS is used by at least one profile', () => {
    const usedCategories = new Set(defaultProfiles.map((p) => p.category));
    for (const category of Object.keys(CATEGORY_LABELS)) {
      expect(usedCategories.has(category as never)).toBe(true);
    }
  });

  it('tremor\'s larger target size wins over motor-disability\'s standard one', () => {
    const motorDisability = defaultProfiles.find((p) => p.id === 'motor-disability')!;
    const tremor = defaultProfiles.find((p) => p.id === 'tremor')!;
    const resolved = resolveConflicts([motorDisability, tremor]);
    expect(resolved['--awcag-control-min-size']).toBe('56px');
  });

  it('keyboard-only\'s stronger focus outline wins over autism\'s simplified one', () => {
    const autism = defaultProfiles.find((p) => p.id === 'autism')!;
    const keyboardOnly = defaultProfiles.find((p) => p.id === 'keyboard-only')!;
    const resolved = resolveConflicts([autism, keyboardOnly]);
    expect(resolved['--awcag-focus-outline-width']).toBe('4px');
  });
});
