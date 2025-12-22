/**
 * Error Handler Middleware
 * 
 * Centralized error handling for all routes.
 * Ensures consistent error responses and prevents app crashes.
 */

// Error handling middleware - catches all errors
function errorHandler(err, req, res, next) {
  // Log error for debugging (developer can see it)
  console.error("❌ [ERROR HANDLER]", {
    message: err.message,
    code: err.code,
    statusCode: err.statusCode || err.status,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  if (err.stack) {
    console.error("📋 Stack:", err.stack.split('\n').slice(0, 3).join('\n'));
  }

  // Determine status code
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";
  let details = {};

  // Map specific error types to status codes
  if (err.message.includes("not found")) {
    statusCode = 404;
    message = "Resource not found";
  } else if (err.message.includes("validation")) {
    statusCode = 400;
    message = "Validation error";
    details = { originalMessage: err.message };
  } else if (err.message.includes("unauthorized")) {
    statusCode = 401;
    message = "Unauthorized access";
  } else if (err.message.includes("forbidden")) {
    statusCode = 403;
    message = "Forbidden";
  } else if (err.code === "ECONNREFUSED" || err.message.includes("connection")) {
    statusCode = 503;
    message = "Service temporarily unavailable";
    details = { service: "Database or Storage connection failed" };
  } else if (statusCode === 500) {
    // For server errors, log more detail but send generic message to client
    console.error("🔥 [CRITICAL ERROR]", err);
    message = "Internal server error - please try again later";
    details = { timestamp: new Date().toISOString() };
  }

  // Send error response (safe message to client, no sensitive info)
  const errorResponse = {
    success: false,
    error: {
      message: message,
      code: statusCode,
      timestamp: new Date().toISOString(),
    },
  };

  if (Object.keys(details).length > 0) {
    errorResponse.error.details = details;
  }

  // Set appropriate status code and send response
  res.status(statusCode).json(errorResponse);
}

// Async error wrapper - wraps route handlers to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
};
