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

// Define a function to traverse and modify the AST
function traverseAndModify(node, variableValues = {}) {
  if (
    node.type === "IfStatement" &&
    node.test &&
    node.test.type === "Identifier"
  ) {
    // Add true and false values to the node
    node.trueValue = true;
    node.falseValue = false;

    // Recursively traverse child nodes
    if (node.consequent) {
      traverseAndModify(node.consequent, variableValues);
    }
    if (node.alternate) {
      traverseAndModify(node.alternate, variableValues);
    }
  }
  if (
    (node.type === "IfStatement" || node.type === "BinaryExpression") &&
    node.test &&
    (node.test.type === "BinaryExpression" ||
      node.test.type === "LogicalExpression")
  ) {
    const { operator, right, left } = node.test;

    if (left.type === "BinaryExpression" || right.type === "BinaryExpression") {
      //after finding the logical condition we check the left and right side
      //as the left side could be like (a < b) both identifiers and
      //right side could like (a < 10 ) one side identifier and other side literal
      //an vice verse

      if (left.left.type === "Identifier" && left.right.type === "Identifier") {
        const {
          trueValueLeft,
          falseValueLeft,
          trueValueRight,
          falseValueRight,
        } = generateTrueFalseValuesForVariables(
          variableValues[left.left.name],
          variableValues[left.right.name],
          left.operator
        );

        // Add true and false values to the node
        left.trueValueLeft = trueValueLeft;
        left.falseValueLeft = falseValueLeft;
        left.trueValueRight = trueValueRight;
        left.falseValueRight = falseValueRight;
      }
      if (
        right.left.type === "Identifier" &&
        right.right.type === "Identifier"
      ) {
        const {
          trueValueLeft,
          falseValueLeft,
          trueValueRight,
          falseValueRight,
        } = generateTrueFalseValuesForVariables(
          variableValues[right.left.name],
          variableValues[right.right.name],
          right.operator
        );

        // Add true and false values to the node
        right.trueValueLeft = trueValueLeft;
        right.falseValueLeft = falseValueLeft;
        right.trueValueRight = trueValueRight;
        right.falseValueRight = falseValueRight;
      }
      if (left.left.type === "Identifier" && left.right.type === "Literal") {
        traverseAndModify(left, variableValues);
      }
      if (right.left.type === "Identifier" && right.right.type === "Literal") {
        traverseAndModify(right, variableValues);
      }
    } else {
      // Check if both left and right values are identifiers (variables)
      if (left.type === "Identifier" && right.type === "Identifier") {
        const {
          trueValueLeft,
          falseValueLeft,
          trueValueRight,
          falseValueRight,
        } = generateTrueFalseValuesForVariables(
          variableValues[left.name],
          variableValues[right.name],
          operator
        );

        // Add true and false values to the node
        node.trueValueLeft = trueValueLeft;
        node.falseValueLeft = falseValueLeft;
        node.trueValueRight = trueValueRight;
        node.falseValueRight = falseValueRight;
      } else if (left.type === "Identifier" && right.type === "Literal") {
        // Generate random values for true and false paths based on the operator and values
        let trueValue, falseValue;

        // Check the data type of the right value
        const rightValueType = right.type;

        switch (rightValueType) {
          case "Literal":
            // Handle different literal types
            if (typeof right.value === "number") {
              switch (operator) {
                case ">":
                  trueValue = Math.floor(right.value) + 1;
                  falseValue = Math.floor(right.value) - 1;
                  break;
                case "<":
                  trueValue = Math.floor(right.value) - 1;
                  falseValue = Math.floor(right.value) + 1;
                  break;
                case ">=":
                  trueValue = Math.floor(right.value);
                  falseValue = Math.floor(right.value - Math.random());
                  break;
                case "<=":
                  trueValue = Math.floor(right.value);
                  falseValue = Math.floor(1 + right.value);
                  break;
                case "===":
                case "==":
                  trueValue = right.value;
                  falseValue =
                    Math.floor(Math.random() * (10 - right.value)) +
                    right.value +
                    1;
                  break;
                case "!==":
                case "!=":
                  trueValue = right.value + 1; // Random boolean value
                  falseValue = right.value;
                  break;
                default:
                  // Handle other operators for number literals
                  trueValue = Math.floor(Math.random() * 10);
                  falseValue = Math.floor(Math.random() * 10);
                  break;
              }
            } else if (typeof right.value === "string") {
              switch (operator) {
                case "===":
                case "==":
                  trueValue = right.value;
                  let val = "String" + Math.random();
                  do {
                    falseValue = "String" + Math.random();
                  } while (val === trueValue);
                  break;
                case "!==":
                case "!=":
                  trueValue = right.value + Math.random();
                  let val1 = "String" + Math.random();
                  falseValue = right.value;

                  break;
                default:
                  // Handle other operators for string literals
                  trueValue = "LiteralTrue";
                  falseValue = "LiteralFalse";
                  break;
              }
            } else if (typeof right.value === "boolean") {
              switch (operator) {
                case "===":
                case "==":
                  trueValue = right.value;
                  falseValue = !right.value;
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
            break;

          case "Identifier":
            // Handle the case where the right value is an identifier (variable)
            const variableName = right.name;

            // Check if the variable has an assigned value
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
            } else {
              const {
                trueValueLeft,
                falseValueLeft,
                trueValueRight,
                falseValueRight,
              } = generateTrueFalseValuesForVariables(
                variableValues[left.name],
                variableValues[right.name],
                operator
              );

              // Add true and false values to the node
              node.trueValueLeft = trueValueLeft;
              node.falseValueLeft = falseValueLeft;
              node.trueValueRight = trueValueRight;
              node.falseValueRight = falseValueRight;
              break;
            }
            break;

          default:
            // Provide default values or handle other types
            trueValue = "DefaultTrue";
            falseValue = "DefaultFalse";
            break;
        }

        // Add trueValue and falseValue properties to the IfStatement node
        node.trueValue = trueValue;
        node.falseValue = falseValue;
      }
    }

    // Recursively traverse child nodes
    if (node.consequent) {
      traverseAndModify(node.consequent, variableValues);
    }
    if (node.alternate) {
      traverseAndModify(node.alternate, variableValues);
    }
  }
  if (node.type === "BinaryExpression" && node.test == undefined) {
    const { operator, right, left } = node;
    // Check if both left and right values are identifiers (variables)
    if (left.type === "Identifier" && right.type === "Identifier") {
      const { trueValueLeft, falseValueLeft, trueValueRight, falseValueRight } =
        generateTrueFalseValuesForVariables(
          variableValues[left.name],
          variableValues[right.name],
          operator
        );

      // Add true and false values to the node
      node.trueValueLeft = trueValueLeft;
      node.falseValueLeft = falseValueLeft;
      node.trueValueRight = trueValueRight;
      node.falseValueRight = falseValueRight;
    } else if (left.type === "Identifier" && right.type === "Literal") {
      // Generate random values for true and false paths based on the operator and values
      let trueValue, falseValue;

      // Check the data type of the right value
      const rightValueType = right.type;

      switch (rightValueType) {
        case "Literal":
          // Handle different literal types
          if (typeof right.value === "number") {
            switch (operator) {
              case ">":
                trueValue = Math.floor(right.value) + 1;
                falseValue = Math.floor(right.value) - 1;
                break;
              case "<":
                trueValue = Math.floor(right.value) - 1;
                falseValue = Math.floor(right.value) + 1;
                break;
              case ">=":
                trueValue = Math.floor(right.value);
                falseValue = Math.floor(right.value - Math.random());
                break;
              case "<=":
                trueValue = Math.floor(right.value);
                falseValue = Math.floor(1 + right.value);
                break;
              case "===":
              case "==":
                trueValue = right.value;
                falseValue =
                  Math.floor(Math.random() * (10 - right.value)) +
                  right.value +
                  1;
                break;
              case "!==":
              case "!=":
                trueValue = right.value + 1; // Random boolean value
                falseValue = right.value;
                break;
              default:
                // Handle other operators for number literals
                trueValue = Math.floor(Math.random() * 10);
                falseValue = Math.floor(Math.random() * 10);
                break;
            }
          } else if (typeof right.value === "string") {
            switch (operator) {
              case "===":
              case "==":
                trueValue = right.value;
                let val = "String" + Math.random();
                do {
                  falseValue = "String" + Math.random();
                } while (val === trueValue);
                break;
              case "!==":
              case "!=":
                trueValue = Math.random() > 0.5; // Random boolean value
                falseValue = !trueValue;
                break;
              default:
                // Handle other operators for string literals
                trueValue = "LiteralTrue";
                falseValue = "LiteralFalse";
                break;
            }
          } else if (typeof right.value === "boolean") {
            switch (operator) {
              case "===":
              case "==":
                trueValue = right.value;
                falseValue = !right.value;
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
          break;

        case "Identifier":
          // Handle the case where the right value is an identifier (variable)
          const variableName = right.name;

          // Check if the variable has an assigned value
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
          } else {
            const {
              trueValueLeft,
              falseValueLeft,
              trueValueRight,
              falseValueRight,
            } = generateTrueFalseValuesForVariables(
              variableValues[left.name],
              variableValues[right.name],
              operator
            );

            // Add true and false values to the node
            node.trueValueLeft = trueValueLeft;
            node.falseValueLeft = falseValueLeft;
            node.trueValueRight = trueValueRight;
            node.falseValueRight = falseValueRight;
            break;
          }
          break;

        default:
          // Provide default values or handle other types
          trueValue = "DefaultTrue";
          falseValue = "DefaultFalse";
          break;
      }

      // Add trueValue and falseValue properties to the IfStatement node
      node.trueValue = trueValue;
      node.falseValue = falseValue;
    }

    // Recursively traverse child nodes
    if (node.consequent) {
      traverseAndModify(node.consequent, variableValues);
    }
    if (node.alternate) {
      traverseAndModify(node.alternate, variableValues);
    }
  } else if (
    node.type != undefined &&
    (node.type === "WhileStatement" || node.type === "ForStatement") &&
    node.test
  ) {
    const { operator, left, right } = node.test;
    let trueValue, falseValue;

    if (left == undefined || right == undefined) {
      node.trueValue = 10;
      node.falseValue = 0;
    } else {
      if (left.type === "Identifier" && right.type === "Identifier") {
        const {
          trueValueLeft,
          falseValueLeft,
          trueValueRight,
          falseValueRight,
        } = generateTrueFalseValuesForVariables(
          variableValues[left.name],
          variableValues[right.name],
          operator
        );

        // Add true and false values to the node
        node.trueValueLeft = trueValueLeft;
        node.falseValueLeft = falseValueLeft;
        node.trueValueRight = trueValueRight;
        node.falseValueRight = falseValueRight;
      } else if (left.type === "Identifier" && right.type === "Literal") {
        // Check the data type of the right value
        const rightValueType = right.type;

        switch (rightValueType) {
          case "Literal":
            // Handle different literal types in the while and for loop conditions
            if (typeof right.value === "number") {
              switch (operator) {
                case ">":
                  trueValue = right.value + 1;
                  falseValue = right.value - 1;
                  break;
                case "<":
                  trueValue = right.value - 1;
                  falseValue = right.value + 1;
                  break;
                case ">=":
                  trueValue = right.value;
                  falseValue = right.value - 1;
                  break;
                case "<=":
                  trueValue = right.value;
                  falseValue = right.value + 1;
                  break;
                default:
                  // Handle other operators for number literals in while and for loop conditions
                  trueValue = right.value + 1;
                  falseValue = right.value - 1;
                  break;
              }
            } else if (typeof right.value === "string") {
              switch (operator) {
                case "===":
                case "==":
                  trueValue = right.value;
                  let val = "String" + Math.random();
                  do {
                    falseValue = "String" + Math.random();
                  } while (val === trueValue);
                  break;
                case "!==":
                case "!=":
                  trueValue = Math.random() > 0.5; // Random boolean value
                  falseValue = !trueValue;
                  break;
                default:
                  // Handle other operators for string literals
                  trueValue = "LiteralTrue";
                  falseValue = "LiteralFalse";
                  break;
              }
            } else if (typeof right.value === "boolean") {
              switch (operator) {
                case "===":
                case "==":
                  trueValue = right.value;
                  falseValue = !right.value;
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
            break;

          case "Identifier":
            // Handle the case where the right value is an identifier (variable)
            const variableName = right.name;

            // Check if the variable has an assigned value
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
            } else {
              // Provide default values or handle other cases
              const {
                trueValueLeft,
                falseValueLeft,
                trueValueRight,
                falseValueRight,
              } = generateTrueFalseValuesForVariables(
                variableValues[left.name],
                variableValues[right.name],
                operator
              );

              // Add true and false values to the node
              node.trueValueLeft = trueValueLeft;
              node.falseValueLeft = falseValueLeft;
              node.trueValueRight = trueValueRight;
              node.falseValueRight = falseValueRight;
              break;
            }
            break;

          default:
            // Provide default values or handle other types
            const {
              trueValueLeft,
              falseValueLeft,
              trueValueRight,
              falseValueRight,
            } = generateTrueFalseValuesForVariables(
              variableValues[left.name],
              variableValues[right.name],
              operator
            );

            // Add true and false values to the node
            node.trueValueLeft = trueValueLeft;
            node.falseValueLeft = falseValueLeft;
            node.trueValueRight = trueValueRight;
            node.falseValueRight = falseValueRight;
            break;
        }

        // Modify the current loop node
        node.trueValue = trueValue;
        node.falseValue = falseValue;
      }

      // Recursively traverse the body of the loop
      traverseAndModify(node.body, variableValues);

      // If there is an update expression, traverse and modify it
      if (node.update) {
        traverseAndModify(node.update, variableValues);
      }
    }
  } else if (node.type === "ForOfStatement" && node.right) {
    // Code for handling ForOfStatement conditions
    // (similar to the code for WhileStatement and ForStatement)
    const { right } = node;
    let trueValue, falseValue;

    // Modify the current ForOfStatement node
    node.trueValue = trueValue;
    node.falseValue = falseValue;

    // Recursively traverse the body of the loop
    traverseAndModify(node.body, variableValues);
  } else if (node.type === "ForStatement" && node.test) {
    // Code for handling ForStatement conditions
    // (similar to the code for WhileStatement and ForOfStatement)
    const { test, update } = node;
    let trueValue, falseValue;

    // Modify the current ForStatement node
    node.trueValue = trueValue;
    node.falseValue = falseValue;

    // Recursively traverse the body of the loop
    traverseAndModify(node.body, variableValues);

    // If there is an update expression, traverse and modify it
    if (update) {
      traverseAndModify(update, variableValues);
    }
  } else if (
    node.type === "ExpressionStatement" &&
    node.expression.type === "CallExpression" &&
    node.expression.callee.type === "MemberExpression" &&
    node.expression.callee.property.name === "forEach"
  ) {
    // Code for handling ForEachStatement
    // (unchanged from the previous code)
    const forEachCallback = node.expression.arguments[0];
    traverseAndModify(forEachCallback.body, variableValues);
  }

  // Recursively traverse child nodes
  for (const key in node) {
    if (node[key] && typeof node[key] === "object") {
      traverseAndModify(node[key], variableValues);
    }
  }
}

const sourceCode = fs.readFileSync("test.js", "utf-8");

const ast = acorn.parse(sourceCode, { ecmaVersion: 2020 });

traverseAndModify(ast);

const utils = new Utils();
utils.evaluateConditionalStatements(ast);
