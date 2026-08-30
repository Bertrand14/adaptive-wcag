# Architecture

For the product vision and philosophy behind profile-based adaptation, see [docs/project.md](docs/project.md). This document is about how the code implements it. For the public method/option surface, see [API.md](API.md).

## Overview

```
 init(options)
      │
      ▼
┌─────────────────┐  restore()/enable()/disable()   ┌───────────────────┐
│  ProfileManager  │ ───────────────────────────────▶│  AdaptationEngine │
│  (active set)    │◀─────────────── syncAndNotify()  │  (applies to DOM)  │
└────────┬─────────┘                                  └─────────┬─────────┘
         │ persist()                    apply(catalog, active) │
         ▼                                                      ▼
┌──────────────────┐                                  ┌───────────────────┐
│  StorageAdapter   │                                  │  ConflictResolver │
│  (localStorage)   │                                  │  (priority tiers) │
└───────────────────┘                                  └─────────┬─────────┘
         ▲                                                        │
         │ emit('updated'/...)                     data-awcag-* / --awcag-* on <html>
┌────────┴─────────┐                                              ▼
│    EventBus       │                                  ┌───────────────────┐
└────────┬──────────┘                                  │  base-stylesheet   │
         │ .on('updated', syncCheckboxes)              │  (consumes vars)   │
         ▼                                              └───────────────────┘
┌───────────────────┐
│   Panel (Shadow    │
│   DOM UI)          │
└───────────────────┘
```

Nothing here runs on a `MutationObserver` loop or polls the DOM. Every module reacts once, synchronously, to an explicit state change (`enable`, `disable`, `restore`, `setLocale`) and then goes idle — see `src/core/AdaptationEngine.ts`'s own comment on why: staying inert between changes is what keeps this from fighting an SPA's own re-renders.

## Core

Lives in `src/core/`.

### ProfileManager

Owns the catalog (all known profiles) and the active set (a `Set<string>` of ids). Every mutation — `enable`, `disable`, `restore()` — funnels through one private `syncAndNotify()` that, in order: re-applies the full catalog to the `AdaptationEngine`, persists the new active set via the `StorageAdapter`, and emits `'updated'` on the `EventBus`. This is what guarantees the engine, storage, and any UI listening for `'updated'` can never drift from the manager's own idea of what's active — there's exactly one path that changes state, and it always finishes the same three steps. `uninstall()` (used by `destroy()`) reuses the same path to deactivate everything, which is why it also wipes storage — see [API.md](API.md#destroy).

### AdaptationEngine

`apply(catalog, activeIds)` is deliberately the only piece of code that touches the DOM outside the Shadow-DOM panel. For every profile in the catalog it toggles a boolean `data-awcag-<id>` attribute on `<html>` (used for the structural, non-variable CSS in `hearing-impairment`), then asks the `ConflictResolver` to merge the active profiles' rules into one `{ cssVar: value }` map and sets those as CSS custom properties on `<html>`. It also removes any custom property that *was* set on a previous `apply()` but isn't in the new resolved set, so disabling a profile actually clears its effect instead of leaving a stale variable behind.

### Conflict resolution

`ConflictResolver.resolveConflicts(profiles)` merges every active profile's `AdaptationRule[]` into one map keyed by CSS variable. Each rule carries a `PriorityTier` (`safety > accessibility > readability > layout > visual-effects > aesthetics`, weighted in `TIER_WEIGHT`); when two active profiles set the same variable, the higher tier wins, and ties keep whichever rule was seen first (iteration order = profile activation order), so results never depend on `Set`/`Map` internals. This is what makes `low-vision`'s contrast boost beat `migraine`'s softened contrast, and `tremor`'s 56px minimum target size beat `motor-disability`'s standard 44px — both are `safety`/stronger-`accessibility` outranking a milder or purely-aesthetic ask, not a coincidence of registration order.

### EventBus

A minimal typed pub/sub (`on`/`off`/`emit`) scoped to the three events in `AdaptiveWCAGEvent`. It exists so `Panel` can react to state changes (`syncCheckboxes()` on `'updated'`) without `ProfileManager` knowing the panel exists at all — the manager only ever emits, never imports UI code.

### StorageAdapter

A two-method interface (`get`/`set`) so persistence is swappable via `init({ storage })`. `LocalStorageAdapter` is the shipped default: it probes `window.localStorage` once at construction (write+delete a throwaway key) and falls back to an in-memory `Map` if that throws — privacy mode, SSR, or a locked-down environment never crashes `init()`, it just doesn't persist across reloads.

## Reusable rule bundles

Lives in `src/profiles/adaptations.ts`.

Profiles don't each hand-roll their `AdaptationRule[]`. Bundles like `reducedMotion`, `simplifiedFocus`, `comfortableSpacing`, `strongerBorders`, and `largerTargets` are defined once and spread into every profile that needs that *exact* value — e.g. 11 profiles compose `reducedMotion` (tier `safety`, because uncontrolled motion is a vestibular/seizure trigger, not an aesthetic preference) instead of repeating `{ cssVar: '--awcag-animation-duration', value: '0.001ms', tier: 'safety' }` eleven times. A profile that needs a *different* value for the same concern (e.g. `tremor`'s 56px vs. the shared 44px `largerTargets`) simply defines its own rule instead of importing the bundle — the `ConflictResolver` picks the winner by tier either way.

## Base stylesheet

Lives in `src/ui/base-stylesheet.ts`.

CSS custom properties only take effect if some rule actually consumes them. `BASE_STYLESHEET` is one `<style>` block, injected once into `<head>` by `injectBaseStylesheet()`, containing every selector that reads an `--awcag-*` variable — all gated behind `html[data-awcag-<id>]` attribute selectors, so with no profile active none of it matches anything and the host page is untouched. `GATED_VAR_GROUPS` is the hand-maintained map of "which profile ids must be listed for this variable's consuming rule to fire", and `tests/base-stylesheet-coverage.test.ts` cross-checks it against the real profile catalog — a new profile that sets a variable without being added to the right group here fails that test instead of silently shipping a no-op adaptation.

## UI

Lives in `src/ui/Panel.ts`.

The floating button + panel render inside a Shadow DOM (`mode: 'open'`) attached to a plain `<div>` host, specifically so the panel's own styles can't leak into the host page and the host page's styles can't override the panel's contrast/focus rules. `Panel` holds a live reference to the `ProfileManager` (to read `isActive()`/call `toggle()`) and subscribes to `'updated'` to keep checkboxes in sync when state changes from outside the panel (e.g. `AdaptiveWCAG.enable()` called directly). It manages its own focus behaviour: traps `Tab` inside the panel while open, restores focus to whatever was focused before opening (or the toggle button, if nothing else) on close, and closes on `Escape`.

`setLocale()` (see [API.md](API.md#setlocalelocale)) works by destroying and recreating just this `Panel` instance — the controller in `src/index.ts` keeps the `container` and current `locale` around specifically to make that cheap, and re-opens the new panel if the old one was open. `ProfileManager`, the `EventBus`, and the `StorageAdapter` are untouched by this, which is the whole point: only `destroy()` (a deliberate full uninstall) is allowed to touch storage.

## Internationalisation

Lives in `src/i18n/`.

`resolveLocale(requested)` reads `navigator.language` for `'auto'` (the default) and falls back to `DEFAULT_LOCALE` ('en') both outside a browser (SSR/tests) and for a language without shipped strings. `getUiStrings(locale)` returns the panel's static strings (button labels, category names, panel title); `translateProfile(locale, profile)` returns a profile's translated `{ label, description }`, falling back to the profile's own English `label`/`description` — which double as both the `'en'` value and the safety net for a profile a locale hasn't translated yet (e.g. one just added to the catalog). This fallback-to-English-by-construction is why translation coverage is enforced by a test (`tests/i18n.test.ts`) rather than a runtime check: a missing translation degrades gracefully instead of throwing, so it needs a different kind of guard.

## Public surface

Lives in `src/index.ts`.

`AdaptiveWCAGController` is the only stateful object exposed (as the default-exported `AdaptiveWCAG` singleton). It wires the pieces above together in `init()`, exposes the thin passthrough methods documented in [API.md](API.md), and is the one place that knows about all of `ProfileManager`, `EventBus`, `Panel`, and the injected base stylesheet — everything else only knows its immediate neighbours in the diagram above.

## Build

Configured in `tsup.config.ts`.

Two build targets from the same `src/index.ts` entry: an ESM+CJS pair with `.d.ts` (for bundler consumers) and a minified IIFE (`dist/adaptive-wcag.min.js`, global `window.AdaptiveWCAG`) for the plain-`<script>`-tag case. See [DEPLOYMENT.md](DEPLOYMENT.md) for the release process that produces these.
