# 🚀 Azure File Manager - Production Deployment Guide

Complete Docker & Azure deployment solution with automatic CI/CD pipeline, production-ready CORS configuration, and environment-based API routing.

**Status:** ✅ Production Ready | **Last Updated:** December 24, 2025

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Production URLs](#production-urls)
- [Testing & Verification](#testing--verification)
- [Environment Configuration](#environment-configuration)
- [Production Deployment](#production-deployment)
- [CORS & Security](#cors--security)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

---

## 🚀 Quick Start

### Prerequisites
- Docker (for local development)
- Node.js 16+ (for development)
- Azure account (for production deployment)
- Git

### Local Development

```bash
# Option 1: Using Docker Compose (recommended)
docker-compose up --build

# Option 2: Manual npm start
# Terminal 1: Backend
cd backend && npm install && npm start
# Terminal 2: Frontend
cd frontend && npm install && npm start

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## 🌐 Production URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://file-manager-frontend-app.azurewebsites.net |
| **Backend API** | https://file-manager-backend-app.azurewebsites.net |
| **Health Check** | https://file-manager-backend-app.azurewebsites.net/health |

---

## ✅ Testing & Verification

### Quick Test (2 minutes)
```bash
# 1. Open website
https://file-manager-frontend-app.azurewebsites.net

# 2. Upload a test file
Click "Choose File" → Select file → Click "Upload"

# 3. Verify
File should appear in the list below
```

### Full Verification Script
```bash
# Run comprehensive system check
chmod +x verify.sh
./verify.sh

# Expected output: All checks passed ✅
```

### Test Individual Components

```bash
# Backend health check
curl https://file-manager-backend-app.azurewebsites.net/health

# CORS preflight test
curl -X OPTIONS https://file-manager-backend-app.azurewebsites.net/api/files/upload \
  -H "Origin: https://file-manager-frontend-app.azurewebsites.net" \
  -v

# Upload endpoint test (requires file)
curl -X POST https://file-manager-backend-app.azurewebsites.net/api/files/upload \
  -F "file=@testfile.txt"
```

---

## 📊 API Endpoints

```
POST   /api/files/upload         - Upload file
GET    /api/files                - List all files
GET    /api/files/{id}           - Get file details
DELETE /api/files/{id}           - Delete file
GET    /health                   - Health check
OPTIONS /api/files/upload        - CORS preflight
```

### Response Examples

**Health Check:**
```json
{
  "status": "healthy",
  "service": "File Management API",
  "timestamp": "2025-12-24T06:17:06.218Z",
  "uptime": 125.748
}
```

**File Upload:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "id": "uuid-here",
    "name": "document.pdf",
    "size": 1024,
    "url": "blob-storage-url"
  }
}
```

---

## ⚙️ Environment Configuration

### Frontend (.env files)

#### Production - `.env.production`
```bash
REACT_APP_API_BASE_URL=https://file-manager-backend-app.azurewebsites.net
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

#### Development - `.env.development`
```bash
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

#### Local Testing - `.env.local` (Git-ignored)
```bash
# Uncomment to override API URL
# REACT_APP_API_BASE_URL=http://192.168.1.100:5000
```

### Backend (.env file)

```bash
# Server
PORT=5000
NODE_ENV=production
WEBSITES_PORT=5000

# Azure Cosmos DB
COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_KEY=your-primary-key
COSMOS_DB_NAME=FileManagementDB
COSMOS_CONTAINER_NAME=fileItems

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
CONTAINER_NAME=files
```

### Set Azure App Service Variables

```bash
az webapp config appsettings set \
  --resource-group file-manager-rg \
  --name file-manager-backend-app \
  --settings \
    PORT=5000 \
    NODE_ENV=production \
    COSMOS_ENDPOINT="https://your-account.documents.azure.com:443/" \
    COSMOS_KEY="your-key" \
    COSMOS_DB_NAME="FileManagementDB" \
    COSMOS_CONTAINER_NAME="fileItems" \
    AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;..." \
    CONTAINER_NAME="files"
```

Or via **Azure Portal**:
1. Go to **App Service** → **Configuration** → **Application settings**
2. Click **+ New application setting**
3. Add each setting above
4. Click **Save**

---

## 🔐 CORS & Security

### How It Works

**Frontend Config:**
```javascript
// frontend/src/config.js - Automatic environment detection
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Uses .env.production in build, .env.development in npm start
```

**Backend CORS:**
```javascript
// backend/src/index.js
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://file-manager-frontend-app.azurewebsites.net'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false, // Stateless - no cookies
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle OPTIONS preflight
```

### Preflight Request Flow

```
1. Browser: OPTIONS /api/files/upload
   Origin: https://file-manager-frontend-app.azurewebsites.net

2. Backend: HTTP 200 OK
   Access-Control-Allow-Origin: https://file-manager-frontend-app.azurewebsites.net
   Access-Control-Allow-Methods: POST, OPTIONS

3. Browser: POST /api/files/upload
   [file data]

4. Backend: HTTP 200 OK
   [response]
```

### Security Features

✅ **No credentials** - Stateless architecture  
✅ **Specific origins only** - Only Azure frontend allowed  
✅ **HTTPS only** - All production URLs secured  
✅ **No source maps** - Production builds optimized  
✅ **Explicit headers** - Only required headers allowed  

---

## 🚀 Production Deployment

### Build & Deploy Frontend

```bash
# Build for production (uses .env.production)
cd frontend
npm run build

# Deploy to Azure
az webapp up \
  --resource-group file-manager-rg \
  --name file-manager-frontend-app \
  --location eastus
```

### Deploy Backend

```bash
cd backend
az webapp up \
  --resource-group file-manager-rg \
  --name file-manager-backend-app \
  --runtime "node|20-lts" \
  --location eastus
```

### Verify Deployment

```bash
# Test frontend
curl -I https://file-manager-frontend-app.azurewebsites.net
# Expected: 200 OK

# Test backend
curl -I https://file-manager-backend-app.azurewebsites.net/health
# Expected: 200 OK

# Test CORS preflight
curl -i -X OPTIONS https://file-manager-backend-app.azurewebsites.net/api/files/upload \
  -H "Origin: https://file-manager-frontend-app.azurewebsites.net" \
  -H "Access-Control-Request-Method: POST"
# Expected: 200 OK with CORS headers
```

---

## 🐛 Troubleshooting

### "Failed to fetch" Error

| Problem | Solution |
|---------|----------|
| Backend not responding | Check: `curl https://file-manager-backend-app.azurewebsites.net/health` |
| Wrong API URL | Verify `REACT_APP_API_BASE_URL` in npm run build |
| CORS rejected | Check `corsOptions` in backend/src/index.js |
| Network blocked | Check Azure Network Security Groups |

### Check Status

```bash
# Backend logs
az webapp log tail -g file-manager-rg -n file-manager-backend-app

# Restart backend
az webapp restart -g file-manager-rg -n file-manager-backend-app
```

### Test Locally

```bash
# Terminal 1: Start backend
cd backend && npm start

# Terminal 2: Test CORS
curl -i -X OPTIONS http://localhost:5000/api/files/upload \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
# Should return: 200 OK with CORS headers
```

---

## 📁 Project Structure

```
.
├── frontend/
│   ├── .env.production        ← Used by npm run build
│   ├── .env.development       ← Used by npm start
│   ├── .env.local            ← Local overrides (Git-ignored)
│   ├── src/
│   │   ├── config.js         ← API config (reads env vars)
│   │   ├── components/
│   │   │   └── FileUpload.js
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── .env.example          ← Template
│   ├── .env                  ← Actual config (Git-ignored)
│   ├── src/
│   │   ├── index.js          ← Server + CORS
│   │   ├── routes/files.js   ← API endpoints
│   │   └── config.js         ← Azure SDK
│   └── package.json
│
├── docker-compose.yml        ← Local dev
├── web.config               ← Azure IISNode
└── README.md               ← This file
```

---

## 📚 API Examples

### Upload File
```bash
curl -X POST https://file-manager-backend-app.azurewebsites.net/api/files/upload \
  -F "file=@document.pdf" \
  -F "userId=user123" \
  -F "description=My document"
```

### List Files
```bash
curl https://file-manager-backend-app.azurewebsites.net/api/files
```

### Delete File
```bash
curl -X DELETE https://file-manager-backend-app.azurewebsites.net/api/files/{file-id}
```

---

## ✅ Final Verification Checklist

- [ ] Frontend `.env.production` has correct REACT_APP_API_BASE_URL
- [ ] Backend `.env` has all Azure credentials
- [ ] Azure App Service environment variables set
- [ ] CORS `corsOptions` includes production frontend URL
- [ ] Backend `app.options()` middleware in place
- [ ] Frontend runs: `npm start` works at localhost:3000
- [ ] Backend runs: `npm start` works at localhost:5000
- [ ] CORS test passes locally with 200 OK
- [ ] Frontend builds: `npm run build` completes
- [ ] Production URLs return 200 OK
- [ ] File upload works end-to-end in production

---

## 💬 Support

1. Check [Troubleshooting](#troubleshooting)
2. Review: `az webapp log tail ...`
3. Test locally first
4. Verify all env vars set
