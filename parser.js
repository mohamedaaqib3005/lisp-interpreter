// const input = "2"
// const input = "(+ 2)"
// const input = "(+ 2 4)"
// const input = "(+ ( + 1) 4)"
// const input = "(+ ( + 1)(- 4))"
// const input = "(+ ( + 1)(- 4))"
// const input = "43abc"
const input = "( * 15 3)  "

const OPERATORS = ['+', '-', '*', '/']

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
  if (OPERATORS.includes(rest[0])) {
    let operator = rest[0]
    let next = rest.slice(1)
    return [operator, next]
  }
  return [null, rest]
}

function parseOperand(rest) {
  rest = removeWhitespace(rest)
  const [node, next] = parseExpression(rest);
  if (node !== null) {
    return [node, next]
  }
  return [null, rest]
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

  rest = removeWhitespace(next)

  let operands = []

  while (rest.length > 0) {
    if (rest.startsWith(")")) {
      rest = rest.slice(1)
      return [[operator, ...operands], rest]
    }
    let [operand, nextOperand] = parseOperand(rest)
    if (operand == null) {
      return [null, rest]
    }
    operands.push(operand)
    rest = nextOperand
  }
  return [null, rest]
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

console.log(parse(input))


// PARSE NUMBER INSIDE PARSEPRIMITIVE
// break down with functions
// operator && operand separator
// define the operators outside
