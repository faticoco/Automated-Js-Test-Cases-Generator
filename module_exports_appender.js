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

let functionNames = [];

// Define a default visitor that will be used for all nodes
let defaultVisitor = (node) => {
  if (functionBodyGetter(node)) {
    let body = functionBodyGetter(node);
    if (body) {
      let name = functionNameExtractor(node);
      if (!functionNames.includes(name)) {
        functionNames.push(name);
      }
    }
  }
};

// Create a new visitor object that uses the default visitor for all nodes
let visitor = {};
for (let type in walk.base) {
  visitor[type] = defaultVisitor;
}

// Traverse the AST
walk.simple(ast, visitor);

console.log(functionNames);

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

//-------------haaadiya

function functionBodyGetter(node) {
  if (!node || !node.type) {
    return false;
  }

  //for arrow func e.g. const func = () => {return 1;}
  if (
    node.type == "VariableDeclaration" &&
    node.declarations &&
    node.declarations[0] &&
    node.declarations[0].init &&
    node.declarations[0].init.type === "ArrowFunctionExpression"
  ) {
    return node.declarations[0].init.body.body;
  }

  //for declaration e.g. const func = function() {return 1;}
  if (
    node.type == "VariableDeclaration" &&
    node.declarations &&
    node.declarations[0] &&
    node.declarations[0].init &&
    node.declarations[0].init.type === "FunctionExpression"
  )
    return node.declarations[0].init.body.body;

  //for normalfunc e.g. function hello() {return 1;}
  if (node.type == "FunctionDeclaration" && node.body && node.body.body)
    return node.body.body;

  return false; //indicate that it's not a function
}

function functionNameExtractor(node) {
  //if arrow funcor other return declarations[0].id.name;
  //if normal return node.id.name

  //for arrow func e.g. const func = () => {return 1;}
  if (
    (node.type == "VariableDeclaration" &&
      node.declarations &&
      node.declarations[0] &&
      node.declarations[0].init &&
      node.declarations[0].init.type === "ArrowFunctionExpression") ||
    (node.type == "VariableDeclaration" &&
      node.declarations &&
      node.declarations[0] &&
      node.declarations[0].init &&
      node.declarations[0].init.type === "FunctionExpression")
  ) {
    return node.declarations[0].id.name;
  }

  //for normalfunc e.g. function hello() {return 1;}
  if (node.type == "FunctionDeclaration" && node.body && node.body.body)
    return node.id.name;

  return "UnnamedFunction";
}
