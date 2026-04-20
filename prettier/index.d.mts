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

declare const config: PrettierBaseConfig;
export default config;

export declare const ejsConfig: {
  plugins: ['prettier-plugin-ejs'];
};

export declare const sortImportsConfig: {
  importOrder: string[];
  importOrderParserPlugins: string[];
  importOrderSeparation: boolean;
  importOrderSortSpecifiers: boolean;
  importOrderGroupNamespaceSpecifiers: boolean;
  importOrderCaseInsensitive: boolean;
  plugins: ['@trivago/prettier-plugin-sort-imports'];
};
