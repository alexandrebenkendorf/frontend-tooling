import type { Linter } from 'eslint';

/**
 * Describes how a list option interacts with the built-in default.
 *
 * - `T[]` — replaces the default entirely.
 * - `{ extend?: T[] }` — appends to the default.
 * - `{ replace: true, extend?: T[] }` — replaces the default (same as `T[]`, but explicit).
 */
export type ListOption<T> = T[] | { extend?: T[]; replace?: boolean };

/** Per-group rule overrides. Each key targets a specific generated config block. */
export interface RulesOverrides {
  /** Rules merged into the base JavaScript config block. */
  js?: Linter.RulesRecord;
  /** Rules merged into the JS non-`src/` console policy block. */
  jsNonSrcConsole?: Linter.RulesRecord;
  /** Rules merged into the JS `src/` console policy block. */
  jsSrcConsole?: Linter.RulesRecord;
  /** Rules merged into the base TypeScript config block. */
  ts?: Linter.RulesRecord;
  /** Rules merged into the TS non-`src/` console policy block. */
  tsNonSrcConsole?: Linter.RulesRecord;
  /** Rules merged into the TS `src/` console policy block. */
  tsSrcConsole?: Linter.RulesRecord;
  /** Rules merged into the React config block. */
  react?: Linter.RulesRecord;
  /** Rules merged into the import config block. */
  import?: Linter.RulesRecord;
  /** Rules merged into the import devDependencies block. */
  importDevDependencies?: Linter.RulesRecord;
  /** Rules merged into the test files config block. */
  test?: Linter.RulesRecord;
  /** Rules merged into the no-only-tests block. */
  noOnlyTests?: Linter.RulesRecord;
}

export interface DefineEslintConfigOptions {
  /**
   * TypeScript project reference passed to `@typescript-eslint/parser` for
   * type-aware linting. Use `true` to auto-discover `tsconfig.json`, a path or
   * array of paths to target specific configs, or `null` to disable type-aware
   * rules entirely.
   */
  project: boolean | string | string[] | null;
  /**
   * Absolute path to the directory that contains the tsconfig file(s).
   * Passed directly to `@typescript-eslint/parser` as `tsconfigRootDir`.
   */
  tsconfigRootDir: string;
  /**
   * Include the `eslint-plugin-import` config block.
   * @default false
   * @see [Feature toggles](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#feature-toggles)
   */
  includeImport?: boolean;
  /**
   * Include the React-specific config block (`eslint-plugin-react`, JSX rules).
   * @default false
   * @see [Feature toggles](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#feature-toggles)
   */
  includeReact?: boolean;
  /**
   * Include the test-file config block with relaxed rules for test files.
   * @default false
   * @see [Feature toggles](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#feature-toggles)
   */
  includeTest?: boolean;
  /**
   * Test framework to configure globals and framework-specific rules for.
   * Required when `includeTest` is `true` and you want framework globals.
   * @see [Test framework rules](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#test-framework-rules)
   */
  testFramework?: 'vitest' | 'jest';
  /**
   * Suffix appended to every config `name` field, e.g. `"my-app"` produces
   * names like `"js/my-app"`. Useful for identifying configs in debug output
   * when multiple projects share the same base config.
   * @default ''
   * @see [Config naming](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#config-naming)
   */
  nameSuffix?: string;
  /**
   * Override the default glob patterns used to target file groups.
   * Each key accepts a `ListOption<string>`: a `string[]` replaces the default;
   * `{ extend?: string[] }` appends to it.
   * @see [File patterns](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#file-patterns)
   */
  patterns?: {
    /** Glob patterns for all JavaScript files. */
    jsFiles?: ListOption<string>;
    /** Glob patterns for all TypeScript files. */
    tsFiles?: ListOption<string>;
    /** Glob patterns for React JavaScript files (`.jsx`). */
    reactJsFiles?: ListOption<string>;
    /** Glob patterns for React TypeScript files (`.tsx`). */
    reactTsFiles?: ListOption<string>;
    /**
     * Glob patterns for JavaScript files inside `src/`, used to apply stricter
     * `no-console` rules to production source code. Override if your project
     * doesn't follow the conventional `src/` layout.
     * @see [src/-scoped console rules](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#src-scoped-console-rules)
     */
    srcJsFiles?: ListOption<string>;
    /**
     * Glob patterns for TypeScript files inside `src/`, used to apply stricter
     * `no-console` rules to production source code. Override if your project
     * doesn't follow the conventional `src/` layout.
     * @see [src/-scoped console rules](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#src-scoped-console-rules)
     */
    srcTsFiles?: ListOption<string>;
    /** Glob patterns for JavaScript test files. */
    testJsFiles?: ListOption<string>;
    /** Glob patterns for TypeScript test files. */
    testTsFiles?: ListOption<string>;
    /**
     * Glob patterns for files where importing `devDependencies` is allowed
     * (e.g. config files, test helpers, build scripts).
     */
    importDevDependencyFiles?: ListOption<string>;
    /**
     * Glob patterns excluded from the non-`src/` ignore set, used to restrict
     * certain rules to source files only.
     * @see [src/-scoped console rules](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#src-scoped-console-rules)
     */
    nonSrcIgnores?: ListOption<string>;
  };
  /**
   * Glob patterns to ignore. A `string[]` replaces the built-in default list;
   * `{ extend?: string[] }` appends to it.
   * @see [File patterns](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#file-patterns)
   */
  ignores?: ListOption<string>;
  /**
   * Options forwarded to `eslint-plugin-import`'s resolver.
   * @see [Import aliases](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#import-aliases)
   */
  importOptions?: {
    /** File extensions considered by the import resolver. */
    resolverExtensions?: ListOption<string>;
    /** File extensions considered when resolving path aliases. */
    aliasExtensions?: ListOption<string>;
    /** Path alias pairs as `[alias, relativePath]` tuples, e.g. `[["@", "./src"]]`. */
    aliasMap?: ListOption<[string, string]>;
  };
  /**
   * Per-group rule overrides merged into the corresponding generated config block.
   * Consumer rules take precedence over the built-in rule sets.
   * @see [Rule overrides](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#rule-overrides)
   */
  rules?: RulesOverrides;
  /**
   * Extra flat config objects appended after all generated configs, before Prettier.
   * @see [Extra configs](https://github.com/alexandrebenkendorf/frontend-tooling/blob/main/docs/eslint.md#extra-configs)
   */
  extraConfigs?: Linter.Config[];
}

export default function defineEslintConfig(options: DefineEslintConfigOptions): Promise<Linter.Config[]>;
