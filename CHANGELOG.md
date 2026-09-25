# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- `AdaptiveWCAG.loadDyslexiaFont(url?)` — loads OpenDyslexic (jsDelivr by default, or your own self-hosted stylesheet) so the Dyslexia profile's font swap actually renders instead of silently falling back to `Comic Sans MS`/sans-serif; opt-in since it's the only thing the library would otherwise fetch from a third party (see [API.md](API.md#loaddyslexiafonturl))
- Internationalisation: English/French/Finnish UI strings and profile translations, resolved from `navigator.language` (`resolveLocale()`, `getUiStrings()`, `translateProfile()` — see [ARCHITECTURE.md](ARCHITECTURE.md#internationalisation))
- `AdaptiveWCAG.setLocale(locale?)` — switches the panel's UI language after `init()` without resetting active profiles or persisted storage, for sites whose own locale can change after load (see [API.md](API.md#setlocalelocale))
- Git-dependency install path: a `prepare` script builds `dist/` automatically when installed via `npm install git+https://...`, ahead of an eventual npm publish (see [INSTALL.md](INSTALL.md))
- Full documentation suite: `API.md`, `ARCHITECTURE.md`, `INSTALL.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `ROADMAP.md`, `DEPLOYMENT.md`, `LICENSE` — `README.md` trimmed down to an entry point linking out to these

### Changed
- Local work-in-progress notes (`TODO.md`, `FIXME.md`) moved out of git into a gitignored `documents/` directory; `TODO.md`'s public-facing items now live in [ROADMAP.md](ROADMAP.md) instead

---

## [0.1.0] — 2026-07-01

### Added
- Core engine: `ProfileManager`, `AdaptationEngine`, `ConflictResolver` with deterministic priority-tier conflict resolution (`safety > accessibility > readability > layout > visual-effects > aesthetics`)
- 23 built-in accessibility profiles across 7 categories (vision, reading, cognitive, motor, hearing, sensory, aging), with shared adaptation bundles (`reducedMotion`, `simplifiedFocus`, `comfortableSpacing`, `strongerBorders`, `largerTargets`) to avoid duplicated rules
- Default UI: floating button + panel rendered in a Shadow DOM, with focus trapping, `Escape` to close, and focus restoration
- Persistence via a pluggable `StorageAdapter` interface, with a `localStorage`-backed default that falls back to an in-memory map when unavailable
- Full reversibility (`destroy()`) and idempotent `init()`
- `EventBus` (`'updated'`, `'profileEnabled'`, `'profileDisabled'`) for reacting to state changes without coupling to the UI
- Base stylesheet with a coverage test (`tests/base-stylesheet-coverage.test.ts`) ensuring every profile's CSS variables are actually consumed
