import { describe, expect, it } from 'vitest';
import { defaultProfiles } from '../src/profiles';
import { getUiStrings, resolveLocale, translateProfile, SUPPORTED_LOCALES } from '../src/i18n';
import { PROFILE_TRANSLATIONS } from '../src/i18n/profiles';

describe('i18n', () => {
  it('resolveLocale honors an explicit locale', () => {
    expect(resolveLocale('fr')).toBe('fr');
    expect(resolveLocale('fi')).toBe('fi');
    expect(resolveLocale('en')).toBe('en');
  });

  it('resolveLocale falls back to English outside a browser', () => {
    expect(resolveLocale('auto')).toBe('en');
    expect(resolveLocale()).toBe('en');
  });

  it('every supported locale has UI strings for every category', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const strings = getUiStrings(locale);
      expect(strings.toggleOpenLabel.length).toBeGreaterThan(0);
      expect(strings.toggleCloseLabel.length).toBeGreaterThan(0);
      expect(strings.panelTitle.length).toBeGreaterThan(0);
      for (const profile of defaultProfiles) {
        expect(strings.categoryLabels[profile.category]?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it('fr and fi translate every shipped profile id', () => {
    const ids = defaultProfiles.map((p) => p.id);
    for (const locale of ['fr', 'fi'] as const) {
      for (const id of ids) {
        const entry = PROFILE_TRANSLATIONS[locale][id];
        expect(entry, `${locale} is missing a translation for "${id}"`).toBeDefined();
        expect(entry.label.length).toBeGreaterThan(0);
        expect(entry.description.length).toBeGreaterThan(0);
      }
    }
  });

  it('translateProfile returns the profile\'s own label/description for "en"', () => {
    const profile = defaultProfiles[0]!;
    expect(translateProfile('en', profile)).toEqual({ label: profile.label, description: profile.description });
  });

  it('translateProfile falls back to English for an id a locale has not translated', () => {
    const profile = { ...defaultProfiles[0]!, id: 'not-a-real-id' };
    expect(translateProfile('fr', profile)).toEqual({ label: profile.label, description: profile.description });
  });
});
