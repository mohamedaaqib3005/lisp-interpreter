// const node = 2;

// const node = ["+", 2];

// const node = ["+", 2, 4];

// const node = ["+", ["+", 1], 4];

// const node = ["+", ["+", 1], ["-", 4]];

// const node = ["*", 15, 3];

// const node = [];

// const node = ["&", "2", "3"]

const parse = require('./parser.js');

// Simple single operations
// const input = "(+ 2 3)"; //5
// const input = "(- 10 4)"; // 6
// const input = "(* 5 6)";   // 30
// const input = "(/ 20 4)";   // 5

// // Unary minus
// const input = "(- 5)"; // -5
// const input = "(- 0)"; //-0

// // Multiple operands
// const input = "(+ 1 2 3 4)"; // 10
// const input = "(- 20 3 2)"; // 15
// const input= "(* 2 3 4)"; //24
// const input= "(/ 100 2 5)";  // 10

// // Nested expressions
// const input = "(+ (* 2 3) 4)";  //10
// const input = "(* (+ 1 2) (- 5 3))"; // 6
// const input = "(- (+ 5 5) (* 2 3))";  // 4
// const input= "(/ (* 10 2) (+ 3 2))"  //4

// // Complex nested
// const input = "(+ (* 2 (+ 1 2)) (- 10 3))"; //13
// const input = "(- (/ 20 2) (+ 3 2))"  //5
// const input = "(* (+ 1 2) (+ 3 4))"; //21
// const input = "(/ (* (+ 2 3) 4) (- 10 5))"; //4

// // Mixed unary and binary
// const input = "(+ (- 5) 3)"; //-2
// const input = "(* (- 3) 4)";  //-12
// const input = "(/ (- 10) 2)"; //-5

//Equality check
// const input = "(= 2 0)";
const input = "(= 2 2)";
const node = parse(input);

console.log(node);

const env = {

  "+": (arr) => arr.reduce((a, b) => a + b, 0),

  "-": (arr) => arr.length === 1 ? -arr[0] : arr.reduce((a, b) => a - b),

  "*": (arr) => arr.reduce((a, b) => a * b, 1,),

  "/": (arr) => arr.reduce((a, b) => a / b),

  "=": (arr) => {
    if (arr.length === 0) throw new Error("Needs atleast one operand")
    const first = arr[0];
    return arr.every((op) => first === op)
  },

}


function Eval(node) {
  if (node === null || node === undefined) {
    return null;
  }

  if (Array.isArray(node) && node.length === 0) {
    console.log("empty expression");
    return null;
  }
  const operator = node[0];
  const operands = node.slice(1);
  const values = operands.map(op => Array.isArray(op) ? Eval(op) : op);
  console.log(values);
  const fn = env[operator]
  if (!fn) {
    throw new Error(` Operator not present '${operator}'`);
  };
  return fn(values)
}

console.log(Eval(node));


