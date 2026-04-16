import js from '@eslint/js';

import {
  NO_CONSOLE_RULES_IN_SRC,
  NO_CONSOLE_RULES_OUTSIDE_SRC,
  RUNTIME_RULES,
  sharedLanguageOptions,
} from './constants.eslint.mjs';
import { createConfigName, mergeRules } from './helpers.eslint.mjs';

/**
 * @returns {import('eslint').Linter.Config[]}
 */
export function createJsConfigs({ nameSuffix = '', patterns, rules = {} } = {}) {
  return [
    {
      ...js.configs.recommended,
      files: patterns.jsFiles,
    },
    {
      name: createConfigName('js', nameSuffix),
      files: patterns.jsFiles,
      languageOptions: sharedLanguageOptions,
      rules: mergeRules(
        {
          ...js.configs.recommended.rules,
          ...RUNTIME_RULES,
          'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
          'no-return-await': 'error',
          'no-throw-literal': 'error',
        },
        rules.js
      ),
    },
    {
      name: createConfigName('js/non-src-console', nameSuffix),
      files: patterns.jsFiles,
      ignores: patterns.nonSrcIgnores,
      rules: mergeRules(NO_CONSOLE_RULES_OUTSIDE_SRC, rules.jsNonSrcConsole),
    },
    {
      name: createConfigName('js/src-console', nameSuffix),
      files: patterns.srcJsFiles,
      rules: mergeRules(NO_CONSOLE_RULES_IN_SRC, rules.jsSrcConsole),
    },
  ];
}
