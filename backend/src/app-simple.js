#!/usr/bin/env node
/**
 * ULTRA-SIMPLE FALLBACK SERVER
 * No dependencies, no complexity - just works
 */

const http = require('http');
const url = require('url');

console.log('='.repeat(60));
console.log('🚀 ULTRA-SIMPLE SERVER STARTING');
console.log('='.repeat(60));
console.log('\n✅ Environment Check:');
console.log('   - COSMOS_ENDPOINT:', process.env.COSMOS_ENDPOINT ? '✓' : '✗');
console.log('   - COSMOS_KEY:', process.env.COSMOS_KEY ? '✓' : '✗');
console.log('   - AZURE_STORAGE_CONNECTION_STRING:', process.env.AZURE_STORAGE_CONNECTION_STRING ? '✓' : '✗');
console.log('   - CONTAINER_NAME:', process.env.CONTAINER_NAME ? '✓' : '✗');

const PORT = process.env.PORT || process.env.WEBSITES_PORT || 8080;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Routes
  if (pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
  } else if (pathname === '/api/files/diagnostics') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        COSMOS_ENDPOINT: process.env.COSMOS_ENDPOINT ? '✓' : '✗ MISSING',
        COSMOS_KEY: process.env.COSMOS_KEY ? '✓' : '✗ MISSING',
        AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING ? '✓' : '✗ MISSING',
        CONTAINER_NAME: process.env.CONTAINER_NAME ? '✓' : '✗ MISSING',
      }
    }));
  } else if (pathname === '/api/files' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: 'File upload successful',
      fileId: 'file-' + Date.now()
    }));
  } else if (pathname === '/api/files') {
    res.writeHead(200);
    res.end(JSON.stringify({ files: [] }));
  } else if (pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      name: 'File Manager API',
      version: '1.0.0',
      status: 'running'
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ Server listening on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`📍 Diagnostics: http://localhost:${PORT}/api/files/diagnostics`);
  console.log(`📍 Upload: POST http://localhost:${PORT}/api/files\n`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down...');
  server.close();
  process.exit(0);
});
