// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Expression", "symbols": ["Comparison"], "postprocess": passThrough},
    {"name": "Expression", "symbols": ["Arithmetic"], "postprocess": passThrough},
    {"name": "Comparison", "symbols": ["Arithmetic", "ComparisonOperator", "Arithmetic"], "postprocess": comparisonNode},
    {"name": "ComparisonOperator", "symbols": [(lexer.has("eq") ? {type: "eq"} : eq)], "postprocess": passThrough},
    {"name": "ComparisonOperator", "symbols": [(lexer.has("neq") ? {type: "neq"} : neq)], "postprocess": passThrough},
    {"name": "Arithmetic", "symbols": ["Additive"], "postprocess": passThrough},
    {"name": "Additive", "symbols": ["Additive", (lexer.has("plus") ? {type: "plus"} : plus), "Multiplicative"], "postprocess": binaryNode},
    {"name": "Additive", "symbols": ["Additive", (lexer.has("minus") ? {type: "minus"} : minus), "Multiplicative"], "postprocess": binaryNode},
    {"name": "Additive", "symbols": ["Multiplicative"], "postprocess": passThrough},
    {"name": "Multiplicative", "symbols": ["Multiplicative", (lexer.has("times") ? {type: "times"} : times), "Primary"], "postprocess": binaryNode},
    {"name": "Multiplicative", "symbols": ["Multiplicative", (lexer.has("divide") ? {type: "divide"} : divide), "Primary"], "postprocess": binaryNode},
    {"name": "Multiplicative", "symbols": ["Primary"], "postprocess": passThrough},
    {"name": "Primary", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": numberNode},
    {"name": "Primary", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "Arithmetic", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": ([, expression]) => expression}
]
  , ParserStart: "Expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
