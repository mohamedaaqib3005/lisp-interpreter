// const input = "2"
// const input = "(+ 2)"
// const input = "(+ 2 4)"
// const input = "(+ ( + 1) 4)"
// const input = "(+ ( + 1)(- 4))"
// const input = "(+ ( + 1)(- 4))"
// const input = "43abc"
// const input = "( * 15 3)  "

// const input = "((if (= 2 2) + -) 5 6 )"
const OPERATORS = ['+', '-', '*', '/', '=', 'if', '>','begin'] // find out  other way of finding operator

function removeWhitespace(rest) {
  return rest.replace(/^\s+/, "")
}

function parseNumber(rest) {

  let match = rest.match(/^\d+/)
  if (match) {
    let num = Number(match[0]);
    let next = rest.slice(match[0].length)
    console.log("parseNumber:", num, "next:", next)

    return [num, next]
  }
  return [null, rest]

}

function parseOperator(rest) {
  rest = removeWhitespace(rest)
  for (let op of OPERATORS) {
    if (rest.startsWith(op)) {
      console.log("parseOperator:", op, "next:", rest.slice(op.length))
      return [op, rest.slice(op.length)];
    }
  }
  return [null, rest];
}


function parseOperand(rest) {
  rest = removeWhitespace(rest)
  let operands = []

  while (rest.length > 0) {
    if (rest.startsWith(")")) {
      rest = rest.slice(1)
      console.log("parseOperand end:", operands, "remaining:", rest)

      return [operands, rest]
    }
    const [operand, next] = parseExpression(rest);
    console.log("parseOperand operand:", operand, "next:", next)

    if (operand === null) {
      return [null, rest]
    }
    operands.push(operand)
    rest = next
  }
}

function parsePrimitive(rest) {
  rest = removeWhitespace(rest)
  console.log("parsePrimitive start:", rest)

  let [num, next] = parseNumber(rest)
  if (num !== null) {
    return [num, next]
  }
  let [operator, nextOp] = parseOperator(rest)
  if (operator !== null) {
    return [operator, nextOp]
  }
  return [null, rest]
}

function parseCompound(rest) {
  rest = removeWhitespace(rest)
  console.log("parseCompound start:", rest)

  if (!rest.startsWith("(")) return [null, rest];

  rest = rest.slice(1);
  rest = removeWhitespace(rest);

  let operands = [];

  while (rest.length > 0) {
    if (rest.startsWith(")")) {
      rest = rest.slice(1);
      console.log("parseCompound result:", operands, "remaining:", rest);
      return [operands, rest];
    }

    const [expr, next] = parseExpression(rest);
    if (expr === null) return [null, rest];

    operands.push(expr);
    rest = next;
    rest = removeWhitespace(rest);
  }

  return [null, rest];
}



function parseExpression(rest) {
  rest = removeWhitespace(rest)
  console.log("parseExpression start:", rest)

  if (rest.length === 0) {
    return [null, rest]
  }
  let result = parseCompound(rest);
  if (result[0] !== null) {
    console.log("parseExpression compound result:", result)

    return result;

  }
  let prim = parsePrimitive(rest)

  console.log("parseExpression primitive result:", prim)

  return parsePrimitive(rest);

}

function parse(rest) {
  let [node, next] = parseExpression(rest)
  next = removeWhitespace(next)
  console.log("parse final:", node, "remaining:", next)

  if (node !== null && next.length === 0) {
    return node
  }
  return null
}

// console.log(parse(input))

module.exports = parse
// PARSE NUMBER INSIDE PARSEPRIMITIVE
// break down with functions
// operator && operand separator
// define the operators outside
