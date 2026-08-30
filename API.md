# API Reference

`AdaptiveWCAG` is a single default-exported controller object (a singleton) — there's nothing to instantiate. See [INSTALL.md](INSTALL.md) for how to get it into your project, and [ARCHITECTURE.md](ARCHITECTURE.md) for what happens internally when these methods are called.

```js
import AdaptiveWCAG from 'adaptive-wcag';
```

## Methods

| Method | Description |
| --- | --- |
| [`init(options?)`](#initoptions) | Starts the engine. Idempotent — calling it twice is a no-op. |
| [`setLocale(locale?)`](#setlocalelocale) | Switches the panel's UI language after `init()`. |
| `open()` / `close()` | Opens/closes the accessibility panel (throws if `ui: false`). |
| `enable(profileId)` / `disable(profileId)` | Activates/deactivates one profile by id. |
| `getProfiles()` | Returns the array of currently active profile ids. |
| [`on(event, handler)`](#events) | Subscribes to `'profileEnabled'`, `'profileDisabled'`, or `'updated'`. Returns an unsubscribe function. |
| [`destroy()`](#destroy) | Uninstalls the engine — see below. |

### `init(options?)`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `ui` | `boolean` | `true` | Set `false` to disable the built-in floating button/panel and drive the engine with your own UI via `enable()`/`disable()`/`on()`. |
| `profiles` | `Profile[]` | the 23 built-in profiles | Replace or extend the catalog. Each `Profile` needs `id`, `label`, `description`, `category`, `htmlAttribute`, and `rules` — see `src/core/types.ts`. |
| `storage` | `StorageAdapter` | `localStorage`-backed | Plug in your own persistence (`{ get(key), set(key, value) }`) — e.g. to sync the active profile set server-side for logged-in users. |
| `storageKey` | `string` | `'adaptive-wcag:active-profiles'` | Override if you need multiple independent instances on one page/origin. |
| `container` | `Element \| ShadowRoot` | `document.body` | Where the panel's host element is appended. |
| `locale` | `'en' \| 'fr' \| 'fi' \| 'auto'` | `'auto'` | UI language. `'auto'` reads `navigator.language` and falls back to English for anything not shipped. Resolved once, at `init()` — see `setLocale()` to follow a later change. |

### `setLocale(locale?)`

```js
AdaptiveWCAG.setLocale('fr');   // explicit
AdaptiveWCAG.setLocale();       // 'auto' (default) — re-reads navigator.language
```

Switches the panel's UI language after `init()`. Unlike `destroy()` + `init()`, this only rebuilds the panel: active profiles and persisted storage are left untouched, so it's safe to call every time a host site's own locale changes (see [INSTALL.md](INSTALL.md#following-a-host-sites-own-locale-switcher) for a framework example). No-op if `ui: false` was passed to `init()`, or if the resolved locale hasn't actually changed. If the panel was open when `setLocale()` is called, it stays open after the rebuild.

### Events

```js
AdaptiveWCAG.on('updated', ({ activeProfiles }) => { ... });
AdaptiveWCAG.on('profileEnabled', ({ profileId }) => { ... });
AdaptiveWCAG.on('profileDisabled', ({ profileId }) => { ... });
```

| Event | Payload | Fires |
| --- | --- | --- |
| `updated` | `{ activeProfiles: string[] }` | After every enable/disable/restore/uninstall — the full active set. |
| `profileEnabled` | `{ profileId: string }` | When a specific profile turns on. |
| `profileDisabled` | `{ profileId: string }` | When a specific profile turns off. |

### `destroy()`

```js
AdaptiveWCAG.destroy();
```

This automatically:

- clears every profile's `data-awcag-*` attribute and `--awcag-*` CSS variable from `<html>`;
- removes the injected base stylesheet;
- removes the floating button and panel (and its Shadow DOM) from the page;
- **wipes the persisted profile selection from storage**, so a future `init()` doesn't bring old profiles back.

`destroy()` is safe to call multiple times and even if `init()` was never called. After `destroy()`, the page is in exactly the state it was in before `init()` ran, and you can call `init()` again to reinstall it cleanly. This is the mechanism to use for SPA route cleanup, feature-flag rollback, or a "disable accessibility toolkit" user action — **not** for following a locale change (use [`setLocale()`](#setlocalelocale) instead, precisely because of the storage wipe above).

---

## Built-in profiles

23 profiles, grouped by need (also the panel's own grouping):

| Vision | Reading | Cognitive | Motor | Hearing | Sensory | Aging |
| --- | --- | --- | --- | --- | --- | --- |
| `low-vision` | `dyslexia` | `autism` | `motor-disability` | `hearing-impairment` | `migraine` | `senior` |
| `color-blindness` | `reading-difficulties` | `adhd` | `tremor` | | `photosensitive-epilepsy` | |
| `photophobia` | `aphasia` | `cognitive-difficulties` | `keyboard-only` | | `visual-fatigue` | |
| `cataract` | | `cognitive-fatigue` | `voice-command` | | | |
| `macular-degeneration` | | `memory-difficulties` | | | | |
| `tunnel-vision` | | | | | | |

Several profiles compose the same underlying adaptation instead of duplicating it (e.g. 11 profiles share the exact `reducedMotion` rule bundle, 8 share `simplifiedFocus` — see `src/profiles/adaptations.ts`, and [ARCHITECTURE.md](ARCHITECTURE.md#conflict-resolution) for how conflicts between profiles are resolved deterministically). A test (`tests/base-stylesheet-coverage.test.ts`) cross-checks every profile's variables against the stylesheet that renders them, so a new profile can't silently ship an adaptation that never actually applies.

Two profiles are intentionally conservative about what generic CSS can deliver:

- `hearing-impairment` only styles native `<video>` captions and standard ARIA live regions — it can't know a site's own caption/transcript markup.
- `cognitive-difficulties`/`aphasia` expose their `data-awcag-*` attribute for a site owner to hook deeper simplification into, rather than guessing at what's "secondary" content.

`photosensitive-epilepsy` is the one profile with a real (bounded, one-shot) side effect beyond CSS: it pauses autoplaying `<video>`/`<audio>` found at activation time (see `onActivate` in `src/core/types.ts`).

Adding a new profile, or replacing the catalog entirely via `init({ profiles })`, is covered in [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-profile).
