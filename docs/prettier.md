# Prettier

The `prettier` export provides `definePrettierConfig` — the recommended way to compose the shared base with opt-in plugins and your own overrides.

## Basic setup

```js
import definePrettierConfig from '@alexandrebenkendorf/frontend-tooling/prettier';

export default definePrettierConfig();
```

## `definePrettierConfig`

Starts from the shared base config and applies your options. Pass `ejs: true` and/or `sortImports: true` to enable the corresponding plugins. Any other keys are treated as Prettier overrides applied last.

```js
import definePrettierConfig from '@alexandrebenkendorf/frontend-tooling/prettier';

export default definePrettierConfig({ printWidth: 80 });
```

With plugins:

```js
import definePrettierConfig from '@alexandrebenkendorf/frontend-tooling/prettier';

export default definePrettierConfig({ ejs: true, sortImports: true });
```

## Default settings

| Option                   | Value      |
| ------------------------ | ---------- |
| `printWidth`             | `120`      |
| `semi`                   | `true`     |
| `singleQuote`            | `true`     |
| `jsxSingleQuote`         | `false`    |
| `trailingComma`          | `'es5'`    |
| `tabWidth`               | `2`        |
| `useTabs`                | `false`    |
| `bracketSpacing`         | `true`     |
| `bracketSameLine`        | `false`    |
| `arrowParens`            | `'always'` |
| `singleAttributePerLine` | `true`     |

## EJS formatting (opt-in)

Requires `prettier-plugin-ejs`:

```sh
npm install -D prettier-plugin-ejs
```

```js
import definePrettierConfig from '@alexandrebenkendorf/frontend-tooling/prettier';

export default definePrettierConfig({ ejs: true });
```

## Import sorting (opt-in)

Requires `@trivago/prettier-plugin-sort-imports`:

```sh
npm install -D @trivago/prettier-plugin-sort-imports
```

```js
import definePrettierConfig from '@alexandrebenkendorf/frontend-tooling/prettier';

export default definePrettierConfig({ sortImports: true });
```

## Using both plugins together

```js
import definePrettierConfig from '@alexandrebenkendorf/frontend-tooling/prettier';

export default definePrettierConfig({ ejs: true, sortImports: true });
```
