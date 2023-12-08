function add(a, b) {
  if (a === 0) {
    if (b > 0) {
      if(a>5 && b>5 || a<5 && b<5) {
    return b;
  }}}
}

function subtract(a, b) {
  return a - b;
}

// Sample conditional statements for testing
function checkNumber(num) {
  if (num < 3 && num < 2) {
    return "Negative";
  }
  if(num!==5) {
    return "peeoo";
  }
}

module.exports = { add, subtract, checkNumber };
//---------Test cases below---------//
add(6, 0.4602718000272834);
add(6, 0.15621895964013444);
add(0, 0.860835022508001);
add(0, 0.7260663818985424);
//---------Test cases below---------//
add(0.37169483055098596, -1);
add(0.024642810557611083, -1);
add(0.5178981861050482, 1);
add(0.12874300879599643, 1);

//---------Test cases below---------//
checkNumber(4);
checkNumber(4);
checkNumber(2);
checkNumber(2);
//---------Test cases below---------//
checkNumber(3);
checkNumber(3);
checkNumber(1);
checkNumber(1);
//---------Test cases below---------//
checkNumber(5);
checkNumber(5);
checkNumber(6);
checkNumber(6);