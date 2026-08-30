import { beforeEach, describe, expect, it } from 'vitest';
import AdaptiveWCAG from '../src/index';

describe('AdaptiveWCAG.setLocale', () => {
  beforeEach(() => {
    AdaptiveWCAG.destroy();
    localStorage.clear();
    document.body.innerHTML = '';
  });

  it('re-renders the panel in the new language', () => {
    AdaptiveWCAG.init({ locale: 'en' });
    const title = () => document.body.querySelector('div')!.shadowRoot!.querySelector('h2')!.textContent;
    const englishTitle = title();

    AdaptiveWCAG.setLocale('fr');

    expect(title()).not.toBe(englishTitle);
  });

  it('does not wipe active profiles or persisted storage', () => {
    AdaptiveWCAG.init({ locale: 'en' });
    AdaptiveWCAG.enable('dyslexia');

    AdaptiveWCAG.setLocale('fr');

    expect(AdaptiveWCAG.getProfiles()).toEqual(['dyslexia']);
    expect(document.documentElement.hasAttribute('data-awcag-dyslexia')).toBe(true);
  });

  it('is a no-op when the resolved locale has not changed', () => {
    AdaptiveWCAG.init({ locale: 'fr' });
    const hostBefore = document.body.querySelector('div');

    AdaptiveWCAG.setLocale('fr');

    expect(document.body.querySelector('div')).toBe(hostBefore);
  });

  it('is a no-op when the UI is disabled', () => {
    AdaptiveWCAG.init({ ui: false });
    expect(() => AdaptiveWCAG.setLocale('fr')).not.toThrow();
  });

  it('throws if called before init()', () => {
    expect(() => AdaptiveWCAG.setLocale('fr')).toThrow(/init/);
  });
});
