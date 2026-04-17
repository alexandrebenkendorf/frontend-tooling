#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cwd = process.cwd();
const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const skipHusky = args.has('--skip-husky');

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJsonPath = path.join(packageRoot, 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

const packageName = packageJson.name;
const packageVersion = packageJson.version;
const peerDependencies = packageJson.peerDependencies ?? {};
const packageDevDependencies = packageJson.devDependencies ?? {};

const results = [];
const notices = [];

function logResult(status, target, detail = '') {
  results.push({ status, target, detail });
}

function addNotice(message) {
  notices.push(message);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

async function writeManagedFile(filePath, content) {
  const existedBefore = existsSync(filePath);

  if (existedBefore && !force) {
    logResult('skipped', path.relative(cwd, filePath), 'already exists');
    return;
  }

  await writeFile(filePath, content, 'utf8');
  logResult(existedBefore ? 'updated' : 'created', path.relative(cwd, filePath));
}

async function updatePackageJson() {
  const targetPath = path.join(cwd, 'package.json');
  const exists = existsSync(targetPath);
  const target = exists
    ? await readJson(targetPath)
    : {
        name: path.basename(cwd),
        private: true,
        type: 'module',
      };

  target.scripts ??= {};
  target.devDependencies ??= {};

  target.scripts.format ??= 'prettier . --write';
  target.scripts['format:check'] ??= 'prettier . --check';
  target.scripts.lint ??= 'eslint .';
  target.scripts['lint:fix'] ??= 'eslint . --fix';
  target.scripts['lint-staged'] ??= 'lint-staged';

  if (!skipHusky) {
    target.scripts.prepare ??= 'husky';
  }

  target.devDependencies[packageName] ??= `^${packageVersion}`;

  for (const [dependency, version] of Object.entries(peerDependencies)) {
    target.devDependencies[dependency] ??= version;
  }

  target.devDependencies['lint-staged'] ??= packageDevDependencies['lint-staged'] ?? '^15';

  if (!skipHusky) {
    target.devDependencies.husky ??= packageDevDependencies.husky ?? '^9';
  }

  await writeJson(targetPath, target);
  logResult(exists ? 'updated' : 'created', 'package.json');

  return target;
}

async function ensureTsconfigJson() {
  const targetPath = path.join(cwd, 'tsconfig.json');
  const content = `{
  "extends": "${packageName}/tsconfig/base.json",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
`;
  await writeManagedFile(targetPath, content);
}

async function ensurePrettierConfig() {
  const targetPath = path.join(cwd, 'prettier.config.mjs');
  const content = `export { default } from '${packageName}/prettier';\n`;
  await writeManagedFile(targetPath, content);
}

async function ensurePrettierIgnore() {
  const targetPath = path.join(cwd, '.prettierignore');
  const content = `dist
node_modules
coverage
*.min.js
*.min.css
package-lock.json
yarn.lock
pnpm-lock.yaml
`;
  await writeManagedFile(targetPath, content);
}

async function ensureTsconfigEslintJson() {
  const targetPath = path.join(cwd, 'tsconfig.eslint.json');
  const content = `{
  "extends": "./tsconfig.json",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
`;
  await writeManagedFile(targetPath, content);
}

async function ensureEslintConfig() {
  const targetPath = path.join(cwd, 'eslint.config.mjs');
  const content = `import createEslintConfig from '${packageName}/eslint';

export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,
});
`;
  await writeManagedFile(targetPath, content);
}

async function ensureEditorConfig() {
  const sourcePath = path.join(packageRoot, '.editorconfig');
  const targetPath = path.join(cwd, '.editorconfig');
  const content = await readFile(sourcePath, 'utf8');
  await writeManagedFile(targetPath, content);
}

async function ensureLintStagedConfig() {
  const targetPath = path.join(cwd, 'lint-staged.config.mjs');
  const content = `import config from '${packageName}/lint-staged';

export default config;
`;
  await writeManagedFile(targetPath, content);
}

async function ensureHuskyPreCommit() {
  if (skipHusky) {
    return;
  }

  const huskyDir = path.join(cwd, '.husky');
  const targetPath = path.join(huskyDir, 'pre-commit');
  const content = `npm run lint-staged
`;

  await ensureDir(huskyDir);
  const existedBefore = existsSync(targetPath);

  if (existedBefore && !force) {
    logResult('skipped', '.husky/pre-commit', 'already exists');
    return;
  }

  await writeFile(targetPath, content, { encoding: 'utf8', mode: 0o755 });
  logResult(existedBefore ? 'updated' : 'created', '.husky/pre-commit');
}

function detectLegacyEslintDependencies(targetPackageJson) {
  const allDependencies = {
    ...(targetPackageJson.dependencies ?? {}),
    ...(targetPackageJson.devDependencies ?? {}),
  };

  const legacyDependencyPatterns = [
    /^eslint-config-airbnb(?:-base)?$/,
    /^eslint-plugin-react$/,
    /^eslint-plugin-react-hooks$/,
    /^eslint-plugin-jsx-a11y$/,
    /^eslint-plugin-import$/,
    /^babel-eslint$/,
    /^@babel\/eslint-parser$/,
    /^eslint-config-standard$/,
    /^eslint-config-prettier$/,
    /^eslint-plugin-node$/,
    /^eslint-plugin-promise$/,
  ];

  return Object.keys(allDependencies).filter((dependency) =>
    legacyDependencyPatterns.some((pattern) => pattern.test(dependency))
  );
}

function detectExistingConfigFiles() {
  const configFiles = [
    '.editorconfig',
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.mjs',
    '.eslintrc.json',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    'eslint.config.js',
    'eslint.config.cjs',
    'eslint.config.ts',
    'eslint.config.mjs',
    'tsconfig.json',
    'tsconfig.eslint.json',
    'prettier.config.js',
    'prettier.config.cjs',
    'prettier.config.mjs',
    '.prettierignore',
    'lint-staged.config.js',
    'lint-staged.config.cjs',
    'lint-staged.config.mjs',
    '.lintstagedrc',
    '.lintstagedrc.json',
    '.lintstagedrc.js',
    '.lintstagedrc.cjs',
    '.lintstagedrc.mjs',
    '.prettierrc',
    '.prettierrc.js',
    '.prettierrc.cjs',
    '.prettierrc.mjs',
    '.prettierrc.json',
  ];

  return configFiles.filter((file) => existsSync(path.join(cwd, file)));
}

const updatedPackageJson = await updatePackageJson();
await ensureEditorConfig();
await ensureTsconfigJson();
await ensureTsconfigEslintJson();
await ensureEslintConfig();
await ensurePrettierConfig();
await ensurePrettierIgnore();
await ensureLintStagedConfig();
await ensureHuskyPreCommit();

const existingConfigFiles = detectExistingConfigFiles();
const legacyEslintDependencies = detectLegacyEslintDependencies(updatedPackageJson);

if (existingConfigFiles.length > 0) {
  addNotice(
    `Existing config files detected: ${existingConfigFiles.join(
      ', '
    )}. The initializer skips existing managed files unless you use --force.`
  );
}

if (legacyEslintDependencies.length > 0) {
  addNotice(
    `Legacy ESLint stack detected: ${legacyEslintDependencies.join(
      ', '
    )}. Migrate intentionally instead of replacing the old setup all at once.`
  );
  addNotice(
    'Recommended next step: create or compare a modern eslint.config.mjs using this package, keep temporary rule overrides where needed, and remove legacy presets in phases.'
  );
}

console.log(`Initialized ${packageName} in ${cwd}\n`);
for (const result of results) {
  console.log(`- ${result.status}: ${result.target}${result.detail ? ` (${result.detail})` : ''}`);
}

if (notices.length > 0) {
  console.log('\nMigration notes:');
  for (const notice of notices) {
    console.log(`- ${notice}`);
  }
}

console.log('\nNext steps:');
console.log('- Run your package manager install command to sync dependencies and hook setup.');
console.log('- Review any skipped files and merge the shared setup manually if needed.');
console.log('- Use --force if you want this initializer to overwrite supported generated files.');
