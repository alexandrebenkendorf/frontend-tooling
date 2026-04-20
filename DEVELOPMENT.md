# Development Guide

Contributor guide for `@alexandrebenkendorf/frontend-tooling`, the source repository for the published tooling package.

This repository is not an app repo. Most changes here affect exported configs consumed by other projects, so default to generic, reusable behavior and documented extension points.

---

## Quick Links

- [Package README](./README.md) - Consumer-facing install and usage docs
- [Commit Conventions](#commit-conventions)
- [Package Workflow](#package-workflow)
- [Published Surface](#published-surface)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Contributor Tooling](#contributor-tooling)

---

## Package Workflow

When working in this repo:

- prefer generic defaults over repo-specific assumptions
- expose extension points instead of hardcoding consumer behavior
- update `README.md` when the public API changes
- verify package shape whenever exports or published files change

Recommended verification commands:

```bash
npm i
npm run format:check
npm run lint
npm pack --dry-run --cache /tmp/frontend-tooling-npm-cache
```

Recommended consumer setup flow:

```bash
npm install -D @alexandrebenkendorf/frontend-tooling eslint prettier typescript
npx frontend-tooling-init
```

Useful contributor scripts:

```bash
npm run format
npm run lint:fix
npm run lint-staged
```

---

## Published Surface

Current exported package surface:

- `@alexandrebenkendorf/frontend-tooling/eslint`
- `@alexandrebenkendorf/frontend-tooling/lint-staged`
- `@alexandrebenkendorf/frontend-tooling/prettier`
- `@alexandrebenkendorf/frontend-tooling/tsconfig/base.json`
- `@alexandrebenkendorf/frontend-tooling/tsconfig/eslint.json`
- `@alexandrebenkendorf/frontend-tooling/tsconfig/node.json`
- `.editorconfig` (distributed to consumer projects via `frontend-tooling-init`)

When changing exported files:

- update `package.json` `exports`
- update `package.json` `files` if needed
- update `README.md`
- verify the tarball with `npm pack --dry-run --cache /tmp/frontend-tooling-npm-cache`

---

## Commit Conventions

Preferred format for this repo:

```
<type>: <description>
```

### Commit Types

| Type       | Usage                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| `feat`     | A new feature                                                                                          |
| `fix`      | A bug fix                                                                                              |
| `docs`     | Documentation only changes                                                                             |
| `style`    | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| `refactor` | A code change that neither fixes a bug nor adds a feature                                              |
| `perf`     | A code change that improves performance                                                                |
| `test`     | Adding missing tests or correcting existing tests                                                      |
| `build`    | Changes that affect the build system or external dependencies                                          |
| `ci`       | Changes to our CI configuration files and scripts                                                      |
| `chore`    | Other changes that don't modify src or test files                                                      |
| `revert`   | Reverts a previous commit                                                                              |
| `rollback` | Rolling back to a previous version                                                                     |

### Message Guidelines

- **Use imperative mood** in the description (e.g., "Add feature" not "Added feature")
- **Keep the description concise** but descriptive
- **Capitalize the first letter** of the description
- **Do not end with a period**

### Examples

```bash
git commit -m "feat: Add exported lint-staged config"
git commit -m "fix: Remove repo-specific tsconfig defaults"
git commit -m "docs: Expand createEslintConfig examples"
git commit -m "chore: Add Husky pre-commit hook"
```

---

## Coding Standards

### Package Design

✅ **Do:**

- keep defaults generic and broadly reusable
- add override points before hardcoding consumer assumptions
- document public API changes in `README.md`
- keep package exports and actual files aligned

❌ **Don't:**

- hardcode consumer-specific paths like `./frontend/src`
- assume a specific framework, bundler, or test runner unless the API explicitly opts into it
- publish contributor-only files accidentally
- leave README examples behind the real API

### Naming Conventions

| Concept          | Convention             | Example                  |
| ---------------- | ---------------------- | ------------------------ |
| Package files    | descriptive + explicit | `lint-staged.config.mjs` |
| Export helpers   | `camelCase`            | `createEslintConfig`     |
| Utility modules  | `kebab-case`           | `import.eslint.mjs`      |
| JSON config file | explicit purpose       | `tsconfig.eslint.json`   |

### Implementation Notes

- Prefer small, composable config builders over one large exported config blob.
- Keep helper modules generic; keep default values and package policy in dedicated config/default modules.
- Make initializer changes idempotent and conservative by default.
- Avoid “magic” install-time behavior. Consumer patching should stay explicit and reviewable.

---

## Testing Guidelines

### Key Principles

- Validate exported behavior and package shape, not app runtime.
- Test files live in `tests/` mirroring the source structure (e.g. `tests/ensure/prettier.spec.mjs` mirrors `scripts/lib/ensure/prettier.mjs`).
- Use `vitest` with `describe` / `it('should ...')` — BDD-style descriptions.
- Mock the `write` callback in `ensure/` tests rather than touching the filesystem.
- When package surface changes, always run `npm pack --dry-run --cache /tmp/frontend-tooling-npm-cache`.
- If the initializer changes, test both a clean temp repo and an existing repo scenario when possible.

---

## Contributor Tooling

```bash
# Install dependencies
npm install

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Tests
npm test

# Staged files
npm run lint-staged

# Package verification
npm pack --dry-run --cache /tmp/frontend-tooling-npm-cache
```

For this repository itself:

- Husky is installed through the `prepare` script.
- Running `npm run prepare` activates Husky in the local clone by configuring the Git hooks path.
- `.husky/pre-commit` runs `npm run lint-staged`.
- The local root `lint-staged.config.mjs` extends the shared `@alexandrebenkendorf/frontend-tooling/lint-staged` export with an extra `npm pack --dry-run --cache /tmp/frontend-tooling-npm-cache` verification step for package-surface changes.

---

## Definition of Done

Before considering work complete:

- [ ] Verification commands pass for the touched surface
- [ ] No lint errors (`npm run lint`)
- [ ] Format check passes (`npm run format:check`)
- [ ] Package tarball is valid when package surface changed
- [ ] README updated if public usage changed
- [ ] `AGENTS.md` / `DEVELOPMENT.md` updated if contributor workflow changed

---

## Getting Help

- **Package usage questions?** Check [README.md](./README.md)
- **Publish surface questions?** Check `package.json` `exports` and `files`
- **Initializer questions?** Check `scripts/init.mjs`
- **Found an issue?** Open a normal repository issue or PR with the reproduction and expected behavior
