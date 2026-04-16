import globals from 'globals';

import { mergeRules } from './helpers.eslint.mjs';

/**
 * @returns {Promise<import('eslint').Linter.Config>}
 */
export async function createJestTestConfig({ baseConfig, rules = {} }) {
  const { default: jestPlugin } = await import('eslint-plugin-jest');

  return {
    ...baseConfig,
    languageOptions: {
      ...baseConfig.languageOptions,
      globals: {
        ...baseConfig.languageOptions?.globals,
        ...globals.jest,
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: mergeRules(
      {
        'jest/no-focused-tests': 'error',
        'jest/no-disabled-tests': 'warn',
        'jest/valid-expect': 'error',
      },
      rules.test
    ),
  };
}
