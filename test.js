const readline = require('readline');
const parse = require('./parser.js');
const { evaluate, env } = require('./eval.js');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'lisp> '
});

function runTest(input, expected) {
  try {
    const ast = parse(input);
    const result = evaluate(ast)
    if (typeof expected === "string" && expected.startsWith("Error:")) {
      console.assert(false, `Test failed: ${input}\nExpected error "${expected}", but got result: ${result}`);
    } else {
      console.assert(result === expected, ` Test failed: ${input}\nExpected{expected}, got ${result}`);
    }
  } catch (err) {
    if (typeof expected === "string" && expected.startsWith("Error:")) {
      const cleanErr = `Error: ${err.message}`;
      console.assert(cleanErr === expected, `Test failed: ${input}\nExpected "${expected}" but got "${cleanErr}"`);
    } else {
      console.assert(false, ` Unexpected error in ${input}: ${err.message}`);
    }
  }
}

rl.prompt();

rl.on("line", (input) => {
  try {
    const ast = parse(input);
    const result = evaluate(ast);
    console.log(result);
  } catch (err) {
    console.error(`Error while testing input ${input}: ${err.message}`);
  }

  rl.prompt();
})
  .on('close', () => {
    console.log("Bye!");
    process.exit(0);
  });

// runTest(`(begin
//   (define fibonacci
//     (lambda (n)
//       (if (> n 2)
//          (+ (fibonacci (- n 1)) (fibonacci (- n 2)))
//          1
//           )))
//   (fibonacci 5))
// `)