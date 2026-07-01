import type { StorageAdapter } from './types';

/**
 * Default adapter backed by window.localStorage. Falls back to an
 * in-memory map if localStorage is unavailable (SSR, privacy mode),
 * so init() never throws in environments without persistent storage.
 */
export class LocalStorageAdapter implements StorageAdapter {
  private memory = new Map<string, string>();
  private available: boolean;

  constructor() {
    this.available = LocalStorageAdapter.isAvailable();
  }

  private static isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const probeKey = '__awcag_probe__';
      window.localStorage.setItem(probeKey, '1');
      window.localStorage.removeItem(probeKey);
      return true;
    } catch {
      return false;
    }
  }

  get(key: string): string | null {
    if (this.available) return window.localStorage.getItem(key);
    return this.memory.get(key) ?? null;
  }

  set(key: string, value: string): void {
    if (this.available) {
      window.localStorage.setItem(key, value);
      return;
    }
    this.memory.set(key, value);
  }
}
