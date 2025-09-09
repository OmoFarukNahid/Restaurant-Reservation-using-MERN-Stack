import ErrorHandler from '../error/error.js';

export const isLoggedIn = (req, res, next) => {
  if (!req.session.isLoggedIn) {  // Changed from isAuthenticated to isLoggedIn
    return next(new ErrorHandler('Login required for this action', 401));
  }
  next();
};