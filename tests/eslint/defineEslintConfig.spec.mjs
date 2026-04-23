import prettierConfig from 'eslint-config-prettier';
import { describe, expect, it } from 'vitest';

import defineEslintConfig from '../../eslint/defineEslintConfig.mjs';

const minimalOptions = {
  project: undefined,
  tsconfigRootDir: undefined,
};

describe('defineEslintConfig', () => {
  it('should return an array', async () => {
    const config = await defineEslintConfig(minimalOptions);
    expect(Array.isArray(config)).toBe(true);
  });

  it('should include at least a global-ignores entry, JS, TS, and Prettier configs', async () => {
    const config = await defineEslintConfig(minimalOptions);
    expect(config.length).toBeGreaterThan(3);
  });

  it('should place the Prettier config last', async () => {
    const config = await defineEslintConfig(minimalOptions);
    const last = config[config.length - 1];
    expect(last).toMatchObject(prettierConfig);
  });

  it('should insert extraConfigs before Prettier', async () => {
    const extra = { name: 'my-override', rules: { 'no-console': 'off' } };
    const config = await defineEslintConfig({ ...minimalOptions, extraConfigs: [extra] });
    const last = config[config.length - 1];
    const secondLast = config[config.length - 2];
    expect(secondLast?.name).toBe('my-override');
    expect(last).toMatchObject(prettierConfig);
  });

  it('should propagate nameSuffix to JS config names', async () => {
    const config = await defineEslintConfig({ ...minimalOptions, nameSuffix: 'app' });
    const names = config.map((c) => c.name).filter(Boolean);
    expect(names.some((n) => n.includes('app'))).toBe(true);
  });

  it('should include extended ignores in the global-ignores entry', async () => {
    const config = await defineEslintConfig({
      ...minimalOptions,
      ignores: { extend: ['**/generated/**'] },
    });
    const ignoresEntry = config.find((c) => c.ignores?.includes('**/generated/**'));
    expect(ignoresEntry).toBeDefined();
  });

  it('should not include any react-named configs when includeReact is false', async () => {
    const config = await defineEslintConfig(minimalOptions);
    const names = config.map((c) => c.name).filter(Boolean);
    expect(names.some((n) => /react/i.test(n))).toBe(false);
  });

  it('should not include any import-named configs when includeImport is false', async () => {
    const config = await defineEslintConfig(minimalOptions);
    const names = config.map((c) => c.name).filter(Boolean);
    expect(names.some((n) => /import/i.test(n))).toBe(false);
  });

  it('should not include any test-named configs when includeTest is false', async () => {
    const config = await defineEslintConfig(minimalOptions);
    const names = config.map((c) => c.name).filter(Boolean);
    expect(names.some((n) => /test|vitest|jest/i.test(n))).toBe(false);
  });
});
