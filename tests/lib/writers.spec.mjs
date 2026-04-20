import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createWriters } from '../../scripts/lib/writers.mjs';

vi.mock('node:fs', () => ({ existsSync: vi.fn() }));
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

function makeWriters(overrides = {}) {
  const results = [];
  const writers = createWriters({
    cwd: '/project',
    dryRun: false,
    force: false,
    skipHusky: false,
    packageName: '@test/pkg',
    packageVersion: '1.0.0',
    peerDependencies: {},
    packageDevDependencies: {},
    logResult: (status, target, detail) => results.push({ status, target, detail }),
    packageRoot: '/pkg',
    ...overrides,
  });
  return { writers, results };
}

describe('createWriters write()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // ensureEditorConfig reads .editorconfig from packageRoot via readFile
    readFile.mockResolvedValue('editor-content');
  });

  it('should log "skipped" and not write when the file exists and force is false', async () => {
    existsSync.mockReturnValue(true);
    const { writers, results } = makeWriters({ force: false });

    await writers.ensureEditorConfig();

    expect(writeFile).not.toHaveBeenCalled();
    expect(results).toContainEqual(expect.objectContaining({ status: 'skipped' }));
  });

  it('should log "would create" in dry-run mode when the file does not exist', async () => {
    existsSync.mockReturnValue(false);
    const { writers, results } = makeWriters({ dryRun: true });

    await writers.ensureEditorConfig();

    expect(writeFile).not.toHaveBeenCalled();
    expect(results).toContainEqual(expect.objectContaining({ status: 'would create' }));
  });

  it('should log "would update" in dry-run mode when the file already exists', async () => {
    existsSync.mockReturnValue(true);
    const { writers, results } = makeWriters({ dryRun: true, force: true });

    await writers.ensureEditorConfig();

    expect(writeFile).not.toHaveBeenCalled();
    expect(results).toContainEqual(expect.objectContaining({ status: 'would update' }));
  });

  it('should write the file and log "created" when the file does not exist', async () => {
    existsSync.mockReturnValue(false);
    const { writers, results } = makeWriters();

    await writers.ensureEditorConfig();

    expect(writeFile).toHaveBeenCalledWith('/project/.editorconfig', 'editor-content', 'utf8');
    expect(results).toContainEqual(expect.objectContaining({ status: 'created', target: '.editorconfig' }));
  });

  it('should write the file and log "updated" when force is true and file exists', async () => {
    existsSync.mockReturnValue(true);
    const { writers, results } = makeWriters({ force: true });

    await writers.ensureEditorConfig();

    expect(writeFile).toHaveBeenCalledWith('/project/.editorconfig', 'editor-content', 'utf8');
    expect(results).toContainEqual(expect.objectContaining({ status: 'updated', target: '.editorconfig' }));
  });
});
