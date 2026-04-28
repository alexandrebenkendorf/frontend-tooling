# TypeScript

Four tsconfig presets are available depending on the project type.

## Base config (generic)

A strict, generic base with no framework assumptions (no `jsx`, no DOM lib). Extend this for non-React projects or as a foundation for custom configs:

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/base.json",
  "include": ["**/*.ts", "**/*.js", "**/*.mjs", "**/*.cjs"]
}
```

## React config (browser + JSX)

For React projects using a bundler (Vite, webpack, etc.). Adds `jsx: react-jsx` and `lib: ["ESNext", "DOM", "DOM.Iterable"]` on top of the base:

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/react.json",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
```

## Node config

For Node.js tooling files (scripts, config files, etc.):

```json
{
  "extends": "@alexandrebenkendorf/frontend-tooling/tsconfig/node.json",
  "include": ["vite.config.ts", "vite.config.mts", "*.config.ts", "*.config.mts", "scripts/**/*"]
}
```

## ESLint config

For type-aware ESLint linting (`parserOptions.project`). Use project references to cover both app and tooling files:

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.json" }, { "path": "./tsconfig.node.json" }]
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

All presets enable `strict` mode. To relax a specific check, override only that option rather than setting `strict: false`.
