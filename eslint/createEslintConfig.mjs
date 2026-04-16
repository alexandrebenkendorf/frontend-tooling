import prettierConfig from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

import { createJsConfigs } from './js.eslint.mjs';
import { resolveIgnores, resolveImportOptions, resolvePatterns } from './options.eslint.mjs';
import { createTsConfigs } from './ts.eslint.mjs';

/**
 * Builds a merged ESLint flat config array for a consumer project.
 *
 * Combines JS, TS, import, React, and test rule sets according to the provided
 * options, then appends Prettier compatibility at the end. Feature sets are
 * lazy-loaded so unused plugins are never imported.
 *
 * @param {import('./createEslintConfig.mjs').CreateEslintConfigOptions} options
 * @returns {Promise<import('eslint').Linter.Config[]>}
 */
export default async function createEslintConfig({
  project,
  tsconfigRootDir,
  includeImport = true,
  includeReact = true,
  includeTest = true,
  testFramework,
  nameSuffix = '',
  patterns = {},
  ignores,
  importOptions = {},
  rules = {},
  overrides: { extraIgnores = [], extraConfigs = [] } = {},
}) {
  const resolvedPatterns = resolvePatterns(patterns);
  const resolvedImportOptions = resolveImportOptions(importOptions);
  const resolvedIgnores = resolveIgnores(ignores, extraIgnores);
  const importConfigs = includeImport
    ? (await import('./import.eslint.mjs')).createImportConfigs({
        project,
        tsconfigRootDir,
        nameSuffix,
        importOptions: resolvedImportOptions,
        patterns: resolvedPatterns,
        rules,
      })
    : [];
  const reactConfigs = includeReact
    ? (await import('./react.eslint.mjs')).createReactConfigs({
        nameSuffix,
        patterns: resolvedPatterns,
        rules,
      })
    : [];
  const testConfigs = includeTest
    ? (await import('./test.eslint.mjs')).createTestConfigs({
        patterns: resolvedPatterns,
        nameSuffix,
        rules,
        testFramework,
      })
    : [];

  return defineConfig([
    globalIgnores(resolvedIgnores),
    ...importConfigs,
    ...createJsConfigs({ nameSuffix, patterns: resolvedPatterns, rules }),
    ...createTsConfigs({ project, tsconfigRootDir, nameSuffix, patterns: resolvedPatterns, rules }),
    ...reactConfigs,
    ...testConfigs,
    ...extraConfigs,
    prettierConfig,
  ]);
}
