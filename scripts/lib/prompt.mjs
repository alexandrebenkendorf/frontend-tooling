import { cancel, confirm, intro, isCancel, select } from '@clack/prompts';

export async function collectChoices({ yes, willCreatePrettier, willCreateEslint, flagChoices = {} }) {
  const choices = {
    react: false,
    testFramework: 'none',
    prettierSortImports: false,
    prettierEjs: false,
    ...flagChoices,
  };

  if (!willCreatePrettier && !willCreateEslint) {
    return choices;
  }

  const needsReactPrompt = willCreateEslint && flagChoices.react === undefined;
  const needsTestPrompt = willCreateEslint && flagChoices.testFramework === undefined;
  const needsSortImportsPrompt = willCreatePrettier && flagChoices.prettierSortImports === undefined;
  const needsEjsPrompt = willCreatePrettier && flagChoices.prettierEjs === undefined;
  const anyPromptsNeeded = needsReactPrompt || needsTestPrompt || needsSortImportsPrompt || needsEjsPrompt;

  if (yes || !anyPromptsNeeded) {
    return choices;
  }

  intro('Configure new config files');

  if (needsReactPrompt) {
    const result = await confirm({ message: 'Use React?' });
    if (isCancel(result)) {
      cancel('Aborted.');
      process.exit(0);
    }
    choices.react = result;
  }

  if (needsTestPrompt) {
    const result = await select({
      message: 'Test framework?',
      options: [
        { value: 'none', label: 'None' },
        { value: 'vitest', label: 'Vitest' },
        { value: 'jest', label: 'Jest' },
      ],
    });
    if (isCancel(result)) {
      cancel('Aborted.');
      process.exit(0);
    }
    choices.testFramework = result;
  }

  if (needsSortImportsPrompt) {
    const result = await confirm({
      message: 'Add import sorting? (requires @trivago/prettier-plugin-sort-imports)',
    });
    if (isCancel(result)) {
      cancel('Aborted.');
      process.exit(0);
    }
    choices.prettierSortImports = result;
  }

  if (needsEjsPrompt) {
    const result = await confirm({
      message: 'Add EJS formatting support? (requires prettier-plugin-ejs)',
    });
    if (isCancel(result)) {
      cancel('Aborted.');
      process.exit(0);
    }
    choices.prettierEjs = result;
  }

  return choices;
}
