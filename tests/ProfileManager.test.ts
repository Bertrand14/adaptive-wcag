import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileManager } from '../src/core/ProfileManager';
import { EventBus } from '../src/core/EventBus';
import { AdaptationEngine } from '../src/core/AdaptationEngine';
import type { Profile, StorageAdapter } from '../src/core/types';

class MemoryStorage implements StorageAdapter {
  private map = new Map<string, string>();
  get(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  set(key: string, value: string): void {
    this.map.set(key, value);
  }
}

const catalog: Profile[] = [
  { id: 'dyslexia', label: 'Dyslexia', description: '', category: 'reading', htmlAttribute: 'data-awcag-dyslexia', rules: [] },
  { id: 'autism', label: 'Autism', description: '', category: 'cognitive', htmlAttribute: 'data-awcag-autism', rules: [] },
];

describe('ProfileManager', () => {
  let storage: MemoryStorage;
  let events: EventBus;
  let root: HTMLElement;
  let manager: ProfileManager;

  beforeEach(() => {
    storage = new MemoryStorage();
    events = new EventBus();
    root = document.createElement('html');
    manager = new ProfileManager(catalog, storage, events, 'test-key', new AdaptationEngine(root));
  });

  it('rejects unknown profile ids', () => {
    expect(() => manager.enable('unknown')).toThrow(/unknown profile/);
  });

  it('enables a profile, applies it, persists it, and emits events', () => {
    const onEnabled = vi.fn();
    const onUpdated = vi.fn();
    events.on('profileEnabled', onEnabled);
    events.on('updated', onUpdated);

    manager.enable('dyslexia');

    expect(manager.isActive('dyslexia')).toBe(true);
    expect(root.hasAttribute('data-awcag-dyslexia')).toBe(true);
    expect(onEnabled).toHaveBeenCalledWith({ profileId: 'dyslexia' });
    expect(onUpdated).toHaveBeenCalledWith({ activeProfiles: ['dyslexia'] });
    expect(JSON.parse(storage.get('test-key')!)).toEqual(['dyslexia']);
  });

  it('is idempotent: enabling an already-active profile does not re-emit', () => {
    manager.enable('dyslexia');
    const onEnabled = vi.fn();
    events.on('profileEnabled', onEnabled);

    manager.enable('dyslexia');

    expect(onEnabled).not.toHaveBeenCalled();
  });

  it('disables a profile and clears its DOM attribute', () => {
    manager.enable('dyslexia');
    manager.disable('dyslexia');

    expect(manager.isActive('dyslexia')).toBe(false);
    expect(root.hasAttribute('data-awcag-dyslexia')).toBe(false);
    expect(JSON.parse(storage.get('test-key')!)).toEqual([]);
  });

  it('restores previously active profiles from storage on restore()', () => {
    manager.enable('dyslexia');
    manager.enable('autism');

    const restored = new ProfileManager(catalog, storage, new EventBus(), 'test-key', new AdaptationEngine(root));
    restored.restore();

    expect(restored.getActiveProfiles().sort()).toEqual(['autism', 'dyslexia']);
  });

  it('ignores unknown ids found in storage instead of throwing', () => {
    storage.set('test-key', JSON.stringify(['dyslexia', 'ghost-profile']));

    expect(() => manager.restore()).not.toThrow();
    expect(manager.getActiveProfiles()).toEqual(['dyslexia']);
  });

  it('uninstall() clears active profiles, DOM attributes, and persisted storage', () => {
    manager.enable('dyslexia');
    manager.enable('autism');

    const onUpdated = vi.fn();
    events.on('updated', onUpdated);
    manager.uninstall();

    expect(manager.getActiveProfiles()).toEqual([]);
    expect(root.hasAttribute('data-awcag-dyslexia')).toBe(false);
    expect(root.hasAttribute('data-awcag-autism')).toBe(false);
    expect(JSON.parse(storage.get('test-key')!)).toEqual([]);
    expect(onUpdated).toHaveBeenCalledWith({ activeProfiles: [] });

    // A fresh manager restoring from storage after uninstall finds nothing.
    const restored = new ProfileManager(catalog, storage, new EventBus(), 'test-key', new AdaptationEngine(root));
    restored.restore();
    expect(restored.getActiveProfiles()).toEqual([]);
  });

  it('uninstall() is a no-op when nothing is active', () => {
    const onUpdated = vi.fn();
    events.on('updated', onUpdated);

    manager.uninstall();

    expect(onUpdated).not.toHaveBeenCalled();
  });
});
