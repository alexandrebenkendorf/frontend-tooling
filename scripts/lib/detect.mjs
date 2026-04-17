import { existsSync } from 'node:fs';
import path from 'node:path';

const LEGACY_DEPENDENCY_PATTERNS = [
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

const MANAGED_CONFIG_FILES = [
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

export function detectLegacyEslintDependencies(targetPackageJson) {
  const allDependencies = {
    ...(targetPackageJson.dependencies ?? {}),
    ...(targetPackageJson.devDependencies ?? {}),
  };

  return Object.keys(allDependencies).filter((dep) => LEGACY_DEPENDENCY_PATTERNS.some((pattern) => pattern.test(dep)));
}

export function detectExistingConfigFiles(cwd) {
  return MANAGED_CONFIG_FILES.filter((file) => existsSync(path.join(cwd, file)));
}
