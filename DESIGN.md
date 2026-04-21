# Design

Why the key decisions in this package were made.

---

## No install-time mutation

`npm install` does not write any files to the consumer project. All patching goes through the explicit `frontend-tooling-init` command.

The reason is reviewability. A `postinstall` script that rewrites `package.json`, creates config files, or modifies `.husky/` is surprising, hard to audit, and breaks idempotency on repeated installs. The init command is opt-in, prints every action it takes, and skips existing files unless forced.

This also means the package is safe to install in projects that are not yet ready to adopt the full setup.

---

## Async lazy-loading for optional plugins

`createEslintConfig` is async and lazy-loads feature-specific config modules (`react.eslint.mjs`, `test.eslint.mjs`, `import.eslint.mjs`) only when that feature is enabled.

The reason is that those modules import optional peer dependencies (`eslint-plugin-react`, `@vitest/eslint-plugin`, `eslint-plugin-import`, etc.). If the module were loaded eagerly at import time, ESLint would throw a `Cannot find module` error for any peer dep the consumer did not install. Lazy-loading means you only need what you actually use.

---

## Optional peer dependencies

Framework-specific ESLint plugins and Prettier plugins are declared as `optionalPeerDependencies`. Consumers install only what their project uses.

A Node.js-only project should not be forced to install `eslint-plugin-react`. A project that does not sort imports should not be forced to install `@trivago/prettier-plugin-sort-imports`. Bundling everything as hard dependencies would bloat the install and pollute the dependency graph with irrelevant packages.

---

## ESLint flat config only (ESLint 9+)

This package only supports the ESLint flat config format. The legacy `eslintrc` format (`eslintrc.json`, `.eslintrc.js`) is not supported.

The `eslintrc` format was deprecated in ESLint 8 and removed in ESLint 9. Building a config package around a deprecated format would mean maintaining two incompatible config paths indefinitely. Flat config is where the ecosystem is going and where new plugins are investing.

---

## Staying on ESLint 9.x (not 10.x)

`eslint` is pinned as a peer dependency at `^9.0.0`. ESLint 10 is not supported yet.

The blocker is `eslint-plugin-import`, which does not yet support ESLint 10 at the time of this writing. Import rules are a meaningful part of the shared config, and dropping them to upgrade ESLint would be a net regression. The constraint will be lifted once `eslint-plugin-import` (or a maintained fork) supports ESLint 10.

This also locks the TypeScript resolver to v3 (`eslint-import-resolver-typescript@^3`). Version 4 of that resolver was redesigned for `eslint-plugin-import-x` and uses a resolver interface incompatible with `eslint-plugin-import` v2. When the time comes to migrate to `import-x`, bumping the resolver to v4 is part of the same move.

---

## Prettier print width at 120

The shared Prettier config uses `printWidth: 120` rather than the Prettier default of 80.

80 characters is a holdover from terminal widths of the 1980s. Modern development happens on wide monitors in wide editors. TypeScript generics, long import paths, and JSX props regularly exceed 80 characters without being meaningfully complex. 120 strikes a better balance: wide enough to avoid excessive line wrapping, narrow enough to read two files side by side on a standard display.

---

## TypeScript strict mode on by default

All three tsconfig presets enable `strict: true` and additional strictness flags (`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`).

Strict mode catches real bugs — unintentional `any` types, missing null checks, implicit returns in branches. The cost of disabling a single overzealous check in a local config is lower than discovering a class of bugs in production because strict mode was off globally. Projects that want to relax a specific check can override just that option in their local `tsconfig.json`.

---

## No `--no-verify` in Husky hooks

The generated `.husky/pre-commit` hook does not include an escape hatch like `|| true` or instructions to use `--no-verify`.

Adding an escape hatch in the template teaches contributors to bypass the hook rather than fix the underlying issue. If the pre-commit hook genuinely needs to be skipped in an emergency, `git commit --no-verify` is always available — it just should not be the documented default.

---

## Monorepo support is not included

The init script and default config patterns target single-root projects. Monorepo setups (Turborepo, Nx, Yarn workspaces) are out of scope.

Monorepos vary too much in structure to handle generically: some use shared root configs, some use per-package configs, some combine both. Adding half-working monorepo support would mean more assumptions and more ways to produce wrong config. The extension points in `createEslintConfig` (`patterns`, `ignores`, `overrides.extraConfigs`) are enough for a monorepo consumer to wire up their own per-package config. Full monorepo support is a future addition, not a current goal.
