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
| `@alexandrebenkendorf/frontend-tooling/prettier`             | Shared Prettier config + opt-in plugin configs        |
| `@alexandrebenkendorf/frontend-tooling/lint-staged`          | Shared lint-staged config                             |
| `@alexandrebenkendorf/frontend-tooling/tsconfig/base.json`   | Base TypeScript config (browser + bundler)            |
| `@alexandrebenkendorf/frontend-tooling/tsconfig/node.json`   | TypeScript config for Node.js projects                |
| `@alexandrebenkendorf/frontend-tooling/tsconfig/eslint.json` | TypeScript config scoped to ESLint type-checks        |
| `.editorconfig`                                              | Copied to consumer project by `frontend-tooling-init` |

## Documentation

- [Initializer — flags, defaults, legacy migration](docs/init.md)
- [ESLint — `createEslintConfig` full reference](docs/eslint.md)
- [Prettier — config usage and opt-in plugins](docs/prettier.md)
- [TypeScript — tsconfig usage and overrides](docs/typescript.md)
- [lint-staged — setup and override patterns](docs/lint-staged.md)
- [Design — why the key decisions were made](DESIGN.md)
