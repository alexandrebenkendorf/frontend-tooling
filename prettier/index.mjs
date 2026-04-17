const config = {
  bracketSpacing: true,
  printWidth: 120,
  semi: true,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'es5',
  jsxSingleQuote: false,
  bracketSameLine: false,
  arrowParens: 'always',
  singleAttributePerLine: true,
  plugins: ['prettier-plugin-ejs'],
};

export default config;

/**
 * Prettier settings for `@trivago/prettier-plugin-sort-imports`.
 * Spread this into your Prettier config to enable automatic import sorting.
 *
 * Requires `@trivago/prettier-plugin-sort-imports` installed as a dev dependency.
 *
 * @example
 * import baseConfig, { sortImportsConfig } from '@alexandrebenkendorf/frontend-tooling/prettier';
 * export default { ...baseConfig, ...sortImportsConfig };
 */
export const sortImportsConfig = {
  importOrder: ['^node:(.*)$', '<THIRD_PARTY_MODULES>', '^~/(.*)$', '^../(.*)$', '^[./]'],
  importOrderParserPlugins: ['importAssertions', 'typescript', 'jsx'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
  plugins: [...config.plugins, '@trivago/prettier-plugin-sort-imports'],
};
