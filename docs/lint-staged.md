# lint-staged

The `lint-staged` export provides a shared lint-staged config that runs ESLint and Prettier on staged files.

## Basic setup

```js
import config from '@alexandrebenkendorf/frontend-tooling/lint-staged';

export default config;
```

Then add the script to `package.json`:

```json
{
  "scripts": {
    "lint-staged": "lint-staged"
  }
}
```

If you use Husky, the pre-commit hook should call:

```sh
npx lint-staged
```

## Extending the shared config

Add rules for file types the shared config does not cover:

```js
import baseConfig from '@alexandrebenkendorf/frontend-tooling/lint-staged';

export default {
  ...baseConfig,
  '*.{css,scss}': 'prettier --write',
};
```

## Replacing a shared entry

Redefine the glob key to replace a shared rule entirely:

```js
import baseConfig from '@alexandrebenkendorf/frontend-tooling/lint-staged';

export default {
  ...baseConfig,
  '*.{js,jsx,mjs,cjs,ejs,ts,tsx,mts,cts}': ['eslint --fix --max-warnings=0', 'prettier --write'],
};
```

## Appending a command to an existing entry

```js
import baseConfig from '@alexandrebenkendorf/frontend-tooling/lint-staged';

export default {
  ...baseConfig,
  '*.{ts,tsx,js,jsx}': [...(baseConfig['*.{js,jsx,mjs,cjs,ejs,ts,tsx,mts,cts}'] ?? []), 'npm run extract-translations'],
};
```

## Running a command once (not per-file)

If a command should run once without receiving staged filenames as arguments, use a function:

```js
import baseConfig from '@alexandrebenkendorf/frontend-tooling/lint-staged';

export default {
  ...baseConfig,
  '{package.json,src/**/*.ts,src/**/*.tsx}': () => 'npm run extract-translations',
};
```
