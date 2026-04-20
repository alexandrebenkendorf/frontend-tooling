import { mkdir, readFile, writeFile } from 'node:fs/promises';

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

export async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}
