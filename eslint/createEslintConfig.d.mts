import type { Linter } from 'eslint';

export interface CreateEslintConfigOptions {
  project: boolean | string | string[] | null;
  tsconfigRootDir: string;
  includeImport?: boolean;
  includeReact?: boolean;
  includeTest?: boolean;
  testFramework?: 'vitest' | 'jest';
  nameSuffix?: string;
  patterns?: {
    jsFiles?: string[];
    tsFiles?: string[];
    reactJsFiles?: string[];
    reactTsFiles?: string[];
    srcJsFiles?: string[];
    srcTsFiles?: string[];
    testJsFiles?: string[];
    testTsFiles?: string[];
    importDevDependencyFiles?: string[];
    nonSrcIgnores?: string[];
  };
  ignores?: string[];
  importOptions?: {
    resolverExtensions?: string[];
    aliasExtensions?: string[];
    aliasMap?: [string, string][];
  };
  rules?: Linter.RulesRecord;
  overrides?: {
    extraIgnores?: string[];
    extraConfigs?: Linter.Config[];
  };
}

export default function createEslintConfig(options: CreateEslintConfigOptions): Promise<Linter.Config[]>;
