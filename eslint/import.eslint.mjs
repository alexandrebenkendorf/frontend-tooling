import importPlugin from 'eslint-plugin-import';

import { createConfigName, mergeRules } from './helpers.eslint.mjs';

/**
 * @returns {import('eslint').Linter.Config[]}
 */
export function createImportConfigs({
  project,
  tsconfigRootDir,
  nameSuffix = '',
  importOptions,
  patterns,
  rules = {},
}) {
  /** @type {import('eslint').Linter.Config[]} */
  const config = [
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    {
      name: createConfigName('import', nameSuffix),
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      settings: {
        'import/resolver': {
          typescript: {
            project,
            tsconfigRootDir,
          },
          node: {
            extensions: importOptions.resolverExtensions,
          },
          alias: {
            map: importOptions.aliasMap,
            extensions: importOptions.aliasExtensions,
          },
        },
      },
      rules: mergeRules(
        {
          // Security & Quality
          'import/no-dynamic-require': 'error',
          'import/no-default-export': 0,
          'import/no-named-as-default': 'off',
          'import/no-extraneous-dependencies': ['error', { devDependencies: false }],
          'import/no-mutable-exports': 'error',

          // Prevent Issues
          'import/no-duplicates': 'error',
          'import/no-self-import': 'error',
          // import/no-cycle is disabled due to severe performance issues on large codebases.
          // Testing showed this rule causes lint times to increase from ~14s to 49+ MINUTES.
          // The rule traces all import relationships across 2500+ files (O(n²) complexity).
          // The old .eslintrc.json had this enabled but likely relied on warm cache or was never completed.
          // Alternative: Use webpack/vite build warnings for circular dependency detection.
          'import/no-cycle': 'off',
          'import/no-useless-path-segments': 'off', // Can be slow
          'import/no-relative-packages': 'off', // Can be slow

          // Style & Organization
          'import/first': 'error',
          'import/newline-after-import': 'error',
          'import/no-anonymous-default-export': [
            'warn',
            {
              allowArray: false,
              allowArrowFunction: false,
              allowAnonymousClass: false,
              allowAnonymousFunction: false,
              allowLiteral: false,
              allowObject: true,
            },
          ],
        },
        rules.import
      ),
    },
    {
      name: createConfigName('import/dev-dependencies', nameSuffix),
      files: patterns.importDevDependencyFiles,
      rules: mergeRules(
        {
          'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        },
        rules.importDevDependencies
      ),
    },
  ];

  return config;
}
