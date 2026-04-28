# `@alexandrebenkendorf/frontend-tooling`

Shared frontend tooling configs for ESLint, Prettier, and TypeScript.

## Quick start

```sh
npm install -D @alexandrebenkendorf/frontend-tooling eslint prettier typescript typescript-eslint
npx frontend-tooling-init
```

The init command patches the project interactively and in a reviewable way. It does not silently rewrite files on install. See [docs/init.md](docs/init.md) for all flags, defaults, and the legacy migration flow.

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

## Exports

| Export                                                       | Purpose                                               |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| `@alexandrebenkendorf/frontend-tooling/eslint`               | Async ESLint flat config builder                      |
| `@alexandrebenkendorf/frontend-tooling/prettier`             | `definePrettierConfig` builder with opt-in plugins    |
| `@alexandrebenkendorf/frontend-tooling/lint-staged`          | Shared lint-staged config                             |
| `@alexandrebenkendorf/frontend-tooling/tsconfig/base.json`   | Base TypeScript config (strict, generic, no jsx/DOM)  |
| `@alexandrebenkendorf/frontend-tooling/tsconfig/react.json`  | TypeScript config for React projects (jsx + DOM)      |
| `@alexandrebenkendorf/frontend-tooling/tsconfig/node.json`   | TypeScript config for Node.js projects                |
| `@alexandrebenkendorf/frontend-tooling/tsconfig/eslint.json` | TypeScript config scoped to ESLint type-checks        |
| `.editorconfig`                                              | Copied to consumer project by `frontend-tooling-init` |

## Documentation

- [Initializer — flags, defaults, legacy migration](docs/init.md)
- [ESLint — `defineEslintConfig` full reference](docs/eslint.md)
- [Prettier — `definePrettierConfig` builder](docs/prettier.md)
- [TypeScript — tsconfig usage and overrides](docs/typescript.md)
- [lint-staged — setup and override patterns](docs/lint-staged.md)
- [Design — why the key decisions were made](DESIGN.md)

## Usage examples

### TypeScript

React project (`tsconfig.json`):

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/react.json",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
```

Tooling files (`tsconfig.node.json`):

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/node.json",
  "include": ["vite.config.ts", "*.config.ts", "scripts/**/*"]
}
```

ESLint type-checking (`tsconfig.eslint.json`):

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.json" }, { "path": "./tsconfig.node.json" }]
}
```

Non-React project uses `tsconfig/base.json` instead of `tsconfig/react.json`. See [docs/typescript.md](docs/typescript.md) for overrides.

### ESLint

```js
// eslint.config.mjs
import defineEslintConfig from '@alexandrebenkendorf/frontend-tooling/eslint';

export default await defineEslintConfig({ includeReact: true, testFramework: 'vitest' });
```

### Prettier

```js
// prettier.config.mjs
import definePrettierConfig from '@alexandrebenkendorf/frontend-tooling/prettier';

export default definePrettierConfig({ sortImports: true });
```

### lint-staged

```js
// lint-staged.config.mjs
export { default } from '@alexandrebenkendorf/frontend-tooling/lint-staged';
```
