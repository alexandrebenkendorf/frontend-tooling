# ESLint

The `eslint` export provides an async flat config builder for ESLint 9+.

## Basic setup

```js
import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
});
```

## Feature toggles

Disable parts of the shared setup you do not need:

```js
export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  includeImport: false, // disable eslint-plugin-import rules
  includeReact: false, // disable React/JSX rules
  includeTest: false, // disable test file rules
});
```

## Test framework rules

Test rules are framework-agnostic by default. Opt into framework-specific rules explicitly:

```js
// Vitest
export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  testFramework: 'vitest',
});

// Jest
export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  testFramework: 'jest',
});
```

## Config naming

Add a suffix to config names to make them easier to identify in ESLint output:

```js
export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  nameSuffix: 'frontend',
});
```

## File patterns

Extend or replace the default file globs:

```js
export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  ignores: ['.generated', 'build-cache'],
  patterns: {
    testTsFiles: ['**/*.{test,spec,vitest}.{ts,tsx}', '**/*.e2e.ts', '**/*.cy.ts'],
    importDevDependencyFiles: ['build/**/*', 'scripts/**/*', 'eslint/**/*', 'playwright.config.ts'],
  },
});
```

Pass `{ replace: true, extend: [] }` to fully replace a default pattern instead of extending it:

```js
export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  patterns: {
    importDevDependencyFiles: {
      replace: true,
      extend: ['build/**/*', 'scripts/**/*'],
    },
  },
});
```

## Import aliases

Replace the default import alias map (`@` → `./src`, `@root` → `.`):

```js
export default await createEslintConfig({
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

Override rules for specific config groups without replacing the entire group:

```js
export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  rules: {
    js: {
      'no-console': 'off',
    },
    ts: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
    react: {
      'react/function-component-definition': 'off',
    },
    test: {
      'vitest/no-disabled-tests': 'off',
    },
  },
});
```

## Extra configs

Append your own flat configs after the shared ones (and before Prettier):

```js
export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  overrides: {
    extraConfigs: [
      {
        files: ['src/generated/**/*'],
        rules: {
          'no-console': 'off',
        },
      },
    ],
    extraIgnores: ['**/generated/**'],
  },
});
```

## EditorConfig

The shared `.editorconfig` is written to the consumer project root by `frontend-tooling-init`. It aligns editor whitespace settings (charset, indentation, line endings, trailing whitespace) with the Prettier config. The initializer skips it if the file already exists unless you pass `--force`.
