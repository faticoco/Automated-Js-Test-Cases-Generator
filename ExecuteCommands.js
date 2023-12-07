const { exec } = require("child_process");

// 1
function formAst() {
  return new Promise((resolve, reject) => {
    exec("node script.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating AST Tree: ${error.message}`);
        reject(error);
        return;
      }

      console.log(`AST formed successfully:\n${stdout}`);
      resolve(stdout);
    });
  });
}
// 2
function TestcaseGnerator() {
  return new Promise((resolve, reject) => {
    exec("node testcasegenerator.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating Test Cases: ${error.message}`);
        reject(error);
        return;
      }

      console.log(`Test Cases formed successfully:\n${stdout}`);
      resolve(stdout);
    });
  });
}

// 3
function ModulesExportAppender() {
  return new Promise((resolve, reject) => {
    exec("node module_exports_appender.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error appending Test Cases: ${error.message}`);
        reject(error);
        return;
      }

      console.log(`Test Cases appended successfully:\n${stdout}`);
      resolve(stdout);
    });
  });
}
// 4
function TestAppender() {
  return new Promise((resolve, reject) => {
    console.log("appending");
    exec("node TestFunctionCallsAppender.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error appending Test Cases: ${error.message}`);
        reject(error);
        return;
      }

      console.log(`Test Cases appended successfully:\n${stdout}`);
      resolve(stdout);
    });
  });
}

//5
function generateCoverageReport() {
  return new Promise((resolve, reject) => {
    exec("istanbul cover test.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating coverage report: ${error.message}`);
        reject(error);
        return;
      }

      console.log(`Coverage report generated successfully:\n${stdout}`);
      resolve(stdout);
    });
  });
}

//5
function generateCoverageReportynyc() {
  return new Promise((resolve, reject) => {
    exec("npm run coverage", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating coverage report: ${error.message}`);
        reject(error);
        return;
      }

      console.log(`Coverage report generated successfully:\n${stdout}`);
      resolve(stdout);
    });
  });
}
//6
function convertHTMLtoPDF(htmlFilePath, pdfOutputPath) {
  return new Promise((resolve, reject) => {
    exec(
      `node converToPdf.js ${htmlFilePath} ${pdfOutputPath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error converting HTML to PDF: ${error.message}`);
          reject(error);
          return;
        }

        console.log(`PDF generated successfully:\n${stdout}`);
        resolve(stdout);
      }
    );
  });
}

async function generateCoverageAndConvertToPDF() {
  try {
    await convertHTMLtoPDF(
      "/JS-Code-Analyzer-main/coverage/lcov-report/index.html",
      "coverage_report.pdf"
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

//6
function conditionalCoverageanalyzer() {
  return new Promise((resolve, reject) => {
    exec("node conditionalCoverageanalyzer.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating coverage report: ${error.message}`);
        reject(error);
        return;
      }

      console.log(`Coverage report generated successfully:\n${stdout}`);
      resolve(stdout);
    });
  });
}

function ModulesExportAppender() {
  return new Promise((resolve, reject) => {
    exec("node module_exports_appender.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error appending Test Cases: ${error.message}`);
        reject(error);
        return;
      }

      console.log(`Test Cases appended successfully:\n${stdout}`);
      resolve(stdout);
    });
  });
}
function executecommands() {
  return new Promise((resolve, reject) => {
    formAst();
    TestcaseGnerator();
    TestAppender();
  });
}
//fiest make the test code available in teh testcalls appender code and then applying rest functionality
ModulesExportAppender();
if (executecommands()) {
  generateCoverageReport();
  generateCoverageAndConvertToPDF();
  conditionalCoverageanalyzer();
}
