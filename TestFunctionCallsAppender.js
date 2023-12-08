const fs = require("fs");

function generateFunctionCalls(testCase, functionSource) {
  const functionName = testCase.name;
  const condition = testCase.conditionName;
  const trueValues = extractValues(testCase, "true");
  const falseValues = extractValues(testCase, "false");
  // Extracting variables from the condition
  const variables = condition.match(/[a-zA-Z_]\w*/g);

  // parameter names from the function signature
  const parameterNames = functionSource
    .toString()
    .match(/\(([^)]+)\)/)[1]
    .split(",")
    .map((param) => param.trim());

  // array to store the function calls
  const functionCalls = [];
  if (testCase.trueValue) {
    var callString = generateCallString(
      testCase,
      functionName,
      parameterNames,
      variables,
      trueValues
    );
    functionCalls.push(callString);

    callString = generateCallString(
      testCase,
      functionName,
      parameterNames,
      variables,
      falseValues
    );
    functionCalls.push(callString);
  } else {
    var callString = generateCallString(
      testCase,
      functionName,
      parameterNames,
      variables,
      falseValues
    );
    functionCalls.push(callString);
    callString = generateCallString(
      testCase,
      functionName,
      parameterNames,
      variables,
      trueValues
      //  );
    );
    functionCalls.push(callString);
  }
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
  falseValues
) {
  const paramValues = {};
  for (let i = 0; i < parameterNames.length; i++) {
    if (variables.includes(parameterNames[i]))
      paramValues[parameterNames[i]] = falseValues[i];
    else paramValues[parameterNames[i]] = Math.random();
  }
  // Generate the function call string
  const callString = `${functionName}(${parameterNames
    .map((param) => paramValues[param])
    .join(", ")});`;
  console.log(callString);
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
// Check for functions without test cases
Object.keys(functions).forEach((functionName) => {
  const testFunction = functions[functionName];
  if (!testCases.some((testCase) => testCase.name === functionName)) {
    // No test case found for this function, assign random values to its parameters
    const parameterNames = testFunction
      .toString()
      .match(/\(([^)]+)\)/)[1]
      .split(",")
      .map((param) => param.trim());

    const randomValues = {};
    parameterNames.forEach((param) => {
      randomValues[param] = Math.random();
    });

    // Generate function call with random values
    const callString = `${functionName}(${parameterNames
      .map((param) => randomValues[param])
      .join(", ")});`;

    // Append the function call to the existing fileContent
    fileContent += `\n//---------Test cases below---------//\n${callString}`;
  }
});
// Writing the modified content back to the file
fs.writeFileSync(fileName, fileContent);

console.log(`Function calls have been appended to ${fileName}`);
