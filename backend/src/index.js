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
const { errorHandler } = require("./middleware/errorHandler");
const filesRouter = require("./routes/files");
const { verifyConnections } = require("./config");

// Create Express app
const app = express();

// ========================================
// MIDDLEWARE SETUP
// ========================================

// CORS Middleware - Allow requests from different origins
// In production, restrict to specific domains
app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:3000",
      "http://localhost:80",
      "https://file-manager-frontend-app.azurewebsites.net",
      "https://file-manager-frontend-app.azurewebsites.net/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

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

  // Verify Azure connections
  await verifyConnections();

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
