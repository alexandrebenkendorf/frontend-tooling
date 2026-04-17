import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

export async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

/**
 * Returns a `write(filePath, content)` function that skips existing files
 * unless `force` is set, and logs the result via `logResult`.
 */
export function createManagedFileWriter({ cwd, force, logResult }) {
  return async function write(filePath, content) {
    const existedBefore = existsSync(filePath);

    if (existedBefore && !force) {
      logResult('skipped', path.relative(cwd, filePath), 'already exists');
      return;
    }

    await writeFile(filePath, content, 'utf8');
    logResult(existedBefore ? 'updated' : 'created', path.relative(cwd, filePath));
  };
}
