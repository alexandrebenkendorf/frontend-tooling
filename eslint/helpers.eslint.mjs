export function createConfigName(baseName, nameSuffix = '') {
  return nameSuffix ? `${baseName}/${nameSuffix}` : baseName;
}

export function resolveListOption(defaultValues, option) {
  if (option == null) {
    return [...defaultValues];
  }

  if (Array.isArray(option)) {
    return [...option];
  }

  const { extend = [], replace = false } = option;
  return [...(replace ? [] : defaultValues), ...extend];
}

export function mergeRules(...ruleSets) {
  return Object.assign({}, ...ruleSets.filter(Boolean));
}
