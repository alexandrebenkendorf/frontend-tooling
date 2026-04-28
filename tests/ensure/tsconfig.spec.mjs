import { describe, expect, it } from 'vitest';

import {
  ensureTsconfigEslintJson,
  ensureTsconfigJson,
  ensureTsconfigNodeJson,
} from '../../scripts/lib/ensure/tsconfig.mjs';

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
  it('should extend the package tsconfig/base.json by default', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigJson(ctx);
    const parsed = JSON.parse(getWritten().content);
    expect(parsed.extends).toBe('@test/pkg/tsconfig/base.json');
  });

  it('should extend tsconfig/react.json when react: true', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigJson(ctx, { react: true });
    const parsed = JSON.parse(getWritten().content);
    expect(parsed.extends).toBe('@test/pkg/tsconfig/react.json');
  });

  it('should extend tsconfig/base.json when react: false', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigJson(ctx, { react: false });
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

describe('ensureTsconfigNodeJson', () => {
  it('should extend the package tsconfig/node.json', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigNodeJson(ctx);
    const parsed = JSON.parse(getWritten().content);
    expect(parsed.extends).toBe('@test/pkg/tsconfig/node.json');
  });

  it('should include tooling/config file globs', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigNodeJson(ctx);
    const parsed = JSON.parse(getWritten().content);
    expect(parsed.include).toContain('vite.config.ts');
    expect(parsed.include).toContain('*.config.ts');
  });

  it('should write to tsconfig.node.json in the cwd', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigNodeJson(ctx);
    expect(getWritten().path).toBe('/project/tsconfig.node.json');
  });
});

describe('ensureTsconfigEslintJson', () => {
  it('should reference both tsconfig.json and tsconfig.node.json', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigEslintJson(ctx);
    const parsed = JSON.parse(getWritten().content);
    expect(parsed.references).toContainEqual({ path: './tsconfig.json' });
    expect(parsed.references).toContainEqual({ path: './tsconfig.node.json' });
  });

  it('should set files to empty array', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigEslintJson(ctx);
    const parsed = JSON.parse(getWritten().content);
    expect(parsed.files).toEqual([]);
  });

  it('should write to tsconfig.eslint.json in the cwd', async () => {
    const { ctx, getWritten } = makeCtx();
    await ensureTsconfigEslintJson(ctx);
    expect(getWritten().path).toBe('/project/tsconfig.eslint.json');
  });
});
