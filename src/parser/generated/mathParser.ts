import moo from 'moo';
import type { CompiledRules, Lexer, Postprocessor } from 'nearley';

const lexer = moo.compile({
  WS: { match: /[ \t\r\n]+/, lineBreaks: true },
  number: /(?:\d+(?:\.\d*)?|\.\d+)/,
  neq: '!=',
  eq: '=',
  plus: '+',
  minus: '-',
  times: '*',
  divide: '/',
  lparen: '(',
  rparen: ')',
});

const lexerNext = lexer.next.bind(lexer);
lexer.next = () => {
  let token;

  while ((token = lexerNext()) && token.type === 'WS') {
    // Whitespace is insignificant for this expression grammar.
  }

  return token;
};

const passThrough = ([value]: unknown[]) => value;

const asPostprocessor = (fn: (data: unknown[]) => unknown) => fn as unknown as Postprocessor;

const numberNode = ([token]: unknown[]) => ({
  type: 'NumberLiteral',
  value: Number((token as moo.Token).value),
  raw: (token as moo.Token).value,
});

const binaryNode = ([left, operator, right]: unknown[]) => ({
  type: 'BinaryExpression',
  operator: (operator as moo.Token).value,
  left,
  right,
});

const comparisonNode = ([left, operator, right]: unknown[]) => ({
  type: 'ComparisonExpression',
  operator: (operator as moo.Token).value,
  left,
  right,
});

const token = (type: string) => ({ type });

const grammar: CompiledRules = {
  Lexer: lexer as unknown as Lexer,
  ParserRules: [
    { name: 'Expression', symbols: ['Comparison'], postprocess: asPostprocessor(passThrough) },
    { name: 'Expression', symbols: ['Arithmetic'], postprocess: asPostprocessor(passThrough) },
    {
      name: 'Comparison',
      symbols: ['Arithmetic', 'ComparisonOperator', 'Arithmetic'],
      postprocess: asPostprocessor(comparisonNode),
    },
    { name: 'ComparisonOperator', symbols: [token('eq')], postprocess: asPostprocessor(passThrough) },
    { name: 'ComparisonOperator', symbols: [token('neq')], postprocess: asPostprocessor(passThrough) },
    { name: 'Arithmetic', symbols: ['Additive'], postprocess: asPostprocessor(passThrough) },
    {
      name: 'Additive',
      symbols: ['Additive', token('plus'), 'Multiplicative'],
      postprocess: asPostprocessor(binaryNode),
    },
    {
      name: 'Additive',
      symbols: ['Additive', token('minus'), 'Multiplicative'],
      postprocess: asPostprocessor(binaryNode),
    },
    { name: 'Additive', symbols: ['Multiplicative'], postprocess: asPostprocessor(passThrough) },
    {
      name: 'Multiplicative',
      symbols: ['Multiplicative', token('times'), 'Primary'],
      postprocess: asPostprocessor(binaryNode),
    },
    {
      name: 'Multiplicative',
      symbols: ['Multiplicative', token('divide'), 'Primary'],
      postprocess: asPostprocessor(binaryNode),
    },
    { name: 'Multiplicative', symbols: ['Primary'], postprocess: asPostprocessor(passThrough) },
    { name: 'Primary', symbols: [token('number')], postprocess: asPostprocessor(numberNode) },
    {
      name: 'Primary',
      symbols: [token('lparen'), 'Arithmetic', token('rparen')],
      postprocess: asPostprocessor(([, expression]) => expression),
    },
  ],
  ParserStart: 'Expression',
};

export default grammar;
