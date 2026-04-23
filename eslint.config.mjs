import defineEslintConfig from './eslint/defineEslintConfig.mjs';

export default await defineEslintConfig({
  project: ['./tsconfig/eslint.json'],
  tsconfigRootDir: import.meta.dirname,
});
