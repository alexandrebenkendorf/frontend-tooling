import { baseConfig, ejsConfig, sortImportsConfig } from './config.prettier.mjs';

/**
 * Builds a merged Prettier config from the shared base, opt-in plugins, and
 * consumer overrides.
 *
 * Pass `ejs: true` and/or `sortImports: true` to enable the corresponding
 * plugins. Any other keys are treated as Prettier overrides applied last.
 * All `plugins` arrays are flattened automatically.
 *
 * @param {{ ejs?: boolean; sortImports?: boolean; [key: string]: unknown }} [options={}]
 * @returns {Record<string, unknown>} Merged Prettier config.
 */
export function definePrettierConfig({ ejs = false, sortImports = false, ...overrides } = {}) {
  const pluginConfigs = [...(ejs ? [ejsConfig] : []), ...(sortImports ? [sortImportsConfig] : [])];
  const allConfigs = [baseConfig, ...pluginConfigs, overrides];
  const plugins = allConfigs.flatMap((c) => c.plugins ?? []);
  const merged = Object.assign({}, ...allConfigs);
  if (plugins.length) {
    merged.plugins = plugins;
  } else {
    delete merged.plugins;
  }
  return merged;
}
