# Roadmap

## In progress / next

### npm publication
The library isn't published to npm or a public CDN yet. In the meantime it's installable via a git dependency (the `prepare` script builds `dist/` automatically) or by self-hosting the built bundle — see [INSTALL.md](INSTALL.md). Publishing to npm properly is the next packaging milestone.

### Official React and Vue wrappers
The core is framework-agnostic by design (it only ever touches `<html>`, never component-owned DOM — see [ARCHITECTURE.md](ARCHITECTURE.md)), so it already works inside any framework via a lifecycle hook. Dedicated wrappers (`useAdaptiveWCAG()` for React, a Vue plugin) would remove that bit of boilerplate for the two most common cases.

### A fuller, documented demo
`demo/` currently exercises the library manually. Expanding it into a documented showcase (each profile demoed individually, conflict-resolution examples, a locale switcher) would make the effect of each profile easier to evaluate without reading the source.

---

## Planned

### WordPress and Laravel integrations
Drop-in packages (a WordPress plugin, a Laravel/Blade helper) so non-JS-bundler projects can add the toolkit without hand-writing the `<script>` tag from [INSTALL.md](INSTALL.md#option-b--self-hosted-script-tag-no-build-step--static-sites).

### Deeper API docs and usage examples
[API.md](API.md) covers the method/option surface; more worked examples (custom `StorageAdapter` backed by a user account, a fully custom UI driven by `{ ui: false }` + events) are planned as real integrations surface real questions.

### End-to-end tests for the demo
The unit test suite (`npm test`) covers the engine, profiles, and i18n thoroughly; the demo page itself has no automated coverage yet.

---

## Long-term

### Accessibility analytics/reporting API
Expose aggregate, privacy-respecting insight into which profiles get activated on a site (opt-in, and without collecting anything beyond what's already needed to apply the profiles) — useful for a site owner deciding which adaptations matter most to their actual visitors.

### Developer tools and community profiles
A way to author, validate, and share custom profiles beyond the 23 built-in ones, plus tooling to check a custom profile against the same coverage guarantees the built-in catalog has (`tests/base-stylesheet-coverage.test.ts`).

---

## Completed

See [CHANGELOG.md](CHANGELOG.md) for the full history of what has shipped.

Highlights:
- ✅ Core engine: `ProfileManager`, `AdaptationEngine`, `ConflictResolver` with deterministic priority-tier conflict resolution
- ✅ 23 built-in profiles across 7 categories, with shared adaptation bundles to avoid duplicated rules
- ✅ Accessible default UI: Shadow-DOM panel with focus trapping, `Escape` to close, focus restoration
- ✅ Persistence via a pluggable `StorageAdapter` (`localStorage` by default)
- ✅ Full reversibility (`destroy()`) and idempotent `init()`
- ✅ Internationalisation: English/French/Finnish UI strings and profile translations, resolved from `navigator.language`
- ✅ `setLocale()` to follow a host site's own language switch without resetting a visitor's saved profiles
- ✅ Git-dependency install path (`prepare` script builds `dist/` automatically)
- ✅ Full documentation suite (README, API, ARCHITECTURE, INSTALL, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, CHANGELOG, ROADMAP, DEPLOYMENT)

---

## Out of scope (for now)

- **A hosted, official CDN build** before an npm release exists — self-hosting or a git dependency covers the immediate need (see [INSTALL.md](INSTALL.md)).
- **Server-side rendering support beyond graceful no-ops.** The library already degrades safely outside a browser (`resolveLocale()`, `LocalStorageAdapter` both fall back cleanly), but there's no plan for an SSR-specific API — it's a client-side, post-hydration concern by nature.
