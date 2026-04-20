import prettierConfig from 'eslint-config-prettier';
import { describe, expect, it } from 'vitest';

import createEslintConfig from '../../eslint/createEslintConfig.mjs';

const minimalOptions = {
  project: undefined,
  tsconfigRootDir: undefined,
  includeImport: false,
  includeReact: false,
  includeTest: false,
};

describe('createEslintConfig', () => {
  it('should return an array', async () => {
    const config = await createEslintConfig(minimalOptions);
    expect(Array.isArray(config)).toBe(true);
  });

  it('should include at least a global-ignores entry, JS, TS, and Prettier configs', async () => {
    const config = await createEslintConfig(minimalOptions);
    expect(config.length).toBeGreaterThan(3);
  });

  it('should place the Prettier config last', async () => {
    const config = await createEslintConfig(minimalOptions);
    const last = config[config.length - 1];
    expect(last).toMatchObject(prettierConfig);
  });

  it('should insert extraConfigs before Prettier', async () => {
    const extra = { name: 'my-override', rules: { 'no-console': 'off' } };
    const config = await createEslintConfig({ ...minimalOptions, overrides: { extraConfigs: [extra] } });
    const last = config[config.length - 1];
    const secondLast = config[config.length - 2];
    expect(secondLast?.name).toBe('my-override');
    expect(last).toMatchObject(prettierConfig);
  });

  it('should propagate nameSuffix to JS config names', async () => {
    const config = await createEslintConfig({ ...minimalOptions, nameSuffix: 'app' });
    const names = config.map((c) => c.name).filter(Boolean);
    expect(names.some((n) => n.includes('app'))).toBe(true);
  });

  it('should include extraIgnores in the global-ignores entry', async () => {
    const config = await createEslintConfig({
      ...minimalOptions,
      overrides: { extraIgnores: ['**/generated/**'] },
    });
    const ignoresEntry = config.find((c) => c.ignores?.includes('**/generated/**'));
    expect(ignoresEntry).toBeDefined();
  });

  it('should not include any react-named configs when includeReact is false', async () => {
    const config = await createEslintConfig(minimalOptions);
    const names = config.map((c) => c.name).filter(Boolean);
    expect(names.some((n) => /react/i.test(n))).toBe(false);
  });

  it('should not include any import-named configs when includeImport is false', async () => {
    const config = await createEslintConfig(minimalOptions);
    const names = config.map((c) => c.name).filter(Boolean);
    expect(names.some((n) => /import/i.test(n))).toBe(false);
  });

  it('should not include any test-named configs when includeTest is false', async () => {
    const config = await createEslintConfig(minimalOptions);
    const names = config.map((c) => c.name).filter(Boolean);
    expect(names.some((n) => /test|vitest|jest/i.test(n))).toBe(false);
  });
});
