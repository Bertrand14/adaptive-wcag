import { describe, expect, it } from 'vitest';
import { GATED_VAR_GROUPS } from '../src/ui/base-stylesheet';
import { defaultProfiles } from '../src/profiles';

describe('base stylesheet gating coverage', () => {
  it('every profile that sets a shared CSS variable is listed in the group that gates it', () => {
    const actualSettersByVar = new Map<string, Set<string>>();
    for (const profile of defaultProfiles) {
      for (const rule of profile.rules) {
        if (!actualSettersByVar.has(rule.cssVar)) actualSettersByVar.set(rule.cssVar, new Set());
        actualSettersByVar.get(rule.cssVar)!.add(profile.id);
      }
    }

    const missing: string[] = [];
    for (const [cssVar, setters] of actualSettersByVar) {
      const gatedGroup = new Set(GATED_VAR_GROUPS[cssVar] ?? []);
      for (const profileId of setters) {
        if (!gatedGroup.has(profileId)) {
          missing.push(`${cssVar} is set by "${profileId}" but that id is missing from GATED_VAR_GROUPS['${cssVar}']`);
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it('every cssVar referenced in GATED_VAR_GROUPS is actually set by at least one profile', () => {
    const varsInUse = new Set(defaultProfiles.flatMap((p) => p.rules.map((r) => r.cssVar)));
    const staleVars = Object.keys(GATED_VAR_GROUPS).filter((cssVar) => !varsInUse.has(cssVar));
    expect(staleVars).toEqual([]);
  });
});
