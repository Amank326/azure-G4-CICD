# 🎯 QUICK COMMAND REFERENCE

## Local Development Commands

### Setup
```bash
cd backend
cp .env.example .env
npm install
```

### Run Server
```bash
npm start
```

### Test Health Endpoint
```bash
curl http://localhost:5000/health
```

### Test API Info
```bash
curl http://localhost:5000/
```

---

## API Testing Commands

### 1. Upload File
```bash
curl -X POST http://localhost:5000/api/files/upload \
  -F "file=@document.pdf" \
  -F "userId=user123" \
  -F "description=My Document" \
  -F "tags=important,work"
```

### 2. List Files
```bash
curl "http://localhost:5000/api/files?userId=user123"
```

### 3. Get File Details
```bash
# Replace FILE_ID with actual ID from upload response
curl "http://localhost:5000/api/files/{FILE_ID}?userId=user123"
```

### 4. Delete File
```bash
curl -X DELETE "http://localhost:5000/api/files/{FILE_ID}?userId=user123"
```

---

## Docker Commands

### Build Image
```bash
docker build -t file-manager-backend:latest .
```

### Run Container
```bash
docker run -p 5000:5000 \
  -e COSMOS_ENDPOINT="https://account.documents.azure.com:443/" \
  -e COSMOS_KEY="your-key" \
  -e COSMOS_DB_NAME="FileManagementDB" \
  -e COSMOS_CONTAINER_NAME="files" \
  -e AZURE_STORAGE_CONNECTION_STRING="your-connection-string" \
  -e CONTAINER_NAME="file-uploads" \
  file-manager-backend:latest
```

### Stop Container
```bash
docker stop <container-id>
```

### View Logs
```bash
docker logs <container-id>
```

### List Running Containers
```bash
docker ps
```

---

## Azure Commands

### Configure Environment Variables
```bash
az webapp config appsettings set \
  --name your-app-name \
  --resource-group your-resource-group \
  --settings \
    COSMOS_ENDPOINT="https://account.documents.azure.com:443/" \
    COSMOS_KEY="your-key" \
    COSMOS_DB_NAME="FileManagementDB" \
    COSMOS_CONTAINER_NAME="files" \
    AZURE_STORAGE_CONNECTION_STRING="your-string" \
    CONTAINER_NAME="file-uploads" \
    NODE_ENV="production" \
    PORT="8080"
```

### Deploy Docker Image
```bash
az webapp config container set \
  --name your-app-name \
  --resource-group your-resource-group \
  --docker-custom-image-name arck326/backend:latest \
  --docker-registry-server-url https://index.docker.io
```

### Restart Web App
```bash
az webapp restart \
  --name your-app-name \
  --resource-group your-resource-group
```

### Check Web App Status
```bash
az webapp show \
  --name your-app-name \
  --resource-group your-resource-group \
  --query "state"
```

### View Logs
```bash
az webapp log tail \
  --name your-app-name \
  --resource-group your-resource-group
```

### Get Web App URL
```bash
az webapp show \
  --name your-app-name \
  --resource-group your-resource-group \
  --query "defaultHostName"
```

---

## Docker Hub Commands

### Login
```bash
docker login
```

### Tag Image
```bash
docker tag file-manager-backend:latest arck326/backend:latest
```

### Push to Docker Hub
```bash
docker push arck326/backend:latest
```

---

## Testing URLs

### Local
```
Health:    http://localhost:5000/health
API Info:  http://localhost:5000/
Upload:    POST http://localhost:5000/api/files/upload
List:      GET http://localhost:5000/api/files?userId=xxx
Get:       GET http://localhost:5000/api/files/:id?userId=xxx
Delete:    DELETE http://localhost:5000/api/files/:id?userId=xxx
```

### Azure
```
Health:    https://your-app.azurewebsites.net/health
API Info:  https://your-app.azurewebsites.net/
Upload:    POST https://your-app.azurewebsites.net/api/files/upload
List:      GET https://your-app.azurewebsites.net/api/files?userId=xxx
Get:       GET https://your-app.azurewebsites.net/api/files/:id?userId=xxx
Delete:    DELETE https://your-app.azurewebsites.net/api/files/:id?userId=xxx
```

---

## Environment Variables

### Required for .env File
```env
COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_KEY=your-primary-key
COSMOS_DB_NAME=FileManagementDB
COSMOS_CONTAINER_NAME=files
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
CONTAINER_NAME=file-uploads
NODE_ENV=development
PORT=5000
```

---

## PowerShell Commands (Windows)

### Create Environment File
```powershell
Copy-Item .env.example .env
```

### Start Server
```powershell
npm start
```

### Build Docker Image
```powershell
docker build -t file-manager-backend:latest .
```

### Run Docker Container
```powershell
docker run -p 5000:5000 `
  -e COSMOS_ENDPOINT="https://account.documents.azure.com:443/" `
  -e COSMOS_KEY="your-key" `
  -e COSMOS_DB_NAME="FileManagementDB" `
  -e COSMOS_CONTAINER_NAME="files" `
  -e AZURE_STORAGE_CONNECTION_STRING="your-string" `
  -e CONTAINER_NAME="file-uploads" `
  file-manager-backend:latest
```

---

## File Locations

### Backend Root
```
backend/
```

### Source Code
```
backend/src/
backend/src/index.js
backend/src/config.js
backend/src/middleware/
backend/src/routes/
```

### Configuration
```
backend/.env.example
backend/Dockerfile
backend/.dockerignore
backend/package.json
```

### Documentation
```
backend/README.md
../AZURE_DEPLOYMENT_CHECKLIST.md
../BACKEND_READY_FOR_DEPLOYMENT.md
../00_START_HERE.md
```

---

## Troubleshooting Commands

### Check if Port 5000 is Used
```bash
# On Windows (PowerShell)
netstat -ano | findstr :5000

# On Mac/Linux
lsof -i :5000
```

### Kill Process on Port 5000
```bash
# On Windows (PowerShell)
Stop-Process -Id <PID> -Force

# On Mac/Linux
kill -9 <PID>
```

### Check Node Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Docker Hub Credentials

### Store Credentials
```bash
docker login
# Enter username: arck326
# Enter password: <your-password>
```

### Logout
```bash
docker logout
```

---

## Azure Credentials

### Get Cosmos DB Credentials
```bash
az cosmosdb keys list \
  --name your-cosmosdb-account \
  --resource-group your-resource-group
```

### Get Storage Connection String
```bash
az storage account show-connection-string \
  --name yourstorageaccount \
  --resource-group your-resource-group
```

---

## Useful Links

- Express.js Docs: https://expressjs.com/
- Azure Cosmos DB: https://docs.microsoft.com/en-us/azure/cosmos-db/
- Azure Blob Storage: https://docs.microsoft.com/en-us/azure/storage/blobs/
- Docker Docs: https://docs.docker.com/
- Node.js Docs: https://nodejs.org/docs/

---

## Quick Copy-Paste Blocks

### Local Development Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm start
```

### Docker Build & Run
```bash
docker build -t backend:latest .
docker run -p 5000:5000 \
  -e COSMOS_ENDPOINT="..." \
  -e COSMOS_KEY="..." \
  -e AZURE_STORAGE_CONNECTION_STRING="..." \
  backend:latest
```

### Azure Deployment
```bash
# 1. Set environment variables
az webapp config appsettings set \
  --name your-app-name \
  --resource-group your-resource-group \
  --settings COSMOS_ENDPOINT="..." COSMOS_KEY="..."

# 2. Deploy image
az webapp config container set \
  --name your-app-name \
  --resource-group your-resource-group \
  --docker-custom-image-name arck326/backend:latest

# 3. Verify
curl https://your-app.azurewebsites.net/health
```

---

**Last Updated:** January 2024
**Version:** 1.0.0
