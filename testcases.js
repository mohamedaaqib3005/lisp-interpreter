// Simple single operations
const input1 = "(+ 2 3)";
const input2 = "(- 10 4)";
const input3 = "(* 5 6)";
const input4 = "(/ 20 4)";

// Unary minus
const input5 = "(- 5)";
const input6 = "(- 0)";

// Multiple operands
const input7 = "(+ 1 2 3 4)";
const input8 = "(- 20 3 2)";
const input9 = "(* 2 3 4)";
const input10 = "(/ 100 2 5)";

// Nested expressions
const input11 = "(+ (* 2 3) 4)";
const input12 = "(* (+ 1 2) (- 5 3))";
const input13 = "(- (+ 5 5) (* 2 3))";
const input14 = "(/ (* 10 2) (+ 3 2))";

// Complex nested
const input15 = "(+ (* 2 (+ 1 2)) (- 10 3))";
const input16 = "(- (/ 20 2) (+ 3 2))";
const input17 = "(* (+ 1 2) (+ 3 4))";
const input18 = "(/ (* (+ 2 3) 4) (- 10 5))";

// Edge / special cases
const input19 = "(+ )";       // empty operands → test behavior
const input20 = "(* )";       // empty operands → test behavior
const input21 = "(- )";       // empty operands → test behavior
const input22 = "(/ )";       // empty operands → test behavior
const input23 = "(/ 5 0)";    // division by zero → test behavior

// Mixed unary and binary
const input24 = "(+ (- 5) 3)";
const input25 = "(* (- 3) 4)";
const input26 = "(/ (- 10) 2)";



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