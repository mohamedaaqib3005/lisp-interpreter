// const node = 2;

// const node = ["+", 2];

// const node = ["+", 2, 4];

// const node = ["+", ["+", 1], 4];

// const node = ["+", ["+", 1], ["-", 4]];


// const node = ["*", 15, 3];

const node = [];


const env = {

  "+": (arr) => arr.reduce((a, b) => a + b, 0),

  "-": (arr) => arr.length === 1 ? -arr[0] : arr.reduce((a, b) => a - b),

  "*": (arr) => arr.reduce((a, b) => a * b, 1,),

  "/": (arr) => arr.reduce((a, b) => a / b),

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
  const fn = env[operator]
  if (!fn) {
    throw new Error(` Operator not present '${operator}'`);
  };
  return fn(values)
}

console.log(Eval(node));
