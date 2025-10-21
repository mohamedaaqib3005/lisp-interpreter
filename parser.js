function tokenise(input) {
  return input
    .replace(/\(/g, "(")
    .replace(/\)/g, ")")
    .trim()
    .split(/\s+/)

}

function atom(token) {
  if (/^-?d+(\.\d+)? $ /.test(token)) {
    return parseFloat(token);
  }
  return token;
}


function parsetoken(tokens) {
  let token = tokens.shift()
  if (token === "(") {
    let list = [];
    while (tokens[0] !== ")") {
      if (tokens.length === 0) {
        throw new Error("missing closing ')' ")
      }
      list.push(parsetoken(token))
    }
    tokens.shift()
    return list;
  }
  else if (token[0] === ")") {
    throw new Error("unexpected ')' ")
  }
  else {
    return atom(token)
  }
}



function parse(input) {
  const tokens = tokenise(input);
  const ast = parsetoken(tokens);
  if (tokens.length > 0) {
    throw new Error("Extra input after parsing")
  }
  return ast;
}

module.exports = parse;