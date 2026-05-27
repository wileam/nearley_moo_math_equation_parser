import nearley from 'nearley';
import grammar from './generated/mathParser';
import { evaluateExpression } from './evaluate';
import type { ExpressionNode, ParseErrorDetails, ParseResult } from './types';

type MooTokenLike = {
  value?: string;
  text?: string;
  offset?: number;
  line?: number;
  col?: number;
};

const getErrorToken = (error: unknown): MooTokenLike | undefined => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const maybeError = error as { token?: MooTokenLike };
  return maybeError.token;
};

const normalizeNearleyError = (error: unknown): ParseErrorDetails => {
  const token = getErrorToken(error);
  const message = error instanceof Error ? error.message : 'Invalid expression.';

  if (!token) {
    return { message };
  }

  return {
    message,
    offset: token.offset,
    line: token.line,
    column: token.col,
    token: token.value ?? token.text,
  };
};

export const parseExpression = (input: string): ParseResult => {
  try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(input);

    if (parser.results.length !== 1) {
      return {
        ok: false,
        error: {
          message:
            parser.results.length === 0
              ? 'Invalid expression.'
              : 'Ambiguous expression grammar produced multiple parse results.',
        },
      };
    }

    const ast = parser.results[0] as ExpressionNode;

    return {
      ok: true,
      ast,
      result: evaluateExpression(ast),
      isStatement: ast.type === 'ComparisonExpression',
    };
  } catch (error) {
    return {
      ok: false,
      error: normalizeNearleyError(error),
    };
  }
};
