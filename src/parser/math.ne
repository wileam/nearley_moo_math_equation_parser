@{%
const moo = require("moo");

const lexer = moo.compile({
  WS: { match: /[ \t\r\n]+/, lineBreaks: true },
  number: /(?:\d+(?:\.\d*)?|\.\d+)/,
  neq: "!=",
  eq: "=",
  plus: "+",
  minus: "-",
  times: "*",
  divide: "/",
  lparen: "(",
  rparen: ")",
});

const lexerNext = lexer.next.bind(lexer);
lexer.next = () => {
  let token;

  while ((token = lexerNext()) && token.type === "WS") {
    // Whitespace is insignificant for this expression grammar.
  }

  return token;
};

const passThrough = ([value]) => value;
const numberNode = ([token]) => ({
  type: "NumberLiteral",
  value: Number(token.value),
  raw: token.value,
});

const binaryNode = ([left, operator, right]) => ({
  type: "BinaryExpression",
  operator: operator.value,
  left,
  right,
});

const comparisonNode = ([left, operator, right]) => ({
  type: "ComparisonExpression",
  operator: operator.value,
  left,
  right,
});
%}

@lexer lexer

Expression -> Comparison {% passThrough %}
            | Arithmetic {% passThrough %}

Comparison -> Arithmetic ComparisonOperator Arithmetic {% comparisonNode %}

ComparisonOperator -> %eq {% passThrough %}
                    | %neq {% passThrough %}

Arithmetic -> Additive {% passThrough %}

Additive -> Additive %plus Multiplicative {% binaryNode %}
          | Additive %minus Multiplicative {% binaryNode %}
          | Multiplicative {% passThrough %}

Multiplicative -> Multiplicative %times Primary {% binaryNode %}
                | Multiplicative %divide Primary {% binaryNode %}
                | Primary {% passThrough %}

Primary -> %number {% numberNode %}
         | %lparen Arithmetic %rparen {% ([, expression]) => expression %}
