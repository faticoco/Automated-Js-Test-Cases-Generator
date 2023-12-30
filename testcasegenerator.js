const fs = require("fs");

function extractConditionName(expression) {
  if (expression.type === "BinaryExpression") {
    const leftName = extractConditionName(expression.left);
    const rightName = extractConditionName(expression.right);
    console.log(leftName, rightName);
    return `${leftName} ${expression.operator} ${rightName}`;
  } else if (expression.type === "Identifier") {
    return expression.name;
  } else if (expression.type === "Literal") {
    return expression.raw;
  } else if (expression.type === "UnaryExpression") {
    return `${expression.operator}${extractConditionName(expression.argument)}`;
  } else if (expression.type === "MemberExpression") {
    const leftName = extractConditionName(expression.left);
    const rightName = extractConditionName(expression.right);
    return `${leftName} ${expression.operator} ${rightName}`;
  } else {
    return "UnknownCondition";
  }
}

function generateTestCases(
  node,
  functionName,
  result,
  currentTrueValue,
  currentFalseValue
) {
  if (
    //node.type === "IfStatement" &&
    node.test &&
    node.test.type === "LogicalExpression"
  ) {
    handleLogicalExpression(
      node.test,
      functionName,
      result,
      currentTrueValue,
      currentFalseValue
    );
    if (node.consequent) {
      console.log(node.consequent);
      console.log(`Processing consequent of IfStatement`);
      generateTestCases(
        node.consequent,
        functionName,
        result,
        node.trueValueLeft,
        node.falseValueLeft
      );
    }

    if (node.alternate) {
      console.log(`Processing alternate of IfStatement`);
      generateTestCases(
        node.alternate,
        functionName,
        result,
        node.trueValueRight,
        node.falseValueRight
      );
    }
  } else if (
    // node.type === "IfStatement" &&
    node.test &&
    node.test.type === "BinaryExpression"
  ) {
    const nodeBinary = node.test;
    const conditionName = extractConditionName(node.test);
    console.log("BinaryExpression", nodeBinary);
    if (nodeBinary.left.type === nodeBinary.right.type) {
      // Both sides are of the same type (either both identifiers or both literals)
      result.push({
        name: functionName,
        conditionName: conditionName,
        trueValueLeft:
          nodeBinary.trueValueLeft !== undefined
            ? nodeBinary.trueValueLeft
            : currentTrueValue,
        trueValueRight:
          nodeBinary.trueValueRight !== undefined
            ? nodeBinary.trueValueRight
            : currentTrueValue,
        falseValueLeft:
          nodeBinary.falseValueLeft !== undefined
            ? nodeBinary.falseValueLeft
            : currentFalseValue,
        falseValueRight:
          nodeBinary.falseValueRight !== undefined
            ? nodeBinary.falseValueRight
            : currentFalseValue,
      });
    }
    if (
      nodeBinary.left.type === "Identifier" &&
      nodeBinary.right.type === "Literal"
    ) {
      // One side is an identifier and the other is a literal


      result.push({
        name: functionName,
        conditionName: conditionName,
        trueValue:
          nodeBinary.trueValue !== undefined
            ? nodeBinary.trueValue
            : currentTrueValue,
        falseValue:
          nodeBinary.falseValue !== undefined
            ? nodeBinary.falseValue
            : currentFalseValue,
      });
    }

    console.log(
      `Generated test case: ${JSON.stringify(result[result.length - 1])}`
    );
    if (node.consequent) {
      console.log(node.consequent);
      console.log(`Processing consequent of IfStatement`);
      generateTestCases(
        node.consequent,
        functionName,
        result,
        node.trueValueLeft,
        node.falseValueLeft
      );
    }

    if (node.alternate) {
      console.log(`Processing alternate of IfStatement`);
      generateTestCases(
        node.alternate,
        functionName,
        result,
        node.trueValueRight,
        node.falseValueRight
      );
    }
  } else if (
    //  node.type === "IfStatement" &&
    node.test &&
    node.test.left &&
    node.test.left.type === "Identifier" &&
    node.test.right &&
    node.test.right.type === "Identifier"
  ) {
    const conditionName = extractConditionName(node.test);

    if (conditionName === "UnknownCondition") {
      console.log(`Skipping test case for UnknownCondition`);
      return;
    }

    result.push({
      name: functionName,
      conditionName: conditionName,
      trueValueLeft:
        node.trueValueLeft !== undefined
          ? node.trueValueLeft
          : currentTrueValue,
      trueValueRight:
        node.trueValueRight !== undefined
          ? node.trueValueRight
          : currentTrueValue,
      falseValueLeft:
        node.falseValueLeft !== undefined
          ? node.falseValueLeft
          : currentFalseValue,
      falseValueRight:
        node.falseValueRight !== undefined
          ? node.falseValueRight
          : currentFalseValue,
    });

    console.log(
      `Generated test case: ${JSON.stringify(result[result.length - 1])}`
    );

    if (node.consequent) {
      console.log(`Processing consequent of IfStatement`);
      generateTestCases(
        node.consequent,
        functionName,
        result,
        node.trueValueLeft !== undefined
          ? node.trueValueLeft
          : currentTrueValue,
        node.falseValueLeft !== undefined
          ? node.falseValueLeft
          : currentFalseValue
      );
    }

    if (node.alternate) {
      console.log(`Processing alternate of IfStatement`);
      generateTestCases(
        node.alternate,
        functionName,
        result,
        node.trueValueRight !== undefined
          ? node.trueValueRight
          : currentTrueValue,
        node.falseValueRight !== undefined
          ? node.falseValueRight
          : currentFalseValue
      );
    }
  } else if (
    (node.type === "WhileStatement" ||
      node.type === "ForOfStatement" ||
      node.type === "ForStatement") &&
    node.test !== undefined
  ) {
    const conditionName = extractConditionName(node.test);

    if (conditionName === "UnknownCondition") {
      console.log(`Skipping test case for UnknownCondition`);
      return; // Skip generating the test case
    }

    if (node.trueValueLeft && node.falseValueLeft) {
      result.push({
        name: functionName,
        conditionName: conditionName,

        trueValueLeft:
          node.test.trueValueLeft !== undefined
            ? node.test.trueValueLeft
            : currentTrueValue,
        trueValueRight:
          node.test.trueValueRight !== undefined
            ? node.test.trueValueRight
            : currentTrueValue,
        falseValueLeft:
          node.test.falseValueLeft !== undefined
            ? node.test.falseValueLeft
            : currentFalseValue,
        falseValueRight:
          node.test.falseValueRight !== undefined
            ? node.test.falseValueRight
            : currentFalseValue,
      });
    } else {
      result.push({
        name: functionName,
        conditionName: conditionName,
        falseValue:
          node.test.falseValue !== undefined
            ? node.test.falseValue
            : currentFalseValue,
        trueValue:
          node.test.trueValue !== undefined
            ? node.test.trueValue
            : currentTrueValue,
      });
    }

    console.log(
      `Generated test case: ${JSON.stringify(result[result.length - 1])}`
    );

    if (node.consequent) {
      console.log(`Processing consequent of IfStatement`);
      generateTestCases(
        node.consequent,
        functionName,
        result,
        node.trueValueLeft !== undefined
          ? node.trueValueLeft
          : currentTrueValue,
        node.falseValueLeft !== undefined
          ? node.falseValueLeft
          : currentFalseValue
      );
    }

    if (node.alternate) {
      console.log(`Processing alternate of IfStatement`);
      generateTestCases(
        node.alternate,
        functionName,
        result,
        node.trueValueRight !== undefined
          ? node.trueValueRight
          : currentTrueValue,
        node.falseValueRight !== undefined
          ? node.falseValueRight
          : currentFalseValue
      );
    }
  } else {
    if (node.type === "IfStatement" && node.test) {
      const conditionName = extractConditionName(node.test);

      if (conditionName === "UnknownCondition") {
        console.log(`Skipping test case for UnknownCondition`);
        return; // Skip generating the test case
      }

      result.push({
        name: functionName,
        conditionName: conditionName,
        trueValue:
          node.test.trueValue !== undefined
            ? node.test.trueValue
            : currentTrueValue,
        falseValue:
          node.test.falseValue !== undefined
            ? node.test.falseValue
            : currentFalseValue,
      });

      console.log(
        `Generated test case: ${JSON.stringify(result[result.length - 1])}`
      );

      // consequent and alternate
      if (node.consequent) {
        console.log(`Processing consequent of IfStatement`);
        generateTestCases(
          node.consequent,
          functionName,
          result,
          node.trueValue !== undefined ? node.trueValue : currentTrueValue,
          node.falseValue !== undefined ? node.falseValue : currentFalseValue
        );
      }

      if (node.alternate) {
        console.log(`Processing alternate of IfStatement`);
        generateTestCases(
          node.alternate,
          functionName,
          result,
          node.trueValue !== undefined ? node.trueValue : currentTrueValue,
          node.falseValue !== undefined ? node.falseValue : currentFalseValue
        );
      }
    } else if (
      (node.type === "WhileStatement" ||
        node.type === "ForOfStatement" ||
        node.type === "ForStatement") &&
      node.test !== undefined
    ) {
      const conditionName = extractConditionName(node.test);

      if (conditionName === "UnknownCondition") {
        console.log(`Skipping test case for UnknownCondition`);
        return; // Skip generating the test case
      }

      result.push({
        name: functionName,
        conditionName: conditionName,
        trueValue:
          node.trueValue !== undefined ? node.trueValue : currentTrueValue,
        falseValue:
          node.falseValue !== undefined ? node.falseValue : currentFalseValue,
      });

      console.log(
        `Generated test case: ${JSON.stringify(result[result.length - 1])}`
      );

      if (node.body) {
        console.log(
          `Processing body of ${node.type}`,
          currentTrueValue,
          node.trueValue
        );
        generateTestCases(
          node.body,
          functionName,
          result,
          node.trueValue !== undefined ? node.trueValue : currentTrueValue,
          node.falseValue !== undefined ? node.falseValue : currentFalseValue
        );
      }
    } else if (
      node.type === "ExpressionStatement" &&
      node.expression !== undefined
    ) {
      const conditionName = extractConditionName(node.expression);

      if (conditionName === "UnknownCondition") {
        console.log(`Skipping test case for UnknownCondition`);
        return;
      }

      result.push({
        name: functionName,
        conditionName: conditionName,
        trueValue:
          node.trueValue !== undefined ? node.trueValue : currentTrueValue,
        falseValue:
          node.falseValue !== undefined ? node.falseValue : currentFalseValue,
      });

      console.log(
        `Generated test case: ${JSON.stringify(result[result.length - 1])}`
      );
    } else if (functionBodyGetter(node)) {
      console.log("\n\n*************************\n\n");
      console.log(`\n\n\n\n\nI FOUND A FUNCTION!!!!`);

      const body = functionBodyGetter(node);
      if (body) {
        console.log(`Node body type: ${body.type}`);
        console.log(`Node body is an array with ${body.length} elements`);

        body.forEach((statement) => {
          generateTestCases(
            statement,
            functionName,
            result,
            currentTrueValue,
            currentFalseValue
          );
        });
      } else {
        console.log(`Node body is undefined`);
      }

      console.log("\n\n*************************\n\n");
    } else if (node.type === "BlockStatement") {
      console.log(`Processing node of type: ${node.type}`);

      if (node.body) {
        console.log(`Node body type: ${node.body.type}`);
        console.log(`Node body is an array with ${node.body.length} elements`);

        node.body.forEach((statement) => {
          generateTestCases(
            statement,
            functionName,
            result,
            currentTrueValue,
            currentFalseValue
          );
        });
      } else {
        console.log(`Node body is undefined`);
      }

      console.log(`Processing body of FunctionDeclaration`);
    } else {
      console.log(`Skipping node of type: ${node.type}`);
    }
  }
}

function handleLogicalExpression(
  node,
  functionName,
  result,
  currentTrueValue,
  currentFalseValue
) {
  console.log("----------------------Processing LogicalExpression   ", node);
  const conditionName = extractConditionName(node);
  if (node.type === "LogicalExpression") {
    handleLogicalExpression(
      node.left,
      functionName,
      result,
      node.left.trueValue,
      node.left.falseValue
    );
    handleLogicalExpression(
      node.right,
      functionName,
      result,
      node.right.trueValue,
      node.right.falseValue
    );
  } else if (node.type === "BinaryExpression") {
    if (node.left.type === node.right.type) {
      // Both sides are of the same type (either both identifiers or both literals)
      result.push({
        name: functionName,
        conditionName: conditionName,
        trueValueLeft:
          node.trueValueLeft !== undefined
            ? node.trueValueLeft
            : currentTrueValue,
        trueValueRight:
          node.trueValueRight !== undefined
            ? node.trueValueRight
            : currentTrueValue,
        falseValueLeft:
          node.falseValueLeft !== undefined
            ? node.falseValueLeft
            : currentFalseValue,
        falseValueRight:
          node.falseValueRight !== undefined
            ? node.falseValueRight
            : currentFalseValue,
      });
    }
    if (node.left.type === "Identifier" && node.right.type === "Literal") {
      // One side is an identifier and the other is a literal

      result.push({
        name: functionName,
        conditionName: conditionName,
        trueValue:
          node.trueValue !== undefined ? node.trueValue : currentTrueValue,
        falseValue:
          node.falseValue !== undefined ? node.falseValue : currentFalseValue,
      });
    }

    console.log(
      `Generated test case: ${JSON.stringify(result[result.length - 1])}`
    );
  } else if (node.type == "Identifier") {
    console.log("Identifier");
    result.push({
      name: functionName,
      conditionName: conditionName,
      trueValue:
        node.trueValue !== undefined ? node.trueValue : currentTrueValue,
      falseValue:
        node.falseValue !== undefined ? node.falseValue : currentFalseValue,
    });
  }
}

const outputTree = JSON.parse(fs.readFileSync("outputTree.json", "utf-8"));

// Array to store test cases
const testCases = [];

outputTree.body.forEach((node) => {
  if (functionBodyGetter(node)) {
    console.log(`Processing function: `);
    generateTestCases(node, functionNameExtractor(node), testCases);
  }
});

outputTree.body.forEach((node) => {
  if (node.type !== "FunctionDeclaration") {
    console.log(`Processing statements outside function: ${node.start}`);
    generateTestCases(node, "", testCases, node.trueValue, node.falseValue);
  }
});

// Write the test cases to testcases.json
fs.writeFileSync("testcases.json", JSON.stringify(testCases, null, 2));

console.log(testCases);

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
