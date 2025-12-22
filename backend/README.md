# Cloud File & Notes Management System - Backend

Production-ready Node.js + Express backend with Azure integration for file and notes management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Azure Setup](#azure-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

## ✨ Features

- **File Upload Management**: Upload files with metadata to Azure Blob Storage
- **Cloud Database**: Store metadata in Azure Cosmos DB for fast retrieval
- **User-Scoped Access**: Isolated file management per user
- **RESTful API**: Clean, modern API design with proper error handling
- **Middleware Architecture**: Modular validation and error handling
- **Production-Ready**: Comprehensive logging, error handling, and security
- **Docker Support**: Containerized for easy deployment
- **Azure Integration**: Seamless integration with Azure services

## 🛠 Tech Stack

**Runtime & Framework:**
- Node.js v16+
- Express.js v4.17+

**Cloud Services:**
- Azure Cosmos DB (NoSQL Database)
- Azure Blob Storage (File Storage)
- Azure App Service (Deployment)

**Dependencies:**
- `@azure/cosmos` - Cosmos DB SDK
- `@azure/storage-blob` - Blob Storage SDK
- `multer` - File upload handling
- `cors` - Cross-origin requests
- `dotenv` - Environment variable management
- `uuid` - Unique ID generation
- `express` - Web framework

## 📦 Prerequisites

### For Local Development
- Node.js v16+ installed
- npm or yarn package manager
- Azure subscription with:
  - Cosmos DB account created
  - Storage Account created with a blob container
- Docker (optional, for containerized testing)

### Azure Credentials
Ensure you have:
1. **Cosmos DB Connection String**
   - Endpoint URL
   - Primary Key
   - Database Name
   - Container Name

2. **Azure Storage Connection String**
   - Storage Account Name
   - Storage Account Key
   - Blob Container Name

## 🚀 Local Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your Azure credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Azure credentials:
```env
# Azure Cosmos DB
COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_KEY=your-primary-key
COSMOS_DB_NAME=FileManagementDB
COSMOS_CONTAINER_NAME=files

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
CONTAINER_NAME=file-uploads

# Server
NODE_ENV=development
PORT=5000
```

### 4. Start Development Server
```bash
npm start
```

You should see:
```
==================================================
✅ Server is running on port 5000
📍 Local: http://localhost:5000
==================================================

Verifying Azure connections...
✅ Successfully connected to Azure Cosmos DB
✅ Successfully connected to Azure Blob Storage
```

### 5. Test the Health Endpoint
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "File Management API",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 5.123
}
```

## ☁️ Azure Setup

### 1. Create Azure Cosmos DB (if not already created)

```bash
# Using Azure Portal or CLI
az cosmosdb create \
  --name your-cosmosdb-account \
  --resource-group your-resource-group \
  --kind GlobalDocumentDB

# Create database
az cosmosdb sql database create \
  --account-name your-cosmosdb-account \
  --resource-group your-resource-group \
  --name FileManagementDB

# Create container
az cosmosdb sql container create \
  --account-name your-cosmosdb-account \
  --resource-group your-resource-group \
  --database-name FileManagementDB \
  --name files \
  --partition-key-path "/userId"
```

### 2. Create Azure Storage Account (if not already created)

```bash
# Create storage account
az storage account create \
  --name yourstorageaccount \
  --resource-group your-resource-group \
  --location eastus

# Create blob container
az storage container create \
  --name file-uploads \
  --account-name yourstorageaccount
```

### 3. Get Connection Strings

**For Cosmos DB:**
```bash
az cosmosdb keys list \
  --name your-cosmosdb-account \
  --resource-group your-resource-group
```

**For Blob Storage:**
```bash
az storage account show-connection-string \
  --name yourstorageaccount \
  --resource-group your-resource-group
```

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://your-app.azurewebsites.net`

### Endpoints

#### 1. Health Check
Check if the API is running and connected to Azure services.

**Request:**
```
GET /health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "File Management API",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

#### 2. Upload File
Upload a file with metadata to Azure storage.

**Request:**
```
POST /api/files/upload
Content-Type: multipart/form-data

Body:
- file: <binary file>
- userId: "user123" (required)
- description: "My document" (optional)
- tags: "important,work" (optional)
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fileName": "document.pdf",
  "fileSize": 1024500,
  "mimeType": "application/pdf",
  "uploadedAt": "2024-01-15T10:30:00.000Z",
  "blobUrl": "https://yourstorageaccount.blob.core.windows.net/file-uploads/user123/550e8400..."
}
```

**Error (400 Bad Request):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "File size exceeds maximum limit of 100MB",
    "details": { "fileSize": 157286400 }
  }
}
```

#### 3. List Files
Get all files for a specific user.

**Request:**
```
GET /api/files?userId=user123
```

**Response (200 OK):**
```json
{
  "count": 2,
  "files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "fileName": "document.pdf",
      "fileSize": 1024500,
      "mimeType": "application/pdf",
      "uploadedAt": "2024-01-15T10:30:00.000Z",
      "blobUrl": "https://yourstorageaccount.blob.core.windows.net/...",
      "description": "Important document",
      "tags": ["important", "work"]
    }
  ]
}
```

#### 4. Get File Details
Retrieve metadata for a specific file.

**Request:**
```
GET /api/files/:id?userId=user123
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fileName": "document.pdf",
  "fileSize": 1024500,
  "mimeType": "application/pdf",
  "uploadedAt": "2024-01-15T10:30:00.000Z",
  "blobUrl": "https://yourstorageaccount.blob.core.windows.net/...",
  "description": "Important document",
  "tags": ["important", "work"]
}
```

**Error (404 Not Found):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "File not found",
    "fileId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### 5. Delete File
Delete a file from both blob storage and database.

**Request:**
```
DELETE /api/files/:id?userId=user123
```

**Response (200 OK):**
```json
{
  "message": "File deleted successfully",
  "deletedFile": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fileName": "document.pdf"
  }
}
```

### Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` (400) - Invalid input
- `NOT_FOUND` (404) - Resource not found
- `SERVER_ERROR` (500) - Internal server error
- `SERVICE_UNAVAILABLE` (503) - Azure service unavailable

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t file-manager-backend:latest .
```

### Run Docker Container
```bash
docker run -p 5000:5000 \
  -e COSMOS_ENDPOINT="your-endpoint" \
  -e COSMOS_KEY="your-key" \
  -e COSMOS_DB_NAME="FileManagementDB" \
  -e COSMOS_CONTAINER_NAME="files" \
  -e AZURE_STORAGE_CONNECTION_STRING="your-connection-string" \
  -e CONTAINER_NAME="file-uploads" \
  file-manager-backend:latest
```

### Using Docker Compose
```bash
docker-compose up -d
```

The backend will be available at `http://localhost:5000`

## 🚢 Azure Web App Deployment

### Prerequisites
- Azure Web App created (Linux container)
- Docker image pushed to Docker Hub (arck326/backend:latest)
- Environment variables configured in App Service

### Configure Environment Variables in Azure

1. Go to **Azure Portal** → Your Web App
2. Settings → **Configuration** → **Application settings**
3. Add the following environment variables:

```
COSMOS_ENDPOINT = https://your-account.documents.azure.com:443/
COSMOS_KEY = your-primary-key
COSMOS_DB_NAME = FileManagementDB
COSMOS_CONTAINER_NAME = files
AZURE_STORAGE_CONNECTION_STRING = DefaultEndpointsProtocol=https;...
CONTAINER_NAME = file-uploads
NODE_ENV = production
PORT = 8080
```

### Deploy to Azure

**Option 1: Using Docker Image (Recommended)**

1. Configure Web App for Docker
   ```bash
   az webapp config container set \
     --name your-app-name \
     --resource-group your-resource-group \
     --docker-custom-image-name arck326/backend:latest \
     --docker-registry-server-url https://index.docker.io \
     --docker-registry-server-user your-docker-username \
     --docker-registry-server-password your-docker-password
   ```

2. Restart the Web App
   ```bash
   az webapp restart \
     --name your-app-name \
     --resource-group your-resource-group
   ```

**Option 2: Using GitHub Actions CI/CD**

The CI/CD pipeline automatically:
1. Builds Docker image from source
2. Pushes to Docker Hub
3. Deploys to Azure Web App

Just push your code to the main branch:
```bash
git add .
git commit -m "Implement production backend"
git push origin main
```

### Verify Deployment

```bash
# Health check
curl https://your-app.azurewebsites.net/health

# API info
curl https://your-app.azurewebsites.net/
```

## 📋 Project Structure

```
backend/
├── src/
│   ├── index.js                 # Main Express server
│   ├── config.js                # Azure service clients
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling & async wrapper
│   │   └── validation.js        # Input validation
│   └── routes/
│       └── files.js             # File management endpoints
├── Dockerfile                   # Docker configuration
├── package.json                 # Dependencies & scripts
├── .env.example                 # Environment variables template
├── .dockerignore                # Docker ignore patterns
└── README.md                    # This file
```

## 🔍 Troubleshooting

### Connection to Cosmos DB Fails

**Error:** `Error connecting to Cosmos DB: Invalid credentials`

**Solution:**
1. Verify COSMOS_ENDPOINT format: `https://account.documents.azure.com:443/`
2. Verify COSMOS_KEY is correct (primary key, not secondary)
3. Check network access - ensure your IP is allowed

### Connection to Blob Storage Fails

**Error:** `Error connecting to Blob Storage: Authentication failed`

**Solution:**
1. Verify AZURE_STORAGE_CONNECTION_STRING format
2. Ensure container CONTAINER_NAME exists
3. Verify storage account access key hasn't been rotated

### File Upload Fails with 413 Payload Too Large

**Solution:**
1. Check MAX_FILE_SIZE environment variable
2. Increase nginx body limit if behind a proxy
3. Azure Blob Storage max file size is 4.75TB, so this is unlikely

### "No databases found" Error

**Error:** `ENOTFOUND your-cosmos-db-account.documents.azure.com`

**Solution:**
1. Verify COSMOS_ENDPOINT is accessible from your network
2. Check Azure Cosmos DB firewall settings
3. Ensure database and container are created

### Port Already in Use

**Error:** `Error: listen EADDRINUSE :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=5001 npm start
```

## 📊 Monitoring

### View Logs
```bash
# Local development
npm start

# Docker container
docker logs <container-id>

# Azure Web App
az webapp log tail --name your-app-name --resource-group your-resource-group
```

### Check Azure Metrics

1. Go to Azure Portal → Cosmos DB Account → Metrics
2. Monitor:
   - Request Unit (RU) consumption
   - Data size
   - Document count

3. Go to Azure Portal → Storage Account → Metrics
4. Monitor:
   - Blob count
   - Data ingress/egress
   - Transactions

## 🔐 Security Best Practices

1. **Never commit `.env` file** - Use `.env.example` as template
2. **Rotate credentials regularly** - Update keys in Azure Portal
3. **Use managed identities** - Consider Azure Managed Identity instead of connection strings
4. **Validate all inputs** - This is already implemented via middleware
5. **Use HTTPS only** - Enable HTTPS-only in Azure Web App
6. **Implement rate limiting** - Add rate limiting middleware for production
7. **Enable CORS carefully** - Whitelist specific origins

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test locally
4. Commit with descriptive messages
5. Push to GitHub
6. Create Pull Request

## 📝 License

This project is part of the Cloud File & Notes Management System.

## 🆘 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review Azure documentation
3. Check application logs
4. Contact the development team

---

**Last Updated:** January 2024
**Version:** 1.0.0
**Maintained By:** Development Team
