import { describe, expect, it } from 'vitest';

import { detectLegacyEslintDependencies } from '../../scripts/lib/detect.mjs';

describe('detectLegacyEslintDependencies', () => {
  it('should return an empty array when there are no legacy deps', () => {
    expect(detectLegacyEslintDependencies({ devDependencies: { eslint: '^9.0.0' } })).toEqual([]);
  });

  it('should detect eslint-config-airbnb', () => {
    const pkg = { devDependencies: { 'eslint-config-airbnb': '^19.0.0' } };
    expect(detectLegacyEslintDependencies(pkg)).toContain('eslint-config-airbnb');
  });

  it('should detect eslint-config-airbnb-base', () => {
    const pkg = { devDependencies: { 'eslint-config-airbnb-base': '^15.0.0' } };
    expect(detectLegacyEslintDependencies(pkg)).toContain('eslint-config-airbnb-base');
  });

  it('should detect babel-eslint', () => {
    const pkg = { dependencies: { 'babel-eslint': '^10.0.0' } };
    expect(detectLegacyEslintDependencies(pkg)).toContain('babel-eslint');
  });

  it('should detect @babel/eslint-parser', () => {
    const pkg = { devDependencies: { '@babel/eslint-parser': '^7.0.0' } };
    expect(detectLegacyEslintDependencies(pkg)).toContain('@babel/eslint-parser');
  });

  it('should handle missing dependencies fields gracefully', () => {
    expect(detectLegacyEslintDependencies({})).toEqual([]);
  });

  it('should merge dependencies and devDependencies when scanning', () => {
    const pkg = {
      dependencies: { 'eslint-config-standard': '^17.0.0' },
      devDependencies: { 'babel-eslint': '^10.0.0' },
    };
    const result = detectLegacyEslintDependencies(pkg);
    expect(result).toContain('eslint-config-standard');
    expect(result).toContain('babel-eslint');
  });
});
