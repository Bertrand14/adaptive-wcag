import type { Profile } from '../core/types';
import { PROFILE_TRANSLATIONS } from './profiles';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from './types';
import { UI_STRINGS, type UiStrings } from './ui';

export { DEFAULT_LOCALE, SUPPORTED_LOCALES };
export type { Locale, UiStrings };

/**
 * `'auto'` (the default) reads `navigator.language`; an explicit locale is
 * used as-is. Falls back to `DEFAULT_LOCALE` outside a browser (SSR/tests)
 * or for a language we don't ship strings for.
 */
export function resolveLocale(requested?: Locale | 'auto'): Locale {
  if (requested && requested !== 'auto') return requested;

  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;

  const lang = navigator.language?.slice(0, 2).toLowerCase();
  return (SUPPORTED_LOCALES as string[]).includes(lang) ? (lang as Locale) : DEFAULT_LOCALE;
}

export function getUiStrings(locale: Locale): UiStrings {
  return UI_STRINGS[locale] ?? UI_STRINGS[DEFAULT_LOCALE];
}

/**
 * English lives directly on each `Profile` (`label`/`description`) and is
 * used as both the `en` value and the fallback for an id a locale hasn't
 * translated yet (e.g. a newly added profile).
 */
export function translateProfile(locale: Locale, profile: Profile): { label: string; description: string } {
  if (locale === 'en') return { label: profile.label, description: profile.description };

  const entry = PROFILE_TRANSLATIONS[locale]?.[profile.id];
  return entry ?? { label: profile.label, description: profile.description };
}
