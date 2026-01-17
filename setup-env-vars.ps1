# 🔧 Azure App Service Environment Variable Setup Script (PowerShell)
# This script sets all required environment variables for the backend App Service

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Azure App Service Environment Variables Setup" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Configuration
$RESOURCE_GROUP = "file-manager-rg"  # Change if different
$APP_NAME = "file-manager-backend-app"

Write-Host "`n⚠️  IMPORTANT: Get these values from Azure Portal:" -ForegroundColor Yellow
Write-Host "  - COSMOS_ENDPOINT: From Azure Cosmos DB > Keys" -ForegroundColor Yellow
Write-Host "  - COSMOS_KEY: From Azure Cosmos DB > Keys (Primary Key)" -ForegroundColor Yellow
Write-Host "  - STORAGE_CONNECTION_STRING: From Storage Account > Access Keys" -ForegroundColor Yellow
Write-Host ""

# Prompt for values
$COSMOS_ENDPOINT = Read-Host "Enter COSMOS_ENDPOINT (https://...)"
$COSMOS_KEY = Read-Host "Enter COSMOS_KEY"
$STORAGE_STRING = Read-Host "Enter AZURE_STORAGE_CONNECTION_STRING"
$CONTAINER_NAME = Read-Host "Enter CONTAINER_NAME (or press Enter for 'files')"
if ([string]::IsNullOrWhiteSpace($CONTAINER_NAME)) { $CONTAINER_NAME = "files" }

Write-Host "`n🚀 Setting environment variables in App Service: $APP_NAME" -ForegroundColor Yellow

# Verify Azure login
try {
    $currentContext = az account show 2>$null
    if (-not $currentContext) {
        Write-Host "`n❌ Not logged into Azure. Running 'az login'..." -ForegroundColor Red
        az login
    }
} catch {
    Write-Host "❌ Azure CLI not found. Install Azure CLI first: https://learn.microsoft.com/cli/azure/install-azure-cli" -ForegroundColor Red
    exit 1
}

# Set environment variables
Write-Host "`n1. Setting COSMOS_ENDPOINT..." -ForegroundColor Yellow
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings COSMOS_ENDPOINT=$COSMOS_ENDPOINT | Out-Null

Write-Host "✓ COSMOS_ENDPOINT set" -ForegroundColor Green

Write-Host "`n2. Setting COSMOS_KEY..." -ForegroundColor Yellow
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings COSMOS_KEY=$COSMOS_KEY | Out-Null

Write-Host "✓ COSMOS_KEY set" -ForegroundColor Green

Write-Host "`n3. Setting AZURE_STORAGE_CONNECTION_STRING..." -ForegroundColor Yellow
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings AZURE_STORAGE_CONNECTION_STRING=$STORAGE_STRING | Out-Null

Write-Host "✓ AZURE_STORAGE_CONNECTION_STRING set" -ForegroundColor Green

Write-Host "`n4. Setting CONTAINER_NAME..." -ForegroundColor Yellow
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings CONTAINER_NAME=$CONTAINER_NAME | Out-Null

Write-Host "✓ CONTAINER_NAME set" -ForegroundColor Green

Write-Host "`n5. Setting COSMOS_DB_NAME..." -ForegroundColor Yellow
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings COSMOS_DB_NAME="file-notes-db" | Out-Null

Write-Host "✓ COSMOS_DB_NAME set" -ForegroundColor Green

Write-Host "`n6. Setting COSMOS_CONTAINER_NAME..." -ForegroundColor Yellow
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings COSMOS_CONTAINER_NAME="files" | Out-Null

Write-Host "✓ COSMOS_CONTAINER_NAME set" -ForegroundColor Green

Write-Host "`n7. Restarting App Service to apply changes..." -ForegroundColor Yellow
az webapp restart `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME

Write-Host "`n" -ForegroundColor Green
Write-Host "✅ All environment variables set successfully!" -ForegroundColor Green
Write-Host "✅ App Service restarted." -ForegroundColor Green
Write-Host "`n" -ForegroundColor Cyan
Write-Host "🧪 Verify by visiting:" -ForegroundColor Cyan
Write-Host "   https://$APP_NAME.azurewebsites.net/api/files/diagnostics" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
