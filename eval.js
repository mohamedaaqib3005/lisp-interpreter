// run try and catch in testcases to expect an error modify the run test this is the error msg im expecting  for ex: reference error .... ; if it mactches the error it can display passed
//

const parse = require('./parser.js');

const input = "(begin(define adder (lambda (x) (+ x 1))) (adder 1)) "



const node = parse(input);

console.log(node);

const env = {

  "+": (arr) => {
    return arr.reduce((a, b) => a + b, 0);
  },

  "-": (arr) => {
    if (arr.length < 1)
      throw new Error("'-' needs at least one arg");
    return arr.length === 1 ? -arr[0] : arr.reduce((a, b) => a - b)
  },

  "*": (arr) => {
    return arr.reduce((a, b) => a * b, 1)
  },

  "/": (arr) => {
    if (arr.length < 2)
      throw new Error("'/' needs at least two args");
    return arr.reduce((a, b) => a / b);
  },

  "=": (arr) => {
    if (arr.length < 2)
      throw new Error("'=' needs at least two arg");
    const first = arr[0];
    return arr.every((op) => first === op)
  },

  "log": (args) => {
    args.forEach(val => console.log("log:", val));
  }
}// add comparison ops


const specialForms = {
  if: (operands) => {
    let [condition, thenExpr, elseExpr] = operands;
    const condValue = evaluate(condition);
    return (condValue) ? evaluate(thenExpr) : evaluate(elseExpr)
  },
  begin: (operands) => {
    if (operands.length === 0) throw new Error("(begin) expects at least one expression");
    return operands.map(evaluate).pop();
  },
  define: (operands) => {
    const [variable, expression] = operands;
    const value = evaluate(expression);
    env[variable] = value;
    return value;
  },
  set: (operands) => {
    const [variable, expression] = operands;
    if (!(variable in env)) {
      throw new Error("the variable does not exist in env")
    }
    const value = evaluate(expression);
    env[variable] = value;
    return value;
  },
  lambda: (operands) => {
    let [params, body] = operands;
    if (!Array.isArray(params)) throw new Error("lambda expects a list")
    return function (...args) {
      params.forEach((param, i) => env[param] = evaluate(args[i]))
      return evaluate(body)
    }
  },
}



function evaluate(node) {
  if (node == null) return null;
  if (Array.isArray(node) && node.length === 0) throw new Error("Empty expression");// create a function
  if (typeof node === "number" || typeof node === "boolean") return node;
  if (typeof node === "string") {
    if (env[node] !== undefined) return env[node];
    throw new Error(`Unknown symbol: ${node}`);
  }
  let [operator, ...operands] = node;
  if (specialForms[operator]) {
    return specialForms[operator](operands)
  }
  if (Array.isArray(operator)) operator = evaluate(operator);
  if (specialForms[operator]) {
    return specialForms[operator](operands)
  }
  const values = operands.map(evaluate); // add checks if operator is already an function dont need to lookup
  let fn = operator;
  if (typeof operator === "string") {
    fn = env[operator];
    if (!fn) throw new Error(`Function not defined: '${operator}'`);
    if (["+", "-", "*", "/", "=", "log"].includes(operator)) {
      return fn(values);
    } else {
      return fn(...values);
    }
  }

  return fn(...values);
}


console.log(evaluate(node));
module.exports = { evaluate, env };


