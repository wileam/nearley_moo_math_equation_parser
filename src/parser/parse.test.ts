import { describe, expect, it } from 'vitest';
import { parseExpression } from './parse';

const requiredExamples = [
  ['1 + 2 = 3', true],
  ['2 * 3 + 4 = 10', true],
  ['2 * (3 + 4) = 10', false],
  ['6 = 10 / 2 + 1', true],
  ['12 + 3 != 4 / 2 + 5', true],
  ['2 + 3 * 2 = 10', false],
  ['2 * 3 + 4 != 10', false],
] as const;

const additionalExamples = [
  ['(8 - 2) / 3 = 2', true],
  ['7 != 3 + 4', false],
  ['18 / (3 * 3) + 1 = 3', true],
  ['3.5 * 2 = 7', true],
] as const;

describe('parseExpression', () => {
  it.each(requiredExamples)('evaluates required example %s', (input, expected) => {
    const result = parseExpression(input);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.isStatement).toBe(true);
      expect(result.result).toBe(expected);
    }
  });

  it.each(additionalExamples)('evaluates additional example %s', (input, expected) => {
    const result = parseExpression(input);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result).toBe(expected);
    }
  });

  it('returns an arithmetic AST and numeric result for expressions without comparison operators', () => {
    const result = parseExpression('2 + 3 * (4 - 1)');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.isStatement).toBe(false);
      expect(result.result).toBe(11);
      expect(result.ast).toMatchObject({
        type: 'BinaryExpression',
        operator: '+',
        right: {
          type: 'BinaryExpression',
          operator: '*',
        },
      });
    }
  });

  it('reports an error location for malformed input', () => {
    const result = parseExpression('1 + (2 = 3');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.token).toBe('=');
      expect(result.error.offset).toBe(7);
      expect(result.error.line).toBe(1);
      expect(result.error.column).toBe(8);
    }
  });
});
