import globals from 'globals';

import { mergeRules } from './helpers.eslint.mjs';

/**
 * @returns {Promise<import('eslint').Linter.Config>}
 */
export async function createVitestTestConfig({ baseConfig, rules = {} }) {
  const { default: vitest } = await import('@vitest/eslint-plugin');

  return {
    ...baseConfig,
    languageOptions: {
      ...baseConfig.languageOptions,
      globals: {
        ...baseConfig.languageOptions?.globals,
        ...globals.vitest,
      },
    },
    plugins: vitest.configs.recommended.plugins,
    rules: mergeRules(
      {
        ...vitest.configs.recommended.rules,
        'vitest/no-focused-tests': 'error',
        'vitest/no-disabled-tests': 'warn',
        'vitest/expect-expect': [
          'warn',
          {
            assertFunctionNames: ['expect', 'expectToThrowSilently', 'expectToRejectSilently'],
          },
        ],
        'vitest/valid-expect': 'error',
      },
      rules.test
    ),
  };
}
