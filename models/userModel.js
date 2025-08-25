const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "../users.json");

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readUsers() {
  try {
    if (!fs.existsSync(usersFile)) return [];
    const content = fs.readFileSync(usersFile, { encoding: 'utf8' });
    if (!content) return [];
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    // Corrupt JSON or read error -> return empty array safely
    return [];
  }
}

function writeUsers(users) {
  ensureDirectoryExists(usersFile);
  const safeArray = Array.isArray(users) ? users : [];
  fs.writeFileSync(usersFile, JSON.stringify(safeArray, null, 2));
}

module.exports = { readUsers, writeUsers };
