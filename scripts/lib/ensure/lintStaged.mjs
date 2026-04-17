import path from 'node:path';

export async function ensureLintStagedConfig({ cwd, packageName, write }) {
  const content = `import config from '${packageName}/lint-staged';

export default config;
`;
  await write(path.join(cwd, 'lint-staged.config.mjs'), content);
}
