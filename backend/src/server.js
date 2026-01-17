#!/usr/bin/env node
/**
 * Azure App Service Entry Point - Simplified Version
 * Uses src/server.js to avoid iisnode path issues
 */
require("dotenv").config();

const express = require('express');
const cors = require('cors');

console.log("=".repeat(50));
console.log("🚀 Backend Starting - Azure App Service");
console.log("=".repeat(50));

// Validate environment
const requiredVars = ["COSMOS_ENDPOINT", "COSMOS_KEY", "AZURE_STORAGE_CONNECTION_STRING", "CONTAINER_NAME"];
const missing = requiredVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error("\n❌ MISSING ENV VARIABLES:");
  missing.forEach(v => console.error(`   ✗ ${v}`));
} else {
  console.log("\n✅ All required environment variables are set");
}

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost",
    "http://localhost:3000",
    "https://file-manager-frontend-app.azurewebsites.net",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: false,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ 
    name: 'Cloud File Manager API',
    version: '1.0.0', 
    status: 'running',
    endpoints: {
      health: '/health',
      upload: 'POST /api/files/upload',
      list: 'GET /api/files',
      diagnostics: 'GET /api/files/diagnostics'
    }
  });
});

// Diagnostics
app.get('/api/files/diagnostics', (req, res) => {
  res.json({
    status: 'diagnostics',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      PORT: process.env.PORT || 'not set',
      WEBSITES_PORT: process.env.WEBSITES_PORT || 'not set',
      COSMOS_ENDPOINT: process.env.COSMOS_ENDPOINT ? '✓' : '✗ MISSING',
      COSMOS_KEY: process.env.COSMOS_KEY ? '✓' : '✗ MISSING',
      AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING ? '✓' : '✗ MISSING',
      CONTAINER_NAME: process.env.CONTAINER_NAME ? '✓' : '✗ MISSING',
    }
  });
});

// Load actual routes
let filesRouter;
try {
  filesRouter = require('./routes/files');
  console.log("✅ Files router loaded successfully");
} catch (err) {
  console.warn("⚠️ Could not load files router:", err.message);
  // Fallback router
  filesRouter = express.Router();
  filesRouter.post('/upload', (req, res) => res.json({ error: 'Router not loaded' }));
  filesRouter.get('/', (req, res) => res.json({ files: [] }));
}

app.use('/api/files', filesRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    path: req.path
  });
});

// Start server
const PORT = process.env.PORT || process.env.WEBSITES_PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`\n✅ Server listening on port ${PORT}`);
  console.log(`\n📍 HTTP://localhost:${PORT}/health`);
  console.log(`📍 HTTP://localhost:${PORT}/api/files/diagnostics\n`);
});

server.on('error', (err) => {
  console.error("Server Error:", err);
  setTimeout(() => process.exit(1), 1000);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM: Graceful shutdown...");
  server.close(() => process.exit(0));
});
