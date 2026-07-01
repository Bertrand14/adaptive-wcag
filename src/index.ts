import { ProfileManager } from './core/ProfileManager';
import { EventBus } from './core/EventBus';
import { LocalStorageAdapter } from './core/StorageAdapter';
import { defaultProfiles } from './profiles';
import { injectBaseStylesheet, removeBaseStylesheet } from './ui/base-stylesheet';
import { Panel } from './ui/Panel';
import type { AdaptiveWCAGEvent, AdaptiveWCAGEventPayload, InitOptions, Profile } from './core/types';

class AdaptiveWCAGController {
  private manager: ProfileManager | null = null;
  private panel: Panel | null = null;
  private events = new EventBus();

  /** Idempotent: calling init() more than once is a no-op after the first call. */
  init(options: InitOptions = {}): void {
    if (this.manager) return;

    const profiles = options.profiles ?? defaultProfiles;
    const storage = options.storage ?? new LocalStorageAdapter();

    this.manager = new ProfileManager(profiles, storage, this.events, options.storageKey);
    injectBaseStylesheet();
    this.manager.restore();

    if (options.ui !== false) {
      this.panel = new Panel(this.manager, this.events, options.container ?? document.body);
    }
  }

  /**
   * Reverts everything init() did: clears every profile's DOM attribute
   * and CSS variable, removes the injected base stylesheet, tears down
   * the UI panel, and wipes the persisted profile selection. The page
   * is left exactly as it was before init() ran. Safe to call even if
   * init() was never called, or to call again after a later init().
   */
  destroy(): void {
    if (!this.manager) return;
    this.manager.uninstall();
    this.panel?.destroy();
    this.panel = null;
    removeBaseStylesheet();
    this.manager = null;
  }

  private requireManager(): ProfileManager {
    if (!this.manager) throw new Error('AdaptiveWCAG: call AdaptiveWCAG.init() before using the API.');
    return this.manager;
  }

  private requirePanel(): Panel {
    if (!this.panel) {
      throw new Error('AdaptiveWCAG: UI is disabled. Re-run init() without { ui: false } to use open()/close().');
    }
    return this.panel;
  }

  open(): void {
    this.requirePanel().open();
  }

  close(): void {
    this.requirePanel().close();
  }

  enable(profileId: string): void {
    this.requireManager().enable(profileId);
  }

  disable(profileId: string): void {
    this.requireManager().disable(profileId);
  }

  getProfiles(): string[] {
    return this.requireManager().getActiveProfiles();
  }

  on<E extends AdaptiveWCAGEvent>(event: E, handler: (payload: AdaptiveWCAGEventPayload[E]) => void): () => void {
    return this.events.on(event, handler);
  }
}

const AdaptiveWCAG = new AdaptiveWCAGController();

export default AdaptiveWCAG;
export { ProfileManager, EventBus, LocalStorageAdapter, defaultProfiles };
export type { Profile, InitOptions, AdaptiveWCAGEvent, AdaptiveWCAGEventPayload };
