import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ensureDir } from '../fs.mjs';

export async function ensureHuskyPreCommit({ cwd, force, skipHusky, logResult }) {
  if (skipHusky) {
    return;
  }

  const huskyDir = path.join(cwd, '.husky');
  const targetPath = path.join(huskyDir, 'pre-commit');
  const content = `npm run lint-staged\n`;

  await ensureDir(huskyDir);
  const existedBefore = existsSync(targetPath);

  if (existedBefore && !force) {
    logResult('skipped', '.husky/pre-commit', 'already exists');
    return;
  }

  await writeFile(targetPath, content, { encoding: 'utf8', mode: 0o755 });
  logResult(existedBefore ? 'updated' : 'created', '.husky/pre-commit');
}
