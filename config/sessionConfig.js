const session = require("express-session");

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set to true in production (https)
    maxAge: 1000 * 60 * 60 // 1 hour
  }
});

module.exports = sessionConfig;
