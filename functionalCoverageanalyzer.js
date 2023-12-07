const fs = require("fs");
const acorn = require("acorn");
const coverageData = require("./coverage/coverage.json");

// Read the content of the test.js file
const testCode = fs.readFileSync("test.js", "utf-8");

// Parse the code to generate AST
const ast = acorn.parse(testCode, { locations: true, ecmaVersion: "latest" });

// Step 1: Traverse the AST to collect CallExpressions and FunctionDeclarations
const callExpressions = [];
const functions = [];

function traverse(node) {
  if (node.type === "CallExpression" && node.callee.type === "Identifier") {
    callExpressions.push({
      name: node.callee.name,
      line: node.loc.start.line,
    });
  }

  if (node.type === "FunctionDeclaration") {
    functions.push({
      name: node.id.name,
      line: node.loc.start.line,
      called: false,
    });
  }

  for (const key in node) {
    if (node[key] && typeof node[key] === "object") {
      traverse(node[key]);
    }
  }
}

traverse(ast);

// Step 2: Map each FunctionDeclaration to its callee expressions
const functionMap = new Map();

for (const func of functions) {
  const callees = callExpressions.filter(
    (callee) => callee.name === func.name && callee.line >= func.line
  );
  functionMap.set(func, callees);
}

// Step 3: Check coverage data for each callee expression
const executedCallees = [];

for (const func of functions) {
  const callees = functionMap.get(func);
  if (callees) {
    for (const callee of callees) {
      const line = callee.line;
      const statementInfo =
        coverageData.statementMap && coverageData.statementMap[line]
          ? coverageData.statementMap[line]
          : null;

      if (
        statementInfo &&
        statementInfo.start &&
        statementInfo.start.line <= line &&
        statementInfo.end &&
        statementInfo.end.line >= line
      ) {
        executedCallees.push(callee);
        func.called = true;
      }
    }
  }
}
// Step 4: Calculate and display functional coverage results
const totalCallees = callExpressions.length;
const executedCalleeCount = executedCallees.length;

console.log("Total Callees:", totalCallees);
console.log("Executed Callees:", executedCalleeCount);

const totalFunctions = functions.length;
const executedFunctions = functions.filter((func) => func.called).length;

console.log("Total Functions:", totalFunctions);
console.log("Executed Functions:", executedFunctions);
