import baseConfig from './lint-staged/index.mjs';

export default {
  ...baseConfig,
  '{package.json,README.md,AGENTS.md,DEVELOPMENT.md,eslint/**/*,lint-staged.config.mjs,lint-staged/**/*,prettier/**/*,scripts/init.mjs,tsconfig*.json}':
    () => 'npm pack --dry-run --cache /tmp/frontend-tooling-npm-cache',
};
