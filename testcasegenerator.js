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
    node.type === "IfStatement" &&
    node.test &&
    node.test.type === "LogicalExpression"
  ) {
    console.log("Processing LogicalExpression");

    const leftCondition = node.test.left;
    const rightCondition = node.test.right;

    const leftConditionName = extractConditionName(leftCondition);
    const rightConditionName = extractConditionName(rightCondition);

    const conditionName = `${leftConditionName} ${node.test.operator} ${rightConditionName}`;

    if (conditionName === "UnknownCondition") {
      console.log(`Skipping test case for UnknownCondition`);
      return;
    }

    if (leftCondition.left.type === leftCondition.right.type) {
      // Both sides are of the same type (either both identifiers or both literals)
      result.push({
        name: functionName,
        conditionName: leftConditionName,
        trueValueLeft:
          leftCondition.trueValueLeft !== undefined
            ? leftCondition.trueValueLeft
            : currentTrueValue,
        trueValueRight:
          leftCondition.trueValueRight !== undefined
            ? leftCondition.trueValueRight
            : currentTrueValue,
        falseValueLeft:
          leftCondition.falseValueLeft !== undefined
            ? leftCondition.falseValueLeft
            : currentFalseValue,
        falseValueRight:
          leftCondition.falseValueRight !== undefined
            ? leftCondition.falseValueRight
            : currentFalseValue,
      });
    }
    if (rightCondition.left.type === rightCondition.right.type) {
      // Both sides are of the same type (either both identifiers or both literals)
      result.push({
        name: functionName,
        conditionName: rightConditionName,
        trueValueLeft:
          rightCondition.trueValueLeft !== undefined
            ? rightCondition.trueValueLeft
            : currentTrueValue,
        trueValueRight:
          rightCondition.trueValueRight !== undefined
            ? rightCondition.trueValueRight
            : currentTrueValue,
        falseValueLeft:
          rightCondition.falseValueLeft !== undefined
            ? rightCondition.falseValueLeft
            : currentFalseValue,
        falseValueRight:
          rightCondition.falseValueRight !== undefined
            ? rightCondition.falseValueRight
            : currentFalseValue,
      });
    }
    if (
      leftCondition.left.type === "Identifier" &&
      leftCondition.right.type === "Literal"
    ) {
      // One side is an identifier and the other is a literal
      result.push({
        name: functionName,
        conditionName: leftConditionName,
        trueValue:
          leftCondition.trueValue !== undefined
            ? leftCondition.trueValue
            : currentTrueValue,
        falseValue:
          leftCondition.falseValue !== undefined
            ? leftCondition.falseValue
            : currentFalseValue,
      });
    }
    if (
      rightCondition.left.type === "Identifier" &&
      rightCondition.right.type === "Literal"
    ) {
      // One side is an identifier and the other is a literal
      result.push({
        name: functionName,
        conditionName: rightConditionName,
        trueValue:
          rightCondition.trueValue !== undefined
            ? rightCondition.trueValue
            : currentTrueValue,
        falseValue:
          rightCondition.falseValue !== undefined
            ? rightCondition.falseValue
            : currentFalseValue,
      });
    }

    console.log(
      `Generated test case: ${JSON.stringify(result[result.length - 1])}`
    );

    //consequent and alternate
    if (node.consequent) {
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
    node.type === "IfStatement" &&
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
    } else {
      result.push({
        name: functionName,
        conditionName: conditionName,
        falseValue:
          node.falseValue !== undefined ? node.falseValue : currentFalseValue,
        trueValue:
          node.trueValue !== undefined ? node.trueValue : currentTrueValue,
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
  } else if (
    (node.type === "WhileStatement" ||
      node.type === "ForOfStatement" ||
      node.type === "ForStatement") &&
    node.test !== undefined
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
          node.trueValue !== undefined ? node.trueValue : currentTrueValue,
        falseValue:
          node.falseValue !== undefined ? node.falseValue : currentFalseValue,
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
        console.log(`Processing body of ${node.type}`);
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
    } else if (
      node.type === "FunctionDeclaration" &&
      node.body.type === "BlockStatement"
    ) {
      console.log(`Processing node of type: ${node.type}`);

      if (node.body.body) {
        console.log(`Node body type: ${node.body.type}`);
        console.log(
          `Node body is an array with ${node.body.body.length} elements`
        );

        node.body.body.forEach((statement) => {
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

const outputTree = JSON.parse(fs.readFileSync("outputTree.json", "utf-8"));

// Array to store test cases
const testCases = [];

outputTree.body.forEach((node) => {
  if (node.type === "FunctionDeclaration") {
    console.log(`Processing function: ${node.id.name}`);
    generateTestCases(node, node.id.name, testCases);
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
