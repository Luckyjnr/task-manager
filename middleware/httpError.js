class HttpError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.expose = statusCode < 500; // expose message for 4xx
    if (options.details) this.details = options.details;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', options) {
    return new HttpError(400, message, options);
  }

  static unauthorized(message = 'Unauthorized', options) {
    return new HttpError(401, message, options);
  }

  static forbidden(message = 'Forbidden', options) {
    return new HttpError(403, message, options);
  }

  static notFound(message = 'Not Found', options) {
    return new HttpError(404, message, options);
  }

  static conflict(message = 'Conflict', options) {
    return new HttpError(409, message, options);
  }

  static unprocessable(message = 'Unprocessable Entity', options) {
    return new HttpError(422, message, options);
  }

  static internal(message = 'Internal Server Error', options) {
    return new HttpError(500, message, options);
  }
}

module.exports = HttpError;


