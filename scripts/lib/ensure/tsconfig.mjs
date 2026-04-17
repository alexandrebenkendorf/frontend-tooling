import path from 'node:path';

export async function ensureTsconfigJson({ cwd, packageName, write }) {
  const content = `{
  "extends": "${packageName}/tsconfig/base.json",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
`;
  await write(path.join(cwd, 'tsconfig.json'), content);
}

export async function ensureTsconfigEslintJson({ cwd, write }) {
  const content = `{
  "extends": "./tsconfig.json",
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"]
}
`;
  await write(path.join(cwd, 'tsconfig.eslint.json'), content);
}
