const express = require("express");
const fs = require("fs").promises; // Use fs.promises for async file operations
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const app = express();
const port = 3000;
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/writeToFile", async (req, res) => {
  const code = req.body.code;
  const filePath = path.join(__dirname, "test.js");

  try {
    // Use fs.promises.writeFile for async file write
    await fs.writeFile(filePath, code);
    console.log("Code successfully written to test.js");

    // Execute commands asynchronously
    await exec("node ExecuteCommands.js");
    console.log("Commands successfully executed");

    // Send a success message (if needed)
    res.json({
      message: "Code successfully written to test.js and commands executed",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
