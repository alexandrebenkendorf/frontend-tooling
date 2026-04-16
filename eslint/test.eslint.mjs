import noOnlyTests from 'eslint-plugin-no-only-tests';

import { createConfigName, mergeRules } from './helpers.eslint.mjs';

/**
 * @returns {Promise<import('eslint').Linter.Config[]>}
 */
export async function createTestConfigs({ patterns, nameSuffix = '', rules = {}, testFramework } = {}) {
  /** @type {import('eslint').Linter.Config[]} */
  const configs = [
    {
      name: createConfigName('test', nameSuffix),
      files: [...patterns.testTsFiles, ...patterns.testJsFiles],
      rules: mergeRules({}, rules.test),
    },
    {
      name: createConfigName('no-only-tests', nameSuffix),
      files: [...patterns.testTsFiles, ...patterns.testJsFiles],
      plugins: { 'no-only-tests': noOnlyTests },
      rules: mergeRules(
        {
          'no-only-tests/no-only-tests': 'error',
        },
        rules.noOnlyTests
      ),
    },
  ];

  if (testFramework === 'vitest') {
    const { createVitestTestConfig } = await import('./vitest.eslint.mjs');
    configs[0] = await createVitestTestConfig({ baseConfig: configs[0], rules });
  }

  if (testFramework === 'jest') {
    const { createJestTestConfig } = await import('./jest.eslint.mjs');
    configs[0] = await createJestTestConfig({ baseConfig: configs[0], rules });
  }

  return configs;
}
