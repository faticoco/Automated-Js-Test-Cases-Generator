function xyz(num1, num2) {
  if (num1 != 10 && num1 > num2) {
    console.log("hello");
  }
}

module.exports = { xyz };
//---------Test cases below---------//
xyz(11, 0.6984437208889389);
xyz(10, 0.5034981655065518);
//---------Test cases below---------//
xyz(3, 3);
xyz(5, 4);
