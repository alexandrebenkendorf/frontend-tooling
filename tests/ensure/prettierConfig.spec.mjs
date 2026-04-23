import { describe, expect, it } from 'vitest';

import { ensurePrettierConfig, ensurePrettierIgnore } from '../../scripts/lib/ensure/prettierConfig.mjs';

function makeCtx() {
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
    },
    getWritten: () => ({ path: writtenPath, content: writtenContent }),
  };
}

describe('ensurePrettierConfig', () => {
  it('should generate a base definePrettierConfig call when no plugins are selected', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensurePrettierConfig(ctx, { prettierEjs: false, prettierSortImports: false });
    const { content } = getWritten();
    expect(content).toContain('definePrettierConfig');
    expect(content).not.toContain('ejs');
    expect(content).not.toContain('sortImports');
  });

  it('should generate a config with ejs: true when prettierEjs is enabled', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensurePrettierConfig(ctx, { prettierEjs: true, prettierSortImports: false });
    const { content } = getWritten();
    expect(content).toContain('ejs: true');
    expect(content).not.toContain('sortImports');
  });

  it('should generate a config with sortImports: true when prettierSortImports is enabled', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensurePrettierConfig(ctx, { prettierEjs: false, prettierSortImports: true });
    const { content } = getWritten();
    expect(content).toContain('sortImports: true');
    expect(content).not.toContain('ejs: true');
  });

  it('should generate a config with both flags when both plugins are enabled', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensurePrettierConfig(ctx, { prettierEjs: true, prettierSortImports: true });
    const { content } = getWritten();
    expect(content).toContain('ejs: true');
    expect(content).toContain('sortImports: true');
  });

  it('should write to prettier.config.mjs in the cwd', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensurePrettierConfig(ctx, { prettierEjs: false, prettierSortImports: false });
    expect(getWritten().path).toBe('/project/prettier.config.mjs');
  });
});

describe('ensurePrettierIgnore', () => {
  it('should write .prettierignore with expected ignore patterns', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensurePrettierIgnore(ctx);
    const { content, path } = getWritten();
    expect(path).toBe('/project/.prettierignore');
    expect(content).toContain('dist');
    expect(content).toContain('node_modules');
    expect(content).toContain('coverage');
    expect(content).toContain('package-lock.json');
  });
});
