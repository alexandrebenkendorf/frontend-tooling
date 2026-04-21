# Prettier

The `prettier` export provides the shared Prettier config and opt-in plugin configs.

## Basic setup

```js
export { default } from '@alexandrebenkendorf/frontend-tooling/prettier';
```

## Overriding settings

Import the shared config and spread your overrides after it:

```js
import baseConfig from '@alexandrebenkendorf/frontend-tooling/prettier';

export default {
  ...baseConfig,
  printWidth: 100,
  singleQuote: false,
};
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
import baseConfig, { ejsConfig } from '@alexandrebenkendorf/frontend-tooling/prettier';

export default { ...baseConfig, ...ejsConfig };
```

## Import sorting (opt-in)

Requires `@trivago/prettier-plugin-sort-imports`:

```sh
npm install -D @trivago/prettier-plugin-sort-imports
```

```js
import baseConfig, { sortImportsConfig } from '@alexandrebenkendorf/frontend-tooling/prettier';

export default { ...baseConfig, ...sortImportsConfig };
```

## Using both plugins together

When combining plugins, merge the `plugins` arrays explicitly to avoid one overwriting the other:

```js
import baseConfig, { ejsConfig, sortImportsConfig } from '@alexandrebenkendorf/frontend-tooling/prettier';

export default {
  ...baseConfig,
  ...ejsConfig,
  ...sortImportsConfig,
  plugins: [...ejsConfig.plugins, ...sortImportsConfig.plugins],
};
```
