import { TIER_WEIGHT, type AdaptationRule, type Profile } from './types';

/**
 * Merges the rules of every active profile into one set of resolved
 * CSS variables. When two profiles disagree on the same variable, the
 * rule with the higher-priority tier wins (see TIER_WEIGHT). Ties keep
 * the rule from the profile activated first, so results are deterministic
 * regardless of Set/Map iteration order.
 */
export function resolveConflicts(profiles: Profile[]): Record<string, string> {
  const winners = new Map<string, AdaptationRule>();

  for (const profile of profiles) {
    for (const rule of profile.rules) {
      const current = winners.get(rule.cssVar);
      if (!current || TIER_WEIGHT[rule.tier] > TIER_WEIGHT[current.tier]) {
        winners.set(rule.cssVar, rule);
      }
    }
  }

  const resolved: Record<string, string> = {};
  for (const [cssVar, rule] of winners) {
    resolved[cssVar] = rule.value;
  }
  return resolved;
}
