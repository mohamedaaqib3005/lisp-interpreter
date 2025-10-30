// run try and catch in testcases to expect an error modify the run test this is the error msg im expecting  for ex: reference error .... ; if it mactches the error it can display passed
//

const parse = require('./parser.js');

const input = "(begin (define addTwo (lambda (x y) (+ x y)))  (addTwo 5))"



const node = parse(input);

console.log(node);

const globalEnv = {

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
  ;

const specialForms = {
  if: (operands, env) => {
    let [condition, thenExpr, elseExpr] = operands;
    const condValue = evaluate(condition, env);
    return (condValue) ? evaluate(thenExpr, env) : evaluate(elseExpr, env)
  },
  begin: (operands, env) => {
    if (operands.length === 0) throw new Error("(begin) expects at least one expression");
    return operands.map((op) => evaluate(op, env)).pop();
  },
  define: (operands, env) => {
    const [variable, expression] = operands;
    const value = evaluate(expression, env);
    env[variable] = value;
    return value;
  },
  set: (operands, env) => {
    const [variable, expression] = operands;
    if (!(variable in env)) {
      throw new Error("the variable does not exist in env")
    }
    const value = evaluate(expression, env);
    env[variable] = value;
    return value;
  },
  lambda: (operands, env) => {
    let [params, body] = operands;
    if (!Array.isArray(params)) throw new Error("lambda expects a  list of params")
    return function (...args) {
      let localEnv = Object.create(env)
      params.forEach((param, i) => localEnv[param] = evaluate(args[i], localEnv))
      return evaluate(body, localEnv)
    }
  },
}



function evaluate(node, env = globalEnv) {
  if (node == null) return null;
  if (Array.isArray(node) && node.length === 0) throw new Error("Empty expression");// create a function
  if (typeof node === "number" || typeof node === "boolean") return node;
  if (typeof node === "string") {
    if (env[node] !== undefined) return env[node];
    throw new Error(`Unknown symbol: ${node}`);
  }
  let [operator, ...operands] = node;

  if (Array.isArray(operator)) operator = evaluate(operator, env);
  if (specialForms[operator]) {
    return specialForms[operator](operands, env)
  }
  const values = operands.map(op => evaluate(op, env)); // add checks if operator is already an function dont need to lookup

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
module.exports = { evaluate, env: globalEnv };


