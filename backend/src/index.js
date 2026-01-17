/**
 * ULTRA-SIMPLE HTTP SERVER - Works on Azure
 * No heavy Express, Cosmos, or Storage dependencies
 */
require("dotenv").config();

const http = require("http");
const url = require("url");

console.log("=" .repeat(60));
console.log("🚀 BACKEND STARTING (ULTRA-SIMPLE MODE)");
console.log("=" .repeat(60));

// Check environment
console.log("\n✅ Environment Check:");
console.log("   - COSMOS_ENDPOINT:", process.env.COSMOS_ENDPOINT ? "✓ SET" : "✗ MISSING");
console.log("   - COSMOS_KEY:", process.env.COSMOS_KEY ? "✓ SET" : "✗ MISSING");
console.log("   - AZURE_STORAGE_CONNECTION_STRING:", process.env.AZURE_STORAGE_CONNECTION_STRING ? "✓ SET" : "✗ MISSING");
console.log("   - CONTAINER_NAME:", process.env.CONTAINER_NAME ? "✓ SET" : "✗ MISSING");

const PORT = process.env.PORT || process.env.WEBSITES_PORT || 8080;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // CORS Headers - Allow ALL
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Routes
  if (pathname === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      message: "✅ Server is running"
    }));
  } 
  else if (pathname === "/api/files/diagnostics") {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: "ok",
      environment: {
        COSMOS_ENDPOINT: process.env.COSMOS_ENDPOINT ? "✓" : "✗",
        COSMOS_KEY: process.env.COSMOS_KEY ? "✓" : "✗",
        AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING ? "✓" : "✗",
        CONTAINER_NAME: process.env.CONTAINER_NAME ? "✓" : "✗",
        PORT: PORT,
        NODE_ENV: process.env.NODE_ENV || "development"
      }
    }));
  } 
  else if ((pathname === "/api/files/upload" || pathname === "/api/files") && req.method === "POST") {
    // Handle file uploads (multipart/form-data)
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        fileId: "file-" + Date.now(),
        message: "✅ File received successfully",
        details: {
          timestamp: new Date().toISOString(),
          size: body.length,
          contentType: req.headers['content-type']
        }
      }));
    });
    req.on('error', (err) => {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        error: err.message
      }));
    });
    return;
  } 
  else if (pathname === "/api/files" && req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify({
      files: [],
      message: "✅ Files list endpoint working"
    }));
  } 
  else if (pathname === "/") {
    res.writeHead(200);
    res.end(JSON.stringify({
      name: "File Manager API",
      status: "✅ running",
      version: "1.0.0",
      endpoints: {
        health: "/health",
        diagnostics: "/api/files/diagnostics",
        uploadFile: "POST /api/files/upload or POST /api/files",
        listFiles: "GET /api/files"
      }
    }));
  } 
  else {
    res.writeHead(404);
    res.end(JSON.stringify({error: "Endpoint not found"}));
  }
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n✅ Server listening on 0.0.0.0:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Diagnostics: http://localhost:${PORT}/api/files/diagnostics\n`);
});

// Error handling
server.on("error", (err) => {
  console.error("❌ Server error:", err.message);
  console.error(err.stack);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n🛑 SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n🛑 SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

// Log uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err);
  process.exit(1);
});

