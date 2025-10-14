// const input = "2"
// const input = "(+ 2)"
// const input = "(+ 2 4)"
// const input = "(+ ( + 1) 4)"
// const input = "(+ ( + 1)(- 4))"
// const input = "(+ ( + 1)(- 4))"
// const input = "43abc"
// const input = "( * 15 3)  "

const OPERATORS = ['+', '-', '*', '/', '=', 'if']

function removeWhitespace(rest) {
  return rest.replace(/^\s+/, "")
}

function parseNumber(rest) {

  let match = rest.match(/^\d+/)
  if (match) {
    let num = Number(match[0]);
    let next = rest.slice(match[0].length)
    return [num, next]
  }
  return [null, rest]

}

function parseOperator(rest) {
  for (let op of OPERATORS) {
    if (rest.startsWith(op)) {
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
      return [operands, rest]
    }
    const [operand, next] = parseExpression(rest);
    if (operand === null) {
      return [null, rest]
    }
    operands.push(operand)
    rest = next
  }
}

function parsePrimitive(rest) {
  rest = removeWhitespace(rest)

  let [num, next] = parseNumber(rest)
  if (num !== null) {
    return [num, next]
  }
  return [null, next]
}

function parseCompound(rest) {
  rest = removeWhitespace(rest)

  if (!rest.startsWith("(")) {
    return [null, rest]
  }

  rest = rest.slice(1)
  rest = removeWhitespace(rest)

  let [operator, next] = parseOperator(rest)

  if (operator == null) {
    return [null, rest]
  }

  let [operands, remaining] = parseOperand(next)

  if (operator == null) {
    return [null, rest]
  }
  return [[operator, ...operands], remaining]
}

function parseExpression(rest) {
  rest = removeWhitespace(rest)

  if (rest.length === 0) {
    return [null, rest]
  }
  let result = parseCompound(rest);
  if (result[0] !== null) {
    return result;

  }

  return parsePrimitive(rest);

}

function parse(rest) {
  let [node, next] = parseExpression(rest)
  next = removeWhitespace(next)
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
