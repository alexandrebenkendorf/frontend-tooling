import path from 'node:path';

export async function ensurePrettierConfig({ cwd, packageName, write }, choices) {
  let content;
  if (choices.prettierEjs && choices.prettierSortImports) {
    content = `import baseConfig, { ejsConfig, sortImportsConfig } from '${packageName}/prettier';

export default {
  ...baseConfig,
  ...ejsConfig,
  ...sortImportsConfig,
  plugins: [...ejsConfig.plugins, ...sortImportsConfig.plugins],
};
`;
  } else if (choices.prettierEjs) {
    content = `import baseConfig, { ejsConfig } from '${packageName}/prettier';

export default { ...baseConfig, ...ejsConfig };
`;
  } else if (choices.prettierSortImports) {
    content = `import baseConfig, { sortImportsConfig } from '${packageName}/prettier';

export default { ...baseConfig, ...sortImportsConfig };
`;
  } else {
    content = `export { default } from '${packageName}/prettier';\n`;
  }

  await write(path.join(cwd, 'prettier.config.mjs'), content);
}

export async function ensurePrettierIgnore({ cwd, write }) {
  const content = `dist
node_modules
coverage
*.min.js
*.min.css
package-lock.json
yarn.lock
pnpm-lock.yaml
`;
  await write(path.join(cwd, '.prettierignore'), content);
}
