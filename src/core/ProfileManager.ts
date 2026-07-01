import { AdaptationEngine } from './AdaptationEngine';
import { EventBus } from './EventBus';
import type { Profile, StorageAdapter } from './types';

const DEFAULT_STORAGE_KEY = 'adaptive-wcag:active-profiles';

/**
 * Owns the catalog of available profiles and the set of active ones.
 * Every mutation (enable/disable/load) re-applies the full catalog to
 * the AdaptationEngine and persists the new active set, so the engine
 * and storage can never drift from the manager's state.
 */
export class ProfileManager {
  private active = new Set<string>();
  private engine: AdaptationEngine;

  constructor(
    private catalog: Profile[],
    private storage: StorageAdapter,
    private events: EventBus,
    private storageKey: string = DEFAULT_STORAGE_KEY,
    engine?: AdaptationEngine,
  ) {
    this.engine = engine ?? new AdaptationEngine();
  }

  private findProfile(id: string): Profile {
    const profile = this.catalog.find((p) => p.id === id);
    if (!profile) {
      throw new Error(`AdaptiveWCAG: unknown profile "${id}"`);
    }
    return profile;
  }

  private persist(): void {
    this.storage.set(this.storageKey, JSON.stringify([...this.active]));
  }

  private syncAndNotify(): void {
    this.engine.apply(this.catalog, this.active);
    this.persist();
    this.events.emit('updated', { activeProfiles: [...this.active] });
  }

  /** Restores previously activated profiles from storage, ignoring unknown ids. */
  restore(): void {
    const raw = this.storage.get(this.storageKey);
    if (!raw) return;

    let ids: unknown;
    try {
      ids = JSON.parse(raw);
    } catch {
      return;
    }
    if (!Array.isArray(ids)) return;

    const known = new Set(this.catalog.map((p) => p.id));
    this.active = new Set(ids.filter((id): id is string => typeof id === 'string' && known.has(id)));
    this.engine.apply(this.catalog, this.active);
    for (const id of this.active) {
      this.findProfile(id).onActivate?.();
    }
  }

  enable(id: string): void {
    const profile = this.findProfile(id);
    if (this.active.has(id)) return;
    this.active.add(id);
    this.syncAndNotify();
    profile.onActivate?.();
    this.events.emit('profileEnabled', { profileId: id });
  }

  disable(id: string): void {
    if (!this.active.has(id)) return;
    const profile = this.findProfile(id);
    this.active.delete(id);
    this.syncAndNotify();
    profile.onDeactivate?.();
    this.events.emit('profileDisabled', { profileId: id });
  }

  toggle(id: string): void {
    if (this.active.has(id)) this.disable(id);
    else this.enable(id);
  }

  /** Deactivates every profile and wipes the persisted selection, so a
   *  later restore() finds nothing to bring back. Reuses syncAndNotify
   *  so the DOM, storage, and 'updated' listeners (e.g. the panel's
   *  checkboxes) all settle to the empty state the same way a normal
   *  disable() would. */
  uninstall(): void {
    if (this.active.size === 0) return;
    const deactivated = [...this.active];
    this.active.clear();
    this.syncAndNotify();
    for (const id of deactivated) {
      this.findProfile(id).onDeactivate?.();
    }
  }

  isActive(id: string): boolean {
    return this.active.has(id);
  }

  getCatalog(): readonly Profile[] {
    return this.catalog;
  }

  getActiveProfiles(): string[] {
    return [...this.active];
  }
}
