const { readUsers, writeUsers } = require("../models/userModel");
const bcrypt = require("bcrypt");
const HttpError = require("../middleware/httpError");
const asyncHandler = require("../middleware/asyncHandler");

const signup = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body || {};
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    throw HttpError.badRequest('Username must be at least 3 characters');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw HttpError.badRequest('Password must be at least 6 characters');
  }

  const users = readUsers();
  if (users.find(u => u.username === username)) {
    throw HttpError.conflict('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  writeUsers(users);

  return res.status(201).json({ message: "Signup successful" });
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    throw HttpError.badRequest('Username and password are required');
  }

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) throw HttpError.unauthorized('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw HttpError.unauthorized('Invalid credentials');

  req.session.user = { username };
  return res.json({ message: "Login successful" });
});

function logout(req, res, next) {
  req.session.destroy(err => {
    if (err) return next(HttpError.internal('Logout failed'));
    return res.json({ message: "Logout successful" });
  });
}

module.exports = { signup, login, logout };
