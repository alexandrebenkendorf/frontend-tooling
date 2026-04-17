# Changelog

All notable changes to `@alexandrebenkendorf/frontend-tooling` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.2.0] - 2026-04-17

### Changed

- Framework-specific ESLint plugins (`eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `@vitest/eslint-plugin`, `eslint-plugin-jest`) are now optional peer dependencies. Install only what your project uses. See README for per-feature install instructions.
- `@trivago/prettier-plugin-sort-imports` is now an optional peer dependency. Import sorting is no longer enabled by default in the Prettier config. Use the exported `sortImportsConfig` to opt in. See README for details.
- All dependency version ranges now consistently use `^` prefixes.

### Added

- GitHub Actions CI workflow running format check, lint, and pack dry-run on every push and pull request.
- `sortImportsConfig` named export from `@alexandrebenkendorf/frontend-tooling/prettier` for opt-in import sorting.
- `CHANGELOG.md`.

---

## [1.1.0] - 2026-04-17

Initial public release.
