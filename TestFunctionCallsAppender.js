const fs = require("fs");
var simple = false;
var complex = false;
function generateFunctionCalls(testCase, functionSource) {
  const functionName = testCase.name;
  const condition = testCase.conditionName;
  const trueValues = extractValues(testCase, "true");
  const falseValues = extractValues(testCase, "false");

  // Extracting variables from the condition
  const variables = condition.match(/[a-zA-Z_]+/g);

  // parameter names from the function signature
  const parameterNames = functionSource
    .toString()
    .match(/\(([^)]+)\)/)[1]
    .split(",")
    .map((param) => param.trim());

  // array to store the function calls
  const functionCalls = [];

  // Generating function calls here
  falseValues.forEach((falseValue) => {
    const callString = generateCallString(
      testCase,
      functionName,
      parameterNames,
      variables,
      falseValue
    );
    if (callString !== null) functionCalls.push(callString);
  });
  trueValues.forEach((trueValue) => {
    const callString = generateCallString(
      testCase,
      functionName,
      parameterNames,
      variables,
      trueValue
    );
    functionCalls.push(callString);
  });

  return functionCalls;
}

function extractValues(testCase, type) {
  const values = [];

  const suffixes = ["Left", "Right"];
  suffixes.forEach((suffix) => {
    const key = `${type}Value${suffix}`;
    const simplekey = `${type}Value`;

    if (testCase.hasOwnProperty(key)) {
      values.push(testCase[key]);

      complex = true;
    } else if (testCase.hasOwnProperty(simplekey)) {
      simple = true;

      values.push(testCase[simplekey]);
    }
  });

  return values;
}

function generateCallString(
  testCase,
  functionName,
  parameterNames,
  variables,
  valuettobeinserted
) {
  const paramValues = {};
  var count = 0;

  parameterNames.forEach((param, index) => {
    if (variables && variables.includes(param)) {
      paramValues[index] = valuettobeinserted
        ? valuettobeinserted
        : Math.random();
      count++;
    }
  });
  parameterNames.forEach((param, index) => {
    if (variables && !variables.includes(param) && count) {
      paramValues[param] = Math.random();
    }
  });

  if (count == 0) {
    return null;
  }
  const callString = `${functionName}(${Object.values(paramValues).join(
    parameterNames.length > 1 ? ", " : ""
  )});`;

  return callString;
}

// Reading the content of the file containing the code to be tested
const functions = require("./test");

// Reading test cases from the JSON file
const testCases = require("./testcases.json");

const fileName = "test.js";

let fileContent = "";
//return true if file exists
if (fs.existsSync(fileName)) {
  fileContent = fs.readFileSync(fileName, "utf-8");
}
const delimiter = "//---------Test cases below---------//";
const delimiterIndex = fileContent.indexOf(delimiter);

// If the delimiter is found, remove everything below it
if (delimiterIndex !== -1) {
  fileContent = fileContent.substring(0, delimiterIndex);
}

testCases.forEach((testCase) => {
  // Find the function in the 'functions' object
  const testFunction = functions[testCase.name];

  if (testFunction) {
    // Generating function calls for the test case
    const functionCalls = generateFunctionCalls(testCase, testFunction);

    // Append function calls to the existing fileContent
    fileContent += `\n//---------Test cases below---------//\n${functionCalls.join(
      "\n"
    )}`;
  } else {
    console.error(`Function ${testCase.name} not found.`);
  }
});

// Writing the modified content back to the file
fs.writeFileSync(fileName, fileContent);

console.log(`Function calls have been appended to ${fileName}`);
