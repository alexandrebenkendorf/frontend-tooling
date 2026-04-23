# ESLint

The `eslint` export provides an async flat config builder for ESLint 9+.

## Basic setup

```js
import defineEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
});
```

## Feature toggles

Enable optional rule sets for your project:

```js
export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  includeImport: true, // eslint-plugin-import rules
  includeReact: true, // React/JSX rules
  includeTest: true, // test file rules
});
```

## Test framework rules

Test rules are framework-agnostic by default. Opt into framework-specific rules explicitly:

```js
// Vitest
export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  includeTest: true,
  testFramework: 'vitest',
});

// Jest
export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  includeTest: true,
  testFramework: 'jest',
});
```

## Config naming

Add a suffix to config names to make them easier to identify in ESLint output:

```js
export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  nameSuffix: 'frontend',
});
```

## File patterns

Extend or replace the default file globs:

```js
export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  // string[] replaces the default; { extend } appends to it
  ignores: { extend: ['.generated', 'build-cache'] },
  patterns: {
    testTsFiles: ['**/*.{test,spec,vitest}.{ts,tsx}', '**/*.e2e.ts', '**/*.cy.ts'],
    importDevDependencyFiles: { extend: ['playwright.config.ts'] },
  },
});
```

### `src/`-scoped console rules

`srcJsFiles` and `srcTsFiles` exist to power a two-tier `no-console` policy:

- **Inside `src/`** — stricter rules (e.g. `no-console: error`) applied via `srcJsFiles` / `srcTsFiles`.
- **Outside `src/`** — more permissive rules applied to all files while ignoring `src/` (via `nonSrcIgnores`), so config files, scripts, and test helpers are not blocked.

Override `srcJsFiles` / `srcTsFiles` if your project doesn't follow the conventional `src/` layout:

```js
export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  patterns: {
    srcJsFiles: ['**/app/**/*.{js,jsx,mjs,cjs}'],
    srcTsFiles: ['**/app/**/*.{ts,tsx,mts,cts}'],
    nonSrcIgnores: ['**/node_modules/**', '**/dist/**', '**/app/**'],
  },
});
```

Pass a plain array to fully replace a default, or `{ extend }` to append. All list fields — `patterns.*`, `ignores`, and `importOptions.*` — accept the same shape:

```js
export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  // replace the entire importDevDependencyFiles list
  patterns: {
    importDevDependencyFiles: ['build/**/*', 'scripts/**/*'],
  },
});
```

## Import aliases

Replace the default import alias map (`@` → `./src`, `@root` → `.`):

```js
export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  importOptions: {
    aliasMap: [
      ['@app', './src'],
      ['@server', './server'],
    ],
  },
});
```

## Rule overrides

Each key targets a specific generated config block:

| Key                     | Config block                             |
| ----------------------- | ---------------------------------------- |
| `js`                    | All JavaScript files                     |
| `jsNonSrcConsole`       | JS files outside `src/` (console policy) |
| `jsSrcConsole`          | JS files inside `src/` (console policy)  |
| `ts`                    | All TypeScript files                     |
| `tsNonSrcConsole`       | TS files outside `src/` (console policy) |
| `tsSrcConsole`          | TS files inside `src/` (console policy)  |
| `react`                 | React / JSX files                        |
| `import`                | `eslint-plugin-import` block             |
| `importDevDependencies` | Import devDependencies block             |
| `test`                  | Test files                               |
| `noOnlyTests`           | No-only-tests block                      |

```js
export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  rules: {
    js: { 'no-console': 'off' },
    ts: { '@typescript-eslint/no-explicit-any': 'off' },
    react: { 'react/function-component-definition': 'off' },
    test: { 'vitest/no-disabled-tests': 'off' },
  },
});
```

## Extra configs

Append your own flat configs after the shared ones (and before Prettier):

```js
export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  extraConfigs: [
    {
      files: ['src/generated/**/*'],
      rules: { 'no-console': 'off' },
    },
  ],
});
```

## EditorConfig

The shared `.editorconfig` is written to the consumer project root by `frontend-tooling-init`. It aligns editor whitespace settings (charset, indentation, line endings, trailing whitespace) with the Prettier config. The initializer skips it if the file already exists unless you pass `--force`.
