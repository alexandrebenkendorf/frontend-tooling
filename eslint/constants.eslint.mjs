import globals from 'globals';

export const sharedLanguageOptions = {
  ecmaVersion: 'latest',
  sourceType: 'module',
  globals: {
    ...globals.browser,
    ...globals.es2021,
    ...globals.node,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

export const NO_CONSOLE_RULES_IN_SRC = {
  'no-console': [2, { allow: ['warn', 'error'] }],
};

export const NO_CONSOLE_RULES_OUTSIDE_SRC = {
  'no-console': [2, { allow: ['log', 'warn', 'error'] }],
};

export const RUNTIME_RULES = {
  // Console & Debugging
  'no-debugger': 'error',
  'no-alert': 'error',

  // Security
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-script-url': 'error',

  // Best Practices
  'no-prototype-builtins': 'off',
  'prefer-const': 'error',
  'no-var': 'error',
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'no-duplicate-imports': 'error',
  'no-await-in-loop': 'warn',
  'no-promise-executor-return': 'warn',
  'prefer-promise-reject-errors': 'warn', // 'error' Too strict for legacy code

  // Modern JavaScript
  'prefer-arrow-callback': 'error',
  'prefer-template': 'warn',
  'prefer-rest-params': 'error',
  'prefer-spread': 'error',
  'object-shorthand': ['warn', 'always'],
  'prefer-destructuring': ['warn', { object: true, array: false }],
  'no-useless-concat': 'warn',
  'no-useless-return': 'warn',
  'no-useless-computed-key': 'warn',
  'no-useless-rename': 'error',

  // Code Quality
  'no-param-reassign': ['warn', { props: false }],
  'no-nested-ternary': 'warn',
  'no-unneeded-ternary': 'warn',
  'no-lonely-if': 'warn',
  yoda: ['warn', 'never'],
  curly: ['warn', 'all'],
  'default-case-last': 'error',
  'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
};
