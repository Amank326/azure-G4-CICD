/**
 * Express Server - Main Entry Point
 * 
 * Cloud File & Notes Management System Backend
 * Port: 5000
 * 
 * This file initializes the Express server with all middleware,
 * routes, and error handling.
 */

require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");

// Safely load modules with error handling
let errorHandler, filesRouter, verifyConnections;

try {
  ({ errorHandler } = require("./middleware/errorHandler"));
  console.log("✅ Error handler loaded");
} catch (err) {
  console.warn("⚠️ Error handler loading:", err.message);
  errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  };
}

try {
  filesRouter = require("./routes/files");
  console.log("✅ Files router loaded");
} catch (err) {
  console.warn("⚠️ Files router loading:", err.message);
  filesRouter = require("express").Router();
}

try {
  ({ verifyConnections } = require("./config"));
  console.log("✅ Config loaded");
} catch (err) {
  console.warn("⚠️ Config loading:", err.message);
  verifyConnections = async () => {
    console.warn("⚠️ Cosmos/Storage not available, running in lite mode");
    return false;
  };
}

// Create Express app
const app = express();

// ========================================
// MIDDLEWARE SETUP
// ========================================

// CORS Middleware - Allow requests from different origins
// In production, restrict to specific domains only
const corsOptions = {
  // Origin validation function - only allow requests from authorized origins
  origin: function (origin, callback) {
    // Define all allowed origins (both development and production)
    const allowedOrigins = [
      // Local development
      "http://localhost",
      "http://localhost:3000",
      "http://localhost:80",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:80",
      // Production - Azure Frontend App Service
      "https://file-manager-frontend-app.azurewebsites.net",
      // Add your custom domain here when you have one
      // "https://yourdomain.com",
    ];

    // Allow requests with no origin header (e.g., mobile apps, curl, Postman)
    // In production, you may want to remove this for stricter security
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin (mobile/curl)');
      callback(null, true);
      return;
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Allowing request from authorized origin: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`❌ CORS: Rejecting request from unauthorized origin: ${origin}`);
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  // HTTP methods allowed by CORS
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  // Allow credentials in CORS requests
  // Set to true ONLY if using cookies/sessions (we're not, so false is fine)
  credentials: false,
  // Headers the client can send
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  // Headers the client can read from response
  exposedHeaders: ["Content-Type", "Content-Length", "X-Total-Count"],
  // How long browser caches preflight response (in seconds)
  maxAge: 3600, // 1 hour
  // Treat HTTP 200 as successful preflight response
  optionsSuccessStatus: 200,
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Explicit OPTIONS handlers for preflight requests
// These ensure that browsers get proper CORS headers before sending actual requests
app.options("*", cors(corsOptions)); // For all routes
app.options("/api/files/upload", cors(corsOptions)); // Specific route with extra specificity

// Body Parser Middleware - Parse JSON requests
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Logging Middleware - Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ========================================
// ROUTES
// ========================================

// Health check endpoint (basic check without database)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "File Management API",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint - API info
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Cloud File & Notes Management System",
    version: "1.0.0",
    description: "Backend API for file management with Azure integration",
    endpoints: {
      health: "GET /health",
      upload: "POST /api/files/upload",
      listFiles: "GET /api/files?userId=xxx",
      getFile: "GET /api/files/:id?userId=xxx",
      deleteFile: "DELETE /api/files/:id?userId=xxx",
    },
    documentation: "See README.md for full API documentation",
  });
});

// Mount file management routes
// All routes will be prefixed with /api/files
app.use("/api/files", filesRouter);

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Endpoint not found",
      path: req.path,
      method: req.method,
      availableEndpoints: {
        health: "GET /health",
        root: "GET /",
        upload: "POST /api/files/upload",
        listFiles: "GET /api/files?userId=xxx",
        getFile: "GET /api/files/:id?userId=xxx",
        deleteFile: "DELETE /api/files/:id?userId=xxx",
      },
    },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// ========================================
// SERVER STARTUP
// ========================================

const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, async () => {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Azure App Service: Will use configured URL`);
  console.log(`${"=".repeat(50)}\n`);

  // Verify Azure connections (non-blocking)
  try {
    await verifyConnections();
  } catch (error) {
    console.warn("⚠️ Connection verification had issues:", error.message);
    // Continue running even if connection fails initially
  }

  console.log(`\n📚 API Documentation:`);
  console.log(`  Health Check: GET http://localhost:${PORT}/health`);
  console.log(`  API Info: GET http://localhost:${PORT}/`);
  console.log(`  Upload File: POST http://localhost:${PORT}/api/files/upload`);
  console.log(`  List Files: GET http://localhost:${PORT}/api/files?userId=xxx`);
  console.log(`  Get File: GET http://localhost:${PORT}/api/files/:id?userId=xxx`);
  console.log(`  Delete File: DELETE http://localhost:${PORT}/api/files/:id?userId=xxx\n`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

module.exports = app;
