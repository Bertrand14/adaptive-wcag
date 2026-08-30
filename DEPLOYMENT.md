# Deployment / Release Guide

Adaptive WCAG is a client-side library, not a hosted application — there's no server to deploy. This document covers how a *maintainer* ships a new version; see [INSTALL.md](INSTALL.md) for how *consumers* get it into their project.

## Prerequisites

- Node.js (see `package.json` / `tsup.config.ts` for the target — `ES2020`)
- Write access to the [GitHub repo](https://github.com/Bertrand14/adaptive-wcag)
- An npm account with publish rights, once npm publishing is enabled (see [ROADMAP.md](ROADMAP.md))

## 1. Build and verify

```bash
npm install
npm run typecheck
npm test
npm run build
```

`npm run build` (`tsup`) produces, from the single `src/index.ts` entry:

| File | Purpose |
| --- | --- |
| `dist/index.js` + `dist/index.d.ts` | ESM, for bundler consumers |
| `dist/index.cjs` + `dist/index.d.cts` | CJS, for `require()` consumers |
| `dist/adaptive-wcag.min.js` | Minified IIFE, global `window.AdaptiveWCAG`, for plain `<script>` tags |

`dist/` is gitignored — it's never committed, only built (locally, by CI once one exists, or via the `prepare` script for git-dependency consumers — see [INSTALL.md](INSTALL.md)).

## 2. Update the changelog

Move the relevant entries from `[Unreleased]` in [CHANGELOG.md](CHANGELOG.md) under a new `## [x.y.z] — YYYY-MM-DD` heading, matching the version you're about to set.

## 3. Bump the version

```bash
npm version patch   # or minor / major
```

Pre-1.0 (current state), treat `minor` bumps as the ones that may carry breaking changes to the public API in `src/index.ts` — semver's own pre-1.0 convention — and document any of those explicitly in the changelog entry.

## 4. Tag and push

```bash
git push origin main --follow-tags
```

## 5. Publish to npm (once enabled)

```bash
npm publish --access public
```

`package.json`'s `files` (`["dist"]`) and `exports` map are already configured so only `dist/` ships in the published tarball. Until this step is actually enabled, git-dependency and self-hosted installs (see [INSTALL.md](INSTALL.md)) remain the supported distribution channels — this section documents the process so it's a non-event whenever that changes.

## 6. Self-hosted consumers

There's no CDN or auto-update path for a self-hosted `dist/adaptive-wcag.min.js` (see [INSTALL.md — Option B](INSTALL.md#option-b--self-hosted-script-tag-no-build-step--static-sites)): each site that copied the bundle in needs to re-run `npm run build` against the new tag and redeploy the copy itself. Mention this in the release notes if a fix is security-relevant (see [SECURITY.md](SECURITY.md)).

## Demo

`npm run demo` builds the library and serves the repo root (`npx serve . -l 4173`) so `demo/` can exercise the latest build at `http://localhost:4173/demo/`. There's no automated deployment of the demo to a public URL yet (see [ROADMAP.md](ROADMAP.md)).
