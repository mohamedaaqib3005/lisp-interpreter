// const node = 2;

// const node = ["+", 2];

// const node = ["+", 2, 4];

// const node = ["+", ["+", 1], 4];

// const node = ["+", ["+", 1], ["-", 4]];

// const node = null;

const node = ["*", 15, 3];

const env = {

  "+": (arr) => arr.reduce((a, b) => a + b),

  "-": (arr) => arr.reduce((a, b) => a - b),

  "*": (arr) => arr.reduce((a, b) => a * b, 1,),

  "/": (arr) => arr.reduce((a, b) => a / b),

}


function Eval(node) {
  const operator = node[0];
  const operands = node.slice(1);
  const values = operands.map(op => Array.isArray(op) ? Eval(op) : op);
  const fn = env[operator]
  if (!fn) return null;
  return fn(values)
}

console.log(Eval(node));
