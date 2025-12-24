# 🚀 Complete Setup & Verification Guide

## Project: Cloud File Manager (Azure G4 CICD)

---

## ✅ PART 1: VERIFY AZURE RESOURCES

### Backend App Service
```bash
# Check backend status
az webapp show --name file-manager-backend-app \
  --resource-group file-manager-rg \
  --query "state"
# Expected: "Running"

# Check health
curl https://file-manager-backend-app.azurewebsites.net/health
# Expected: {"status":"healthy",...}
```

### Frontend App Service
```bash
# Check frontend status
az webapp show --name file-manager-frontend-app \
  --resource-group file-manager-rg \
  --query "state"
# Expected: "Running"

# Access website
# https://file-manager-frontend-app.azurewebsites.net
```

### Cosmos DB Verification
```bash
# Check Cosmos DB account
az cosmosdb show --name filemanagementdb \
  --resource-group file-manager-rg \
  --query "provisioningState"
# Expected: "Succeeded"
```

### Blob Storage Verification
```bash
# Check storage account
az storage account show --name filemanagerstorage5371 \
  --resource-group file-manager-rg \
  --query "provisioningState"
# Expected: "Succeeded"
```

---

## ✅ PART 2: END-TO-END TESTING

### Test 1: File Upload
1. Open: https://file-manager-frontend-app.azurewebsites.net
2. Click "Choose File" button
3. Select any test file
4. Click "Upload"
5. ✅ Expected: Success message appears

### Test 2: File Listing
1. After upload, check if file appears in list
2. ✅ Expected: File name visible in the list

### Test 3: File Download
1. Click on any file in the list
2. ✅ Expected: File downloads to your computer

### Test 4: File Deletion
1. Click delete button next to any file
2. ✅ Expected: File removed from list

### Test 5: Verify Storage
1. Go to Azure Portal
2. Search: "filemanagerstorage5371"
3. Open Blob Containers → "uploads"
4. ✅ Expected: Your test files should be here

---

## ✅ PART 3: MONITORING & LOGGING

### View Backend Logs
```bash
# Stream logs
az webapp log tail --name file-manager-backend-app \
  --resource-group file-manager-rg
```

### View Upload Endpoint
```bash
curl -X OPTIONS https://file-manager-backend-app.azurewebsites.net/api/files/upload \
  -H "Origin: https://file-manager-frontend-app.azurewebsites.net" \
  -v
# Should see CORS headers in response
```

### Check Environment Variables
```bash
az webapp config appsettings list \
  --name file-manager-backend-app \
  --resource-group file-manager-rg \
  --query "[].{name:name, value:value}"
```

---

## ✅ PART 4: LOCAL DEVELOPMENT TESTING

### Run Locally
```bash
# Start services
docker-compose up -d

# Wait 30 seconds
# Access: http://localhost

# Test backend
curl http://localhost:5000/health

# Stop services
docker-compose down
```

---

## ✅ PART 5: DATABASE VERIFICATION

### Check Cosmos DB Connection
```bash
# Verify endpoint is set
echo $env:COSMOS_ENDPOINT

# Verify container exists
# Azure Portal → FileManagementDB → Containers → "files"
```

### Check Blob Storage Connection
```bash
# Verify connection string is set
echo $env:AZURE_STORAGE_CONNECTION_STRING

# List blobs
az storage blob list --container-name uploads \
  --account-name filemanagerstorage5371 \
  --query "[].name"
```

---

## ✅ PART 6: PRODUCTION CHECKLIST

- [x] Backend deployed and running
- [x] Frontend deployed and running
- [x] CORS configured correctly
- [x] Upload endpoint working
- [x] Azure resources created
- [x] Code quality verified
- [ ] Load testing completed (optional)
- [ ] Security audit completed (optional)
- [ ] Application Insights enabled (optional)
- [ ] Custom domain configured (optional)

---

## ✅ PART 7: QUICK REFERENCE

### URLs
- **Frontend Live:** https://file-manager-frontend-app.azurewebsites.net
- **Backend API:** https://file-manager-backend-app.azurewebsites.net
- **Health Check:** https://file-manager-backend-app.azurewebsites.net/health
- **Local Dev:** http://localhost

### API Endpoints
- `GET /health` - Health check
- `POST /api/files/upload` - Upload file
- `GET /api/files` - List files
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file

### Important Commands
```bash
# Check status
az webapp show --name file-manager-backend-app --resource-group file-manager-rg --query "state"

# View logs
az webapp log tail --name file-manager-backend-app --resource-group file-manager-rg

# Restart service
az webapp restart --name file-manager-backend-app --resource-group file-manager-rg

# View environment variables
az webapp config appsettings list --name file-manager-backend-app --resource-group file-manager-rg
```

---

## ✅ TROUBLESHOOTING

### Upload Not Working?
1. Check browser console (F12 → Console tab)
2. Check CORS headers: `curl -I https://...`
3. Verify backend is running: `https://...azurewebsites.net/health`
4. Check environment variables are set

### Files Not Appearing?
1. Verify Cosmos DB connection
2. Check Blob Storage connection string
3. Review backend logs
4. Check database has "files" container

### Backend Not Starting?
1. Check app plan isn't Free tier
2. Verify all environment variables are set
3. Check logs: `az webapp log tail ...`
4. Restart app service

---

## 📞 SUPPORT

For issues:
1. Check backend logs
2. Review environment variables
3. Verify Azure resources exist
4. Check GitHub repository for code

---

**Last Updated:** December 24, 2025  
**Status:** ✅ Production Ready
