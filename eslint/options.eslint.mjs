import { resolveListOption } from './helpers.eslint.mjs';

const TEST_FILE_SUFFIXES = ['test', 'spec', 'vitest', 'bench', 'e2e', 'cy'];
const TEST_JS_FILE_GLOB = `**/*.{${TEST_FILE_SUFFIXES.join(',')}}.{js,jsx,mjs,cjs}`;
const TEST_TS_FILE_GLOB = `**/*.{${TEST_FILE_SUFFIXES.join(',')}}.{ts,tsx,mts,cts}`;
const DEV_TEST_FILE_GLOB = `**/*.{${TEST_FILE_SUFFIXES.join(',')}}.{js,jsx,ts,tsx,mjs,cjs,mts,cts}`;

export const DEFAULT_PATTERNS = {
  jsFiles: ['**/*.{js,jsx,mjs,cjs}'],
  tsFiles: ['**/*.{ts,tsx,mts,cts}'],
  reactJsFiles: ['**/*.jsx'],
  reactTsFiles: ['**/*.tsx'],
  srcJsFiles: ['**/src/**/*.{js,jsx,mjs,cjs}'],
  srcTsFiles: ['**/src/**/*.{ts,tsx,mts,cts}'],
  testJsFiles: [TEST_JS_FILE_GLOB, '**/__tests__/**/*.{js,jsx,mjs,cjs}', '**/__mocks__/**/*.{js,jsx,mjs,cjs}'],
  testTsFiles: [TEST_TS_FILE_GLOB, '**/__tests__/**/*.{ts,tsx,mts,cts}', '**/__mocks__/**/*.{ts,tsx,mts,cts}'],
  importDevDependencyFiles: [
    'build/**/*',
    'scripts/**/*',
    'eslint/**/*',
    'eslint.*',
    '.storybook/**/*',
    DEV_TEST_FILE_GLOB,
    '**/*.test-utils.{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
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
  '**/*.ejs',
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

export function resolveIgnores(ignores) {
  return resolveListOption(DEFAULT_IGNORES, ignores);
}

export function resolveImportOptions(importOptions = {}) {
  return {
    resolverExtensions: resolveListOption(DEFAULT_IMPORT_OPTIONS.resolverExtensions, importOptions.resolverExtensions),
    aliasExtensions: resolveListOption(DEFAULT_IMPORT_OPTIONS.aliasExtensions, importOptions.aliasExtensions),
    aliasMap: resolveListOption(DEFAULT_IMPORT_OPTIONS.aliasMap, importOptions.aliasMap),
  };
}
