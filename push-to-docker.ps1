# Quick setup script to push images to Docker Hub (Windows PowerShell)

$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"

Write-Host "🚀 Docker Hub Setup Script" -ForegroundColor Green
Write-Host ""
Write-Host "Enter your Docker Hub username:" -ForegroundColor Cyan
$USERNAME = Read-Host

Write-Host ""
Write-Host "Logging in to Docker Hub..." -ForegroundColor Yellow
docker login -u $USERNAME

Write-Host ""
Write-Host "Tagging images..." -ForegroundColor Yellow
docker tag azureg4cicd-backend:latest "$USERNAME/azureg4cicd-backend:latest"
docker tag azureg4cicd-frontend:latest "$USERNAME/azureg4cicd-frontend:latest"

Write-Host ""
Write-Host "Pushing Backend image..." -ForegroundColor Yellow
docker push "$USERNAME/azureg4cicd-backend:latest"

Write-Host ""
Write-Host "Pushing Frontend image..." -ForegroundColor Yellow
docker push "$USERNAME/azureg4cicd-frontend:latest"

Write-Host ""
Write-Host "✅ Images pushed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Update GitHub Secrets with:" -ForegroundColor Cyan
Write-Host "  DOCKERHUB_USERNAME: $USERNAME" -ForegroundColor White
Write-Host "  DOCKERHUB_TOKEN: <your-access-token>" -ForegroundColor White
Write-Host ""
Write-Host "Get your token from: https://hub.docker.com/settings/security" -ForegroundColor Yellow
