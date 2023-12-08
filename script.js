const acorn = require("acorn");
const util = require("util");
const fs = require("fs");

class Utils {
  evaluateConditionalStatements(ast) {
    // Write the evaluated AST to a file
    fs.writeFileSync("outputTree.json", JSON.stringify(ast, null, 2));
    console.log("Output written to outputTree.json");
  }
}

//function to generate true and false values for both
//variables on left and right side of the operator
function generateTrueFalseValuesForVariables(
  leftVariable,
  rightVariable,
  operator
) {
  let trueValueLeft, falseValueLeft, trueValueRight, falseValueRight;

  switch (operator) {
    case "==":
      const randomValue = Math.floor(Math.random() * 10);
      trueValueLeft = trueValueRight = randomValue;
      falseValueLeft = randomValue;
      falseValueRight = randomValue - 1;
      break;
    case "!=":
      const randomValueNE = Math.floor(Math.random() * 10);
      trueValueLeft = randomValueNE - 1;
      trueValueRight = randomValueNE;
      falseValueLeft = falseValueRight = randomValueNE - 1;
      break;
    case "<":
      const randomValueLT = Math.floor(Math.random() * 10);
      trueValueLeft = randomValueLT;
      trueValueRight = randomValueLT + 1;
      falseValueLeft = falseValueRight = randomValueLT - 1;
      break;
    case "<=":
      const randomValueLE = Math.floor(Math.random() * 10);
      trueValueLeft = randomValueLE;
      trueValueRight = randomValueLE + 1;
      falseValueLeft = randomValueLE;
      falseValueRight = randomValueLE - 1;
      break;
    case ">":
      const randomValueGT = Math.floor(Math.random() * 10);
      trueValueLeft = randomValueGT + 1;
      trueValueRight = randomValueGT;
      falseValueLeft = falseValueRight = randomValueGT - 1;
      break;
    case ">=":
      const randomValueGE = Math.floor(Math.random() * 10);
      trueValueLeft = trueValueRight = randomValueGE;
      falseValueLeft = randomValueGE - 1;
      falseValueRight = randomValueGE;
      break;
    case "===":
      const randomValueStrict = Math.floor(Math.random() * 10);
      trueValueLeft = trueValueRight = randomValueStrict;
      falseValueLeft = randomValueStrict;
      falseValueRight = randomValueStrict - 1;
      break;
    case "!==":
      const randomValueNotStrict = Math.floor(Math.random() * 10);
      trueValueLeft = randomValueNotStrict + 1;
      trueValueRight = randomValueNotStrict;
      falseValueLeft = falseValueRight = randomValueNotStrict - 1;
      break;
    // Add more cases for other operators as needed
    default:
      // Provide default boolean values if the operator is not explicitly handled
      trueValueLeft = true;
      falseValueLeft = !leftVariable;
      trueValueRight = true;
      falseValueRight = !rightVariable;
      break;
  }

  return {
    trueValueLeft,
    falseValueLeft,
    trueValueRight,
    falseValueRight,
  };
}

function traverseAndModify(node) {
  if (node.type === "ExpressionStatement") {
    // If it's an ExpressionStatement, get the expression and traverse it
    traverseAndModify(node.expression);
  } else {
    switch (node.type) {
      case "LogicalExpression":
        console.log("This is a logical expression: ", node.operator);
        traverseAndModify(node.left);
        traverseAndModify(node.right);
        break;
      case "BinaryExpression":
        console.log(
          "This is a binary expression: ",
          node.left.name,
          node.operator,
          node.right.name
        );
        handleBinaryExpression(node);
        break;
      case "Identifier":
        console.log("This is a identifier expression: ");
        handleIdentifierExpression(node);
        break;
      case "Literal":
        console.log("This is a literal: " + node.name);
        break;
      case "CallExpression":
        console.log("This is a call expression");
        traverseAndModify(node.callee);
        for (const arg of node.arguments) {
          traverseAndModify(arg);
        }
        break;
      default:
        console.log("Encountered unknown node type: " + node.type);
    }
  }
}

const sourceCode = fs.readFileSync("test.js", "utf-8");

const ast = acorn.parse(sourceCode, { ecmaVersion: 2020 });

function traverseTree(node, visitor) {
  if (node.test) {
    // If the node has a 'test' property, apply the modification function
    traverseAndModify(node.test);
  }

  // Check each property of the node
  for (let prop in node) {
    if (
      node.hasOwnProperty(prop) &&
      typeof node[prop] === "object" &&
      node[prop] !== null
    ) {
      // If the property is an object, traverse it
      traverseTree(node[prop], visitor);
    } else if (Array.isArray(node[prop])) {
      // If the property is an array, traverse each item
      for (let child of node[prop]) {
        if (typeof child === "object" && child !== null) {
          traverseTree(child, visitor);
        }
      }
    }
  }
}

function handleBinaryExpression(node, variableValues) {
  //in the node parameter, pass node.test

  if (!node.type) {
    //nodetype should be binaryExpression
    return;
  }

  //case one is variable and one is literal
  //e.g. a>5
  if (node.left.type === "Identifier") {
    usingOpposite(node, "Right");
  }
  //in case of something like 5>a
  else if (node.right.type == "Identifier") {
    usingOpposite(node, "Left");
  }
  console.log("node.truevalue ", node.trueValue);
  console.log("node.falsevalue ", node.falseValue);
  console.log("node.trueValueRight ", node.trueValueRight);
  console.log("node.falseValueRight ", node.falseValueRight);
  console.log("node.trueValueLeft ", node.trueValueLeft);
  console.log("node.falseValueLeft ", node.falseValueLeft);
}

function usingOpposite(node, oppositeType, variableValues = {}) {
  let trueValue, falseValue, switchValue;
  if (oppositeType == "Left") {
    switchValue = node.left.type;
  } else if (oppositeType == "Right") {
    console.log("node.right.type ", node.right.type);
    switchValue = node.right.type;
  }
  let oppositeNode;
  if (oppositeType == "Left") {
    oppositeNode = node.left;
  } else if (oppositeType == "Right") {
    console.log("Opposite node: Right");
    oppositeNode = node.right;
  }

  switch (switchValue) {
    case "Literal":
      const { trueValue, falseValue } = generateTrueFalseValue(
        oppositeNode,
        node.operator
      );
      node.trueValue = trueValue;
      node.falseValue = falseValue;
      console.log("trueValue ", node.type, " ", node.trueValue);
      break;

    case "Identifier":
      // Handle the case where the right value is an identifier (variable)
      const variableName = oppositeNode.name;
      //Check if the variable has an assigned value
      if (variableValues.hasOwnProperty(variableName)) {
        const variableValue = variableValues[variableName];
        // Check the type of the variable and set true and false values accordingly
        if (typeof variableValue === "number") {
          trueValue = variableValue + 1;
          falseValue = variableValue - 1;
        } else if (typeof variableValue === "string") {
          trueValue = variableValue;
          let val = "String" + Math.random();
          do {
            falseValue = "String" + Math.random();
          } while (val === trueValue);
        } else if (typeof variableValue === "boolean") {
          trueValue = variableValue;
          falseValue = !variableValue;
        }
        node.trueValue = trueValue;
        node.falseValue = falseValue;
      } else {
        const {
          trueValueLeft,
          falseValueLeft,
          trueValueRight,
          falseValueRight,
        } = generateTrueFalseValuesForVariables(
          variableValues[node.left.name],
          variableValues[node.right.name],
          node.operator
        );

        // Add true and false values to the node
        node.trueValueLeft = trueValueLeft;
        node.falseValueLeft = falseValueLeft;
        node.trueValueRight = trueValueRight;
        node.falseValueRight = falseValueRight;
      }
      break;

    default:
      trueValue = "DefaultTrue";
      falseValue = "DefaultFalse";
      break;
  }

  //assigning node truevalue and false value
}

function generateTrueFalseValue(node, operator) {
  //pass node.right/left
  let trueValue, falseValue;
  let val = node.value;
  if (typeof val === "number") {
    switch (operator) {
      case ">":
        trueValue = Math.floor(val) + 1;
        falseValue = Math.floor(val) - 1;
        break;
      case "<":
        trueValue = Math.floor(val) - 1;
        falseValue = Math.floor(val) + 1;
        break;
      case ">=":
        trueValue = Math.floor(val);
        falseValue = Math.floor(val - Math.random());
        break;
      case "<=":
        console.log("val: ", val, " node name", node.name);
        trueValue = Math.floor(val);
        falseValue = Math.floor(1 + val);
        break;
      case "===":
      case "==":
        trueValue = val;
        falseValue = Math.floor(Math.random() * (10 - val)) + val + 1;
        break;
      case "!==":
      case "!=":
        trueValue = val + 1; // Random boolean value
        falseValue = val;
        break;
      default:
        // Handle other operators for number literals
        trueValue = Math.floor(Math.random() * 10);
        falseValue = Math.floor(Math.random() * 10);
        break;
    }
  } else if (typeof val === "string") {
    switch (operator) {
      case "===":
      case "==":
        trueValue = val;
        val = "String" + Math.random();
        do {
          falseValue = "String" + Math.random();
        } while (val === trueValue);
        break;
      case "!==":
      case "!=":
        trueValue = val + Math.random();
        let val1 = "String" + Math.random();
        falseValue = val;

        break;
      default:
        // Handle other operators for string literals
        trueValue = "LiteralTrue";
        falseValue = "LiteralFalse";
        break;
    }
  } else if (typeof val === "boolean") {
    switch (operator) {
      case "===":
      case "==":
        trueValue = val;
        falseValue = !val;
        break;
      case "!==":
      case "!=":
        trueValue = Math.random() > 0.5; // Random boolean value
        falseValue = !trueValue;
        break;
      default:
        // Handle other operators for boolean literals
        trueValue = "LiteralTrue";
        falseValue = "LiteralFalse";
        break;
    }
  }
  return { trueValue, falseValue };
}

function handleIdentifierExpression(node, variableValues = {}) {
  node.trueValue = true;
  node.falseValue = false;
}

traverseTree(ast);
const utils = new Utils();
async function processAST() {
  await utils.evaluateConditionalStatements(ast);
}

processAST();
