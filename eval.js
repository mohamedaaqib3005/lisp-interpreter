
const globalEnv = {
  "+": (...arr) => {
    return arr.reduce((a, b) => a + b, 0);
  },

  "-": (...arr) => {
    console.log(`the arguments ${arr}`)
    if (arr.length < 1) throw new Error("'-' needs at least one arg");
    return arr.length === 1 ? -arr[0] : arr.reduce((a, b) => a - b);
  },

  "*": (...arr) => {
    return arr.reduce((a, b) => a * b, 1);
  },

  "/": (...arr) => {
    if (arr.length < 2) throw new Error("'/' needs at least two args");
    return arr.reduce((a, b) => a / b);
  },

  "=": (...arr) => {
    if (arr.length < 2) throw new Error("'=' needs at least two args");
    const first = arr[0];
    return arr.every((op) => first === op);
  },

  "<": (...arr) => {
    if (arr.length < 2) throw new Error("'<' needs at least two args");
    return arr.every((v, i, a) => i === 0 || a[i - 1] < v);
  },

  "<=": (...arr) => {
    if (arr.length < 2) throw new Error("'<=' needs at least two args");
    return arr.every((v, i, a) => i === 0 || a[i - 1] <= v);
  },

  ">": (...arr) => {
    if (arr.length < 2) throw new Error("'>' needs at least two args");
    return arr.every((v, i, a) => i === 0 || a[i - 1] > v);
  },

  ">=": (...arr) => {
    if (arr.length < 2) throw new Error("'>=' needs at least two args");
    return arr.every((v, i, a) => i === 0 || a[i - 1] >= v);
  },

  "log": (...arr) => {
    arr.forEach(val => console.log("log:", val));
    return null;
  },

  "modulo": (...arr) => {
    if (arr.length !== 2) throw new Error("modulo expects exactly 2 args");
    const a = Number(arr[0]);
    const b = Number(arr[1]);
    if (b === 0) throw new Error("modulo cannot divide by 0");
    let remainder = a % b;
    if (remainder < 0) remainder += Math.abs(b);
    return remainder;
  }
};

const specialForms = {
  if: (operands, env) => {
    let [condition, thenExpr, elseExpr] = operands;
    const condValue = evaluate(condition, env);
    return condValue ? evaluate(thenExpr, env) : evaluate(elseExpr, env);
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
    env[variable] = undefined;
    const value = evaluate(expression, env);
    env[variable] = value;

    return value;
  },

  set: (operands, env) => {
    const [variable, expression] = operands;
    let scope = env;
    while (scope && !(variable in scope)) {
      scope = Object.getPrototypeOf(scope);
    }

    if (!scope) throw new Error(`Variable '${variable}' not defined`);

    const value = evaluate(expression, env);
    scope[variable] = value;
    return value;
  },

  lambda: (operands, env) => {
    let [params, body] = operands;
    if (!Array.isArray(params)) throw new Error("lambda expects a list of params");
    return function (...args) {
      if (args.length !== params.length) {
        throw new Error(`Lambda expected ${params.length} args, got ${args.length}`);
      }
      let localEnv = Object.create(env);
      params.forEach((param, i) => localEnv[param] = args[i]);
      return evaluate(body, localEnv);
    };
  },
  quote: (operands, env) => {
    function processCompoundExpression(compExpr, quotationLevel) {
      console.log("comp", compExpr)
      let [operator, ...operands] = compExpr
      if (operator !== "unquote") {
        if (operator === "quote") quotationLevel++
        return compExpr.map((expr) => (isCompoundExpression(expr) ? (processCompoundExpression(expr, quotationLevel)) : expr))
      }
      if (quotationLevel > 1) {
        console.log("quot level", quotationLevel)
        console.log("the operator", operator)
        console.log("the operands", operands)
        return [operator, ...operands.map((operand) => (isCompoundExpression(operand) ? processCompoundExpression(operand, quotationLevel - 1) : operand))];
      }
      else {
        console.log("ops", ...operands)
        return localEnv.unquote(...operands)

      }

    }
    if (operands.length !== 1) throw new Error("cannot have more than one operand");
    let localEnv = Object.create(env);
    localEnv["unquote"] = (expr) => evaluate(expr, env);
    let expr = operands[0]
    return isCompoundExpression(expr) ? processCompoundExpression(expr, 1) : expr
  },
  defmacro: (operands, env) => {
    if (!Array.isArray(operands)) throw new Error("def macros expects a list of params")
    let [name, params, ...body] = operands;
    let macroFn = function (...args) {
      if (args.length !== params.length) {
        throw new Error(`Lambda expected ${params.length} args, got ${args.length}`);
      }
      let localEnv = Object.create(env)
      params.forEach((params, i) => localEnv[params] = args[i]);
      return expandMacro(body[0], env, 1);

    }
    env[name] = macroFn;
    return macroFn;

    function expandMacro(expr, env, quotationLevel) {
      let [operator, ...operands] = expr;
      if (operator !== "unquote") {
        if (operator === "quote") {
          quotationLevel++;
          return expr.map(SubExp => isCompoundExpression(SubExp) ? expandMacro(SubExp) : SubExp)
        }
        return expr;
      }
      if (quotationLevel > 1) {
        let result = [operator];
        for (let operand of operands) {
          if (isCompoundExpression(operand)) {
            result.push(expandMacro(operand, env, quotationLevel - 1));
          }
          else {
            result.push(operand)
          }
        }
        return result;
      }
      else return evaluate(operands[0], env)

    }
  }
};

function checkEmptyExpression(node) {
  if (isCompoundExpression(node) && node.length === 0) {
    throw new Error("Empty expression");
  }
}

function isCompoundExpression(expr) {
  return Array.isArray(expr)
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

  if (isCompoundExpression(operator)) operator = evaluate(operator, env);
  if (specialForms[operator]) {
    return specialForms[operator](operands, env)
  }
  // we can fix the evaluate fn to make unquote behave like special form
  let fn = typeof operator === "function" ? operator : env[operator];
  if (!fn) throw new Error(`Function not defined: '${operator}'`);

  const values = operands.map((op) => evaluate(op, env));

  console.log(env)
  return fn(...values);
}

module.exports = { evaluate, env: globalEnv };


