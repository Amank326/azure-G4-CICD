/**
 * Error Handler Middleware
 * 
 * Centralized error handling for all routes.
 * Ensures consistent error responses and prevents app crashes.
 */

// Error handling middleware - catches all errors
function errorHandler(err, req, res, next) {
  // Log error for debugging (developer can see it)
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  // Map specific error types to status codes
  if (err.message.includes("not found")) {
    statusCode = 404;
    message = "Resource not found";
  } else if (err.message.includes("validation")) {
    statusCode = 400;
    message = "Validation error: " + err.details;
  } else if (err.message.includes("unauthorized")) {
    statusCode = 401;
    message = "Unauthorized access";
  } else if (err.message.includes("forbidden")) {
    statusCode = 403;
    message = "Forbidden";
  }

  // Send error response (safe message to client, no sensitive info)
  res.status(statusCode).json({
    error: {
      message: message,
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
    },
  });
}

// Async error wrapper - wraps route handlers to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
};
