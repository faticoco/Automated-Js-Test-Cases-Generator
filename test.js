// Sample functions for testing
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// Sample conditional statements for testing
function checkNumber(num) {
  if (num < 3 && num < 2) {
    return "Negative";
  }
}

module.exports = { add, subtract, checkNumber };

console.log(add(2, 3));
/* istanbul ignore next */
