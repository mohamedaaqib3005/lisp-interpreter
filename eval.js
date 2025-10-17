
const parse = require('./parser.js');

const input = "(begin (+ 1 2) (* 2 3))"

const node = parse(input);

console.log(node);

function logEval(expr, result) {
  if (Array.isArray(expr)) {
    const [op, ...args] = expr;
    console.log(op, ...args, "→", result);
  } else {
    console.log(expr, "→", result);
  }
}


const env = {

  "+": (arr) => arr.reduce((a, b) => a + b, 0),

  "-": (arr) => arr.length === 1 ? -arr[0] : arr.reduce((a, b) => a - b),

  "*": (arr) => arr.reduce((a, b) => a * b, 1,),

  "/": (arr) => arr.reduce((a, b) => a / b),

  "=": (arr) => {
    if (arr.length === 0)
      throw new Error("Needs atleast one operand")
    const first = arr[0];
    return arr.every((op) => first === op)
  },

}

function specialForm(operands) {
  let [condition, thenExpr, elseExpr] = operands;
  const condValue = evaluate(condition);
  return (condValue) ? evaluate(thenExpr) : evaluate(elseExpr)
}

function evaluate(node) { // fn within 10 line

  if (typeof node === "number" || typeof node === "boolean") {
    logEval(node); // log primitive

    return node;
  }
  if (typeof node === "string") {
    if (env[node]) {
      return node;
    }
    throw new Error(`Unknown symbol: ${node}`);
  }

  if (node == null) { // double equals
    return null;
  }

  if (Array.isArray(node) && node.length === 0) {
    console.log("empty expression");
    return null;
  }
  let operator = node[0]; // operator can be an expression
  let operands = node.slice(1);
  if (Array.isArray(operator)) {
    operator = evaluate(operator);
  }
  if (operator === "if") {
    const result = specialForm(operands); // evaluate first
    logEval(node, result);
    return result;
  }

  if (operator === "begin") {
    let result = null;
    for (let exp of operands) {
      result = evaluate(exp)
      logEval(exp, result)
    }
    return result;
  }

  const values = operands.map(op => Array.isArray(op) ? evaluate(op) : op);
  // console.log(values);


  const fn = env[operator];
  // console.log(fn);
  if (!fn) {
    throw new Error(` function is not defined '${operator}'`);
  };
  const result = fn(values)
  logEval(node, result);

  return fn(values)
}

console.log(evaluate(node));


