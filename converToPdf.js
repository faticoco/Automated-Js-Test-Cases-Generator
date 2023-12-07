const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "C:/Users/fatim/Downloads/JS-Code-Analyzer-main/JS-Code-Analyzer-main/coverage/lcov-report/index.html",
    {
      waitUntil: "networkidle2",
    }
  );
  await page.pdf({ path: "coverage_report.pdf", format: "A4" });

  await browser.close();
})();
