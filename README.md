# `@alexandrebenkendorf/frontend-tooling`

Shared frontend tooling configs for ESLint, Prettier, and TypeScript.

## Install

```sh
npm install -D @alexandrebenkendorf/frontend-tooling eslint prettier typescript
npx frontend-tooling-init
```

Install only the peer dependencies your config actually uses:

```sh
# React projects
npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-jsx-a11y

# Vitest projects
npm install -D @vitest/eslint-plugin

# Jest projects
npm install -D eslint-plugin-jest

# Import sorting in Prettier (opt-in)
npm install -D @trivago/prettier-plugin-sort-imports

# EJS formatting (opt-in)
npm install -D prettier-plugin-ejs
```

The init command is explicit on purpose. Installing the package does not silently rewrite the consumer repo. Instead, `frontend-tooling-init` patches the current project with the shared setup in a reviewable way.

By default, it:

- updates `package.json` scripts and `devDependencies`
- creates `.editorconfig` if missing
- creates `tsconfig.json` if missing
- creates `tsconfig.eslint.json` if missing
- creates `eslint.config.mjs` if missing
- creates `prettier.config.mjs` if missing
- creates `.prettierignore` if missing
- creates `lint-staged.config.mjs` if missing
- creates `.husky/pre-commit` unless `--skip-husky` is used

Useful options:

```sh
npx frontend-tooling-init --skip-husky
npx frontend-tooling-init --force
```

### Legacy apps

If you are integrating this package into a legacy app with older ESLint setup, Airbnb presets, or existing config files, treat the initializer as a migration helper, not a full replacement.

Recommended flow:

1. Install the package.
2. Run `npx frontend-tooling-init`.
3. Review any skipped files and migration notes from the initializer output.
4. Migrate existing ESLint and TypeScript config intentionally, in phases.

By default, the initializer will not overwrite existing managed config files unless you use `--force`. It also prints migration hints when it detects older ESLint-style setup or existing config files that likely need a manual merge.

Recommended scripts:

```json
{
  "scripts": {
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint-staged": "lint-staged"
  }
}
```

Recommended `lint-staged` setup:

```js
import config from '@alexandrebenkendorf/frontend-tooling/lint-staged';

export default config;
```

Override or extend it by spreading the shared config and adding your own staged file rules:

```js
import baseConfig from '@alexandrebenkendorf/frontend-tooling/lint-staged';

export default {
  ...baseConfig,
  '*.{css,scss}': 'prettier --write',
};
```

If you want to replace one of the shared entries, redefine that glob key:

```js
import baseConfig from '@alexandrebenkendorf/frontend-tooling/lint-staged';

export default {
  ...baseConfig,
  '*.{js,jsx,mjs,cjs,ejs,ts,tsx,mts,cts}': ['eslint --fix --max-warnings=0', 'prettier --write'],
};
```

You can also add project-specific commands such as translation extraction. If you want to append a command to an existing shared file-based rule, extend the array:

```js
import baseConfig from '@alexandrebenkendorf/frontend-tooling/lint-staged';

export default {
  ...baseConfig,
  '*.{ts,tsx,js,jsx}': [...(baseConfig['*.{js,jsx,mjs,cjs,ejs,ts,tsx,mts,cts}'] ?? []), 'npm run extract-translations'],
};
```

If a command should run once and should not receive staged filenames as arguments, use a function:

```js
import baseConfig from '@alexandrebenkendorf/frontend-tooling/lint-staged';

export default {
  ...baseConfig,
  '{package.json,src/**/*.ts,src/**/*.tsx}': () => 'npm run extract-translations',
};
```

Then add the script:

```json
{
  "scripts": {
    "lint-staged": "lint-staged"
  }
}
```

If you use Husky, a simple pre-commit hook can call:

```sh
npx lint-staged
```

## Exports

- `@alexandrebenkendorf/frontend-tooling/eslint`
- `@alexandrebenkendorf/frontend-tooling/lint-staged`
- `@alexandrebenkendorf/frontend-tooling/prettier`
- `@alexandrebenkendorf/frontend-tooling/tsconfig/base.json`
- `@alexandrebenkendorf/frontend-tooling/tsconfig/eslint.json`
- `@alexandrebenkendorf/frontend-tooling/tsconfig/node.json`
- `.editorconfig` (copied to the consumer project by `frontend-tooling-init`)

## ESLint

```js
import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
});
```

`createEslintConfig` also supports feature toggles, naming, file pattern overrides, import alias configuration, rule overrides, and extra flat configs.

Test rules are framework-agnostic by default. If you use Vitest or Jest, opt into the framework-specific rules explicitly with `testFramework: 'vitest'` or `testFramework: 'jest'`.

Disable parts of the shared setup:

```js
import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  includeImport: false,
  includeReact: false,
  includeTest: false,
});
```

Enable Vitest-specific test rules:

```js
import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  testFramework: 'vitest',
});
```

Enable Jest-specific test rules:

```js
import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  testFramework: 'jest',
});
```

Add a suffix to config names so they are easier to identify in ESLint output:

```js
import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  nameSuffix: 'frontend',
});
```

Extend default ignore patterns and test file globs:

```js
import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

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

Replace the default import aliases:

```js
import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

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

Override rules for specific config groups:

```js
import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

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

Append your own flat configs after the shared ones:

```js
import createEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

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
  },
});
```

## EditorConfig

The shared `.editorconfig` is written to the consumer project root by `frontend-tooling-init`. It aligns editor whitespace settings (charset, indentation, line endings, trailing whitespace) with the Prettier config.

If your project already has an `.editorconfig`, the initializer will skip it unless you pass `--force`.

## Prettier

```js
export { default } from '@alexandrebenkendorf/frontend-tooling/prettier';
```

Override any settings by importing the shared config and spreading your changes after it.

```js
import baseConfig from '@alexandrebenkendorf/frontend-tooling/prettier';

export default {
  ...baseConfig,
  printWidth: 100,
  singleQuote: false,
};
```

### EJS formatting (opt-in)

EJS template formatting via `prettier-plugin-ejs` is not included by default. Enable it by installing the package and using the exported `ejsConfig`:

```sh
npm install -D prettier-plugin-ejs
```

```js
import baseConfig, { ejsConfig } from '@alexandrebenkendorf/frontend-tooling/prettier';

export default { ...baseConfig, ...ejsConfig };
```

### Import sorting (opt-in)

Import sorting via `@trivago/prettier-plugin-sort-imports` is not included by default. Enable it by installing the package and using the exported `sortImportsConfig`:

```sh
npm install -D @trivago/prettier-plugin-sort-imports
```

```js
import baseConfig, { sortImportsConfig } from '@alexandrebenkendorf/frontend-tooling/prettier';

export default { ...baseConfig, ...sortImportsConfig };
```

To use both together:

```js
import baseConfig, { ejsConfig, sortImportsConfig } from '@alexandrebenkendorf/frontend-tooling/prettier';

export default {
  ...baseConfig,
  ...ejsConfig,
  ...sortImportsConfig,
  plugins: [...ejsConfig.plugins, ...sortImportsConfig.plugins],
};
```

## TypeScript

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/base.json",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
```

For Node-focused projects, extend the Node config instead.

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/node.json"
}
```

For ESLint-specific type-checking projects, extend the ESLint config.

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/eslint.json"
}
```

You can still override compiler options in your local config after extending it.

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "dist",
    "types": ["node"]
  },
  "include": ["scripts/**/*.ts", "vite.config.ts"]
}
```
