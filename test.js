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
function name(n, m) {
  if (n == "hi" && m > 3) {
    if (m) {
    }
  }
}

function hi()
{

}

module.exports = { name, hi };
//---------Test cases below---------//
name("String0.752261665160151", 0.05942495503273415);
name("String0.752261665160151", 0.25106540592687);
name("hi", 0.21735530758283939);
name("hi", 0.8133452720177614);
//---------Test cases below---------//
name(0.754641670100199, 2);
name(0.685174792249674, 2);
name(0.9475265279297747, 4);
name(0.2281977420743735, 4);
//---------Test cases below---------//
name(0.6431781558149321, false);
name(0.505577936597045, false);
name(0.5736624854930972, true);
name(0.24070610765357214, true);