
const parse = require('./parser.js');

// Simple single operations
// const input = "(+ 2 3)";
// const input = "(- 10 4)";
// const input = "(* 5 6)";
// const input = "(/ 20 4)";

// // Unary minus
// const input = "(- 5)"; // -5
// const input = "(- 0)"; //-0

// // Multiple operands
// const input = "(+ 1 2 3 4)";
// const input = "(- 20 3 2)";
// const input= "(* 2 3 4)";
// const input= "(/ 100 2 5)";

// // Nested expressions
// const input = "(+ (* 2 3) 4)";
// const input = "(* (+ 1 2) (- 5 3))";
// const input = "(- (+ 5 5) (* 2 3))";
// const input= "(/ (* 10 2) (+ 3 2))"

// // Complex nested
// const input = "(+ (* 2 (+ 1 2)) (- 10 3))";
// const input = "(- (/ 20 2) (+ 3 2))"
// const input = "(* (+ 1 2) (+ 3 4))";
// const input = "(/ (* (+ 2 3) 4) (- 10 5))";

// // Mixed unary and binary
// const input = "(+ (- 5) 3)";
// const input = "(* (- 3) 4)";
// const input = "(/ (- 10) 2)";

//Equality check
// const input = "(= 2 0)";
// const input = "(= 2 2)";

// const input = "(= 2 2  4)";

// if conditions
// const input = "(if 1 10 20)";

// const input = "(if (= 2 2) 10 20)";

// const input = "(if (= 2 3) 10 20)";

// const input = "(if (+ (+ 2 2) 3) 1 0)";

// const input = "(+ -1)" // error
// const input = "(-)"// return null error
// const input = "(/ 5 0)" // return null

// const input = "(if (= 2 2) 4 )"
//  error

const input = "(begin (+ 1 2) (* 2 3))"

//  error
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


