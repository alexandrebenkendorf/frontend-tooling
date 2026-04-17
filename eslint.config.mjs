import createEslintConfig from './eslint/createEslintConfig.mjs';

export default await createEslintConfig({
  project: ['./tsconfig/eslint.json'],
  tsconfigRootDir: import.meta.dirname,
  includeImport: false,
  includeReact: false,
  includeTest: false,
});
