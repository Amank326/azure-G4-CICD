# 🤖 FULLY AUTOMATED SETUP SCRIPT (PowerShell)
# This script will automatically configure everything!

Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🤖 AUTOMATED AZURE FILE MANAGER SETUP" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Configuration
$SUBSCRIPTION_ID = "ce176ab4-0474-47f5-bfe2-72e93937970f"
$COSMOS_ACCOUNT = "filemanagercosmos1234"
$APP_SERVICE_NAME = "file-manager-backend-app"
$RESOURCE_GROUP = "file-manager-rg"

Write-Host "Starting automated setup..." -ForegroundColor Yellow

# ========================================
# STEP 1: Get Cosmos DB Credentials
# ========================================
Write-Host "`n📍 Step 1/5: Retrieving Cosmos DB credentials..." -ForegroundColor Yellow

try {
    $cosmosInfo = az cosmosdb show --name $COSMOS_ACCOUNT --resource-group $RESOURCE_GROUP -o json | ConvertFrom-Json
    $COSMOS_ENDPOINT = $cosmosInfo.documentEndpoint
    Write-Host "✓ Got Cosmos DB Endpoint: $($COSMOS_ENDPOINT.Substring(0, 50))..." -ForegroundColor Green
}
catch {
    Write-Host "❌ Error getting Cosmos DB: $_" -ForegroundColor Red
    exit 1
}

try {
    $keysInfo = az cosmosdb keys list --name $COSMOS_ACCOUNT --resource-group $RESOURCE_GROUP --type keys -o json | ConvertFrom-Json
    $COSMOS_KEY = $keysInfo.primaryMasterKey
    if (-not $COSMOS_KEY) { $COSMOS_KEY = $keysInfo.primaryKey }
    Write-Host "✓ Got Cosmos DB Key: $($COSMOS_KEY.Substring(0, 20))..." -ForegroundColor Green
}
catch {
    Write-Host "❌ Error getting Cosmos DB keys: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# STEP 2: Get Storage Account Credentials
# ========================================
Write-Host "`n📍 Step 2/5: Retrieving Storage Account credentials..." -ForegroundColor Yellow

try {
    $storageAccounts = az storage account list --resource-group $RESOURCE_GROUP -o json | ConvertFrom-Json
    $storageAccount = $storageAccounts[0]
    $storageName = $storageAccount.name
    Write-Host "✓ Found Storage Account: $storageName" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error finding Storage Account: $_" -ForegroundColor Red
    exit 1
}

try {
    $connStrInfo = az storage account show-connection-string --name $storageName --resource-group $RESOURCE_GROUP -o json | ConvertFrom-Json
    $STORAGE_CONNECTION_STRING = $connStrInfo.connectionString
    Write-Host "✓ Got Storage Connection String: $($STORAGE_CONNECTION_STRING.Substring(0, 50))..." -ForegroundColor Green
}
catch {
    Write-Host "❌ Error getting Storage Connection String: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# STEP 3: Set Environment Variables
# ========================================
Write-Host "`n📍 Step 3/5: Setting environment variables in App Service..." -ForegroundColor Yellow

$settings = @(
    "COSMOS_ENDPOINT=$COSMOS_ENDPOINT",
    "COSMOS_KEY=$COSMOS_KEY",
    "AZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING",
    "CONTAINER_NAME=files",
    "COSMOS_DB_NAME=file-notes-db",
    "COSMOS_CONTAINER_NAME=files"
) -join " "

try {
    az webapp config appsettings set `
      --resource-group $RESOURCE_GROUP `
      --name $APP_SERVICE_NAME `
      --settings COSMOS_ENDPOINT=$COSMOS_ENDPOINT `
                 COSMOS_KEY=$COSMOS_KEY `
                 AZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING `
                 CONTAINER_NAME=files `
                 COSMOS_DB_NAME=file-notes-db `
                 COSMOS_CONTAINER_NAME=files | Out-Null
    
    Write-Host "✓ Environment variables set successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error setting environment variables: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# STEP 4: Restart App Service
# ========================================
Write-Host "`n📍 Step 4/5: Restarting App Service..." -ForegroundColor Yellow

try {
    az webapp restart --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME | Out-Null
    Write-Host "✓ App Service restarting..." -ForegroundColor Green
}
catch {
    Write-Host "❌ Error restarting App Service: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# STEP 5: Wait and Verify
# ========================================
Write-Host "`n📍 Step 5/5: Waiting for app to fully restart (60 seconds)..." -ForegroundColor Yellow

for ($i = 0; $i -lt 12; $i++) {
    Write-Host -NoNewline "`r⏳ $($i * 5) seconds elapsed..."
    Start-Sleep -Seconds 5
}
Write-Host "`r✓ Restart complete                       " -ForegroundColor Green

Write-Host "`n🔍 Verifying setup..." -ForegroundColor Yellow

$maxAttempts = 5
$attempt = 0
$success = $false

while ($attempt -lt $maxAttempts -and -not $success) {
    try {
        $response = Invoke-WebRequest -Uri "https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics" -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        
        if ($data.environment) {
            $allSet = $true
            foreach ($val in $data.environment.PSObject.Properties.Value) {
                if ($val -ne "✓") {
                    $allSet = $false
                    break
                }
            }
            
            if ($allSet) {
                Write-Host "`n" -ForegroundColor Green
                Write-Host "✅ ====================================" -ForegroundColor Green
                Write-Host "✅  SETUP COMPLETE! SUCCESS!" -ForegroundColor Green
                Write-Host "✅ ====================================" -ForegroundColor Green
                Write-Host "`n📊 Verification Results:" -ForegroundColor Green
                foreach ($prop in $data.environment.PSObject.Properties) {
                    Write-Host "  ✓ $($prop.Name): $($prop.Value)" -ForegroundColor Green
                }
                
                Write-Host "`n🎉 Your backend is now fully configured!" -ForegroundColor Green
                Write-Host "🚀 You can now upload files without errors!" -ForegroundColor Green
                Write-Host "`n🧪 Test it:" -ForegroundColor Cyan
                Write-Host "   1. Go to: https://file-manager-frontend-app.azurewebsites.net" -ForegroundColor Cyan
                Write-Host "   2. Select a file and upload" -ForegroundColor Cyan
                Write-Host "   3. File should upload successfully! ✅" -ForegroundColor Cyan
                
                $success = $true
            }
        }
    }
    catch {
        $attempt++
        if ($attempt -lt $maxAttempts) {
            Write-Host "⏳ Checking again in 10 seconds... (Attempt $attempt/$maxAttempts)" -ForegroundColor Yellow
            Start-Sleep -Seconds 10
        }
    }
}

if (-not $success) {
    Write-Host "`n⚠️  Could not fully verify setup, but settings have been applied!" -ForegroundColor Yellow
    Write-Host "⏳ Wait 2-3 more minutes and check manually:" -ForegroundColor Yellow
    Write-Host "   https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics" -ForegroundColor Cyan
}

Write-Host "`n═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
