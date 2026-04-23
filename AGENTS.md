# AGENTS

Global, authoritative rules for this repository.

This repository is the source for the published package `@alexandrebenkendorf/frontend-tooling`.

If a user wants to use this package in another repo, prefer the explicit integration flow:

1. `npm install -D @alexandrebenkendorf/frontend-tooling eslint prettier typescript typescript-eslint`
2. `npx frontend-tooling-init`

The init command is the supported way to patch a consumer repo. Do not assume `npm install` alone should silently rewrite consumer files.

## Order of precedence

1. `/AGENTS.md`
2. Existing code and comments

If instructions conflict, follow the higher-precedence source and mention the conflict.

## Repo composition

- Published package: shared npm tooling package
- Exported package surface:
  - `eslint/` for flat-config builders and helpers
  - `scripts/init.mjs` exposed via `frontend-tooling-init` for explicit consumer-repo setup
  - `prettier/` for the shared Prettier config
  - `tsconfig*.json` for the published TypeScript config chain
  - `lint-staged/` for the shared `lint-staged` export
  - `.editorconfig` distributed to consumer projects via `frontend-tooling-init`
- Contributor-only local tooling:
  - `.husky/` for local git hooks

---

## Non-negotiable rules

- Do NOT silently mutate consumer repos through install-time behavior. Use the explicit `frontend-tooling-init` flow for patching consumer projects.
- Do NOT overwrite existing consumer config files unless the user explicitly wants that or the init flow is run with `--force`.
- Keep changes minimal and incremental.
- Keep exported configs generic and reusable; avoid repo-specific paths, aliases, includes, framework types, or app assumptions in published files unless explicitly required.
- When changing package exports, keep `package.json` `exports` and `files` aligned with the actual filesystem.
- Keep dependency placement intentional:
  - `dependencies` for package-owned runtime/config integrations
  - `peerDependencies` for consumer-provided tooling like `eslint`, `prettier`, and `typescript`
  - `devDependencies` for repo-only contributor tooling like `husky` and `lint-staged`
- When changing the initializer, keep it idempotent and safe for existing repos.
- When changing README examples, keep them aligned with the actual exported API and init behavior.
- Treat `.husky/` as contributor tooling, not published package surface.

---

## Package safety

- When changing published files, verify `npm pack --dry-run --cache /tmp/frontend-tooling-npm-cache`.
- Keep README examples aligned with the current exported API and initializer behavior.
- Treat `frontend-tooling-init` as the supported consumer patching flow.
- Keep local contributor tooling like `.husky/` out of the published package surface unless intentionally exported.

---

## Commands that must pass

- Install: `npm i`
- Format: `npm run format`
- Format check: `npm run format:check`
- Lint: `npm run lint`
- Lint fix: `npm run lint:fix`
- Package verification: `npm pack --dry-run --cache /tmp/frontend-tooling-npm-cache`

---

## Definition of Done

- [ ] Tests added or updated when behavior changes require them
- [ ] Lint passing
- [ ] Format check passes (`npm run format:check`)
- [ ] `npm pack --dry-run --cache /tmp/frontend-tooling-npm-cache` passes when package surface changed
- [ ] No duplicated constants or paths
- [ ] README and contributor docs updated if a new public pattern was introduced
- [ ] `DEVELOPMENT.md` updated when introducing new patterns, conventions, or quick reference material relevant to human developers
