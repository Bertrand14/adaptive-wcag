import { ProfileManager } from './core/ProfileManager';
import { EventBus } from './core/EventBus';
import { LocalStorageAdapter } from './core/StorageAdapter';
import { defaultProfiles } from './profiles';
import { injectBaseStylesheet, removeBaseStylesheet } from './ui/base-stylesheet';
import { loadDyslexiaFont, removeDyslexiaFont } from './ui/dyslexia-font';
import { Panel } from './ui/Panel';
import { resolveLocale } from './i18n';
import type { AdaptiveWCAGEvent, AdaptiveWCAGEventPayload, InitOptions, Profile } from './core/types';
import type { Locale } from './i18n';

class AdaptiveWCAGController {
  private manager: ProfileManager | null = null;
  private panel: Panel | null = null;
  private events = new EventBus();
  private container: Element | ShadowRoot = document.body;
  private locale: Locale = 'en';

  /** Idempotent: calling init() more than once is a no-op after the first call. */
  init(options: InitOptions = {}): void {
    if (this.manager) return;

    const profiles = options.profiles ?? defaultProfiles;
    const storage = options.storage ?? new LocalStorageAdapter();

    this.manager = new ProfileManager(profiles, storage, this.events, options.storageKey);
    injectBaseStylesheet();
    this.manager.restore();

    this.container = options.container ?? document.body;

    if (options.ui !== false) {
      this.locale = resolveLocale(options.locale);
      this.panel = new Panel(this.manager, this.events, this.container, this.locale);
    }
  }

  /**
   * Switches the panel's UI language after init(). Unlike destroy()+init(),
   * this only rebuilds the panel: active profiles and persisted state are
   * left untouched, so it's safe to call every time a host site's own
   * locale changes. No-op if the UI is disabled ({ ui: false }) or the
   * resolved locale hasn't changed.
   */
  setLocale(locale: Locale | 'auto' = 'auto'): void {
    const manager = this.requireManager();
    if (!this.panel) return;

    const resolved = resolveLocale(locale);
    if (resolved === this.locale) return;

    const wasOpen = this.panel.opened;
    this.locale = resolved;
    this.panel.destroy();
    this.panel = new Panel(manager, this.events, this.container, resolved);
    if (wasOpen) this.panel.open();
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
    removeDyslexiaFont();
    this.manager = null;
  }

  /**
   * Loads OpenDyslexic so the Dyslexia profile's --awcag-font-family
   * rule actually renders instead of silently falling back to 'Comic
   * Sans MS'/sans-serif (see src/ui/dyslexia-font.ts). Not called by
   * init() automatically — this is the one place the library would
   * otherwise make a third-party network request on your visitors'
   * behalf, so it stays opt-in. Pass your own self-hosted stylesheet
   * URL instead of the default jsDelivr CDN if that fits your CSP
   * better. Safe to call before or after init(); idempotent.
   */
  loadDyslexiaFont(url?: string): void {
    loadDyslexiaFont(url);
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
export { ProfileManager, EventBus, LocalStorageAdapter, defaultProfiles, resolveLocale };
export type { Profile, InitOptions, AdaptiveWCAGEvent, AdaptiveWCAGEventPayload, Locale };
