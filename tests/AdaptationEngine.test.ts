import { beforeEach, describe, expect, it } from 'vitest';
import { AdaptationEngine } from '../src/core/AdaptationEngine';
import type { Profile } from '../src/core/types';

const profileA: Profile = {
  id: 'a',
  label: 'A',
  description: '',
  category: 'vision',
  htmlAttribute: 'data-awcag-a',
  rules: [{ cssVar: '--awcag-x', value: '1', tier: 'accessibility' }],
};

const profileB: Profile = {
  id: 'b',
  label: 'B',
  description: '',
  category: 'vision',
  htmlAttribute: 'data-awcag-b',
  rules: [{ cssVar: '--awcag-y', value: '2', tier: 'readability' }],
};

describe('AdaptationEngine', () => {
  let root: HTMLElement;
  let engine: AdaptationEngine;

  beforeEach(() => {
    root = document.createElement('html');
    engine = new AdaptationEngine(root);
  });

  it('sets the html attribute and css variable for an active profile', () => {
    engine.apply([profileA, profileB], new Set(['a']));
    expect(root.hasAttribute('data-awcag-a')).toBe(true);
    expect(root.hasAttribute('data-awcag-b')).toBe(false);
    expect(root.style.getPropertyValue('--awcag-x')).toBe('1');
    expect(root.style.getPropertyValue('--awcag-y')).toBe('');
  });

  it('removes attributes and variables once a profile is deactivated', () => {
    engine.apply([profileA, profileB], new Set(['a', 'b']));
    engine.apply([profileA, profileB], new Set(['b']));

    expect(root.hasAttribute('data-awcag-a')).toBe(false);
    expect(root.style.getPropertyValue('--awcag-x')).toBe('');
    expect(root.hasAttribute('data-awcag-b')).toBe(true);
    expect(root.style.getPropertyValue('--awcag-y')).toBe('2');
  });

  it('clears every variable once no profile is active', () => {
    engine.apply([profileA, profileB], new Set(['a', 'b']));
    engine.apply([profileA, profileB], new Set());

    expect(root.getAttributeNames().filter((n) => n.startsWith('data-awcag-'))).toEqual([]);
    expect(root.style.cssText).toBe('');
  });
});
