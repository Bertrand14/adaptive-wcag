import type { Locale } from '../i18n/types';

/**
 * Priority tiers used to resolve conflicts when two active profiles
 * disagree on the value of the same adaptation.
 * Order encodes the rule from docs/project.md:
 * accessibility > aesthetics, safety > visual-effects, readability > layout.
 */
export type PriorityTier =
  | 'safety'
  | 'accessibility'
  | 'readability'
  | 'layout'
  | 'visual-effects'
  | 'aesthetics';

export const TIER_WEIGHT: Record<PriorityTier, number> = {
  safety: 50,
  accessibility: 40,
  readability: 30,
  layout: 20,
  'visual-effects': 10,
  aesthetics: 0,
};

/**
 * A single adaptation, expressed as a CSS custom property assignment.
 * The engine never touches individual DOM nodes: it only ever resolves
 * a set of rules down to CSS variables set on <html>, so it survives
 * framework re-renders (React/Vue/etc never own <html>).
 */
export interface AdaptationRule {
  /** CSS custom property name, e.g. "--awcag-letter-spacing" */
  cssVar: string;
  value: string;
  tier: PriorityTier;
}

/** Matches the grouping in README.md's profile table. Purely a UI
 *  concern — the engine and ConflictResolver never look at this. */
export type ProfileCategory = 'vision' | 'reading' | 'cognitive' | 'motor' | 'hearing' | 'sensory' | 'aging';

export const CATEGORY_LABELS: Record<ProfileCategory, string> = {
  vision: 'Vision',
  reading: 'Reading',
  cognitive: 'Cognitive',
  motor: 'Motor',
  hearing: 'Hearing',
  sensory: 'Sensory',
  aging: 'Aging',
};

export interface Profile {
  id: string;
  label: string;
  description: string;
  category: ProfileCategory;
  /** Boolean data-attribute set on <html> while the profile is active,
   *  used by the base stylesheet for structural (non-variable) rules. */
  htmlAttribute: string;
  rules: AdaptationRule[];
  /**
   * Escape hatch for the rare adaptation that CSS variables genuinely
   * can't express (e.g. pausing autoplaying media for photosensitive
   * epilepsy). Runs once when the profile is enabled/restored, and
   * once when disabled/uninstalled — never on a continuous observer,
   * so it stays consistent with the engine's "touch the DOM once per
   * change" rule. Most profiles don't need this.
   */
  onActivate?: () => void;
  onDeactivate?: () => void;
}

export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

export type AdaptiveWCAGEvent = 'profileEnabled' | 'profileDisabled' | 'updated';

export interface AdaptiveWCAGEventPayload {
  profileEnabled: { profileId: string };
  profileDisabled: { profileId: string };
  updated: { activeProfiles: string[] };
}

export interface InitOptions {
  ui?: boolean;
  storage?: StorageAdapter;
  storageKey?: string;
  profiles?: Profile[];
  container?: Element | ShadowRoot;
  /**
   * UI language. `'auto'` (the default) reads `navigator.language` and
   * falls back to English for anything we don't ship strings for.
   */
  locale?: Locale | 'auto';
}
