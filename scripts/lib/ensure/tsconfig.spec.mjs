import { describe, expect, it } from 'vitest';

import { ensureTsconfigEslintJson, ensureTsconfigJson } from './tsconfig.mjs';

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

describe('ensureTsconfigJson', () => {
  it('should extend the package tsconfig/base.json', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigJson(ctx);
    const parsed = JSON.parse(getWritten().content);
    expect(parsed.extends).toBe('@test/pkg/tsconfig/base.json');
  });

  it('should include expected file globs', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigJson(ctx);
    const parsed = JSON.parse(getWritten().content);
    expect(parsed.include).toContain('**/*.ts');
    expect(parsed.include).toContain('**/*.mjs');
  });

  it('should write to tsconfig.json in the cwd', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigJson(ctx);
    expect(getWritten().path).toBe('/project/tsconfig.json');
  });
});

describe('ensureTsconfigEslintJson', () => {
  it('should extend the local tsconfig.json', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigEslintJson(ctx);
    const parsed = JSON.parse(getWritten().content);
    expect(parsed.extends).toBe('./tsconfig.json');
  });

  it('should write to tsconfig.eslint.json in the cwd', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigEslintJson(ctx);
    expect(getWritten().path).toBe('/project/tsconfig.eslint.json');
  });
});
