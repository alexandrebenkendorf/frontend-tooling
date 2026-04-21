# Initializer

`frontend-tooling-init` patches a consumer project with the shared setup. It is explicit by design — nothing is written on install.

## Usage

```sh
npx frontend-tooling-init
```

## What it creates

By default the initializer:

- updates `package.json` scripts and `devDependencies`
- creates `.editorconfig` if missing
- creates `tsconfig.json` if missing
- creates `tsconfig.eslint.json` if missing
- creates `eslint.config.mjs` if missing
- creates `prettier.config.mjs` if missing
- creates `.prettierignore` if missing
- creates `lint-staged.config.mjs` if missing
- creates `.husky/pre-commit` unless `--skip-husky` is used

Existing files are **skipped** unless `--force` is passed. The initializer prints a notice for any file it skips so you can merge the shared setup manually.

## Flags

```sh
npx frontend-tooling-init --dry-run
npx frontend-tooling-init --force
npx frontend-tooling-init --skip-husky
npx frontend-tooling-init --yes
```

All interactive prompts can be answered non-interactively:

```sh
npx frontend-tooling-init --react --test=vitest --prettier-sort-imports
npx frontend-tooling-init --no-react --test=jest
npx frontend-tooling-init --yes  # accept all defaults silently
```

| Flag                                                     | Description                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| `--dry-run`                                              | Preview what would be created or updated without writing any files |
| `--force`                                                | Overwrite existing managed config files                            |
| `--skip-husky`                                           | Skip Husky pre-commit hook setup                                   |
| `--yes` / `-y`                                           | Accept all prompt defaults non-interactively                       |
| `--react` / `--no-react`                                 | Enable or disable React ESLint config                              |
| `--test=vitest\|jest\|none`                              | Set the test framework for ESLint rules                            |
| `--prettier-sort-imports` / `--no-prettier-sort-imports` | Enable or disable import sorting                                   |
| `--prettier-ejs` / `--no-prettier-ejs`                   | Enable or disable EJS formatting                                   |

## Legacy apps

If the target project has older ESLint setup (eslintrc files, Airbnb presets) or existing config files, treat the initializer as a migration helper rather than a full replacement.

Recommended flow:

1. Install the package.
2. Run `npx frontend-tooling-init --dry-run` to preview changes.
3. Run `npx frontend-tooling-init` to apply changes for files that do not yet exist.
4. Review any skipped files and migration notes printed by the initializer.
5. Migrate existing ESLint and TypeScript config intentionally, in phases.
6. Use `--force` selectively once you are ready to replace a specific managed file.

The initializer prints a migration notice when it detects older ESLint dependencies (`eslint-config-airbnb`, `babel-eslint`, `@babel/eslint-parser`, etc.) so you can plan the transition.
