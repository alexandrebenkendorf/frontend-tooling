# TypeScript

Three tsconfig presets are available depending on the project type.

## Base config (browser + bundler)

For frontend projects using a bundler (Vite, webpack, etc.):

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/base.json",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
```

## Node config

For Node.js projects or scripts:

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/node.json"
}
```

## ESLint config

For type-aware ESLint linting (`parserOptions.project`). Extend this in `tsconfig.eslint.json` at the project root:

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/eslint.json"
}
```

## Overriding compiler options

Add `compilerOptions` after `extends` to override specific settings:

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

All three presets enable `strict` mode. To relax a specific check, override only that option rather than setting `strict: false`.
