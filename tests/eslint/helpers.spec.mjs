import { describe, expect, it } from 'vitest';

import { createConfigName, mergeRules, resolveListOption } from '../../eslint/helpers.eslint.mjs';

describe('createConfigName', () => {
  it('should return the base name when no suffix is provided', () => {
    expect(createConfigName('js')).toBe('js');
  });

  it('should return the base name when suffix is an empty string', () => {
    expect(createConfigName('js', '')).toBe('js');
  });

  it('should append the suffix separated by a slash when provided', () => {
    expect(createConfigName('js', 'my-app')).toBe('js/my-app');
  });
});

describe('resolveListOption', () => {
  const defaults = ['a', 'b'];

  it('should return a copy of defaults when option is null', () => {
    expect(resolveListOption(defaults, null)).toEqual(['a', 'b']);
  });

  it('should return a copy of defaults when option is undefined', () => {
    expect(resolveListOption(defaults, undefined)).toEqual(['a', 'b']);
  });

  it('should return a copy of the array when option is an array', () => {
    expect(resolveListOption(defaults, ['c'])).toEqual(['c']);
  });

  it('should extend defaults when option has extend', () => {
    expect(resolveListOption(defaults, { extend: ['c'] })).toEqual(['a', 'b', 'c']);
  });

  it('should replace defaults when option has replace: true', () => {
    expect(resolveListOption(defaults, { replace: true, extend: ['c'] })).toEqual(['c']);
  });

  it('should return defaults when option has empty extend and no replace', () => {
    expect(resolveListOption(defaults, { extend: [] })).toEqual(['a', 'b']);
  });
});

describe('mergeRules', () => {
  it('should return an empty object when no rule sets are provided', () => {
    expect(mergeRules()).toEqual({});
  });

  it('should return the rules from a single rule set', () => {
    expect(mergeRules({ 'no-console': 'error' })).toEqual({ 'no-console': 'error' });
  });

  it('should merge multiple rule sets with later sets winning', () => {
    const base = { 'no-console': 'warn', eqeqeq: 'error' };
    const override = { 'no-console': 'off' };
    expect(mergeRules(base, override)).toEqual({ 'no-console': 'off', eqeqeq: 'error' });
  });

  it('should ignore null and undefined rule sets', () => {
    expect(mergeRules({ 'no-console': 'error' }, null, undefined)).toEqual({ 'no-console': 'error' });
  });
});
