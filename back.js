require("dotenv").config();
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load environment variables
const REPO_PATH = process.env.REPO_PATH;
const BACKDATE = process.env.BACKDATE; // Starting backdate
const BRANCH = process.env.BRANCH || "main";

if (!REPO_PATH || !BACKDATE) {
  console.error("❌ Error: REPO_PATH or BACKDATE is not set in .env");
  process.exit(1);
}

// File to modify
const FILE_NAME = "dummy.txt";
const FILE_PATH = path.join(REPO_PATH, FILE_NAME);

try {
  // Change to repository directory
  process.chdir(REPO_PATH);

  for (let i = 0; i < 100; i++) {
    // Calculate a new date for each commit (e.g., increment by 1 minute)
    let commitDate = new Date(BACKDATE);
    commitDate.setMinutes(commitDate.getMinutes() + i);
    let commitDateString = commitDate.toISOString();

    // Modify the file
    fs.appendFileSync(FILE_PATH, `Commit ${i + 1} at ${commitDateString}\n`);

    // Add and commit with a backdated timestamp
    execSync(`git add ${FILE_NAME}`);
    execSync(
      `GIT_COMMITTER_DATE="${commitDateString}" git commit --date "${commitDateString}" -m "Backdated commit #${
        i + 1
      }"`
    );

    console.log(`✅ Commit ${i + 1} created at ${commitDateString}`);
  }

  // Push all commits at once
  execSync(`git push origin ${BRANCH}`);
  console.log("🚀 100 Backdated commits pushed successfully!");
} catch (error) {
  console.error("❌ Error:", error.message);
}
