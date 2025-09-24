let string = "(* 2 3)";
function parseList() {
  if (!string.startsWith("("))
    return null;

  let i = 1;
  function skipWhitespace() {
    if (i === "") {
      i++;
    }
  }
  skipWhitespace()
  const result = []
  if (string[i] === ")") {
    return result;
  }

  if (string[i] === ("+" || "/" || "*")) {
    result.push(string[i])
  }
  skipWhitespace()

  if (string[i].isNumber) {
    result.push(string[i])
  }

}
console.log(parseList(string));