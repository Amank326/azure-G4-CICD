#!/usr/bin/env pwsh
<#
Direct Kudu upload - Manually push app-simple.js to Azure
#>

$appName = "file-manager-backend-app"
$rg = "file-manager-rg"
$localFile = "C:\Users\amank\OneDrive\Desktop\azure G4 CICD\backend\src\app-simple.js"

Write-Host "Getting publishing credentials..." -ForegroundColor Yellow

$creds = az webapp deployment list-publishing-credentials -n $appName -g $rg --query "{username:publishingUserName, password:publishingPassword}" | ConvertFrom-Json

if (-not $creds -or -not $creds.username) {
    Write-Host "❌ Could not get credentials" -ForegroundColor Red
    exit 1
}

$username = $creds.username
$password = $creds.password

Write-Host "✅ Got credentials" -ForegroundColor Green
Write-Host "Uploading $localFile to Azure Kudu..." -ForegroundColor Yellow

$kuduUrl = "https://$appName.scm.azurewebsites.net/api/vfs/site/wwwroot/src/app-simple.js"

$fileContent = Get-Content $localFile -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($fileContent)

$basicAuth = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes("$($username):$($password)"))

try {
    $response = Invoke-WebRequest -Uri $kuduUrl -Method PUT -Body $bytes `
        -Headers @{Authorization = "Basic $basicAuth"} `
        -ContentType "application/octet-stream"
    
    Write-Host "✅ File uploaded successfully!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Also upload web.config
Write-Host "`nUploading web.config..." -ForegroundColor Yellow

$webConfigFile = "C:\Users\amank\OneDrive\Desktop\azure G4 CICD\backend\web.config"
$webConfigUrl = "https://$appName.scm.azurewebsites.net/api/vfs/site/wwwroot/web.config"

$fileContent = Get-Content $webConfigFile -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($fileContent)

try {
    $response = Invoke-WebRequest -Uri $webConfigUrl -Method PUT -Body $bytes `
        -Headers @{Authorization = "Basic $basicAuth"} `
        -ContentType "application/xml"
    
    Write-Host "✅ web.config uploaded!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ web.config upload issue: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Restart app
Write-Host "`nRestarting app..." -ForegroundColor Yellow
az webapp restart -n $appName -g $rg

Write-Host "✅ App restarting..." -ForegroundColor Green
Write-Host "`nWaiting 10 seconds..."

Start-Sleep -Seconds 10

Write-Host "Testing..." -ForegroundColor Cyan
$resp = curl -s "https://$appName.azurewebsites.net/health" 2>&1

if ($resp -match "healthy") {
    Write-Host "🎉 SUCCESS! App is healthy!" -ForegroundColor Green
    Write-Host $resp
} else {
    Write-Host "⏳ Still starting..." -ForegroundColor Yellow
    Write-Host $resp
}
