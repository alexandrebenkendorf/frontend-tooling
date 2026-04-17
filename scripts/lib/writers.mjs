import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ensureDir, readJson, writeJson } from './fs.mjs';

/**
 * @param {{ cwd: string, force: boolean, skipHusky: boolean, packageName: string, packageVersion: string, peerDependencies: Record<string, string>, packageDevDependencies: Record<string, string>, logResult: Function, packageRoot: string }} context
 */
export function createWriters({
  cwd,
  force,
  skipHusky,
  packageName,
  packageVersion,
  peerDependencies,
  packageDevDependencies,
  logResult,
  packageRoot,
}) {
  async function writeManagedFile(filePath, content) {
    const existedBefore = existsSync(filePath);

    if (existedBefore && !force) {
      logResult('skipped', path.relative(cwd, filePath), 'already exists');
      return;
    }

    await writeFile(filePath, content, 'utf8');
    logResult(existedBefore ? 'updated' : 'created', path.relative(cwd, filePath));
  }

  async function updatePackageJson(choices) {
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

  async function ensureEditorConfig() {
    const sourcePath = path.join(packageRoot, '.editorconfig');
    const { readFile } = await import('node:fs/promises');
    const content = await readFile(sourcePath, 'utf8');
    await writeManagedFile(path.join(cwd, '.editorconfig'), content);
  }

  async function ensureTsconfigJson() {
    const content = `{
  "extends": "${packageName}/tsconfig/base.json",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
`;
    await writeManagedFile(path.join(cwd, 'tsconfig.json'), content);
  }

  async function ensureTsconfigEslintJson() {
    const content = `{
  "extends": "./tsconfig.json",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
`;
    await writeManagedFile(path.join(cwd, 'tsconfig.eslint.json'), content);
  }

  async function ensureEslintConfig(choices) {
    const optionLines = [];
    if (!choices.react) {
      optionLines.push(`  includeReact: false,`);
    }
    if (choices.testFramework !== 'none') {
      optionLines.push(`  testFramework: '${choices.testFramework}',`);
    }

    const extraOptions = optionLines.length > 0 ? `\n${optionLines.join('\n')}` : '';

    const content = `import createEslintConfig from '${packageName}/eslint';

export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,${extraOptions}
});
`;
    await writeManagedFile(path.join(cwd, 'eslint.config.mjs'), content);
  }

  async function ensurePrettierConfig(choices) {
    let content;
    if (choices.prettierEjs && choices.prettierSortImports) {
      content = `import baseConfig, { ejsConfig, sortImportsConfig } from '${packageName}/prettier';

export default {
  ...baseConfig,
  ...ejsConfig,
  ...sortImportsConfig,
  plugins: [...ejsConfig.plugins, ...sortImportsConfig.plugins],
};
`;
    } else if (choices.prettierEjs) {
      content = `import baseConfig, { ejsConfig } from '${packageName}/prettier';

export default { ...baseConfig, ...ejsConfig };
`;
    } else if (choices.prettierSortImports) {
      content = `import baseConfig, { sortImportsConfig } from '${packageName}/prettier';

export default { ...baseConfig, ...sortImportsConfig };
`;
    } else {
      content = `export { default } from '${packageName}/prettier';\n`;
    }

    await writeManagedFile(path.join(cwd, 'prettier.config.mjs'), content);
  }

  async function ensurePrettierIgnore() {
    const content = `dist
node_modules
coverage
*.min.js
*.min.css
package-lock.json
yarn.lock
pnpm-lock.yaml
`;
    await writeManagedFile(path.join(cwd, '.prettierignore'), content);
  }

  async function ensureLintStagedConfig() {
    const content = `import config from '${packageName}/lint-staged';

export default config;
`;
    await writeManagedFile(path.join(cwd, 'lint-staged.config.mjs'), content);
  }

  async function ensureHuskyPreCommit() {
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

  return {
    updatePackageJson,
    ensureEditorConfig,
    ensureTsconfigJson,
    ensureTsconfigEslintJson,
    ensureEslintConfig,
    ensurePrettierConfig,
    ensurePrettierIgnore,
    ensureLintStagedConfig,
    ensureHuskyPreCommit,
  };
}
