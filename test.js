// Traditional function expressions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b !== 0) {
    return a / b;
  } else {
    return "Cannot divide by zero";
  }
}

function square(num) {
  return multiply(num, num);
}

function greet(name) {
  if (name) {
    return "Hello, " + name + "!";
  } else {
    return "Hello, stranger!";
  }
}

console.log(add(3, 5)); // Output: 8
console.log(subtract(10, 4)); // Output: 6
console.log(multiply(2, 6)); // Output: 12
console.log(divide(8, 2)); // Output: 4
console.log(divide(5, 0)); // Output: Cannot divide by zero
console.log(square(4)); // Output: 16
console.log(greet("Alice")); // Output: Hello, Alice!
console.log(greet()); // Output: Hello, stranger!


module.exports = { add, subtract, multiply, divide, square, greet };
//---------Test cases below---------//
divide(0.6050641911735826, 0.6506472557828107);
divide(0.8172440441618738, 0.22269002284925787);
divide(1, 0.7173972574891956);
divide(1, 0.41343807030758173);
//---------Test cases below---------//
greet(0.0010808548958174402);
greet(0.6146210379779355);
greet(true);
greet(true);