# Changelog

All notable changes to `@alexandrebenkendorf/frontend-tooling` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [2.1.0] - 2026-04-28

### Breaking changes

- **`tsconfig/base.json` no longer includes `jsx: react-jsx` or DOM libs.** It is now a strict generic base with no framework assumptions (`lib: ["ESNext"]` only). If your project extends `base.json` and relies on React JSX or DOM types, switch to the new `tsconfig/react.json`:
  ```json
  {
    "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/react.json"
  }
  ```

### Added

- **`tsconfig/react.json`** — new preset extending `base.json` with `jsx: react-jsx` and `lib: ["ESNext", "DOM", "DOM.Iterable"]`. Exported as `@alexandrebenkendorf/frontend-tooling/tsconfig/react.json`.
- **`frontend-tooling-init` now generates `tsconfig.node.json`** alongside `tsconfig.json`, covering tooling files (`vite.config.ts`, `*.config.ts`, `scripts/**/*`).
- **`frontend-tooling-init` now generates a project-references `tsconfig.eslint.json`** (`files: [], references: [...]`) instead of a config that extends `tsconfig.json` directly.
- **`frontend-tooling-init` selects `tsconfig/react.json` or `tsconfig/base.json`** for the generated `tsconfig.json` based on the react prompt answer.

### Fixed

- React ESLint config now applies rules to `.jsx` and `.js` files in addition to `.tsx` and `.ts`.
- Removed `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-import`, and `eslint-config-prettier` from the legacy dependency detection list — these are valid modern dependencies and should not trigger a migration warning.

---

## [2.0.0] - 2026-04-23

### Breaking changes

- **`createEslintConfig` renamed to `defineEslintConfig`** — aligns with the `defineConfig` convention from Vite/Rsbuild. Update your import:
  ```js
  // before
  import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';
  // after
  import defineEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';
  ```
- **`overrides` option removed from `defineEslintConfig`.** Migrate as follows:
  - `overrides.extraConfigs` → root `extraConfigs`
  - `overrides.extraIgnores` → `ignores: { extend: [...] }`
- **All list fields now accept `ListOption<T>`** (`T[] | { extend?: T[]; replace?: boolean }`).  
  Previously, passing a `string[]` to `ignores` already replaced the default; this is unchanged.  
  The `{ extend }` shape is new and now the recommended way to append without discarding defaults.
- **`includeImport`, `includeReact`, `includeTest` now default to `false`** — these feature flags are now opt-in. Previously they defaulted to `true`, requiring `false` to disable. Update your config to explicitly enable the ones you use:
  ```js
  // before (relied on defaults)
  export default await defineEslintConfig({ project: [...], tsconfigRootDir: ... });
  // after (explicit opt-in)
  export default await defineEslintConfig({
    project: [...],
    tsconfigRootDir: ...,
    includeImport: true,
    includeReact: true,
    includeTest: true,
    testFramework: 'vitest',
  });
  ```
- **`prettier` export no longer exports `baseConfig`, `ejsConfig`, or `sortImportsConfig`** — these are now internal implementation details. Remove any imports of these named exports and migrate to `definePrettierConfig`:
  ```js
  // before
  import baseConfig, { ejsConfig, sortImportsConfig } from '@alexandrebenkendorf/frontend-tooling/prettier';
  export default { ...baseConfig, ...ejsConfig, ...sortImportsConfig };
  // after
  import definePrettierConfig from '@alexandrebenkendorf/frontend-tooling/prettier';
  export default definePrettierConfig({ ejs: true, sortImports: true });
  ```

### Added

- **`definePrettierConfig(options?)`** — new builder function exported as the default from `prettier`. Pass `ejs: true` and/or `sortImports: true` to enable the corresponding plugins. Any other keys are treated as Prettier overrides. Plugin configs (`ejsConfig`, `sortImportsConfig`, `baseConfig`) are now internal implementation details and no longer exported.
- **`DefinePrettierConfigOptions` type exported** from `prettier`.
- **`ListOption<T>` type exported** from `eslint/defineEslintConfig.d.mts` for use in consumer wrappers.
- **`RulesOverrides` interface exported** — replaces the previous untyped `Linter.RulesRecord` for `rules`, exposing all named per-group keys (`js`, `ts`, `react`, `test`, `import`, `jsNonSrcConsole`, etc.).
- `importOptions.resolverExtensions`, `importOptions.aliasExtensions`, and `importOptions.aliasMap` now accept `ListOption<T>` (previously only plain arrays).

---

## [1.4.4] - 2026-04-22

### Fixed

- Added a dedicated `^@/(.*)$` import-order group ahead of `^~/(.*)$` in the shared Prettier `sortImportsConfig`, so `@/` aliases sort before `~/` aliases.

---

## [1.4.3] - 2026-04-21

### Fixed

- Removed `.ejs` from `jsFiles` and `srcJsFiles` patterns — EJS template syntax is invalid JS and caused parse errors. Added `**/*.ejs` to `DEFAULT_IGNORES` so ESLint skips all `.ejs` files by default.

---

## [1.4.2] - 2026-04-21

### Fixed

- Moved `typescript-eslint` from `dependencies` to `peerDependencies` so npm hoists `@typescript-eslint/parser` to the consumer's root `node_modules`, fixing a `parser not found` error caused by `eslint-plugin-import` using CJS `require()` which cannot traverse nested `node_modules`.
- Added test file patterns (`**/*.test.ts`, `**/*.spec.ts`, etc.) and `coverage` to the `exclude` list in `tsconfig/base.json` so consumer production builds do not include test files by default.
- Added `typescript-eslint` to the required peer dependencies injected by `frontend-tooling-init`.

---

## [1.4.1] - 2026-04-21

### Fixed

- Downgraded `eslint-import-resolver-typescript` from `^4` to `^3`. Version 4 was redesigned for `eslint-plugin-import-x` and uses a resolver interface that `eslint-plugin-import` v2 does not support, causing a `typescript with invalid interface loaded as resolver` error at lint time.

---

## [1.4.0] - 2026-04-21

### Added

- `--dry-run` flag for `frontend-tooling-init`: previews what would be created or updated without writing any files.
- Non-interactive CLI flags for `frontend-tooling-init`: `--react`/`--no-react`, `--test=vitest|jest|none`, `--prettier-sort-imports`/`--no-prettier-sort-imports`, `--prettier-ejs`/`--no-prettier-ejs`. Any pre-set flag skips its interactive prompt.
- Type declarations (`.d.mts`) for the `prettier` and `lint-staged` package exports.
- 25 BDD-style Vitest specs covering `detect`, `eslintConfig`, `prettier`, `tsconfig`, and `lintStaged` ensure modules.
- 27 additional specs covering `createEslintConfig` output shape and lazy-loading behaviour, ESLint helper functions (`createConfigName`, `resolveListOption`, `mergeRules`), and `createWriters` write logic (skip, dry-run, create, update).
- `npm test` script running Vitest.
- `DESIGN.md` explaining the rationale behind key decisions (no install-time mutation, async lazy-loading, optional peer deps, flat config, ESLint 9.x, print width, strict TypeScript, no `--no-verify`, monorepo scope).
- `docs/` folder with dedicated pages for the initializer, ESLint, Prettier, TypeScript, and lint-staged.

### Changed

- `frontend-tooling-init` now detects pre-existing config files before performing any writes, so the migration notice accurately reflects files that existed before the run rather than files created during it.
- Interactive prompts replaced with `@clack/prompts` for a cleaner terminal UI.
- `engines.node` tightened to `>=22.0.0` (Node 20 is EOL).
- CI and publish workflows bumped to Node 22; `NODE_AUTH_TOKEN` scoped to the publish step only.
- Test step added to both CI and publish workflows.
- Spec files moved to `tests/` so they are excluded from the published package.
- README split into a concise quick-start front door; full reference content moved to `docs/`.

### Fixed

- Removed the redundant `max-len` ESLint rule (`code: 200`) from shared runtime rules — Prettier already enforces the print width.
- Removed dead `createManagedFileWriter` export from `scripts/lib/fs.mjs`.

---

## [1.3.1] - 2026-04-18

### Changed

- Expanded the shared test and dev-only file globs to cover colocated `*.bench.*`, `*.e2e.*`, `*.cy.*`, and `*.test-utils.*` files consistently, preventing false `import/no-extraneous-dependencies` errors in consumer repos.

---

## [1.3.0] - 2026-04-18

### Fixed

- Awaited the async test config builder in `createEslintConfig` so consumer ESLint loads no longer fail with `TypeError: testConfigs is not iterable`.

### Changed

- Bumped the shared tooling dependency ranges, including `typescript` 6 support and newer optional ESLint/Prettier peer versions, while keeping `eslint` on 9.x because `eslint-plugin-import` does not yet support ESLint 10.

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
