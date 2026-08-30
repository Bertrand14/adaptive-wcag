# Adaptive WCAG

> An intelligent accessibility engine that automatically adapts any website to the user's needs.

Instead of exposing dozens of technical toggles (font size, contrast, spacing...), Adaptive WCAG asks one question — *"What are your accessibility needs?"* — and applies the right combination of adaptations for you. See [docs/project.md](docs/project.md) for the full product vision.

**Status:** early-stage MVP. The core engine, 23 profiles, the default UI (grouped by category), persistence, and i18n (en/fr/fi) are implemented and tested. Framework wrappers (React, Vue, ...) are on the [roadmap](ROADMAP.md), not built yet — the vanilla core works in any framework today via a lifecycle hook, just without a dedicated adapter.

---

## Features

- **Profile-based**, not setting-based: users pick a need, not a list of CSS properties.
- **Framework-agnostic core**: manipulates only `<html>` (data attributes + CSS custom properties), so it survives React/Vue/etc. re-renders instead of fighting them.
- **Deterministic conflict resolution**: when two active profiles disagree, a priority tier decides the winner.
- **Persistent**: active profiles are restored automatically on the next visit, via a pluggable storage adapter.
- **Accessible UI out of the box**: floating button + panel, rendered in a Shadow DOM, with focus trapping, `Escape` to close, and focus restoration.
- **Internationalised**: English/French/Finnish, following either `navigator.language` or a host site's own locale switch.
- **Fully reversible**: `AdaptiveWCAG.destroy()` removes every trace the library added, restoring the page to its pre-`init()` state.

See [ARCHITECTURE.md](ARCHITECTURE.md) for how these pieces fit together.

---

## Quick start

Not yet published to npm — see [INSTALL.md](INSTALL.md) for the two ways to get it into a project today (git dependency or self-hosted bundle).

```js
import AdaptiveWCAG from 'adaptive-wcag';

AdaptiveWCAG.init();               // default UI + all built-in profiles

AdaptiveWCAG.enable('dyslexia');
AdaptiveWCAG.getProfiles();        // -> ['dyslexia']

AdaptiveWCAG.on('updated', ({ activeProfiles }) => {
  console.log('active profiles:', activeProfiles);
});
```

The full method/option reference — including `setLocale()` for following a host site's own language switch, and everything `destroy()` reverts — is in [API.md](API.md).

---

## Documentation

| Doc | Covers |
| --- | --- |
| [INSTALL.md](INSTALL.md) | Getting the library into a project, quick start, framework usage, removing it |
| [API.md](API.md) | Full method/option reference, events, built-in profile catalog |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the engine, conflict resolution, i18n, and UI fit together |
| [docs/project.md](docs/project.md) | Product vision and philosophy |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Dev setup, project layout, adding a new profile |
| [SECURITY.md](SECURITY.md) | Security posture, reporting a vulnerability |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community standards |
| [ROADMAP.md](ROADMAP.md) | What's planned, in progress, and shipped |
| [CHANGELOG.md](CHANGELOG.md) | Notable changes by version |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Release process (for maintainers) |

---

## License

[MIT](LICENSE)
