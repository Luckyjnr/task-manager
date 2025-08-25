const HttpError = require('./httpError');

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user.username) {
    return next(HttpError.unauthorized());
  }
  next();
}

module.exports = requireAuth;
