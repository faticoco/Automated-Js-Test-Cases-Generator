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
// function traverseAndModify(node, variableValues = {}) {
//   if ( node.type === "IfStatement" &&
//     node.test && node.test.type === "Identifier") 
//     {
//     // Add true and false values to the node
//     node.trueValue = true;
//     node.falseValue = false;

//     // Recursively traverse child nodes
//     if (node.consequent) {
//       traverseAndModify(node.consequent, variableValues);
//     }
//     if (node.alternate) {
//       traverseAndModify(node.alternate, variableValues);
//     }
//   }
//   if (
//     (node.type === "IfStatement" || node.type === "BinaryExpression") &&
//     node.test &&
//     (node.test.type === "BinaryExpression" ||
//       node.test.type === "LogicalExpression")
//   ) {
//     const { operator, right, left } = node.test;

//     if (left.type === "BinaryExpression" || right.type === "BinaryExpression") {
//       //after finding the logical condition we check the left and right side
//       //as the left side could be like (a < b) both identifiers and
//       //right side could like (a < 10 ) one side identifier and other side literal
//       //an vice verse

//       if (left.left.type === "Identifier" && left.right.type === "Identifier") {
//         const {
//           trueValueLeft,
//           falseValueLeft,
//           trueValueRight,
//           falseValueRight,
//         } = generateTrueFalseValuesForVariables(
//           variableValues[left.left.name],
//           variableValues[left.right.name],
//           left.operator
//         );

//         // Add true and false values to the node
//         left.trueValueLeft = trueValueLeft;
//         left.falseValueLeft = falseValueLeft;
//         left.trueValueRight = trueValueRight;
//         left.falseValueRight = falseValueRight;
//       }
//       if (
//         right.left.type === "Identifier" &&
//         right.right.type === "Identifier"
//       ) {
//         const {
//           trueValueLeft,
//           falseValueLeft,
//           trueValueRight,
//           falseValueRight,
//         } = generateTrueFalseValuesForVariables(
//           variableValues[right.left.name],
//           variableValues[right.right.name],
//           right.operator
//         );

//         // Add true and false values to the node
//         right.trueValueLeft = trueValueLeft;
//         right.falseValueLeft = falseValueLeft;
//         right.trueValueRight = trueValueRight;
//         right.falseValueRight = falseValueRight;
//       }
//       if (left.left.type === "Identifier" && left.right.type === "Literal") {
//         traverseAndModify(left, variableValues);
//       }
//       if (right.left.type === "Identifier" && right.right.type === "Literal") {
//         traverseAndModify(right, variableValues);
//       }
//     } else {
//       // Check if both left and right values are identifiers (variables)
//       if (left.type === "Identifier" && right.type === "Identifier") {
//         const {
//           trueValueLeft,
//           falseValueLeft,
//           trueValueRight,
//           falseValueRight,
//         } = generateTrueFalseValuesForVariables(
//           variableValues[left.name],
//           variableValues[right.name],
//           operator
//         );

//         // Add true and false values to the node
//         node.trueValueLeft = trueValueLeft;
//         node.falseValueLeft = falseValueLeft;
//         node.trueValueRight = trueValueRight;
//         node.falseValueRight = falseValueRight;
//       } else if (left.type === "Identifier" && right.type === "Literal") {
//         // Generate random values for true and false paths based on the operator and values
//         let trueValue, falseValue;

//         // Check the data type of the right value
//         const rightValueType = right.type;

//         switch (rightValueType) {
//           case "Literal":
//             // Handle different literal types
//             if (typeof right.value === "number") {
//               switch (operator) {
//                 case ">":
//                   trueValue = Math.floor(right.value) + 1;
//                   falseValue = Math.floor(right.value) - 1;
//                   break;
//                 case "<":
//                   trueValue = Math.floor(right.value) - 1;
//                   falseValue = Math.floor(right.value) + 1;
//                   break;
//                 case ">=":
//                   trueValue = Math.floor(right.value);
//                   falseValue = Math.floor(right.value - Math.random());
//                   break;
//                 case "<=":
//                   trueValue = Math.floor(right.value);
//                   falseValue = Math.floor(1 + right.value);
//                   break;
//                 case "===":
//                 case "==":
//                   trueValue = right.value;
//                   falseValue =
//                     Math.floor(Math.random() * (10 - right.value)) +
//                     right.value +
//                     1;
//                   break;
//                 case "!==":
//                 case "!=":
//                   trueValue = right.value + 1; // Random boolean value
//                   falseValue = right.value;
//                   break;
//                 default:
//                   // Handle other operators for number literals
//                   trueValue = Math.floor(Math.random() * 10);
//                   falseValue = Math.floor(Math.random() * 10);
//                   break;
//               }
//             } else if (typeof right.value === "string") {
//               switch (operator) {
//                 case "===":
//                 case "==":
//                   trueValue = right.value;
//                   let val = "String" + Math.random();
//                   do {
//                     falseValue = "String" + Math.random();
//                   } while (val === trueValue);
//                   break;
//                 case "!==":
//                 case "!=":
//                   trueValue = right.value + Math.random();
//                   let val1 = "String" + Math.random();
//                   falseValue = right.value;

//                   break;
//                 default:
//                   // Handle other operators for string literals
//                   trueValue = "LiteralTrue";
//                   falseValue = "LiteralFalse";
//                   break;
//               }
//             } else if (typeof right.value === "boolean") {
//               switch (operator) {
//                 case "===":
//                 case "==":
//                   trueValue = right.value;
//                   falseValue = !right.value;
//                   break;
//                 case "!==":
//                 case "!=":
//                   trueValue = Math.random() > 0.5; // Random boolean value
//                   falseValue = !trueValue;
//                   break;
//                 default:
//                   // Handle other operators for boolean literals
//                   trueValue = "LiteralTrue";
//                   falseValue = "LiteralFalse";
//                   break;
//               }
//             }
//             break;

//           case "Identifier":
//             // Handle the case where the right value is an identifier (variable)
//             const variableName = right.name;

//             // Check if the variable has an assigned value
//             if (variableValues.hasOwnProperty(variableName)) {
//               const variableValue = variableValues[variableName];

//               // Check the type of the variable and set true and false values accordingly
//               if (typeof variableValue === "number") {
//                 trueValue = variableValue + 1;
//                 falseValue = variableValue - 1;
//               } else if (typeof variableValue === "string") {
//                 trueValue = variableValue;
//                 let val = "String" + Math.random();
//                 do {
//                   falseValue = "String" + Math.random();
//                 } while (val === trueValue);
//               } else if (typeof variableValue === "boolean") {
//                 trueValue = variableValue;
//                 falseValue = !variableValue;
//               }
//             } else {
//               const {
//                 trueValueLeft,
//                 falseValueLeft,
//                 trueValueRight,
//                 falseValueRight,
//               } = generateTrueFalseValuesForVariables(
//                 variableValues[left.name],
//                 variableValues[right.name],
//                 operator
//               );

//               // Add true and false values to the node
//               node.trueValueLeft = trueValueLeft;
//               node.falseValueLeft = falseValueLeft;
//               node.trueValueRight = trueValueRight;
//               node.falseValueRight = falseValueRight;
//               break;
//             }
//             break;

//           default:
//             // Provide default values or handle other types
//             trueValue = "DefaultTrue";
//             falseValue = "DefaultFalse";
//             break;
//         }

//         // Add trueValue and falseValue properties to the IfStatement node
//         node.trueValue = trueValue;
//         node.falseValue = falseValue;
//       }
//     }

//     // Recursively traverse child nodes
//     if (node.consequent) {
//       traverseAndModify(node.consequent, variableValues);
//     }
//     if (node.alternate) {
//       traverseAndModify(node.alternate, variableValues);
//     }
//   }
//   if (node.type === "BinaryExpression" && node.test == undefined) {
//     const { operator, right, left } = node;
//     // Check if both left and right values are identifiers (variables)
//     if (left.type === "Identifier" && right.type === "Identifier") {
//       const { trueValueLeft, falseValueLeft, trueValueRight, falseValueRight } =
//         generateTrueFalseValuesForVariables(
//           variableValues[left.name],
//           variableValues[right.name],
//           operator
//         );

//       // Add true and false values to the node
//       node.trueValueLeft = trueValueLeft;
//       node.falseValueLeft = falseValueLeft;
//       node.trueValueRight = trueValueRight;
//       node.falseValueRight = falseValueRight;
//     } else if (left.type === "Identifier" && right.type === "Literal") {
//       // Generate random values for true and false paths based on the operator and values
//       let trueValue, falseValue;

//       // Check the data type of the right value
//       const rightValueType = right.type;

//       switch (rightValueType) {
//         case "Literal":
//           // Handle different literal types
//           if (typeof right.value === "number") {
//             switch (operator) {
//               case ">":
//                 trueValue = Math.floor(right.value) + 1;
//                 falseValue = Math.floor(right.value) - 1;
//                 break;
//               case "<":
//                 trueValue = Math.floor(right.value) - 1;
//                 falseValue = Math.floor(right.value) + 1;
//                 break;
//               case ">=":
//                 trueValue = Math.floor(right.value);
//                 falseValue = Math.floor(right.value - Math.random());
//                 break;
//               case "<=":
//                 trueValue = Math.floor(right.value);
//                 falseValue = Math.floor(1 + right.value);
//                 break;
//               case "===":
//               case "==":
//                 trueValue = right.value;
//                 falseValue =
//                   Math.floor(Math.random() * (10 - right.value)) +
//                   right.value +
//                   1;
//                 break;
//               case "!==":
//               case "!=":
//                 trueValue = right.value + 1; // Random boolean value
//                 falseValue = right.value;
//                 break;
//               default:
//                 // Handle other operators for number literals
//                 trueValue = Math.floor(Math.random() * 10);
//                 falseValue = Math.floor(Math.random() * 10);
//                 break;
//             }
//           } else if (typeof right.value === "string") {
//             switch (operator) {
//               case "===":
//               case "==":
//                 trueValue = right.value;
//                 let val = "String" + Math.random();
//                 do {
//                   falseValue = "String" + Math.random();
//                 } while (val === trueValue);
//                 break;
//               case "!==":
//               case "!=":
//                 trueValue = Math.random() > 0.5; // Random boolean value
//                 falseValue = !trueValue;
//                 break;
//               default:
//                 // Handle other operators for string literals
//                 trueValue = "LiteralTrue";
//                 falseValue = "LiteralFalse";
//                 break;
//             }
//           } else if (typeof right.value === "boolean") {
//             switch (operator) {
//               case "===":
//               case "==":
//                 trueValue = right.value;
//                 falseValue = !right.value;
//                 break;
//               case "!==":
//               case "!=":
//                 trueValue = Math.random() > 0.5; // Random boolean value
//                 falseValue = !trueValue;
//                 break;
//               default:
//                 // Handle other operators for boolean literals
//                 trueValue = "LiteralTrue";
//                 falseValue = "LiteralFalse";
//                 break;
//             }
//           }
//           break;

//         case "Identifier":
//           // Handle the case where the right value is an identifier (variable)
//           const variableName = right.name;

//           // Check if the variable has an assigned value
//           if (variableValues.hasOwnProperty(variableName)) {
//             const variableValue = variableValues[variableName];

//             // Check the type of the variable and set true and false values accordingly
//             if (typeof variableValue === "number") {
//               trueValue = variableValue + 1;
//               falseValue = variableValue - 1;
//             } else if (typeof variableValue === "string") {
//               trueValue = variableValue;
//               let val = "String" + Math.random();
//               do {
//                 falseValue = "String" + Math.random();
//               } while (val === trueValue);
//             } else if (typeof variableValue === "boolean") {
//               trueValue = variableValue;
//               falseValue = !variableValue;
//             }
//           } else {
//             const {
//               trueValueLeft,
//               falseValueLeft,
//               trueValueRight,
//               falseValueRight,
//             } = generateTrueFalseValuesForVariables(
//               variableValues[left.name],
//               variableValues[right.name],
//               operator
//             );

//             // Add true and false values to the node
//             node.trueValueLeft = trueValueLeft;
//             node.falseValueLeft = falseValueLeft;
//             node.trueValueRight = trueValueRight;
//             node.falseValueRight = falseValueRight;
//             break;
//           }
//           break;

//         default:
//           // Provide default values or handle other types
//           trueValue = "DefaultTrue";
//           falseValue = "DefaultFalse";
//           break;
//       }

//       // Add trueValue and falseValue properties to the IfStatement node
//       node.trueValue = trueValue;
//       node.falseValue = falseValue;
//     }

//     // Recursively traverse child nodes
//     if (node.consequent) {
//       traverseAndModify(node.consequent, variableValues);
//     }
//     if (node.alternate) {
//       traverseAndModify(node.alternate, variableValues);
//     }
//   } else if (
//     node.type != undefined &&
//     (node.type === "WhileStatement" || node.type === "ForStatement") &&
//     node.test
//   ) {
//     const { operator, left, right } = node.test;
//     let trueValue, falseValue;

//     if (left == undefined || right == undefined) {
//       node.trueValue = 10;
//       node.falseValue = 0;
//     } else {
//       if (left.type === "Identifier" && right.type === "Identifier") {
//         const {
//           trueValueLeft,
//           falseValueLeft,
//           trueValueRight,
//           falseValueRight,
//         } = generateTrueFalseValuesForVariables(
//           variableValues[left.name],
//           variableValues[right.name],
//           operator
//         );

//         // Add true and false values to the node
//         node.trueValueLeft = trueValueLeft;
//         node.falseValueLeft = falseValueLeft;
//         node.trueValueRight = trueValueRight;
//         node.falseValueRight = falseValueRight;
//       } else if (left.type === "Identifier" && right.type === "Literal") {
//         // Check the data type of the right value
//         const rightValueType = right.type;

//         switch (rightValueType) {
//           case "Literal":
//             // Handle different literal types in the while and for loop conditions
//             if (typeof right.value === "number") {
//               switch (operator) {
//                 case ">":
//                   trueValue = right.value + 1;
//                   falseValue = right.value - 1;
//                   break;
//                 case "<":
//                   trueValue = right.value - 1;
//                   falseValue = right.value + 1;
//                   break;
//                 case ">=":
//                   trueValue = right.value;
//                   falseValue = right.value - 1;
//                   break;
//                 case "<=":
//                   trueValue = right.value;
//                   falseValue = right.value + 1;
//                   break;
//                 default:
//                   // Handle other operators for number literals in while and for loop conditions
//                   trueValue = right.value + 1;
//                   falseValue = right.value - 1;
//                   break;
//               }
//             } else if (typeof right.value === "string") {
//               switch (operator) {
//                 case "===":
//                 case "==":
//                   trueValue = right.value;
//                   let val = "String" + Math.random();
//                   do {
//                     falseValue = "String" + Math.random();
//                   } while (val === trueValue);
//                   break;
//                 case "!==":
//                 case "!=":
//                   trueValue = Math.random() > 0.5; // Random boolean value
//                   falseValue = !trueValue;
//                   break;
//                 default:
//                   // Handle other operators for string literals
//                   trueValue = "LiteralTrue";
//                   falseValue = "LiteralFalse";
//                   break;
//               }
//             } else if (typeof right.value === "boolean") {
//               switch (operator) {
//                 case "===":
//                 case "==":
//                   trueValue = right.value;
//                   falseValue = !right.value;
//                   break;
//                 case "!==":
//                 case "!=":
//                   trueValue = Math.random() > 0.5; // Random boolean value
//                   falseValue = !trueValue;
//                   break;
//                 default:
//                   // Handle other operators for boolean literals
//                   trueValue = "LiteralTrue";
//                   falseValue = "LiteralFalse";
//                   break;
//               }
//             }
//             break;

//           case "Identifier":
//             // Handle the case where the right value is an identifier (variable)
//             const variableName = right.name;

//             // Check if the variable has an assigned value
//             if (variableValues.hasOwnProperty(variableName)) {
//               const variableValue = variableValues[variableName];

//               // Check the type of the variable and set true and false values accordingly
//               if (typeof variableValue === "number") {
//                 trueValue = variableValue + 1;
//                 falseValue = variableValue - 1;
//               } else if (typeof variableValue === "string") {
//                 trueValue = variableValue;
//                 let val = "String" + Math.random();
//                 do {
//                   falseValue = "String" + Math.random();
//                 } while (val === trueValue);
//               } else if (typeof variableValue === "boolean") {
//                 trueValue = variableValue;
//                 falseValue = !variableValue;
//               }
//             } else {
//               // Provide default values or handle other cases
//               const {
//                 trueValueLeft,
//                 falseValueLeft,
//                 trueValueRight,
//                 falseValueRight,
//               } = generateTrueFalseValuesForVariables(
//                 variableValues[left.name],
//                 variableValues[right.name],
//                 operator
//               );

//               // Add true and false values to the node
//               node.trueValueLeft = trueValueLeft;
//               node.falseValueLeft = falseValueLeft;
//               node.trueValueRight = trueValueRight;
//               node.falseValueRight = falseValueRight;
//               break;
//             }
//             break;

//           default:
//             // Provide default values or handle other types
//             const {
//               trueValueLeft,
//               falseValueLeft,
//               trueValueRight,
//               falseValueRight,
//             } = generateTrueFalseValuesForVariables(
//               variableValues[left.name],
//               variableValues[right.name],
//               operator
//             );

//             // Add true and false values to the node
//             node.trueValueLeft = trueValueLeft;
//             node.falseValueLeft = falseValueLeft;
//             node.trueValueRight = trueValueRight;
//             node.falseValueRight = falseValueRight;
//             break;
//         }

//         // Modify the current loop node
//         node.trueValue = trueValue;
//         node.falseValue = falseValue;
//       }

//       // Recursively traverse the body of the loop
//       traverseAndModify(node.body, variableValues);

//       // If there is an update expression, traverse and modify it
//       if (node.update) {
//         traverseAndModify(node.update, variableValues);
//       }
//     }
//   } else if (node.type === "ForOfStatement" && node.right) {
//     // Code for handling ForOfStatement conditions
//     // (similar to the code for WhileStatement and ForStatement)
//     const { right } = node;
//     let trueValue, falseValue;

//     // Modify the current ForOfStatement node
//     node.trueValue = trueValue;
//     node.falseValue = falseValue;

//     // Recursively traverse the body of the loop
//     traverseAndModify(node.body, variableValues);
//   } else if (node.type === "ForStatement" && node.test) {
//     // Code for handling ForStatement conditions
//     // (similar to the code for WhileStatement and ForOfStatement)
//     const { test, update } = node;
//     let trueValue, falseValue;

//     // Modify the current ForStatement node
//     node.trueValue = trueValue;
//     node.falseValue = falseValue;

//     // Recursively traverse the body of the loop
//     traverseAndModify(node.body, variableValues);

//     // If there is an update expression, traverse and modify it
//     if (update) {
//       traverseAndModify(update, variableValues);
//     }
//   } else if (
//     node.type === "ExpressionStatement" &&
//     node.expression.type === "CallExpression" &&
//     node.expression.callee.type === "MemberExpression" &&
//     node.expression.callee.property.name === "forEach"
//   ) {
//     // Code for handling ForEachStatement
//     // (unchanged from the previous code)
//     const forEachCallback = node.expression.arguments[0];
//     traverseAndModify(forEachCallback.body, variableValues);
//   }

//   // Recursively traverse child nodes
//   for (const key in node) {
//     if (node[key] && typeof node[key] === "object") {
//       traverseAndModify(node[key], variableValues);
//     }
//   }
// }
// if node.left== identifier , pass node.left
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
        console.log("This is a binary expression: ", node.left.name, node.operator, node.right.name);
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
    if (node.hasOwnProperty(prop) && typeof node[prop] === 'object' && node[prop] !== null) {
      // If the property is an object, traverse it
      traverseTree(node[prop], visitor);
    } else if (Array.isArray(node[prop])) {
      // If the property is an array, traverse each item
      for (let child of node[prop]) {
        if (typeof child === 'object' && child !== null) {
          traverseTree(child, visitor);
        }
      }
    }
  }
}

function handleBinaryExpression(node, variableValues) { //in the node parameter, pass node.test

  if (!node.type) { //nodetype should be binaryExpression
      return;
  }

  //case one is variable and one is literal
  //e.g. a>5
  if ((node.left.type === "Identifier")) {
      usingOpposite(node, "Right");
  } 
  //in case of something like 5>a
  else if((node.right.type == "Identifier")) {
      usingOpposite(node, "Left");
  
  }
  console.log("node.truevalue ",node.trueValue );
  console.log("node.falsevalue ",node.falseValue);
  console.log("node.trueValueRight ",node.trueValueRight);
  console.log("node.falseValueRight ",node.falseValueRight);
  console.log("node.trueValueLeft ",node.trueValueLeft);
  console.log("node.falseValueLeft ",node.falseValueLeft);
}

function usingOpposite(node, oppositeType, variableValues={}){
  let trueValue, falseValue, switchValue;
  if(oppositeType == "Left") {
      switchValue = node.left.type;
  }else if(oppositeType == "Right"){
      console.log("node.right.type ", node.right.type);
      switchValue = node.right.type;
  }
  let oppositeNode;
  if(oppositeType == "Left") {
      oppositeNode = node.left;
  }
  else if(oppositeType == "Right"){
      console.log("Opposite node: Right")
      oppositeNode = node.right;
  }

  switch (switchValue) {
      case "Literal":
          const { trueValue,falseValue } = generateTrueFalseValue(oppositeNode, node.operator);
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

function generateTrueFalseValue(node, operator) { //pass node.right/left
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
              trueValue = Math.floor(val);
              falseValue = Math.floor(1 + val);
              break;
          case "===":
          case "==":
              trueValue = val;
              falseValue =
                  Math.floor(Math.random() * (10 - val)) + val +1;
              break;
          case "!==":
          case "!=":
              console.log("val: ", val, " node name", node.name);
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


function handleIdentifierExpression(node, variableValues={}) 
{ 
  node.trueValue = true;
  node.falseValue = false;
}


traverseTree(ast);
const utils = new Utils();
async function processAST() {
  await utils.evaluateConditionalStatements(ast);
}

processAST();