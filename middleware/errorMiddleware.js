function notFound(req, res, next) {
  res.status(404).json({ message: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.expose ? err.message : (statusCode === 500 ? "Internal Server Error" : err.message);
  const details = err.details || undefined;

  if (process.env.NODE_ENV !== "test" && statusCode >= 500) {
    // Log server errors
    // Prefer console.error to avoid adding a logger dependency
    // Do not leak stack to client in production
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({ message, ...(details ? { details } : {}) });
}

module.exports = { notFound, errorHandler };


