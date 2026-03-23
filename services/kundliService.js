const { execFile } = require("child_process");
const path = require("path");

// 🔥 Use your venv Python (CONFIRMED WORKING)
const PYTHON_PATH = "/home/utkarsh/projects/pandit-ji-ai/astro-engine/venv/bin/python";

const generateKundli = (dob, time, lat, lon) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../astro-engine/astro.py");

    execFile(
      PYTHON_PATH,
      [
        scriptPath,
        dob,
        time,
        lat.toString(),
        lon.toString()
      ],
      (error, stdout, stderr) => {

        // ❌ Python execution error
        if (error) {
          console.error("❌ Python Execution Error:", error.message);
          return reject(error);
        }

        // ⚠️ Python warnings (not fatal)
        if (stderr) {
          console.warn("⚠️ Python STDERR:", stderr);
        }

        try {
          // ✅ Parse JSON output
          const result = JSON.parse(stdout.trim());
          resolve(result);

        } catch (err) {
          console.error("❌ JSON Parse Error. Raw output:", stdout);
          reject(new Error("Invalid response from Python script"));
        }
      }
    );
  });
};

module.exports = { generateKundli };