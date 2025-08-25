const fs = require("fs");
const path = require("path");

const tasksFile = path.join(__dirname, "../tasks.json");

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readTasks() {
  try {
    if (!fs.existsSync(tasksFile)) return [];
    const content = fs.readFileSync(tasksFile, { encoding: 'utf8' });
    if (!content) return [];
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

function writeTasks(tasks) {
  ensureDirectoryExists(tasksFile);
  const safeArray = Array.isArray(tasks) ? tasks : [];
  fs.writeFileSync(tasksFile, JSON.stringify(safeArray, null, 2));
}

module.exports = { readTasks, writeTasks };
