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

// const input = "(+ (begin +2 5 (+ 2 (begin 2 5 (+ 2 5) ) ) ) 6 3 9) ";

// const input = "";// throw error

const input = "+" // should return fn [Function: log]





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
      throw new Error("Needs atleast one operand") //
    const first = arr[0];
    return arr.every((op) => first === op)
  },

}

function ifCondition(operands) {
  let [condition, thenExpr, elseExpr] = operands;
  const condValue = evaluate(condition);
  return (condValue) ? evaluate(thenExpr) : evaluate(elseExpr)
}

function evaluate(node) { // fn within 10 line
  if (node == null) {
    return null;
  }

  if (Array.isArray(node) && node.length === 0) {
    throw new Error("empty expression");
  }

  if (typeof node === "number" || typeof node === "boolean") {
    return node;
  }
  if (typeof node === "string") {
    if (env[node]) {
      return node;
    }
    throw new Error(`Unknown symbol: ${node}`);
  }


  let operator = node[0]; // operator can be an expression
  let operands = node.slice(1);
  if (Array.isArray(operator)) {
    operator = evaluate(operator);
  }
  if (operator === "if") {
    const result = ifCondition(operands); // evaluate first
    return result;
  }

  if (operator === "begin") { //make function for begin
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


module.exports = { evaluate };
