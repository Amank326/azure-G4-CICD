/**
 * Minimal Backend - Cloud File & Notes Management System
 * Simplified to work reliably on Azure
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:80",
    "https://file-manager-frontend-app.azurewebsites.net",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Root
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Cloud File & Notes Management System API",
    version: "1.0.0",
    status: "operational",
    endpoints: {
      health: "GET /health",
      upload: "POST /api/files/upload",
      listFiles: "GET /api/files?userId=xxx",
      getFile: "GET /api/files/:id?userId=xxx",
      deleteFile: "DELETE /api/files/:id?userId=xxx",
    }
  });
});

// Mock API Endpoints (until Cosmos/Storage are ready)
app.post("/api/files/upload", (req, res) => {
  res.status(200).json({
    id: "mock-" + Date.now(),
    filename: "uploaded-file.txt",
    size: 1024,
    uploadDate: new Date(),
    message: "File uploaded successfully (API ready)"
  });
});

app.get("/api/files", (req, res) => {
  res.status(200).json({
    files: [],
    count: 0,
    message: "No files yet"
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message });
});

// Not Found
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log(`${"=".repeat(50)}\n`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down gracefully...");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  server.close(() => process.exit(0));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

module.exports = app;
