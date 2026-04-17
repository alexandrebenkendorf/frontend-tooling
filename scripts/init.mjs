#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { detectExistingConfigFiles, detectLegacyEslintDependencies } from './lib/detect.mjs';
import { collectChoices } from './lib/prompt.mjs';
import { createWriters } from './lib/writers.mjs';

const cwd = process.cwd();
const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const skipHusky = args.has('--skip-husky');
const yes = args.has('--yes') || args.has('-y') || !process.stdin.isTTY;

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));

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

const willCreatePrettier = !existsSync(path.join(cwd, 'prettier.config.mjs')) || force;
const willCreateEslint = !existsSync(path.join(cwd, 'eslint.config.mjs')) || force;

const choices = await collectChoices({ yes, willCreatePrettier, willCreateEslint });

const {
  updatePackageJson,
  ensureEditorConfig,
  ensureTsconfigJson,
  ensureTsconfigEslintJson,
  ensureEslintConfig,
  ensurePrettierConfig,
  ensurePrettierIgnore,
  ensureLintStagedConfig,
  ensureHuskyPreCommit,
} = createWriters({
  cwd,
  force,
  skipHusky,
  packageName,
  packageVersion,
  peerDependencies,
  packageDevDependencies,
  logResult,
  packageRoot,
});

const updatedPackageJson = await updatePackageJson(choices);
await ensureEditorConfig();
await ensureTsconfigJson();
await ensureTsconfigEslintJson();
await ensureEslintConfig(choices);
await ensurePrettierConfig(choices);
await ensurePrettierIgnore();
await ensureLintStagedConfig();
await ensureHuskyPreCommit();

const existingConfigFiles = detectExistingConfigFiles(cwd);
const legacyEslintDependencies = detectLegacyEslintDependencies(updatedPackageJson);

if (existingConfigFiles.length > 0) {
  addNotice(
    `Existing config files detected: ${existingConfigFiles.join(', ')}. The initializer skips existing managed files unless you use --force.`
  );
}

if (legacyEslintDependencies.length > 0) {
  addNotice(
    `Legacy ESLint stack detected: ${legacyEslintDependencies.join(', ')}. Migrate intentionally instead of replacing the old setup all at once.`
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
