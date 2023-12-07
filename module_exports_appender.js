const fs = require("fs");
const acorn = require("acorn");
const walk = require("acorn-walk");

// Reading the content of test.js
const testContent = fs.readFileSync("test.js", "utf-8");

// Parsing the code to generate AST
const ast = acorn.parse(testContent, { ecmaVersion: "latest" });

// Checking if module.exports is already present
let moduleExportsAlreadyPresent = false;
walk.simple(ast, {
  AssignmentExpression(node) {
    if (
      node.left &&
      node.left.object &&
      node.left.object.name === "module" &&
      node.left.property &&
      node.left.property.name === "exports"
    ) {
      moduleExportsAlreadyPresent = true;
    }
  },
});

// Finding all function declarations in the AST
const functionNames = [];
walk.simple(ast, {
  FunctionDeclaration(node) {
    functionNames.push(node.id.name);
  },
});

// Creating the module.exports string
const moduleExportsString = `module.exports = { ${functionNames.join(", ")} };`;

// Appending module.exports at the end of the file
const updatedTestContent = `${testContent}\n\n${moduleExportsString}`;

// Write the updated content back to test.js
fs.writeFileSync("test.js", updatedTestContent, "utf-8");

if (!moduleExportsAlreadyPresent) {
  console.log("Module.exports appended to test.js");
} else {
  console.log("Module.exports is already present in test.js");
}
