import { configs as tsConfigs, parser as tsParser, plugin as tsPlugin } from 'typescript-eslint';

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
export function createTsConfigs({ project, tsconfigRootDir, nameSuffix = '', patterns, rules = {} }) {
  /** @type {import('eslint').Linter.Config[]} */
  const config = [
    ...tsConfigs.recommended.map((config) => ({
      ...config,
      files: patterns.tsFiles,
      languageOptions: {
        ...config.languageOptions,
        parser: tsParser,
        parserOptions: {
          ...config.languageOptions?.parserOptions,
          project,
          tsconfigRootDir,
        },
      },
    })),
    {
      name: createConfigName('typescript', nameSuffix),
      files: patterns.tsFiles,
      languageOptions: {
        ...sharedLanguageOptions,
        parser: tsParser,
        parserOptions: {
          ...sharedLanguageOptions.parserOptions,
          project,
          tsconfigRootDir,
        },
      },
      plugins: {
        '@typescript-eslint': tsPlugin,
      },
      rules: mergeRules(
        {
          ...RUNTIME_RULES,

          // Disable rules handled by TypeScript
          'no-undef': 'off',
          'no-throw-literal': 'off',
          'no-return-await': 'off',
          'no-unused-expressions': 'off',
          'no-use-before-define': 'off',

          // Variables & Types
          '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
          '@typescript-eslint/no-unused-vars': [
            'error',
            {
              argsIgnorePattern: '^_',
              varsIgnorePattern: '^_',
              destructuredArrayIgnorePattern: '^_',
              ignoreRestSiblings: true,
              // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/website/blog/2024-07-31-announcing-typescript-eslint-v8.md?plain=1#L465-L466
              caughtErrors: 'none',
            },
          ],
          '@typescript-eslint/no-explicit-any': 'warn',
          '@typescript-eslint/explicit-function-return-type': 'off',
          '@typescript-eslint/explicit-module-boundary-types': 'off',
          '@typescript-eslint/no-non-null-assertion': 'warn',

          // Async/Promises (type-aware rules enabled)
          '@typescript-eslint/no-floating-promises': 'error',
          // allow common React/event-handler patterns returning void
          '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
          '@typescript-eslint/await-thenable': 'error',
          '@typescript-eslint/promise-function-async': 'warn',

          // Type Safety (some require type information)
          '@typescript-eslint/no-unnecessary-type-assertion': 'error',
          '@typescript-eslint/prefer-nullish-coalescing': 'warn',
          '@typescript-eslint/prefer-optional-chain': 'error',
          '@typescript-eslint/no-unnecessary-condition': 'warn',

          // Code Quality
          '@typescript-eslint/no-unnecessary-type-constraint': 'error',
          '@typescript-eslint/prefer-as-const': 'error',
          '@typescript-eslint/prefer-literal-enum-member': 'error',
          '@typescript-eslint/no-duplicate-enum-values': 'error',
          '@typescript-eslint/only-throw-error': 'error',
          '@typescript-eslint/return-await': ['error', 'in-try-catch'],
          '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],

          // Naming Conventions
          '@typescript-eslint/naming-convention': [
            'warn',
            {
              selector: 'interface',
              format: ['PascalCase'],
            },
            {
              selector: 'typeAlias',
              format: ['PascalCase'],
            },
            {
              selector: 'enum',
              format: ['PascalCase'],
            },
            {
              selector: 'enumMember',
              format: ['PascalCase', 'UPPER_CASE'],
            },
          ],
        },
        rules.ts
      ),
    },
    {
      name: createConfigName('typescript/non-src-console', nameSuffix),
      files: patterns.tsFiles,
      ignores: patterns.nonSrcIgnores,
      rules: mergeRules(NO_CONSOLE_RULES_OUTSIDE_SRC, rules.tsNonSrcConsole),
    },
    {
      name: createConfigName('typescript/src-console', nameSuffix),
      files: patterns.srcTsFiles,
      rules: mergeRules(NO_CONSOLE_RULES_IN_SRC, rules.tsSrcConsole),
    },
  ];

  return config;
}
