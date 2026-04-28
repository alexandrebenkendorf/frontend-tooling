import path from 'node:path';

export async function ensureTsconfigJson({ cwd, packageName, write }, { react = false } = {}) {
  const base = react ? `${packageName}/tsconfig/react.json` : `${packageName}/tsconfig/base.json`;
  const content = `{
  "extends": "${base}",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
`;
  await write(path.join(cwd, 'tsconfig.json'), content);
}

export async function ensureTsconfigNodeJson({ cwd, packageName, write }) {
  const content = `{
  "extends": "${packageName}/tsconfig/node.json",
  "include": ["vite.config.ts", "vite.config.mts", "*.config.ts", "*.config.mts", "scripts/**/*"]
}
`;
  await write(path.join(cwd, 'tsconfig.node.json'), content);
}

export async function ensureTsconfigEslintJson({ cwd, write }) {
  const content = `{
  "files": [],
  "references": [{ "path": "./tsconfig.json" }, { "path": "./tsconfig.node.json" }]
}
`;
  await write(path.join(cwd, 'tsconfig.eslint.json'), content);
}
