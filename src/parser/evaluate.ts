import type {
  ArithmeticNode,
  BinaryExpressionNode,
  ComparisonExpressionNode,
  ExpressionNode,
} from './types';

const evaluateBinaryExpression = (node: BinaryExpressionNode): number => {
  const left = evaluateArithmetic(node.left);
  const right = evaluateArithmetic(node.right);

  switch (node.operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
  }
};

export const evaluateArithmetic = (node: ArithmeticNode): number => {
  if (node.type === 'NumberLiteral') {
    return node.value;
  }

  return evaluateBinaryExpression(node);
};

export const evaluateComparison = (node: ComparisonExpressionNode): boolean => {
  const left = evaluateArithmetic(node.left);
  const right = evaluateArithmetic(node.right);

  switch (node.operator) {
    case '=':
      return left === right;
    case '!=':
      return left !== right;
  }
};

export const evaluateExpression = (node: ExpressionNode): boolean | number => {
  if (node.type === 'ComparisonExpression') {
    return evaluateComparison(node);
  }

  return evaluateArithmetic(node);
};
