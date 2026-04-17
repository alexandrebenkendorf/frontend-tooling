import { resolveListOption } from './helpers.eslint.mjs';

export const DEFAULT_PATTERNS = {
  jsFiles: ['**/*.{js,jsx,mjs,cjs,ejs}'],
  tsFiles: ['**/*.{ts,tsx,mts,cts}'],
  reactJsFiles: ['**/*.jsx'],
  reactTsFiles: ['**/*.tsx'],
  srcJsFiles: ['**/src/**/*.{js,jsx,mjs,cjs,ejs}'],
  srcTsFiles: ['**/src/**/*.{ts,tsx,mts,cts}'],
  testJsFiles: [
    '**/*.{test,spec,vitest}.{js,jsx,mjs,cjs}',
    '**/__tests__/**/*.{js,jsx,mjs,cjs}',
    '**/__mocks__/**/*.{js,jsx,mjs,cjs}',
  ],
  testTsFiles: [
    '**/*.{test,spec,vitest}.{ts,tsx,mts,cts}',
    '**/__tests__/**/*.{ts,tsx,mts,cts}',
    '**/__mocks__/**/*.{ts,tsx,mts,cts}',
  ],
  importDevDependencyFiles: [
    'build/**/*',
    'scripts/**/*',
    'eslint/**/*',
    'eslint.*',
    '.storybook/**/*',
    '**/test/**/*',
    '**/__tests__/**/*',
    '**/__mocks__/**/*',
    '**/setupTests.*',
    '**/*.config.{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
    '**/*.stories.{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
    '**/vite.*',
    '**/vitest.*',
    '**/vitest-setup.*',
    '**/playwright*.{js,ts,mjs,cjs,mts,cts}',
  ],
  nonSrcIgnores: ['**/node_modules/**', '**/dist/**', '**/src/**'],
};

export const DEFAULT_IGNORES = [
  '**/dist/**/*',
  '**/node_modules/**/*',
  '**/*.d.{ts,mts,cts}',
  '.git',
  '.cache',
  '.next',
  '.nuxt',
  '.turbo',
  '.vercel',
  '.vite',
  'coverage',
  'playwright-report',
  'public',
  'storybook-static',
  'test-results',
  '**/*.timestamp*',
];

export const DEFAULT_IMPORT_OPTIONS = {
  resolverExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  aliasExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  aliasMap: [
    ['@', './src'],
    ['@root', '.'],
  ],
};

export function resolvePatterns(patterns = {}) {
  return {
    jsFiles: resolveListOption(DEFAULT_PATTERNS.jsFiles, patterns.jsFiles),
    tsFiles: resolveListOption(DEFAULT_PATTERNS.tsFiles, patterns.tsFiles),
    reactJsFiles: resolveListOption(DEFAULT_PATTERNS.reactJsFiles, patterns.reactJsFiles),
    reactTsFiles: resolveListOption(DEFAULT_PATTERNS.reactTsFiles, patterns.reactTsFiles),
    srcJsFiles: resolveListOption(DEFAULT_PATTERNS.srcJsFiles, patterns.srcJsFiles),
    srcTsFiles: resolveListOption(DEFAULT_PATTERNS.srcTsFiles, patterns.srcTsFiles),
    testJsFiles: resolveListOption(DEFAULT_PATTERNS.testJsFiles, patterns.testJsFiles),
    testTsFiles: resolveListOption(DEFAULT_PATTERNS.testTsFiles, patterns.testTsFiles),
    importDevDependencyFiles: resolveListOption(
      DEFAULT_PATTERNS.importDevDependencyFiles,
      patterns.importDevDependencyFiles
    ),
    nonSrcIgnores: resolveListOption(DEFAULT_PATTERNS.nonSrcIgnores, patterns.nonSrcIgnores),
  };
}

export function resolveIgnores(ignores, extraIgnores = []) {
  return [...resolveListOption(DEFAULT_IGNORES, ignores), ...extraIgnores];
}

export function resolveImportOptions(importOptions = {}) {
  return {
    resolverExtensions: resolveListOption(DEFAULT_IMPORT_OPTIONS.resolverExtensions, importOptions.resolverExtensions),
    aliasExtensions: resolveListOption(DEFAULT_IMPORT_OPTIONS.aliasExtensions, importOptions.aliasExtensions),
    aliasMap: resolveListOption(DEFAULT_IMPORT_OPTIONS.aliasMap, importOptions.aliasMap),
  };
}
