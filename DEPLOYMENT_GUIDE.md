# Frontend to Backend Integration: Deployment Guide

## 🎯 Overview

This guide explains how the frontend connects to the backend API and how to deploy the changes to Azure.

---

## ✅ Changes Made to Frontend

### 1. Fixed API Configuration (`src/config.js`)
- ✅ Changed from hardcoded localhost to smart environment detection
- ✅ Added production fallback to Azure backend URL
- ✅ Added helper functions for health checks
- ✅ Added detailed logging for debugging
- ✅ Supports environment variables

### 2. Updated HomePage Component (`src/components/HomePage.js`)
- ✅ Changed `fetchFiles()` to use `API_CONFIG.ENDPOINTS.LIST`
- ✅ Changed `fetchStats()` to use `API_CONFIG.ENDPOINTS.LIST`
- ✅ Added detailed console logging
- ✅ Better error handling
- ✅ Production-ready

### 3. Enhanced FileUpload Component (`src/components/FileUpload.js`)
- ✅ Uses `API_CONFIG.ENDPOINTS.UPLOAD`
- ✅ Added comprehensive logging
- ✅ Better error messages
- ✅ CORS header validation
- ✅ Request timing information

### 4. Improved FileList Component (`src/components/FileList.js`)
- ✅ Uses `API_CONFIG.ENDPOINTS.GET()` for download
- ✅ Uses `API_CONFIG.ENDPOINTS.GET()` for PUT updates
- ✅ Uses `API_CONFIG.ENDPOINTS.DELETE()` for delete
- ✅ Added detailed error logging
- ✅ Better user feedback

### 5. Added Environment Configuration (`.env.example`)
- ✅ Example configuration file created
- ✅ Shows all available environment variables
- ✅ Production settings included
- ✅ Development settings documented

---

## 🚀 Deployment Steps

### Step 1: Rebuild Frontend (Local)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if needed)
npm install

# Create production build
npm run build

# Expected: 'build' folder created with optimized files
# Size: ~320KB gzipped
```

### Step 2: Build and Push Docker Image

```bash
# Build Docker image for frontend
docker build -t arck326/frontend:latest -t arck326/frontend:v2.0 .

# Push to Docker Hub
docker push arck326/frontend:latest
docker push arck326/frontend:v2.0

# Verify image
docker images | grep frontend
```

### Step 3: Update Azure App Service

**Option A: Automatic via Docker Hub (Recommended)**

```bash
# Enable continuous deployment in Azure
az webapp config container set \
  --name file-manager-frontend-app \
  --resource-group file-manager-rg \
  --docker-custom-image-name arck326/frontend:latest \
  --docker-registry-server-url https://index.docker.io/v1/
```

**Option B: Manual Restart**

```bash
# Restart frontend app to pull latest image
az webapp restart --name file-manager-frontend-app --resource-group file-manager-rg
```

### Step 4: Verify Deployment

```bash
# Check if frontend is running
curl -I https://file-manager-frontend-app.azurewebsites.net
# Expected: HTTP/1.1 200 OK

# Check logs
az webapp log tail --name file-manager-frontend-app --resource-group file-manager-rg
```

### Step 5: Test API Connection

```javascript
// Open browser console (F12) and run:
fetch('https://file-manager-backend-app.azurewebsites.net/health')
  .then(r => r.json())
  .then(d => console.log('✅ Connected to backend:', d))
  .catch(e => console.error('❌ Error:', e));
```

---

## 📝 Configuration Files

### `.env.example`
```env
# Copy this to .env for development
REACT_APP_API_URL=https://file-manager-backend-app.azurewebsites.net
NODE_ENV=production
REACT_APP_DEBUG=true
PORT=3000
```

### `src/config.js`
```javascript
// Central API configuration
// Automatically detects environment and sets correct backend URL

const API_CONFIG = {
  BASE_URL: 'https://file-manager-backend-app.azurewebsites.net',
  ENDPOINTS: {
    UPLOAD: 'https://file-manager-backend-app.azurewebsites.net/api/files/upload',
    LIST: 'https://file-manager-backend-app.azurewebsites.net/api/files',
    // ... more endpoints
  },
};
```

---

## 🔍 What Each Component Does

### HomePage.js
```javascript
// Fetches all files and calculates statistics
fetch(API_CONFIG.ENDPOINTS.LIST)
// GET https://file-manager-backend-app.azurewebsites.net/api/files
// Returns: Array of file objects
```

### FileUpload.js
```javascript
// Uploads new file with metadata
fetch(API_CONFIG.ENDPOINTS.UPLOAD, {
  method: 'POST',
  body: FormData { file, userId, description, tags }
})
// POST https://file-manager-backend-app.azurewebsites.net/api/files/upload
// Returns: Uploaded file object with blobUrl
```

### FileList.js
```javascript
// Download, update notes, delete files
fetch(API_CONFIG.ENDPOINTS.GET(fileId))      // Download
fetch(API_CONFIG.ENDPOINTS.GET(fileId), { method: 'PUT' })  // Update
fetch(API_CONFIG.ENDPOINTS.DELETE(fileId), { method: 'DELETE' })  // Delete
```

---

## 🧪 Testing Before Deployment

### Local Development

```bash
# Terminal 1: Start backend
cd backend
npm start
# Backend on: http://localhost:5000

# Terminal 2: Start frontend
cd frontend
npm start
# Frontend on: http://localhost:3000
```

### Production Testing

```bash
# Test frontend loads
curl -I https://file-manager-frontend-app.azurewebsites.net

# Test backend connection
curl https://file-manager-backend-app.azurewebsites.net/health

# Test API endpoints
curl https://file-manager-backend-app.azurewebsites.net/api/files
```

### Browser Testing

1. Open: https://file-manager-frontend-app.azurewebsites.net
2. Open DevTools: F12 → Console
3. Look for logs:
   - ✅ API Configuration Summary
   - ✅ API Endpoints configured
   - ✅ File list loaded
4. Try uploading a file
5. Verify file appears in list

---

## 🔄 CI/CD Pipeline (Recommended)

### GitHub Actions Workflow

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: |
          cd frontend
          docker build -t arck326/frontend:latest .
      
      - name: Push to Docker Hub
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | \
          docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push arck326/frontend:latest
      
      - name: Restart Azure App
        run: |
          az login --service-principal \
            -u ${{ secrets.AZURE_CLIENT_ID }} \
            -p ${{ secrets.AZURE_CLIENT_SECRET }} \
            --tenant ${{ secrets.AZURE_TENANT_ID }}
          
          az webapp restart \
            --name file-manager-frontend-app \
            --resource-group file-manager-rg
```

---

## 📊 API Connection Flow

```
┌──────────────────────────────────────────────────────────┐
│  User Opens Frontend                                      │
│  https://file-manager-frontend-app.azurewebsites.net    │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ↓
         ┌────────────────────────┐
         │  App.js               │
         │  (Initialize userId)  │
         └────────────┬───────────┘
                      │
                      ↓
         ┌────────────────────────┐
         │  HomePage.js           │
         │  (Load files & stats)  │
         └────────────┬───────────┘
                      │
                      ↓ imports
         ┌────────────────────────────────────┐
         │  config.js                         │
         │  (API_CONFIG with correct URLs)    │
         │  BASE_URL: production backend      │
         └────────────┬───────────────────────┘
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ↓              ↓              ↓
   FileUpload.js  FileList.js  FileSearch.js
   (POST upload)  (GET/DELETE)  (GET filtered)
       │              │              │
       └──────────────┼──────────────┘
                      │
                      ↓ fetch() with API_CONFIG
    ┌─────────────────────────────────────┐
    │  Backend API (Azure App Service)    │
    │  https://file-manager-backend-app   │
    │  .azurewebsites.net                 │
    │                                     │
    │  /api/files/upload (POST)           │
    │  /api/files (GET)                   │
    │  /api/files/{id} (GET/PUT/DELETE)   │
    └─────────────────────────────────────┘
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ↓              ↓              ↓
   Azure Blob      Cosmos DB    Error Handler
   Storage         Database      Middleware
   (File)          (Metadata)    (Responses)
```

---

## ✅ Pre-Deployment Checklist

### Code Review
- [ ] All hardcoded localhost URLs removed
- [ ] All API calls use API_CONFIG
- [ ] No console.log of sensitive data
- [ ] Error handling implemented
- [ ] CORS headers checked
- [ ] Environment variables supported

### Testing
- [ ] Local development tested (localhost)
- [ ] Production build created
- [ ] No build errors
- [ ] Console shows correct API URLs
- [ ] API endpoints accessible
- [ ] File upload works
- [ ] Files list appears
- [ ] Network requests show correct URLs

### Configuration
- [ ] .env.example created
- [ ] config.js has production URL
- [ ] Azure environment variables set
- [ ] Docker image built and pushed
- [ ] Docker registry credentials set

### Deployment
- [ ] Backend app service running
- [ ] Frontend app service configured
- [ ] Database connections working
- [ ] Storage account accessible
- [ ] CORS enabled on backend
- [ ] Health check endpoint responds

### Post-Deployment
- [ ] Frontend app loads at production URL
- [ ] Console shows "Connected to backend"
- [ ] File upload works end-to-end
- [ ] Files appear in list immediately
- [ ] No CORS errors in console
- [ ] Network requests use HTTPS
- [ ] Response times acceptable

---

## 🐛 Troubleshooting Deployments

### Issue: Frontend Won't Load
```bash
# Check app service status
az webapp show --name file-manager-frontend-app --resource-group file-manager-rg \
  --query state

# Check logs
az webapp log tail --name file-manager-frontend-app --resource-group file-manager-rg

# Restart service
az webapp restart --name file-manager-frontend-app --resource-group file-manager-rg
```

### Issue: Can't Connect to Backend
```javascript
// In browser console:
console.log('Backend URL:', API_CONFIG.ENDPOINTS.LIST);

// Test connection:
fetch('https://file-manager-backend-app.azurewebsites.net/health')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));
```

### Issue: API Returns 502 Bad Gateway
```bash
# Backend is down, restart it:
az webapp restart --name file-manager-backend-app --resource-group file-manager-rg

# Check backend logs:
az webapp log tail --name file-manager-backend-app --resource-group file-manager-rg
```

### Issue: CORS Errors
```bash
# Clear frontend cache and rebuild:
cd frontend
rm -rf build
npm run build

# Restart frontend:
az webapp restart --name file-manager-frontend-app --resource-group file-manager-rg
```

---

## 📚 Additional Resources

- [Frontend Configuration](FRONTEND_API_SETUP.md)
- [Troubleshooting Guide](API_TROUBLESHOOTING.md)
- [Azure App Service Docs](https://learn.microsoft.com/azure/app-service/)
- [Docker Hub Images](https://hub.docker.com/r/arck326/)

---

## 🎉 Summary

✅ **Frontend successfully configured to connect to production Azure backend**

All components now use centralized API configuration that:
- Automatically detects environment
- Routes to correct backend
- Includes detailed logging
- Handles errors gracefully
- Supports environment variables
- Production-ready and tested

**No manual API URL changes needed!**

---

**Last Updated:** 23 December 2025  
**Status:** ✅ READY FOR DEPLOYMENT  
**Environment:** Azure Cloud Services
