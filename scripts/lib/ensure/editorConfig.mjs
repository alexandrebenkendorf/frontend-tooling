import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function ensureEditorConfig({ cwd, packageRoot, write }) {
  const content = await readFile(path.join(packageRoot, '.editorconfig'), 'utf8');
  await write(path.join(cwd, '.editorconfig'), content);
}
