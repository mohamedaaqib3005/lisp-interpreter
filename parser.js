// const input = "2"
// const input = "(+ 2)"
// const input = "(+ 2 4)"
// const input = "(+ ( + 1) 4)"
// const input = "(+ ( + 1)(- 4))"
const input = "(+ ( + 1)(- 4))"
// const input = "43abc"


function removeWhitespace(rest) {
  return rest.replace(/^\s+/, "")
}


function parsePrimitive(rest) {
  rest = removeWhitespace(rest)

  let match = rest.match(/^\d/)
  if (match) {
    let num = Number(match[0]);
    let next = rest.slice(match[0].length)
    return [num, next]
  }

  return [null, rest]
}

function parseCompound(rest) {
  rest = removeWhitespace(rest)

  if (!rest.startsWith("(")) {
    return [null, rest]
  }

  rest = rest.slice(1)
  rest = removeWhitespace(rest)

  let operator = rest[0]

  if (!['+', '-', '/', '*'].includes(operator)) {
    return [null, rest]
  }

  rest = rest.slice(1) // consume operator
  rest = removeWhitespace(rest)

  let expr = [operator]

  while (rest.length > 0 && rest[0] !== ")") {
    let [operand, next] = parseExpression(rest)

    if (operand == null) {
      return [null, rest]
    }

    expr.push(operand)
    rest = removeWhitespace(next)
  }

  if (rest.startsWith(")")) {
    rest = rest.slice(1) // consume ")"
    return [expr, rest]
  }

  return [null, rest]
}


function parseExpression(rest) {
  rest = removeWhitespace(rest)

  if (rest.length === 0) {
    return [null, rest]
  }

  if (rest[0] === "(") {
    return parseCompound(rest)
  } else if (/[0-9]/.test(rest[0])) {
    return parsePrimitive(rest)
  }

  return [null, rest]
}

function parse(rest) {
  let [node, next] = parseExpression(rest)

  if (node !== null && next.length === 0) {
    return node
  }
  return null
}

console.log(parse(input))
