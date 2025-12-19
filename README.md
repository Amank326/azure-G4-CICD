# Cloud File & Notes Management System

A modern, cloud-based application that allows users to upload files with attached notes or descriptions. Files are securely stored in cloud storage, and metadata is maintained in a distributed database. This project demonstrates integration with Azure services, containerization with Docker, and CI/CD automation with GitHub Actions.

## Features

✅ **File Upload & Management**
- Upload multiple file types (PDF, images, text, documents)
- Secure cloud storage in Azure Blob Storage
- File metadata tracking with timestamps

✅ **Notes & Descriptions**
- Add and edit descriptions/notes for each file
- Update notes without re-uploading files
- Full metadata persistence in Azure Cosmos DB

✅ **File Operations**
- View list of all uploaded files with details
- Download files with single click
- Delete files (removes from both storage and database)
- File size and upload time information

✅ **Cloud Infrastructure**
- Azure Blob Storage for scalable file storage
- Azure Cosmos DB (SQL API) for metadata management
- Docker containerization for all services
- NGINX reverse proxy and load balancing
- Multi-container orchestration with Docker Compose

✅ **CI/CD & Deployment**
- GitHub Actions automated pipelines
- Docker Hub image registry integration
- Automated build and push on code changes
- One-click Azure deployment
- Container health checks and monitoring

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Node.js + Express |
| **Frontend** | React 18 |
| **Database** | Azure Cosmos DB (SQL API) |
| **Storage** | Azure Blob Storage |
| **Containerization** | Docker & Docker Compose |
| **Reverse Proxy** | NGINX |
| **CI/CD** | GitHub Actions |
| **Cloud Deployment** | Microsoft Azure |

## Prerequisites

Before getting started, ensure you have:

- **Docker** and **Docker Compose** installed
- **Node.js 16+** (for local development)
- **Azure Account** with:
  - Cosmos DB (SQL API) instance
  - Blob Storage account
  - Container Registry or Docker Hub account
- **GitHub Account** with repository access
- **Git** for version control

## Quick Start - Local Development

### 1. Azure Setup

Create the required Azure resources:

#### Azure Cosmos DB (SQL API)
1. Go to Azure Portal → Create resource → Azure Cosmos DB
2. Select SQL API
3. Create a database named `file-notes-db`
4. Create a container named `files` with partition key `/id`

#### Azure Blob Storage
1. Go to Azure Portal → Create resource → Storage Account
2. Create a container named `files` with private access level

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Azure credentials
# Update these values:
# - COSMOS_ENDPOINT: From Cosmos DB account → Keys
# - COSMOS_KEY: From Cosmos DB account → Keys (Primary Key)
# - AZURE_STORAGE_CONNECTION_STRING: From Storage Account → Access keys
```

### 3. Start Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- NGINX: http://localhost

## API Endpoints

### Get All Files
```
GET /api/files
Response: Array of file objects
```

### Upload File
```
POST /api/files
Content-Type: multipart/form-data
Parameters:
  - file: File object
  - notes: String (optional)
Response: Created file object with id
```

### Get/Download File
```
GET /api/files/:fileId
Response: File binary data
```

### Update File Notes
```
PUT /api/files/:fileId
Content-Type: application/json
Body: { "notes": "Updated notes" }
Response: Updated file object
```

### Delete File
```
DELETE /api/files/:fileId
Response: { "message": "File deleted successfully" }
```

## GitHub Actions CI/CD Setup

### 1. Add GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:

```
DOCKER_HUB_USERNAME        # Your Docker Hub username
DOCKER_HUB_TOKEN          # Docker Hub access token
AZURE_CREDENTIALS         # Azure service principal credentials
AZURE_WEBAPP_NAME         # Azure Web App name (optional)
AZURE_RESOURCE_GROUP      # Azure resource group name
COSMOS_ENDPOINT           # Cosmos DB endpoint
COSMOS_KEY                # Cosmos DB primary key
AZURE_STORAGE_CONNECTION_STRING  # Storage connection string
```

### 2. Get Azure Credentials

```bash
az ad sp create-for-rbac --name "file-manager-sp" --role Contributor \
  --scopes /subscriptions/<subscription-id>
```

Copy the JSON output as `AZURE_CREDENTIALS` secret.

## Deployment to Azure

### Option 1: Container Instances (Easiest)

```bash
# Create resource group
az group create --name file-manager-rg --location eastus

# Deploy
az container create \
  --resource-group file-manager-rg \
  --name file-manager-app \
  --image-registry-login-username <docker-username> \
  --image-registry-login-password <docker-token> \
  --compose-file docker-compose.yml \
  --environment-variables \
    COSMOS_ENDPOINT=<your-endpoint> \
    COSMOS_KEY=<your-key> \
    AZURE_STORAGE_CONNECTION_STRING=<connection-string> \
  --ports 80 443 5000
```

### Option 2: App Service

```bash
# Create App Service Plan
az appservice plan create \
  --name file-manager-plan \
  --resource-group file-manager-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name file-manager-app \
  --plan file-manager-plan \
  --resource-group file-manager-rg
```

### Option 3: Kubernetes (AKS)

```bash
# Create AKS cluster
az aks create \
  --name file-manager-aks \
  --resource-group file-manager-rg \
  --node-count 3 \
  --enable-managed-identity
```

## Development

### Backend Development

```bash
cd backend
npm install
npm run dev    # Starts with nodemon
```

### Frontend Development

```bash
cd frontend
npm install
npm start      # Starts React dev server
```

### Docker Commands

```bash
# Build specific service
docker-compose build backend

# View logs
docker-compose logs backend -f

# Execute command in container
docker-compose exec backend npm run dev

# Rebuild and restart
docker-compose up -d --build
```

## Project Structure

```
.
├── .github/workflows/
│   ├── build-and-push.yml      # Build and push Docker images
│   └── deploy-to-azure.yml     # Deploy to Azure
├── backend/
│   ├── src/
│   │   ├── index.js            # Express server setup
│   │   └── routes/files.js     # File endpoints
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.js   # Upload form component
│   │   │   └── FileList.js     # File list display component
│   │   ├── App.js
│   │   └── App.css
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   └── default.conf            # Reverse proxy configuration
├── docker-compose.yml          # Multi-container orchestration
├── .env.example                # Environment variables template
└── README.md
```

## Troubleshooting

### Backend Connection Issues

```bash
# Check if backend is running
curl http://localhost:5000/api

# View logs
docker-compose logs backend
```

### Azure Authentication Errors

```bash
# Verify credentials in .env
docker-compose exec backend env | grep AZURE

# Test connectivity
az login
az cosmosdb list --output table
```

### File Upload Failures

```bash
# Check container permissions
az storage container show-permission --name files --account-name <storage-name>

# Verify database
az cosmosdb sql database list --account-name <db-name> --resource-group <rg-name>
```

## Performance Tips

- Enable CDN for Blob Storage for faster downloads
- Use Cosmos DB auto-scale for variable workloads
- Enable container image caching in GitHub Actions
- Use appropriate Azure storage tier (Hot/Cool)

## Security Best Practices

✅ Implemented:
- Environment-based credential management
- HTTPS support with NGINX
- Blob Storage authentication
- Cosmos DB connection strings

⚠️ Recommended:
- Add JWT authentication to API endpoints
- Enable Azure AD integration
- Implement rate limiting
- Add input validation and sanitization
- Implement audit logging

## Monitoring

```bash
# Stream logs from Container Instances
az container logs --name file-manager-app \
  --resource-group file-manager-rg \
  --follow

# Export logs
az container logs --name file-manager-app \
  --resource-group file-manager-rg > logs.txt
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/feature-name`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review Azure documentation
- Open an issue on GitHub

## Resources

- [Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)

