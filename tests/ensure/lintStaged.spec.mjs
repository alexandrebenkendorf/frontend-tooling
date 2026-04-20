import { describe, expect, it } from 'vitest';

import { ensureLintStagedConfig } from '../../scripts/lib/ensure/lintStaged.mjs';

describe('ensureLintStagedConfig', () => {
  it('should generate a config that imports from the package', async () => {
    let writtenPath;
    let writtenContent;
    const ctx = {
      cwd: '/project',
      packageName: '@test/pkg',
      write: (p, c) => {
        writtenPath = p;
        writtenContent = c;
      },
    };

    await ensureLintStagedConfig(ctx);

    expect(writtenPath).toBe('/project/lint-staged.config.mjs');
    expect(writtenContent).toContain("from '@test/pkg/lint-staged'");
    expect(writtenContent).toContain('export default config');
  });
});
