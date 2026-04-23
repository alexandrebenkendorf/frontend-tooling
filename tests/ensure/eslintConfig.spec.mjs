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
  it('should always include includeImport: true', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: false, testFramework: 'none' });
    expect(getWritten().content).toContain('includeImport: true');
  });

  it('should include includeReact: true when react is enabled', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: true, testFramework: 'none' });
    expect(getWritten().content).toContain('includeReact: true');
  });

  it('should not include includeReact when react is disabled', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: false, testFramework: 'none' });
    expect(getWritten().content).not.toContain('includeReact');
  });

  it('should include includeTest: true and testFramework when a framework is chosen', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: true, testFramework: 'vitest' });
    const { content } = getWritten();
    expect(content).toContain('includeTest: true');
    expect(content).toContain("testFramework: 'vitest'");
  });

  it('should include testFramework: jest when jest is chosen', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: true, testFramework: 'jest' });
    expect(getWritten().content).toContain("testFramework: 'jest'");
  });

  it('should not include includeTest or testFramework when no framework is set', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: true, testFramework: 'none' });
    const { content } = getWritten();
    expect(content).not.toContain('includeTest');
    expect(content).not.toContain('testFramework');
  });

  it('should write to eslint.config.mjs in the cwd', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureEslintConfig(ctx, { react: true, testFramework: 'none' });
    expect(getWritten().path).toBe('/project/eslint.config.mjs');
  });
});
