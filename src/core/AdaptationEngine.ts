import { resolveConflicts } from './ConflictResolver';
import type { Profile } from './types';

/**
 * Applies resolved adaptations to the DOM. Deliberately touches only
 * <html>: a boolean data-attribute per profile (for structural CSS
 * hooks) and resolved CSS custom properties (for scalar values).
 * This runs once per profile change, never on a MutationObserver loop,
 * so it stays inert to SPA re-renders instead of fighting them.
 */
export class AdaptationEngine {
  private appliedVars = new Set<string>();

  constructor(private root: HTMLElement = document.documentElement) {}

  apply(catalog: Profile[], activeIds: ReadonlySet<string>): void {
    for (const profile of catalog) {
      this.root.toggleAttribute(profile.htmlAttribute, activeIds.has(profile.id));
    }

    const active = catalog.filter((profile) => activeIds.has(profile.id));
    const resolved = resolveConflicts(active);

    for (const cssVar of this.appliedVars) {
      if (!(cssVar in resolved)) this.root.style.removeProperty(cssVar);
    }
    for (const [cssVar, value] of Object.entries(resolved)) {
      this.root.style.setProperty(cssVar, value);
    }
    this.appliedVars = new Set(Object.keys(resolved));
  }
}
