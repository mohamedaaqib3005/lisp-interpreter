
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
    console.assert(
      expected !== undefined && result === expected,
      `Test failed for ${input} , expected ${expected} got:${result} `
    )
  }
  catch (err) {
    console.error(`Error while testing input ${input} :${err.message}`);
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


// === Simple single operations ===
// runTest("(+ 2 3)", 5);
// runTest("(- 10 4)", 6);
// runTest("(* 5 6)", 30);
// runTest("(/ 20 4)", 5);

// // === Unary minus ===
// runTest("(- 5)", -5);
// runTest("(- 0)", -0);

// // === Multiple operands ===
// runTest("(+ 1 2 3 4)", 10);
// runTest("(- 20 3 2)", 15);
// runTest("(* 2 3 4)", 24);
// runTest("(/ 100 2 5)", 10);

// // === Nested ===
// runTest("(+ (* 2 3) 4)", 10);
// runTest("(* (+ 1 2) (- 5 3))", 6);
// runTest("(- (+ 5 5) (* 2 3))", 4);
// runTest("(/ (* 10 2) (+ 3 2))", 4);

// // === Complex nested ===
// runTest("(+ (* 2 (+ 1 2)) (- 10 3))", 13);
// runTest("(- (/ 20 2) (+ 3 2))", 5);
// runTest("(* (+ 1 2) (+ 3 4))", 21);
// runTest("(/ (* (+ 2 3) 4) (- 10 5))", 4);

// // === Equality checks ===
// runTest("(= 2 2)", true);
// runTest("(= 2 3)", false);
// runTest("(= 2 2 2)", true);
// runTest("(= 2 2 4)", false);

// // === If conditions ===
// runTest("(if (= 2 2) 10 20)", 10);
// runTest("(if (= 2 3) 10 20)", 20);
// runTest("(if (+ 1 2) 10 20)", 10);

// // === Begin block ===
// runTest("(begin (+ 1 2) (* 2 3))", 6);
// runTest("(begin (+ 1 2) (+ (* 2 2) 3))", 7);
// runTest("(begin (- 5) (+ 2 3))", 5);
// runTest("(begin (+ 3 4))", 7);
// runTest("(begin (if (= 2 2) 10 20) (* 2 3))", 6);
// runTest("(begin -1 2 -3)",);

// // define
// runTest("(= x 10)", 10);
// runTest("x", 10);

// runTest("(= y (+ x 5))", 15);
// runTest("y", 15);

// runTest("(= x (* y 2))", 30);
// runTest("x", 30);

// runTest("(= name \"aaqib\")", "aaqib");
// runTest("name", "aaqib");



// // === Error tests (should throw) ===
// runTest("(+ )");      // no operands
// runTest("(/ 5 0)");   // divide by zero
// runTest("(unknown 2 3)"); // invalid operator

// === Define variable tests ===
runTest("(define x 10)", 10);
runTest("x", 10);

runTest("(define y (+ x 5))", 15);//  //0x5
runTest("y", 15);

runTest("(define z (* y 2))", 30);//  NaN
runTest("z", 30); //rror while testing input ("y", 15): Function not defined: '"y"

runTest("(define name \"aaqib\")", "aaqib"); //Error while testing input (define name \"aaqib\"): Unknown symbol: \"aaqib\"
runTest("name", "aaqib");

// === Set variable tests ===
runTest("(set x 50)", 50);//50
runTest("x", 50);//50

runTest("(set y (+ x 10))", 60); //0x10
runTest("y", 60);

runTest("(set name \"mohammed\")", "mohammed"); //Error while testing input (set name \"mohammed\"): the variable does not exist in env
runTest("name", "mohammed");

// === Error: setting undefined variable ===
runTest("(set notDefined 20)"); // should throw error

// === Check env after operations ===
console.log("ENV snapshot after define/set tests:", env);

