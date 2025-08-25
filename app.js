const express = require("express");
const cors = require("cors");
const sessionConfig = require("./config/sessionConfig");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(sessionConfig);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
