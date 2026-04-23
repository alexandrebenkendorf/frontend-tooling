import path from 'node:path';

export async function ensurePrettierConfig({ cwd, packageName, write }, choices) {
  let content;
  if (choices.prettierEjs && choices.prettierSortImports) {
    content = `import definePrettierConfig from '${packageName}/prettier';

export default definePrettierConfig({ ejs: true, sortImports: true });
`;
  } else if (choices.prettierEjs) {
    content = `import definePrettierConfig from '${packageName}/prettier';

export default definePrettierConfig({ ejs: true });
`;
  } else if (choices.prettierSortImports) {
    content = `import definePrettierConfig from '${packageName}/prettier';

export default definePrettierConfig({ sortImports: true });
`;
  } else {
    content = `import definePrettierConfig from '${packageName}/prettier';

export default definePrettierConfig();
`;
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
