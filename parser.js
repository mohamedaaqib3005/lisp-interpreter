function tokenise(input) {
  return input.replaceAll("(", " ( ")
    .replaceAll(")", " ) ")
    .trim()
    .split(/\s+/)

}

function atom(token) {
  if (/^[+-]?\d+(\.\d+)?$/.test(token)) {
    return parseFloat(token);
  }
  if (token === "true") {
    return true;
  }
  else if (token === "false") {
    return false;
  }
  else {
    return token;

  }
}


function parsetoken(tokens) {
  let token = tokens.shift()
  if (token === "(") {
    let list = [];
    while (tokens[0] !== ")") {
      if (tokens.length === 0) {
        throw new Error("missing closing ')' ")
      }
      list.push(parsetoken(tokens))
    }
    tokens.shift()
    return list;
  }
  else if (token === ")") {
    throw new Error("unexpected ')'");
  }

  else {
    return atom(token)
  }
}

// function parsetokenPure(tokens) {
//   if (tokens[0] === ")") {
//     throw new Error("unexpected ')'");
//   }

//   if (tokens[0] != "(") {
//     return [atom(tokens[0]), tokens.slice(1)]
//   }

//   let remainingTokens = tokens.slice(1)
//   const AST = [];
//   while (remainingTokens[0] != ")") {
//     const [subAST, subTokens] = parsetokenPure(tokens.slice(1))
//     remainingTokens = subTokens
//     AST.append(subAST)
//   }

//   remainingTokens = remainingTokens.slice(1)

//   return [AST, remainingTokens]
// }


function parse(input) {
  const tokens = tokenise(input);
  const ast = parsetoken(tokens);
  if (tokens.length > 0) {
    throw new Error("Extra input after parsing")
  }
  return ast;
}

module.exports = parse;