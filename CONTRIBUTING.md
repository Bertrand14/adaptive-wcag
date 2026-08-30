# Contributing

Adaptive WCAG is MIT-licensed (see [LICENSE](LICENSE)) and open to contributions — bug reports, profile suggestions, and pull requests are all welcome. It's currently maintained solo, so please open an issue before a large PR (a new framework wrapper, a new integration) to agree on the approach first; small fixes and new profiles can go straight to a PR.

For security vulnerabilities specifically, see [SECURITY.md](SECURITY.md) instead of opening a public issue.

---

## Dev setup

```bash
npm install
npm run build       # build dist/ (ESM, CJS, minified IIFE)
npm run dev          # build in watch mode
npm run typecheck   # TypeScript, no emit
npm test             # run the unit test suite (vitest)
npm run demo         # build, then serve the repo root — open http://localhost:4173/demo/
```

## Project layout

```
src/
  core/       framework-agnostic engine: ProfileManager, AdaptationEngine,
              ConflictResolver, EventBus, StorageAdapter
  i18n/       locale resolution, UI strings, profile translations (en/fr/fi)
  profiles/   one file per accessibility profile
  ui/         Shadow DOM panel + injected base stylesheet
  index.ts    public AdaptiveWCAG API
demo/         a static page to manually exercise the library
tests/        vitest unit tests
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for how these pieces fit together.

## Adding a profile

1. Create `src/profiles/<id>.ts` exporting a `Profile` (see `src/core/types.ts` for the shape). Reuse a bundle from `src/profiles/adaptations.ts` (`reducedMotion`, `simplifiedFocus`, `comfortableSpacing`, `strongerBorders`, `largerTargets`) wherever your profile needs the *exact same value* as an existing one — only write a new `AdaptationRule` when the value genuinely differs.
2. Register it in `src/profiles/index.ts` (both the `defaultProfiles` array, grouped by category, and the named export list).
3. If any rule sets a CSS variable that isn't consumed yet, add the actual CSS to `BASE_STYLESHEET` in `src/ui/base-stylesheet.ts`, and list the profile's id in the right entry of `GATED_VAR_GROUPS`. `tests/base-stylesheet-coverage.test.ts` will fail if a variable your profile sets has no consuming rule or is missing from that map — treat that failure as the mechanism working as intended, not a test to work around.
4. Add translations for `'fr'` and `'fi'` in `src/i18n/profiles.ts` (label + description). `tests/i18n.test.ts` checks every shipped profile has both.
5. Pick the right `PriorityTier` (`safety > accessibility > readability > layout > visual-effects > aesthetics`, see `src/core/types.ts`) for each rule — this decides who wins when your profile is active alongside another one that sets the same variable. When in doubt, look at how a similar existing profile classifies the same kind of adaptation.
6. Run `npm test` and `npm run typecheck` before opening a PR.

## Code style

- TypeScript strict mode (`noUncheckedIndexedAccess` included) — don't add `any` or non-null assertions to work around a type error; fix the underlying type instead.
- No comments unless the *why* is non-obvious (a hidden constraint, a subtle invariant, a workaround). The existing code favours short comments explaining a design decision over ones restating what the code does — match that.
- One profile per file in `src/profiles/`; don't add a second export to an existing profile file for an unrelated concern.
- Keep `docs/project.md` (product vision) and the technical docs (`README.md`, `API.md`, `ARCHITECTURE.md`) in sync with behaviour changes — a PR that changes public behaviour should update the relevant doc in the same PR.

## Before merging

- All tests must pass: `npm test`
- `npm run typecheck` must pass
- Add or update tests for any changed behaviour
- Add a line under `[Unreleased]` in [CHANGELOG.md](CHANGELOG.md)
