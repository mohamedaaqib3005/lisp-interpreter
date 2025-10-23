// to do
//separate testcase file with working eval ,each testcase should have expected output
// repl
// log func in env not as special form
// add comparative operators and logical operators
// throw an error (begin (-) (+)) expects some arg
// parsing shouldnt lookup in env
// throw error for operators minus needs atleast one arg ,+,/,* needs atleast 2 arg
// fn within 20 line


const parse = require('./parser.js');

// const input = "(begin -1 2 -3)";// error

// const input = "(+ (begin+2 5(+ 2 (begin 2 5 (+ 2 5) ) ) ) 6 3 9) ";

// const input = "";// throw error

const input = "(define x 10)";


const node = parse(input);

console.log(node);


const env = {

  "+": (arr) => {
    if (arr.length < 2)
      throw new Error("'+' needs at least two args");
    return arr.reduce((a, b) => a + b, 0);
  },

  "-": (arr) => {
    if (arr.length < 1)
      throw new Error("'-' needs at least one arg");
    return arr.length === 1 ? -arr[0] : arr.reduce((a, b) => a - b)
  },

  "*": (arr) => {
    if (arr.length < 2)
      throw new Error("'*' needs at least two args");
    return arr.reduce((a, b) => a * b, 1)
  },

  "/": (arr) => {
    if (arr.length < 2)
      throw new Error("'/' needs at least two args");
    return arr.reduce((a, b) => a / b);
  },

  "=": (arr) => {
    if (arr.length < 1)
      throw new Error("'=' needs at least one arg");
    const first = arr[0];
    return arr.every((op) => first === op)
  },

  "log": (args) => {
    args.forEach(val => console.log("log:", val));
    return args[args.length - 1];
  }
}

function ifCondition(operands) {
  let [condition, thenExpr, elseExpr] = operands;
  const condValue = evaluate(condition);
  return (condValue) ? evaluate(thenExpr) : evaluate(elseExpr)
}

function define(operands) {
  const [variable, expression] = operands;
  const value = evaluate(expression);
  env[variable] = value;
  return value;
}
function evaluate(node) {
  if (node == null) {
    return null;
  }
  if (Array.isArray(node) && node.length === 0) {
    throw new Error("Empty expression");
  }
  if (typeof node === "number" || typeof node === "boolean") {
    return node;
  }
  if (typeof node === "string") {
    if (!isNaN(node)) {
      return Number(node);
    }
    if (env[node] !== undefined) {
      return env[node];
    }
    throw new Error(`Unknown symbol: ${node}`);
  }

  let operator = node[0];
  let operands = node.slice(1);

  if (Array.isArray(operator))
    operator = evaluate(operator);

  if (operator === "if") {
    return ifCondition(operands);
  }
  if (operator === "define") {
    return define(operands);
  }
  if (operator === "begin") {
    if (operands.length === 0) {
      throw new Error("(begin) expects at least one expression");
    }
    return operands.map(evaluate).pop();
  }

  const values = operands.map(op => Array.isArray(op) ? evaluate(op) : op);
  const fn = env[operator];
  if (!fn) throw new Error(`Function not defined: '${operator}'`);
  return fn(values);
}

console.log(evaluate(node));
module.exports = { evaluate };
