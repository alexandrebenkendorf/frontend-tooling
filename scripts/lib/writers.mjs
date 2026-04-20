import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  ensureEditorConfig,
  ensureEslintConfig,
  ensureHuskyPreCommit,
  ensureLintStagedConfig,
  ensurePrettierConfig,
  ensurePrettierIgnore,
  ensureTsconfigEslintJson,
  ensureTsconfigJson,
  updatePackageJson,
} from './ensure/index.mjs';

/**
 * @param {{ cwd: string, force: boolean, skipHusky: boolean, packageName: string, packageVersion: string, peerDependencies: Record<string, string>, packageDevDependencies: Record<string, string>, logResult: Function, packageRoot: string }} context
 */
export function createWriters({
  cwd,
  dryRun,
  force,
  skipHusky,
  packageName,
  packageVersion,
  peerDependencies,
  packageDevDependencies,
  logResult,
  packageRoot,
}) {
  async function write(filePath, content) {
    const existedBefore = existsSync(filePath);

    if (existedBefore && !force) {
      logResult('skipped', path.relative(cwd, filePath), 'already exists');
      return;
    }

    if (dryRun) {
      logResult(existedBefore ? 'would update' : 'would create', path.relative(cwd, filePath));
      return;
    }

    await writeFile(filePath, content, 'utf8');
    logResult(existedBefore ? 'updated' : 'created', path.relative(cwd, filePath));
  }

  const ctx = {
    cwd,
    dryRun,
    force,
    skipHusky,
    packageName,
    packageVersion,
    peerDependencies,
    packageDevDependencies,
    logResult,
    packageRoot,
    write,
  };

  return {
    updatePackageJson: (choices) => updatePackageJson(ctx, choices),
    ensureEditorConfig: () => ensureEditorConfig(ctx),
    ensureTsconfigJson: () => ensureTsconfigJson(ctx),
    ensureTsconfigEslintJson: () => ensureTsconfigEslintJson(ctx),
    ensureEslintConfig: (choices) => ensureEslintConfig(ctx, choices),
    ensurePrettierConfig: (choices) => ensurePrettierConfig(ctx, choices),
    ensurePrettierIgnore: () => ensurePrettierIgnore(ctx),
    ensureLintStagedConfig: () => ensureLintStagedConfig(ctx),
    ensureHuskyPreCommit: () => ensureHuskyPreCommit(ctx),
  };
}
