# Installation

This isn't published to npm or a public CDN yet — see [ROADMAP.md](ROADMAP.md). Until it is, use one of the two options below.

## Option A — git dependency (bundler projects: Vite, webpack, Next, ...)

```bash
npm install git+https://github.com/Bertrand14/adaptive-wcag.git
```

`dist/` is gitignored in this repo (it's a build artifact, not source), so installing straight from GitHub would normally leave you without the files `main`/`module`/`types` point to. The `prepare` script (`package.json`) covers this automatically: npm runs it right after installing a git dependency, which builds `dist/` in place inside `node_modules/adaptive-wcag`. Nothing extra to run — `npm install` is enough.

Pin to a commit or tag for reproducible installs: `git+https://github.com/Bertrand14/adaptive-wcag.git#<commit-or-tag>`.

```js
import AdaptiveWCAG from 'adaptive-wcag';

AdaptiveWCAG.init();
```

## Option B — self-hosted script tag (no build step / static sites)

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

---

## Quick start

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

See [API.md](API.md) for the full option/method reference.

## Using it inside a framework (e.g. React)

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

Don't reach for `destroy()` + `init()` here: `destroy()` uninstalls the engine entirely, including **wiping the visitor's saved profile selection from storage** — so a naive reinit on every language switch would silently reset someone's accessibility settings each time they change the site's language. `setLocale()` exists specifically to avoid that: it only rebuilds the panel's DOM/strings and leaves the engine, active profiles, and storage alone. See [API.md](API.md#setlocalelocale) for details.

---

## Removing it from your project

1. Call `AdaptiveWCAG.destroy()` (or reload the page) so no residual DOM/storage state is left behind — see [API.md](API.md#destroy) for exactly what this reverts.
2. Remove the import (`import AdaptiveWCAG from 'adaptive-wcag'`) or the `<script>` tag, and the `AdaptiveWCAG.init()` call.
3. Uninstall the package if you installed it via npm/git dependency:

   ```bash
   npm uninstall adaptive-wcag
   ```

No server-side state, cookies, or background processes are created by this library — everything it does is scoped to the current page's DOM and `localStorage`, so steps 1–3 fully remove it.
