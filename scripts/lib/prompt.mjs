import { createInterface } from 'node:readline/promises';

export function createPrompter(yes) {
  let rl;

  function getRl() {
    if (!rl) {
      rl = createInterface({ input: process.stdin, output: process.stdout });
    }
    return rl;
  }

  function close() {
    if (rl) {
      rl.close();
      rl = null;
    }
  }

  async function confirm(question, defaultValue = false) {
    if (yes) {
      return defaultValue;
    }
    const hint = defaultValue ? 'Y/n' : 'y/N';
    const answer = await getRl().question(`  ${question} (${hint}): `);
    const trimmed = answer.trim().toLowerCase();
    if (!trimmed) {
      return defaultValue;
    }
    return trimmed === 'y' || trimmed === 'yes';
  }

  async function choose(question, options, defaultValue) {
    if (yes) {
      return defaultValue;
    }
    const hint = options.join('/');
    const answer = await getRl().question(`  ${question} (${hint}): `);
    const trimmed = answer.trim().toLowerCase();
    return options.includes(trimmed) ? trimmed : defaultValue;
  }

  return { confirm, choose, close };
}

export async function collectChoices({ yes, willCreatePrettier, willCreateEslint }) {
  const choices = {
    react: false,
    testFramework: 'none',
    prettierEjs: false,
    prettierSortImports: false,
  };

  if (!willCreatePrettier && !willCreateEslint) {
    return choices;
  }

  const { confirm, choose, close } = createPrompter(yes);

  if (!yes) {
    console.log('\nConfigure new config files:\n');
  }

  if (willCreateEslint) {
    choices.react = await confirm('Use React?');
    choices.testFramework = await choose('Test framework?', ['vitest', 'jest', 'none'], 'none');
  }

  if (willCreatePrettier) {
    choices.prettierSortImports = await confirm('Add import sorting? (requires @trivago/prettier-plugin-sort-imports)');
    choices.prettierEjs = await confirm('Add EJS formatting support? (requires prettier-plugin-ejs)');
  }

  close();

  return choices;
}
