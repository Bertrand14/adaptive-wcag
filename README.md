# Adaptive WCAG

> An intelligent accessibility engine that automatically adapts any website to the user's needs.

Instead of exposing dozens of technical toggles (font size, contrast, spacing...), Adaptive WCAG asks one question — *"What are your accessibility needs?"* — and applies the right combination of adaptations for you. See [`docs/project.md`](docs/project.md) for the full product vision.

**Status:** early-stage MVP. The core engine, 23 profiles, the default UI (grouped by category), and persistence are implemented and tested. Framework wrappers (React, Vue, ...) from the roadmap are not built yet — the vanilla core works in any framework today, just without a dedicated adapter.

---

## Features

- **Profile-based**, not setting-based: users pick a need, not a list of CSS properties.
- **Framework-agnostic core**: manipulates only `<html>` (data attributes + CSS custom properties), so it survives React/Vue/etc. re-renders instead of fighting them.
- **Deterministic conflict resolution**: when two active profiles disagree, a priority tier (`safety` > `accessibility` > `readability` > `layout` > `visual-effects` > `aesthetics`) decides the winner.
- **Persistent**: active profiles are restored automatically on the next visit (`localStorage` by default, pluggable storage adapter).
- **Accessible UI out of the box**: floating button + panel, rendered in a Shadow DOM, with focus trapping, `Escape` to close, and focus restoration.
- **Fully reversible**: `AdaptiveWCAG.destroy()` removes every trace the library added, restoring the page to its pre-`init()` state.

---

## How to install

This is not yet published to npm or a public CDN. Until it is, use one of the two options below.

### Option A — git dependency (bundler projects: Vite, webpack, Next, ...)

```bash
npm install git+https://github.com/Bertrand14/adaptive-wcag.git
```

`dist/` is gitignored in this repo (it's a build artifact, not source), so installing straight from GitHub would normally leave you without the files `main`/`module`/`types` point to. The `prepare` script (`package.json`) covers this automatically: npm runs it right after installing a git dependency, which builds `dist/` in place inside `node_modules/adaptive-wcag`. Nothing extra to run — `npm install` is enough.

```js
import AdaptiveWCAG from 'adaptive-wcag';

AdaptiveWCAG.init();
```

Pin to a commit or tag for reproducible installs: `git+https://github.com/Bertrand14/adaptive-wcag.git#<commit-or-tag>`.

### Option B — self-hosted script tag (no build step / static sites)

Build the library, then copy the generated bundle into your own site (e.g. `public/vendor/adaptive-wcag.min.js`) and serve it from there — don't point at this repo's checkout at request time:

```bash
npm install
npm run build
```

```html
<script src="/vendor/adaptive-wcag.min.js"></script>
<script>
  AdaptiveWCAG.init();
</script>
```

### Quick start

```js
AdaptiveWCAG.init();               // default UI + all built-in profiles
AdaptiveWCAG.init({ ui: false });  // engine only, bring your own UI

AdaptiveWCAG.enable('dyslexia');
AdaptiveWCAG.disable('dyslexia');
AdaptiveWCAG.getProfiles();        // -> ['dyslexia']

AdaptiveWCAG.on('updated', ({ activeProfiles }) => {
  console.log('active profiles:', activeProfiles);
});
```

### Using it inside a framework (e.g. React)

The core never touches component-owned DOM, so it's safe to call from a lifecycle hook:

```jsx
useEffect(() => {
  AdaptiveWCAG.init();
  return () => AdaptiveWCAG.destroy();
}, []);
```

### Following a host site's own locale switcher

`init({ locale })` only resolves the language once, at startup. If your site's language can change later (a locale switcher, an Inertia/React Router locale prop, i18next's `languageChanged` event, ...), call `setLocale()` whenever that happens instead of tearing the widget down and calling `init()` again:

```jsx
const { locale } = usePage().props; // or wherever your app exposes the current locale

useEffect(() => {
  AdaptiveWCAG.setLocale(locale);
}, [locale]);
```

Don't reach for `destroy()` + `init()` here: `destroy()` uninstalls the engine entirely, including **wiping the visitor's saved profile selection from storage** — so a naive reinit on every language switch would silently reset someone's accessibility settings each time they change the site's language. `setLocale()` exists specifically to avoid that: it only rebuilds the panel's DOM/strings and leaves the engine, active profiles, and storage alone.

---

## API reference

| Method | Description |
| --- | --- |
| `init(options?)` | Starts the engine. Idempotent — calling it twice is a no-op. `options.ui = false` disables the default panel. |
| `setLocale(locale?)` | Switches the panel's UI language after `init()` (`'en' \| 'fr' \| 'fi' \| 'auto'`, default `'auto'`). Only rebuilds the panel — active profiles and persisted storage are untouched. No-op if `ui: false` or the resolved locale hasn't changed. |
| `open()` / `close()` | Opens/closes the accessibility panel (throws if `ui: false`). |
| `enable(profileId)` / `disable(profileId)` | Activates/deactivates one profile. |
| `getProfiles()` | Returns the array of currently active profile ids. |
| `on(event, handler)` | Subscribes to `'profileEnabled'`, `'profileDisabled'`, or `'updated'`. Returns an unsubscribe function. |
| `destroy()` | **Uninstalls** the engine — see below. |

Built-in profiles (23), grouped by need:

| Vision | Reading | Cognitive | Motor | Hearing | Sensory | Aging |
| --- | --- | --- | --- | --- | --- | --- |
| `low-vision` | `dyslexia` | `autism` | `motor-disability` | `hearing-impairment` | `migraine` | `senior` |
| `color-blindness` | `reading-difficulties` | `adhd` | `tremor` | | `photosensitive-epilepsy` | |
| `photophobia` | `aphasia` | `cognitive-difficulties` | `keyboard-only` | | `visual-fatigue` | |
| `cataract` | | `cognitive-fatigue` | `voice-command` | | | |
| `macular-degeneration` | | `memory-difficulties` | | | | |
| `tunnel-vision` | | | | | | |

Several profiles compose the same underlying adaptation instead of duplicating it (e.g. 11 profiles share the exact `reducedMotion` rule bundle, 8 share `simplifiedFocus` — see `src/profiles/adaptations.ts`). The `ConflictResolver` picks a deterministic winner by priority tier when active profiles disagree on the same value — e.g. `low-vision`'s contrast boost always wins over `migraine`'s softened contrast (unreadable content is a harder blocker than visual comfort), and `tremor`'s 56px minimum target size always wins over `motor-disability`'s standard 44px. A test (`tests/base-stylesheet-coverage.test.ts`) cross-checks every profile's variables against the stylesheet that renders them, so a new profile can't silently ship an adaptation that never actually applies.

Two profiles are intentionally conservative about what generic CSS can deliver: `hearing-impairment` only styles native `<video>` captions and standard ARIA live regions (it can't know a site's own caption/transcript markup), and `cognitive-difficulties`/`aphasia` expose their `data-awcag-*` attribute for a site owner to hook deeper simplification into, rather than guessing at what's "secondary" content. `photosensitive-epilepsy` is the one profile with a real (bounded, one-shot) side effect beyond CSS: it pauses autoplaying `<video>`/`<audio>` found at activation time.

---

## How to remove

There are two levels of "removing" Adaptive WCAG: removing it at runtime from an already-loaded page, and removing it from your project entirely.

### Automatic runtime uninstall

Call `destroy()`:

```js
AdaptiveWCAG.destroy();
```

This automatically:

- clears every profile's `data-awcag-*` attribute and `--awcag-*` CSS variable from `<html>`;
- removes the injected base stylesheet;
- removes the floating button and panel (and its Shadow DOM) from the page;
- wipes the persisted profile selection from storage, so a future `init()` doesn't bring old profiles back.

`destroy()` is safe to call multiple times and even if `init()` was never called. After `destroy()`, the page is in exactly the state it was in before `init()` ran, and you can call `init()` again to reinstall it cleanly. This is the mechanism to use for SPA route cleanup, feature-flag rollback, or a "disable accessibility toolkit" user action.

### Removing it from your project

1. Call `AdaptiveWCAG.destroy()` (or reload the page) so no residual DOM/storage state is left behind.
2. Remove the import (`import AdaptiveWCAG from 'adaptive-wcag'`) or the `<script>` tag, and the `AdaptiveWCAG.init()` call.
3. Uninstall the package if you installed it via npm:

   ```bash
   npm uninstall adaptive-wcag
   ```

No server-side state, cookies, or background processes are created by this library — everything it does is scoped to the current page's DOM and `localStorage`, so steps 1–3 fully remove it.

---

## Development

```bash
npm install         # install dependencies
npm run build       # build dist/ (ESM, CJS, minified IIFE)
npm run dev         # build in watch mode
npm run typecheck   # TypeScript, no emit
npm test            # run the unit test suite (vitest)
npm run demo        # build, then serve the repo root — open http://localhost:4173/demo/
```

Project layout:

```
src/
  core/       framework-agnostic engine: ProfileManager, AdaptationEngine,
              ConflictResolver, EventBus, StorageAdapter
  profiles/   one file per accessibility profile
  ui/         Shadow DOM panel + injected base stylesheet
  index.ts    public AdaptiveWCAG API
demo/         a static page to manually exercise the library
tests/        vitest unit tests
```

---

## License

MIT
