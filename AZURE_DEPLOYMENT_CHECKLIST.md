# Azure Deployment Checklist

## Pre-Deployment Verification

### Local Setup ✅
- [ ] Clone repository and navigate to `backend/` folder
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in Azure credentials in `.env`:
  - [ ] `COSMOS_ENDPOINT` (from Azure Portal)
  - [ ] `COSMOS_KEY` (from Azure Portal)
  - [ ] `COSMOS_DB_NAME` (default: FileManagementDB)
  - [ ] `COSMOS_CONTAINER_NAME` (default: files)
  - [ ] `AZURE_STORAGE_CONNECTION_STRING` (from Azure Portal)
  - [ ] `CONTAINER_NAME` (default: file-uploads)

### Install Dependencies ✅
```bash
npm install
```
Check for warnings/errors.

### Local Testing ✅
```bash
npm start
```

Expected output:
```
==================================================
✅ Server is running on port 5000
📍 Local: http://localhost:5000
==================================================

✅ Successfully connected to Azure Cosmos DB
✅ Successfully connected to Azure Blob Storage
```

### Test Health Endpoint ✅
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "File Management API",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 5.123
}
```

### Test API Info Endpoint ✅
```bash
curl http://localhost:5000/
```

## Docker Build & Test

### Build Docker Image ✅
```bash
docker build -t file-manager-backend:latest .
```

Expected output (no errors):
```
[1/5] FROM node:16-alpine
[2/5] WORKDIR /app
[3/5] COPY package*.json ./
[4/5] RUN npm install --production
[5/5] RUN npm start
```

### Run Docker Container Locally ✅
```bash
docker run -p 5000:5000 \
  -e COSMOS_ENDPOINT="your-endpoint" \
  -e COSMOS_KEY="your-key" \
  -e COSMOS_DB_NAME="FileManagementDB" \
  -e COSMOS_CONTAINER_NAME="files" \
  -e AZURE_STORAGE_CONNECTION_STRING="your-string" \
  -e CONTAINER_NAME="file-uploads" \
  file-manager-backend:latest
```

### Test Docker Container ✅
```bash
curl http://localhost:5000/health
curl http://localhost:5000/
```

### Stop Docker Container ✅
```bash
docker stop <container-id>
```

## Docker Hub Push (Optional)

### Tag Image ✅
```bash
docker tag file-manager-backend:latest arck326/backend:latest
```

### Push to Docker Hub ✅
```bash
docker login
docker push arck326/backend:latest
```

## Azure Web App Configuration

### Create Azure Web App (If Not Done)

**Using Azure Portal:**
1. [ ] Go to Azure Portal
2. [ ] Create App Service
3. [ ] Choose:
   - Publish: Docker Container
   - OS: Linux
   - Region: Your preferred region
4. [ ] Create App Service Plan (Basic or Standard)
5. [ ] Click "Create"

**Wait for deployment (~5 minutes)**

### Get Web App Information ✅
```bash
# Get the name
az webapp list --query "[].name" -o table

# Get the URL
az webapp show --name your-app-name --resource-group your-resource-group --query "defaultHostName"
```

### Configure Environment Variables ✅

**Via Azure Portal:**
1. [ ] Go to your Web App
2. [ ] Settings → Configuration
3. [ ] Click "New application setting"
4. [ ] Add each variable:

| Name | Value |
|------|-------|
| COSMOS_ENDPOINT | `https://your-account.documents.azure.com:443/` |
| COSMOS_KEY | Your primary key from Cosmos DB |
| COSMOS_DB_NAME | FileManagementDB |
| COSMOS_CONTAINER_NAME | files |
| AZURE_STORAGE_CONNECTION_STRING | Your storage connection string |
| CONTAINER_NAME | file-uploads |
| NODE_ENV | production |
| PORT | 8080 |

5. [ ] Click "Save"
6. [ ] Click "Continue" when prompted
7. [ ] Wait for changes to apply

**Via Azure CLI:**
```bash
az webapp config appsettings set \
  --name your-app-name \
  --resource-group your-resource-group \
  --settings \
    COSMOS_ENDPOINT="your-endpoint" \
    COSMOS_KEY="your-key" \
    COSMOS_DB_NAME="FileManagementDB" \
    COSMOS_CONTAINER_NAME="files" \
    AZURE_STORAGE_CONNECTION_STRING="your-string" \
    CONTAINER_NAME="file-uploads" \
    NODE_ENV="production" \
    PORT="8080"
```

### Configure Docker Container ✅

**Option 1: Using Docker Hub Image (Recommended)**

```bash
az webapp config container set \
  --name your-app-name \
  --resource-group your-resource-group \
  --docker-custom-image-name arck326/backend:latest \
  --docker-registry-server-url https://index.docker.io \
  --docker-registry-server-user your-docker-username \
  --docker-registry-server-password your-docker-password
```

**Option 2: Using GitHub Actions (Auto Deploy)**
- Push to GitHub main branch
- GitHub Actions automatically:
  - Builds Docker image
  - Pushes to Docker Hub
  - Deploys to Azure Web App

### Restart Web App ✅
```bash
az webapp restart \
  --name your-app-name \
  --resource-group your-resource-group
```

Wait 30-60 seconds for restart.

## Deployment Verification

### Check Web App Status ✅
```bash
az webapp show \
  --name your-app-name \
  --resource-group your-resource-group \
  --query "state"
```

Expected output: `Running`

### Test Health Endpoint ✅
```bash
curl https://your-app.azurewebsites.net/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "File Management API",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

### Test API Info Endpoint ✅
```bash
curl https://your-app.azurewebsites.net/
```

### View Container Logs ✅
```bash
az webapp log tail \
  --name your-app-name \
  --resource-group your-resource-group
```

Expected output:
```
2024-01-15 10:30:00 - ==================================================
2024-01-15 10:30:00 - ✅ Server is running on port 5000
2024-01-15 10:30:00 - ✅ Successfully connected to Azure Cosmos DB
2024-01-15 10:30:00 - ✅ Successfully connected to Azure Blob Storage
```

## Post-Deployment Testing

### Test File Upload API ✅
```bash
curl -X POST https://your-app.azurewebsites.net/api/files/upload \
  -F "file=@test-file.txt" \
  -F "userId=testuser123" \
  -F "description=Test upload"
```

Expected response: 201 Created

### Test List Files API ✅
```bash
curl "https://your-app.azurewebsites.net/api/files?userId=testuser123"
```

Expected response: 200 OK with file list

### Test Get File API ✅
```bash
# Use the file ID from the upload response
curl "https://your-app.azurewebsites.net/api/files/{FILE_ID}?userId=testuser123"
```

Expected response: 200 OK with file details

### Test Delete API ✅
```bash
curl -X DELETE "https://your-app.azurewebsites.net/api/files/{FILE_ID}?userId=testuser123"
```

Expected response: 200 OK with success message

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
az webapp log tail --name your-app-name --resource-group your-resource-group
```

**Common issues:**
- [ ] Missing environment variables
- [ ] Invalid Azure credentials
- [ ] Cosmos DB/Storage account not accessible
- [ ] Port mapping issue (should use PORT env var, not hardcoded 5000)

### Connection to Azure Services Fails

**Check:**
- [ ] Environment variables are set correctly
- [ ] Cosmos DB endpoint URL format is correct (with https:// and :443/)
- [ ] Storage connection string format is correct
- [ ] Network/firewall allows outbound connections
- [ ] Credentials haven't expired

### API Endpoint Returns 500 Error

**Check logs:**
```bash
az webapp log tail --name your-app-name --resource-group your-resource-group
```

**Common issues:**
- [ ] Database query syntax error
- [ ] Missing required parameters
- [ ] File too large
- [ ] Azure storage quota exceeded

### File Upload Returns 413 Payload Too Large

**Solution:**
- Check MAX_FILE_SIZE in environment (default: 100MB)
- File size must be less than limit
- Azure Blob Storage max is 4.75TB, so this is usually client-side limit

## Performance Tuning

### Monitor Resource Usage
```bash
# Check App Service metrics
az monitor metrics list \
  --resource /subscriptions/{subscription}/resourceGroups/{resource-group}/providers/Microsoft.Web/sites/{app-name} \
  --metric "CpuTime,MemoryWorkingSet,RequestCount"
```

### Scale Up If Needed
```bash
az appservice plan update \
  --name your-plan-name \
  --resource-group your-resource-group \
  --sku B2
```

### Enable Application Insights
1. [ ] Go to Web App in Azure Portal
2. [ ] Settings → Application Insights
3. [ ] Click "Turn on Application Insights"
4. [ ] Choose existing or create new App Insights resource
5. [ ] Click "Apply"

## Security Checklist

- [ ] .env file is NOT committed to GitHub
- [ ] .env.example is committed as template
- [ ] .gitignore includes .env
- [ ] Azure credentials are strong (25+ characters)
- [ ] Web App has "HTTPS Only" enabled
- [ ] CORS origins are restricted (not *)
- [ ] Storage account firewall is configured
- [ ] Cosmos DB has firewall enabled
- [ ] Rotate credentials every 90 days
- [ ] Monitor activity logs for suspicious access

## Final Verification

- [ ] Health endpoint responds: `/health`
- [ ] API info endpoint responds: `/`
- [ ] File upload works: `POST /api/files/upload`
- [ ] List files works: `GET /api/files?userId=xxx`
- [ ] Get file works: `GET /api/files/:id?userId=xxx`
- [ ] Delete file works: `DELETE /api/files/:id?userId=xxx`
- [ ] Error handling works: Invalid requests return proper errors
- [ ] Logging shows in Application Insights
- [ ] No 500 errors in logs
- [ ] Response times < 500ms

## Deployment Complete! 🎉

Your backend is now deployed to Azure Web App and ready for production!

**Public URL:** `https://your-app.azurewebsites.net`

### Next Steps
1. [ ] Update frontend with new API URL
2. [ ] Test end-to-end workflow
3. [ ] Monitor performance and errors
4. [ ] Set up alerts for critical errors
5. [ ] Schedule regular backups of Cosmos DB
6. [ ] Document any custom configurations

---

**Checklist Version:** 1.0
**Last Updated:** January 2024
