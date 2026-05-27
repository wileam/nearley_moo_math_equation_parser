export type ArithmeticOperator = '+' | '-' | '*' | '/';
export type ComparisonOperator = '=' | '!=';

export type NumberLiteralNode = {
  type: 'NumberLiteral';
  value: number;
  raw: string;
};

export type BinaryExpressionNode = {
  type: 'BinaryExpression';
  operator: ArithmeticOperator;
  left: ArithmeticNode;
  right: ArithmeticNode;
};

export type ComparisonExpressionNode = {
  type: 'ComparisonExpression';
  operator: ComparisonOperator;
  left: ArithmeticNode;
  right: ArithmeticNode;
};

export type ArithmeticNode = NumberLiteralNode | BinaryExpressionNode;
export type ExpressionNode = ArithmeticNode | ComparisonExpressionNode;

export type ParseErrorDetails = {
  message: string;
  offset?: number;
  line?: number;
  column?: number;
  token?: string;
};

export type ParseSuccess = {
  ok: true;
  ast: ExpressionNode;
  result: boolean | number;
  isStatement: boolean;
};

export type ParseFailure = {
  ok: false;
  error: ParseErrorDetails;
};

export type ParseResult = ParseSuccess | ParseFailure;
