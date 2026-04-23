import path from 'node:path';

export async function ensureEslintConfig({ cwd, packageName, write }, choices) {
  const optionLines = [`  includeImport: true,`];
  if (choices.react) {
    optionLines.push(`  includeReact: true,`);
  }
  if (choices.testFramework !== 'none') {
    optionLines.push(`  includeTest: true,`);
    optionLines.push(`  testFramework: '${choices.testFramework}',`);
  }

  const extraOptions = `\n${optionLines.join('\n')}`;

  const content = `import defineEslintConfig from '${packageName}/eslint';

export default await defineEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,${extraOptions}
});
`;
  await write(path.join(cwd, 'eslint.config.mjs'), content);
}
