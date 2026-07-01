import { describe, expect, it } from 'vitest';
import { injectBaseStylesheet, removeBaseStylesheet } from '../src/ui/base-stylesheet';

describe('base stylesheet', () => {
  it('injects exactly one <style> tag, even if called twice', () => {
    injectBaseStylesheet(document);
    injectBaseStylesheet(document);
    expect(document.querySelectorAll('#awcag-base-styles')).toHaveLength(1);
  });

  it('removeBaseStylesheet cleans it up, and is safe to call when absent', () => {
    injectBaseStylesheet(document);
    removeBaseStylesheet(document);
    expect(document.getElementById('awcag-base-styles')).toBeNull();
    expect(() => removeBaseStylesheet(document)).not.toThrow();
  });
});
