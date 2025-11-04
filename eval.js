
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
};

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
    if (variable in specialForms) {
      throw new Error(`Cannot redefine built-in or special form: ${variable}`);
    }
    const value = evaluate(expression, env);
    env[variable] = value;
    return value;
  },
  set: (operands, env) => {
    const [variable, expression] = operands;
    let scope = env;
    while (scope && !(variable in scope)) { //can also be done using hasOwnPropertymethod
      scope = Object.getPrototypeOf(scope);
    }

    if (!scope) throw new Error(`Variable '${variable}' not defined`);

    const value = evaluate(expression, env);
    scope[variable] = value;
    return value;
  },
  lambda: (operands, env) => {
    let [params, body] = operands;
    if (!Array.isArray(params)) throw new Error("lambda expects a  list of params")
    return function (...args) {
      if ((args.length) !== params.length) {
        throw new Error(`Lambda expected ${params.length} args, got ${args.length}`);
      }
      let localEnv = Object.create(env)
      params.forEach((param, i) => localEnv[param] = evaluate(args[i], localEnv))
      return evaluate(body, localEnv)
    }
  },
}

function checkEmptyExpression(node) {
  if (Array.isArray(node) && node.length === 0) {
    throw new Error("Empty expression");
  }
}

function evaluate(node, env = globalEnv) {
  if (node == null) return null;
  checkEmptyExpression(node);

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
  let fn = typeof operator === "function" ? operator : env[operator];
  if (!fn) throw new Error(`Function not defined: '${operator}'`);

  const values = operands.map((op) => evaluate(op, env));

  if (["+", "-", "*", "/", "=", "<", ">", "<=", ">=", "log"].includes(operator))//change it the evaluate should not know about the functions and these are ordinary fns and can be modified unlike specialform functions
    return fn(values);

  return fn(...values);

}

module.exports = { evaluate, env: globalEnv };


