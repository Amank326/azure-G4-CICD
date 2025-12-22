#!/usr/bin/env pwsh
# Complete Rebuild and Deploy Script

Write-Host "🚀 Complete Build and Deploy Pipeline" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$projectRoot = "c:\Users\amank\OneDrive\Desktop\azure G4 CICD"
cd $projectRoot

# ============================================
# STEP 1: Build Frontend
# ============================================
Write-Host "`n1️⃣ Building Frontend..." -ForegroundColor Yellow
cd "$projectRoot\frontend"

# Remove old build
if (Test-Path "build") {
    Write-Host "  Removing old build folder..."
    Remove-Item -Recurse -Force "build"
}

# Build
Write-Host "  Running npm run build..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend build complete" -ForegroundColor Green

# ============================================
# STEP 2: Build Backend Docker Image
# ============================================
Write-Host "`n2️⃣ Building Backend Docker Image..." -ForegroundColor Yellow
cd $projectRoot

Write-Host "  Building docker image: arck326/backend:latest"
docker build -f backend/Dockerfile -t arck326/backend:latest ./backend

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend Docker image built" -ForegroundColor Green

# ============================================
# STEP 3: Push Backend to Docker Hub
# ============================================
Write-Host "`n3️⃣ Pushing Backend to Docker Hub..." -ForegroundColor Yellow

Write-Host "  Pushing: docker push arck326/backend:latest"
docker push arck326/backend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend Docker push failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend Docker image pushed" -ForegroundColor Green

# ============================================
# STEP 4: Build Frontend Docker Image
# ============================================
Write-Host "`n4️⃣ Building Frontend Docker Image..." -ForegroundColor Yellow

Write-Host "  Building docker image: arck326/frontend:latest"
docker build -f frontend/Dockerfile -t arck326/frontend:latest ./frontend

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend Docker image built" -ForegroundColor Green

# ============================================
# STEP 5: Push Frontend to Docker Hub
# ============================================
Write-Host "`n5️⃣ Pushing Frontend to Docker Hub..." -ForegroundColor Yellow

Write-Host "  Pushing: docker push arck326/frontend:latest"
docker push arck326/frontend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend Docker push failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend Docker image pushed" -ForegroundColor Green

# ============================================
# STEP 6: Restart Azure App Services
# ============================================
Write-Host "`n6️⃣ Restarting Azure App Services..." -ForegroundColor Yellow

Write-Host "  Restarting backend app..."
az webapp restart --name file-manager-backend-app --resource-group file-manager-rg

Write-Host "  Restarting frontend app..."
az webapp restart --name file-manager-frontend-app --resource-group file-manager-rg

Write-Host "✅ Apps restarted" -ForegroundColor Green

# ============================================
# STEP 7: Test Deployment
# ============================================
Write-Host "`n7️⃣ Testing Deployment..." -ForegroundColor Yellow

Write-Host "  Waiting 30 seconds for apps to start..."
Start-Sleep -Seconds 30

Write-Host "  Testing backend health endpoint..."
try {
    $healthResponse = Invoke-WebRequest -Uri "https://file-manager-backend-app.azurewebsites.net/api/health" `
        -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ Backend is healthy (200)" -ForegroundColor Green
        Write-Host "   Response: $($healthResponse.Content)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️ Backend returned: $($healthResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "  Testing frontend..."
try {
    $frontendResponse = Invoke-WebRequest -Uri "https://file-manager-frontend-app.azurewebsites.net" `
        -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running (200)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Frontend returned: $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Frontend check failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# ============================================
# FINAL SUMMARY
# ============================================
Write-Host "`n✨ Deployment Complete! ✨" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "`nWebsite URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: https://file-manager-frontend-app.azurewebsites.net" 
Write-Host "  Backend API: https://file-manager-backend-app.azurewebsites.net/api/health"
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "  1. Open website on any device"
Write-Host "  2. Try uploading a file"
Write-Host "  3. Check browser console (F12) for logs"
Write-Host "  4. Check backend logs with: az webapp log tail --name file-manager-backend-app --resource-group file-manager-rg"
