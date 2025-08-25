const { readTasks, writeTasks } = require("../models/taskModel");
const { v4: uuid } = require("uuid");
const HttpError = require("../middleware/httpError");
const asyncHandler = require("../middleware/asyncHandler");

const getTasks = asyncHandler(async (req, res) => {
  const tasks = readTasks().filter(t => t.username === req.session.user.username);
  return res.json(tasks);
});

const addTask = asyncHandler(async (req, res) => {
  const { title, priority } = req.body || {};
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw HttpError.badRequest('Title is required');
  }
  if (!priority || !['low','medium','high'].includes(String(priority).toLowerCase())) {
    throw HttpError.badRequest('Priority must be one of: low, medium, high');
  }

  const normalizedPriority = String(priority).toLowerCase();
  const tasks = readTasks();
  const newTask = { id: uuid(), username: req.session.user.username, title: title.trim(), priority: normalizedPriority };
  tasks.push(newTask);
  writeTasks(tasks);

  return res.status(201).json(newTask);
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, priority } = req.body || {};

  const tasks = readTasks();
  const task = tasks.find(t => t.id === id && t.username === req.session.user.username);
  if (!task) throw HttpError.notFound('Task not found');

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw HttpError.badRequest('Title must be a non-empty string');
    }
    task.title = title.trim();
  }

  if (priority !== undefined) {
    const normalizedPriority = String(priority).toLowerCase();
    if (!['low','medium','high'].includes(normalizedPriority)) {
      throw HttpError.badRequest('Priority must be one of: low, medium, high');
    }
    task.priority = normalizedPriority;
  }

  writeTasks(tasks);
  return res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();

  const newTasks = tasks.filter(t => !(t.id === id && t.username === req.session.user.username));
  if (newTasks.length === tasks.length) {
    throw HttpError.notFound('Task not found');
  }

  writeTasks(newTasks);
  return res.json({ message: "Task deleted" });
});

module.exports = { getTasks, addTask, updateTask, deleteTask };
