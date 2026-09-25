import { describe, expect, it } from 'vitest';
import { loadDyslexiaFont, removeDyslexiaFont } from '../src/ui/dyslexia-font';

describe('dyslexia font loader', () => {
  it('injects exactly one <link>, even if called twice', () => {
    loadDyslexiaFont(undefined, document);
    loadDyslexiaFont(undefined, document);
    expect(document.querySelectorAll('#awcag-dyslexia-font')).toHaveLength(1);
    removeDyslexiaFont(document);
  });

  it('defaults to the jsDelivr @fontsource/opendyslexic stylesheet', () => {
    loadDyslexiaFont(undefined, document);
    const link = document.getElementById('awcag-dyslexia-font') as HTMLLinkElement;
    expect(link.rel).toBe('stylesheet');
    expect(link.href).toBe('https://cdn.jsdelivr.net/npm/@fontsource/opendyslexic/index.css');
    removeDyslexiaFont(document);
  });

  it('accepts a self-hosted URL instead of the default CDN', () => {
    loadDyslexiaFont('/fonts/opendyslexic.css', document);
    const link = document.getElementById('awcag-dyslexia-font') as HTMLLinkElement;
    expect(link.getAttribute('href')).toBe('/fonts/opendyslexic.css');
    removeDyslexiaFont(document);
  });

  it('removeDyslexiaFont cleans it up, and is safe to call when absent', () => {
    loadDyslexiaFont(undefined, document);
    removeDyslexiaFont(document);
    expect(document.getElementById('awcag-dyslexia-font')).toBeNull();
    expect(() => removeDyslexiaFont(document)).not.toThrow();
  });
});
