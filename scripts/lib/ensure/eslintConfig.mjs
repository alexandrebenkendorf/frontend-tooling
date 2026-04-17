import path from 'node:path';

export async function ensureEslintConfig({ cwd, packageName, write }, choices) {
  const optionLines = [];
  if (!choices.react) {
    optionLines.push(`  includeReact: false,`);
  }
  if (choices.testFramework !== 'none') {
    optionLines.push(`  testFramework: '${choices.testFramework}',`);
  }

  const extraOptions = optionLines.length > 0 ? `\n${optionLines.join('\n')}` : '';

  const content = `import createEslintConfig from '${packageName}/eslint';

export default await createEslintConfig({
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: import.meta.dirname,${extraOptions}
});
`;
  await write(path.join(cwd, 'eslint.config.mjs'), content);
}
