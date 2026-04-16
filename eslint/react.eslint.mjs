import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

import { createConfigName, mergeRules } from './helpers.eslint.mjs';

/**
 * @returns {import('eslint').Linter.Config[]}
 */
export function createReactConfigs({ nameSuffix = '', patterns, rules = {} } = {}) {
  return [
    {
      name: createConfigName('react', nameSuffix),
      files: patterns.reactTsFiles,
      plugins: {
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
        'react-refresh': reactRefreshPlugin,
        'jsx-a11y': jsxA11yPlugin,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: mergeRules(
        {
          ...reactPlugin.configs.recommended.rules,
          ...reactPlugin.configs['jsx-runtime'].rules,
          ...reactHooksPlugin.configs.recommended.rules,
          ...jsxA11yPlugin.configs.recommended.rules,

          // React Core Rules
          'react/no-unescaped-entities': 'off',
          'react/no-danger': 'warn',
          'react/display-name': 'off',
          'react/prop-types': 'off',
          'react/react-in-jsx-scope': 'off',
          'react/jsx-uses-react': 'off',
          'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
          'react/no-array-index-key': 'warn',
          'react/no-unstable-nested-components': 'warn',
          'react/jsx-no-constructed-context-values': 'warn',
          'react/jsx-no-useless-fragment': 'warn',
          'react/void-dom-elements-no-children': 'error',
          'react/no-children-prop': 'error',

          // JSX Style & Quality
          'react/jsx-key': ['error', { checkFragmentShorthand: true, warnOnDuplicates: true }],
          'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
          'react/self-closing-comp': 'warn',
          'react/jsx-boolean-value': ['warn', 'never'],
          'react/jsx-fragments': ['warn', 'syntax'],
          'react/jsx-no-leaked-render': [
            'error',
            {
              validStrategies: ['coerce', 'ternary'],
            },
          ],

          // Component Definition
          'react/function-component-definition': [
            'warn',
            {
              namedComponents: 'function-declaration',
              unnamedComponents: 'function-expression',
            },
          ],

          // Performance
          'react/jsx-no-bind': [
            'warn',
            {
              allowArrowFunctions: true,
              allowBind: false,
              allowFunctions: false,
            },
          ],

          // React Hooks
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn',

          // React Refresh
          'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

          // Accessibility
          'jsx-a11y/anchor-is-valid': 'warn',
          'jsx-a11y/click-events-have-key-events': 'warn',
          'jsx-a11y/no-static-element-interactions': 'warn',
          'jsx-a11y/alt-text': 'error',
          'jsx-a11y/aria-props': 'error',
          'jsx-a11y/aria-proptypes': 'error',
          'jsx-a11y/aria-unsupported-elements': 'error',
          'jsx-a11y/role-has-required-aria-props': 'error',
          'jsx-a11y/role-supports-aria-props': 'error',
          'jsx-a11y/label-has-associated-control': 'warn',
          'jsx-a11y/no-autofocus': 'warn',
          'jsx-a11y/interactive-supports-focus': 'warn',
        },
        rules.react
      ),
    },
  ];
}
