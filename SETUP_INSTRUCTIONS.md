# 🚀 Complete Setup Instructions

## Step 1: Create Docker Hub Account (if you don't have one)
1. Go to https://hub.docker.com/
2. Sign up for free account
3. Note your username (e.g., `your-username`)

## Step 2: Push Images to Docker Hub

### Option A: Manual Push (Recommended for first time)

```powershell
# Login to Docker Hub
docker login

# When prompted:
# Username: <your-docker-hub-username>
# Password: <your-docker-hub-password>

# Tag your images
docker tag azureg4cicd-backend:latest <your-username>/azureg4cicd-backend:latest
docker tag azureg4cicd-frontend:latest <your-username>/azureg4cicd-frontend:latest

# Push to Docker Hub
docker push <your-username>/azureg4cicd-backend:latest
docker push <your-username>/azureg4cicd-frontend:latest
```

### Option B: Automated (via GitHub Actions)
GitHub Actions will handle tagging and pushing automatically when you push to main/develop branch.

---

## Step 3: Update GitHub Secrets

Go to: **Your GitHub Repo → Settings → Secrets and variables → Actions**

Add these secrets:
- `DOCKERHUB_USERNAME` - Your Docker Hub username
- `DOCKERHUB_TOKEN` - Your Docker Hub access token
- `DOCKERHUB_PASSWORD` - Your Docker Hub password

---

## Step 4: GitHub Secrets Setup Details

### Get Docker Hub Token:
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Name: `github-actions`
4. Copy the token
5. Add as `DOCKERHUB_TOKEN` secret

### GitHub Secrets Format:
```
DOCKERHUB_USERNAME = your-username
DOCKERHUB_PASSWORD = your-docker-password-or-token
DOCKERHUB_TOKEN = your-access-token
DOCKER_REGISTRY_URL = docker.io
```

---

## Step 5: Azure Secrets

Add these for Azure deployment:
- `AZURE_SUBSCRIPTION_ID` - Your Azure subscription ID
- `AZURE_RESOURCE_GROUP` - Your resource group name
- `AZURE_CREDENTIALS` - Your Azure service principal

---

## Step 6: Verify Setup

```bash
# Check containers are running
docker ps

# Check images are built
docker images | grep azureg4cicd

# Test endpoints
curl http://localhost:5000/health
curl http://localhost/
```

---

## What Gets Deployed?

✅ Docker images pushed to Docker Hub  
✅ GitHub Actions CI/CD automated  
✅ Images tagged with git commit SHA  
✅ Ready for production deployment  

---

## Troubleshooting

**Issue**: `docker login` fails
- Solution: Check Docker Hub credentials

**Issue**: Push fails
- Solution: Check internet connection, Docker Hub quota

**Issue**: Images not appearing on Docker Hub
- Solution: Wait 30 seconds, refresh page, verify push completed

---

## Next Steps

1. Complete Docker Hub setup
2. Add GitHub Secrets
3. Push code to GitHub
4. GitHub Actions will automatically build and push

---

**Questions?** Check Docker docs at https://docs.docker.com/
