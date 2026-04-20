import { describe, expect, it } from 'vitest';

import { ensurePrettierConfig, ensurePrettierIgnore } from './prettier.mjs';

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
  it('should generate a re-export for the base config when no plugins are selected', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensurePrettierConfig(ctx, { prettierEjs: false, prettierSortImports: false });
    expect(getWritten().content).toBe("export { default } from '@test/pkg/prettier';\n");
  });

  it('should generate a config with ejsConfig only when prettierEjs is enabled', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensurePrettierConfig(ctx, { prettierEjs: true, prettierSortImports: false });
    const { content } = getWritten();
    expect(content).toContain('ejsConfig');
    expect(content).not.toContain('sortImportsConfig');
  });

  it('should generate a config with sortImportsConfig only when prettierSortImports is enabled', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensurePrettierConfig(ctx, { prettierEjs: false, prettierSortImports: true });
    const { content } = getWritten();
    expect(content).toContain('sortImportsConfig');
    expect(content).not.toContain('ejsConfig');
  });

  it('should generate a config with both ejsConfig and sortImportsConfig when both plugins are enabled', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensurePrettierConfig(ctx, { prettierEjs: true, prettierSortImports: true });
    const { content } = getWritten();
    expect(content).toContain('ejsConfig');
    expect(content).toContain('sortImportsConfig');
    expect(content).toContain('plugins: [...ejsConfig.plugins, ...sortImportsConfig.plugins]');
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
