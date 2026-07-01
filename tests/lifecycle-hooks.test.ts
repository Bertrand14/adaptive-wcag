import { beforeEach, describe, expect, it } from 'vitest';
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

describe('Profile onActivate/onDeactivate hooks', () => {
  let activations: string[];
  let profile: Profile;
  let manager: ProfileManager;
  let storage: MemoryStorage;

  beforeEach(() => {
    activations = [];
    profile = {
      id: 'with-hooks',
      label: 'With Hooks',
      description: '',
      category: 'sensory',
      htmlAttribute: 'data-awcag-with-hooks',
      rules: [],
      onActivate: () => activations.push('activated'),
      onDeactivate: () => activations.push('deactivated'),
    };
    storage = new MemoryStorage();
    manager = new ProfileManager([profile], storage, new EventBus(), 'test-key', new AdaptationEngine(document.createElement('html')));
  });

  it('calls onActivate when enabled and onDeactivate when disabled', () => {
    manager.enable('with-hooks');
    expect(activations).toEqual(['activated']);

    manager.disable('with-hooks');
    expect(activations).toEqual(['activated', 'deactivated']);
  });

  it('calls onActivate for profiles brought back by restore()', () => {
    manager.enable('with-hooks');
    activations = [];

    const restored = new ProfileManager([profile], storage, new EventBus(), 'test-key', new AdaptationEngine(document.createElement('html')));
    restored.restore();

    expect(activations).toEqual(['activated']);
  });

  it('calls onDeactivate for every active profile on uninstall()', () => {
    manager.enable('with-hooks');
    activations = [];

    manager.uninstall();

    expect(activations).toEqual(['deactivated']);
  });
});

describe('photosensitive-epilepsy profile', () => {
  it('pauses autoplaying media on activation', async () => {
    const { photosensitiveEpilepsyProfile } = await import('../src/profiles/photosensitive-epilepsy');
    const video = document.createElement('video');
    video.autoplay = true;
    document.body.appendChild(video);
    let paused = false;
    video.pause = () => {
      paused = true;
    };

    photosensitiveEpilepsyProfile.onActivate?.();

    expect(paused).toBe(true);
    document.body.removeChild(video);
  });
});
