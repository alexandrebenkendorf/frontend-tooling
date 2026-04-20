import { describe, expect, it } from 'vitest';

import { ensureEslintConfig } from '../../scripts/lib/ensure/eslintConfig.mjs';

function makeCtx(overrides = {}) {
  let writtenPath;
  let writtenContent;
  return {
    ctx: {
      cwd: '/project',
      packageName: '@test/pkg',
      write: (p, c) => {
        writtenPath = p;
        writtenContent = c;
      },
      ...overrides,
    },
    getWritten: () => ({ path: writtenPath, content: writtenContent }),
  };
}

describe('ensureEslintConfig', () => {
  it('should generate a base config with no extra options when react is enabled and no test framework is set', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: true, testFramework: 'none' });
    const { content } = getWritten();
    expect(content).toContain("import createEslintConfig from '@test/pkg/eslint'");
    expect(content).not.toContain('includeReact');
    expect(content).not.toContain('testFramework');
  });

  it('should include includeReact: false when react is disabled', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: false, testFramework: 'none' });
    expect(getWritten().content).toContain('includeReact: false');
  });

  it('should include testFramework: vitest when vitest is chosen', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: true, testFramework: 'vitest' });
    expect(getWritten().content).toContain("testFramework: 'vitest'");
  });

  it('should include testFramework: jest when jest is chosen', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: true, testFramework: 'jest' });
    expect(getWritten().content).toContain("testFramework: 'jest'");
  });

  it('should include both includeReact: false and testFramework when react is disabled and a framework is set', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: false, testFramework: 'vitest' });
    const { content } = getWritten();
    expect(content).toContain('includeReact: false');
    expect(content).toContain("testFramework: 'vitest'");
  });

  it('should write to eslint.config.mjs in the cwd', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: true, testFramework: 'none' });
    expect(getWritten().path).toBe('/project/eslint.config.mjs');
  });
});
