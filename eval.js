
const parse = require('./parser.js');

const input = "(begin (+ 1 2) (* 2 3))";


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
  }
}


const specialForms = {
  if: (evaluate, operands) => {
    let [condition, thenExpr, elseExpr] = operands;
    const condValue = evaluate(condition);
    return (condValue) ? evaluate(thenExpr) : evaluate(elseExpr)
  },
  begin: (operands) => {
    if (operands.length === 0) throw new Error("(begin) expects at least one expression");
    return operands.map(evaluate).pop();
  },
  define: (operands, evaluate, env) => {
    const [variable, expression] = operands;
    const value = evaluate(expression);
    env[variable] = value;
    return value;
  },
  set: (operands, evaluate, env) => {
    const [variable, expression] = operands;
    if (!(variable in env)) {
      throw new Error("the variable does not exist in env")
    }
  },

}


function evaluate(node) {
  if (node == null) return null;
  if (Array.isArray(node) && node.length === 0) throw new Error("Empty expression");
  if (typeof node === "number" || typeof node === "boolean") return node;
  if (typeof node === "string") {
    if (env[node] !== undefined) return env[node];
    throw new Error(`Unknown symbol: ${node}`);
  }
  let [operator, ...operands] = node;
  if (Array.isArray(operator)) operator = evaluate(operator);
  if (specialForms[operator]) {
    return specialForms[operator](operands, evaluate, env)
  }
  const values = operands.map(evaluate);
  const fn = env[operator];
  if (!fn) throw new Error(`Function not defined: '${operator}'`);
  return fn(values);
}

console.log(evaluate(node));
module.exports = { evaluate, env };
