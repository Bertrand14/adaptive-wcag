# Security Policy

## Supported versions

Adaptive WCAG is pre-1.0. Only the latest version on the `main` branch is actively maintained and receives security fixes — there's no back-porting to older commits until a stable 1.0 release policy is defined (see [ROADMAP.md](ROADMAP.md)).

---

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Report security issues privately by email to: **bertrand.tyo@famille-anne.fr**

Please include:

- A description of the vulnerability
- Steps to reproduce it
- The potential impact
- Your name/handle if you wish to be credited

You will receive an acknowledgement within 48 hours.

---

## Security posture

Adaptive WCAG runs entirely client-side and has a deliberately small attack surface:

- **No network requests.** The library never calls out to any server — see [docs/project.md](docs/project.md) and [README.md](README.md).
- **No server-side state.** No backend, no cookies, no analytics, no telemetry.
- **No PII collected.** The only thing persisted is the visitor's own choice of accessibility profiles (an array of built-in ids), stored client-side.
- **DOM writes are limited to `textContent`/attribute APIs.** The panel (`src/ui/Panel.ts`) builds its UI with `document.createElement` and `textContent`; the codebase contains no `innerHTML`, `outerHTML`, `eval`, or `new Function` — translated strings and profile labels can't be interpreted as markup.
- **`AdaptationEngine`** ([ARCHITECTURE.md](ARCHITECTURE.md)) only ever sets a fixed, hardcoded set of `--awcag-*` CSS custom properties and `data-awcag-*` boolean attributes on `<html>`, all sourced from the built-in profile catalog — not from user input.
- **Locale resolution** (`resolveLocale()`, [ARCHITECTURE.md](ARCHITECTURE.md#internationalisation)) reads `navigator.language` but only ever uses it to index into a fixed allowlist (`SUPPORTED_LOCALES`); an unrecognised or malformed value falls back to the default locale rather than being used directly.
- **Pluggable `StorageAdapter`** ([API.md](API.md#initoptions)): if you supply a custom adapter (e.g. to sync profile selection to your own backend), the security of that channel is your integration's responsibility — the library only ever writes a JSON array of known profile ids to it, never arbitrary data.

If you're embedding Adaptive WCAG in a site with a strict Content-Security-Policy, note the panel injects one `<style>` element into `<head>` (`injectBaseStylesheet()`) and renders its UI inside a Shadow DOM `<div>` appended to `document.body` (or your chosen `container`) — no inline event handler attributes, no `unsafe-eval`.
