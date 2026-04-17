import { existsSync } from 'node:fs';
import path from 'node:path';

import { readJson, writeJson } from '../fs.mjs';

export async function updatePackageJson(
  { cwd, skipHusky, packageName, packageVersion, peerDependencies, packageDevDependencies, logResult },
  choices
) {
  const targetPath = path.join(cwd, 'package.json');
  const exists = existsSync(targetPath);
  const target = exists ? await readJson(targetPath) : { name: path.basename(cwd), private: true, type: 'module' };

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

  // Required peer deps — always added
  for (const dep of ['eslint', 'prettier', 'typescript']) {
    if (peerDependencies[dep]) {
      target.devDependencies[dep] ??= peerDependencies[dep];
    }
  }

  // Optional peer deps — added based on choices
  if (choices.react) {
    for (const dep of [
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-react-refresh',
      'eslint-plugin-jsx-a11y',
    ]) {
      if (peerDependencies[dep]) {
        target.devDependencies[dep] ??= peerDependencies[dep];
      }
    }
  }
  if (choices.testFramework === 'vitest' && peerDependencies['@vitest/eslint-plugin']) {
    target.devDependencies['@vitest/eslint-plugin'] ??= peerDependencies['@vitest/eslint-plugin'];
  }
  if (choices.testFramework === 'jest' && peerDependencies['eslint-plugin-jest']) {
    target.devDependencies['eslint-plugin-jest'] ??= peerDependencies['eslint-plugin-jest'];
  }
  if (choices.prettierSortImports && peerDependencies['@trivago/prettier-plugin-sort-imports']) {
    target.devDependencies['@trivago/prettier-plugin-sort-imports'] ??=
      peerDependencies['@trivago/prettier-plugin-sort-imports'];
  }
  if (choices.prettierEjs && peerDependencies['prettier-plugin-ejs']) {
    target.devDependencies['prettier-plugin-ejs'] ??= peerDependencies['prettier-plugin-ejs'];
  }

  target.devDependencies['lint-staged'] ??= packageDevDependencies['lint-staged'] ?? '^15';
  if (!skipHusky) {
    target.devDependencies.husky ??= packageDevDependencies.husky ?? '^9';
  }

  await writeJson(targetPath, target);
  logResult(exists ? 'updated' : 'created', 'package.json');

  return target;
}
