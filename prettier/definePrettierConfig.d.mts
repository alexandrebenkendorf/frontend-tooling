/**
 * Options for `definePrettierConfig`. Pass `ejs: true` and/or
 * `sortImports: true` to enable the corresponding plugins. Any other keys
 * are treated as Prettier overrides applied on top of the base config.
 *
 * @see [definePrettierConfig](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/prettier.md#defineprettierconfig)
 */
export interface DefinePrettierConfigOptions {
  /** Enable `prettier-plugin-ejs`. Requires `prettier-plugin-ejs` installed. */
  ejs?: boolean;
  /** Enable `@trivago/prettier-plugin-sort-imports`. Requires the package installed. */
  sortImports?: boolean;
  [key: string]: unknown;
}

/**
 * Builds a merged Prettier config from the shared base, opt-in plugins, and
 * consumer overrides. All `plugins` arrays are flattened automatically.
 *
 * @see [definePrettierConfig](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/prettier.md#defineprettierconfig)
 */
export declare function definePrettierConfig(options?: DefinePrettierConfigOptions): Record<string, unknown>;
