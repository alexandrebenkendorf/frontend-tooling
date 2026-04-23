/**
 * Shape of the shared Prettier base config.
 * @see [Default settings](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/prettier.md#default-settings)
 */
export interface PrettierBaseConfig {
  bracketSpacing: boolean;
  printWidth: number;
  semi: boolean;
  singleQuote: boolean;
  useTabs: boolean;
  tabWidth: number;
  trailingComma: 'es5';
  jsxSingleQuote: boolean;
  bracketSameLine: boolean;
  arrowParens: 'always';
  singleAttributePerLine: boolean;
}

/**
 * Shared Prettier base config.
 * @see [Basic setup](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/prettier.md#basic-setup)
 * @see [Overriding settings](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/prettier.md#overriding-settings)
 */
export declare const baseConfig: PrettierBaseConfig;

/**
 * Opt-in Prettier config for EJS template formatting.
 * Requires `prettier-plugin-ejs` installed as a dev dependency.
 * @see [EJS formatting](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/prettier.md#ejs-formatting-opt-in)
 */
export declare const ejsConfig: {
  plugins: ['prettier-plugin-ejs'];
};

/**
 * Opt-in Prettier config for import sorting via `@trivago/prettier-plugin-sort-imports`.
 * Requires `@trivago/prettier-plugin-sort-imports` installed as a dev dependency.
 * @see [Import sorting](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/prettier.md#import-sorting-opt-in)
 */
export declare const sortImportsConfig: {
  importOrder: string[];
  importOrderParserPlugins: string[];
  importOrderSeparation: boolean;
  importOrderSortSpecifiers: boolean;
  importOrderGroupNamespaceSpecifiers: boolean;
  importOrderCaseInsensitive: boolean;
  plugins: ['@trivago/prettier-plugin-sort-imports'];
};
