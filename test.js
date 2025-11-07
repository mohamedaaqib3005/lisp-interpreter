const parse = require('./parser.js');
const { evaluate, env } = require('./eval.js');

const input = "(define z '(+ 2 3) )"

const ast = parse(input);
console.log(ast)
// evaluate(ast)