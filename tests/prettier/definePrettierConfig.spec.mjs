import { describe, expect, it } from 'vitest';

import definePrettierConfig from '../../prettier/index.mjs';

describe('definePrettierConfig', () => {
  it('should include the base config properties when called with no arguments', () => {
    const result = definePrettierConfig();
    expect(result.singleQuote).toBe(true);
    expect(result.printWidth).toBe(120);
    expect(result.semi).toBe(true);
  });

  it('should not include a plugins key when no flags are passed', () => {
    const result = definePrettierConfig();
    expect(result.plugins).toBeUndefined();
  });

  it('should include ejs plugin when ejs: true', () => {
    const result = definePrettierConfig({ ejs: true });
    expect(result.plugins).toEqual(['prettier-plugin-ejs']);
  });

  it('should include sort-imports plugin when sortImports: true', () => {
    const result = definePrettierConfig({ sortImports: true });
    expect(result.plugins).toEqual(['@trivago/prettier-plugin-sort-imports']);
  });

  it('should include both plugins when both flags are true', () => {
    const result = definePrettierConfig({ ejs: true, sortImports: true });
    expect(result.plugins).toContain('prettier-plugin-ejs');
    expect(result.plugins).toContain('@trivago/prettier-plugin-sort-imports');
    expect(result.plugins).toHaveLength(2);
  });

  it('should apply consumer overrides on top of the base config', () => {
    const result = definePrettierConfig({ printWidth: 80 });
    expect(result.printWidth).toBe(80);
    expect(result.singleQuote).toBe(true);
  });

  it('should not include ejs or sortImports keys in output', () => {
    const result = definePrettierConfig({ ejs: true, sortImports: true });
    expect(result.ejs).toBeUndefined();
    expect(result.sortImports).toBeUndefined();
  });

  it('should not mutate the base config', () => {
    definePrettierConfig({ printWidth: 80 });
    const base = definePrettierConfig();
    expect(base.printWidth).toBe(120);
  });
});
