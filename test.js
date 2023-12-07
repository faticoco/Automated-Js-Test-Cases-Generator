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