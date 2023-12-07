const fs = require("fs");
const acorn = require("acorn");
const coverageData = require("./coverage/coverage.json");

// Read the content of the test.js file
const testCode = fs.readFileSync("test.js", "utf-8");

// Parse the code to generate AST
const ast = acorn.parse(testCode, { locations: true, ecmaVersion: "latest" });

// Function to traverse AST and count conditions
function countConditions(node, conditions) {
  if (
    node.type === "IfStatement" ||
    node.type === "ForStatement" ||
    node.type === "WhileStatement"
  ) {
    conditions.push(node.loc.start.line);
  }

  // Traverse child nodes
  for (const key in node) {
    if (node[key] && typeof node[key] === "object") {
      countConditions(node[key], conditions);
    }
  }
}

// Initialize conditions array
const conditions = [];

// Traverse AST to count conditions
countConditions(ast, conditions);

function calculateAndDisplayResults(conditions, coverageData) {
  const totalConditions = conditions.length;
  let executedConditions = 0;

  conditions.forEach((lineNumber) => {
    const lineExecutionCount = coverageData.s[lineNumber];
    if (lineExecutionCount !== undefined && lineExecutionCount > 0) {
      executedConditions++;
    }
  });

  const percentageExecuted = (executedConditions / totalConditions) * 100;
  console.log(
    "=============================== Conditional Coverage summary ==============================="
  );
  console.log("Total Conditions:", totalConditions);
  console.log("Executed Conditions:", executedConditions);
  console.log("Percentage Executed:", percentageExecuted.toFixed(2) + "%");
  console.log(
    "============================================================================================="
  );
}

// Display results
calculateAndDisplayResults(
  conditions,
  coverageData[
    "C:\\Users\\fatim\\Downloads\\JS-Code-Analyzer-main\\JS-Code-Analyzer-main\\test.js"
  ]
);
