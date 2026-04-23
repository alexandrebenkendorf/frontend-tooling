export const baseConfig = {
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
};

/**
 * Prettier settings for `prettier-plugin-ejs`.
 * Requires `prettier-plugin-ejs` installed as a dev dependency.
 */
export const ejsConfig = {
  plugins: ['prettier-plugin-ejs'],
};

/**
 * Prettier settings for `@trivago/prettier-plugin-sort-imports`.
 * Requires `@trivago/prettier-plugin-sort-imports` installed as a dev dependency.
 */
export const sortImportsConfig = {
  importOrder: ['^node:(.*)$', '<THIRD_PARTY_MODULES>', '^@/(.*)$', '^~/(.*)$', '^../(.*)$', '^[./]'],
  importOrderParserPlugins: ['importAssertions', 'typescript', 'jsx'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
