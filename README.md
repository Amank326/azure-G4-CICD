# Azure G4 CICD - Docker Build & Deployment

Advanced GitHub Actions CI/CD pipeline with automated Docker image builds and deployments.

## Overview

This project implements a production-ready Docker containerization and CI/CD solution using:
- **GitHub Actions** for automated builds
- **Docker Buildx** for multi-platform image building
- **Docker Hub** for image registry
- **Trivy** for security scanning
- **Kubernetes** for orchestration (optional)

## Quick Start

### Prerequisites
- Docker (for local development)
- GitHub account with repository access
- Docker Hub account with credentials

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# - COSMOS_ENDPOINT: Azure Cosmos DB endpoint
# - COSMOS_KEY: Azure Cosmos DB primary key
# - AZURE_STORAGE_CONNECTION_STRING: Azure Storage connection string
```

### Local Development

```bash
# Build and run locally with Docker Compose
docker-compose up --build

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Nginx: http://localhost:80
```

## Architecture

```
.
├── backend/
│   ├── Dockerfile          (Node.js 16-Alpine)
│   ├── package.json
│   └── src/
│       ├── index.js
│       └── routes/
├── frontend/
│   ├── Dockerfile          (Node 18-Alpine → Nginx)
│   ├── package.json
│   └── src/
│       ├── App.js
│       └── components/
├── nginx/
│   └── default.conf        (Reverse proxy config)
├── k8s/
│   └── deployment.yaml     (Kubernetes manifests)
├── docker-compose.yml      (Local development)
└── .github/
    └── workflows/
        └── docker-build-push-advanced.yml
```

## CI/CD Pipeline

### Automated GitHub Actions Workflow

Triggers on push to `main` or `develop` branches:

1. **Setup & Validate** - Validate Dockerfiles, generate build metadata
2. **Build Backend** - Build Node.js backend image
3. **Build Frontend** - Build React app with Nginx serving
4. **Security Scan** - Run Trivy vulnerability scans
5. **Build Summary** - Generate and report results

### Docker Images

**Backend**
- Registry: `docker.io/756191/azure-g4-cicd-backend`
- Base: `node:16-alpine`
- Port: `5000`
- Includes health checks

**Frontend**
- Registry: `docker.io/756191/azure-g4-cicd-frontend`
- Build: `node:18-alpine` → Serve: `nginx:stable-alpine`
- Port: `80`
- Multi-stage optimized image

### Image Tags

Each build generates multiple tags:
- `:latest` - Latest main branch build
- `:main` - Current main branch
- `:develop` - Current develop branch
- `:COMMIT_SHA` - Specific commit version
- `:DATE_TIME` - Build timestamp

## Deployment

### Docker Compose (Development)

```bash
docker-compose up -d
docker-compose down
```

### Kubernetes (Production)

```bash
kubectl apply -f k8s/deployment.yaml
kubectl get pods
kubectl logs <pod-name>
```

## Configuration

### Environment Variables

See `.env.example` for all available options:

```env
# Azure Cosmos DB
COSMOS_ENDPOINT=https://<account>.documents.azure.com:443/
COSMOS_KEY=<primary-key>

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
```

### Docker Credentials

GitHub Secrets configured:
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token

## Security

- ✅ Multi-stage Docker builds (optimized size)
- ✅ Alpine base images (reduced attack surface)
- ✅ Trivy security scanning on all images
- ✅ No secrets in images (using env vars)
- ✅ Health checks on all containers
- ✅ Layer caching with GitHub Actions

## Monitoring & Logs

### GitHub Actions
- View workflow runs: GitHub Actions tab
- Live logs: Click on workflow run
- Artifacts: Build summary reports

### Container Logs

```bash
# Docker Compose
docker-compose logs -f backend
docker-compose logs -f frontend

# Kubernetes
kubectl logs -f <pod-name>
kubectl describe pod <pod-name>
```

## Troubleshooting

### Build Failures
1. Check GitHub Actions logs
2. Verify Docker credentials in secrets
3. Validate Dockerfile syntax
4. Check resource limits

### Image Not Pushing
- Confirm Docker Hub credentials
- Check network connectivity
- Verify token hasn't expired

### Container Won't Start
- Check environment variables
- Review container logs
- Verify port bindings
- Check health check configuration

## Contributing

1. Create feature branch from `develop`
2. Make changes and commit
3. Push to GitHub (triggers CI/CD)
4. Monitor Actions tab
5. Merge to `main` when ready for production

## License

MIT

## Support

For issues or questions, check:
- GitHub Actions logs
- Container logs
- Kubernetes events (if deployed to K8s)
