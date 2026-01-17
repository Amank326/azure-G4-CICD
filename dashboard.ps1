#!/usr/bin/env pwsh
<#
════════════════════════════════════════════════════════════════
📊 LIVE DASHBOARD - 100% Instant Access to Everything
════════════════════════════════════════════════════════════════
#>

$config = @{
    FrontendUrl = "https://file-manager-frontend-app.azurewebsites.net"
    BackendUrl = "https://file-manager-backend-app.azurewebsites.net"
    HealthUrl = "https://file-manager-backend-app.azurewebsites.net/health"
    DiagUrl = "https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics"
    CosmosId = "filemanagercosmos1234"
    StorageId = "filemanagerstorage5371"
    ResourceGroup = "file-manager-rg"
    Subscription = "ce176ab4-0474-47f5-bfe2-72e93937970f"
}

function Get-ServiceStatus {
    param([string]$Url)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        return @{ Online = $true; StatusCode = $response.StatusCode }
    } catch {
        return @{ Online = $false; Error = $_.Exception.Message }
    }
}

function Show-Dashboard {
    Clear-Host
    
    Write-Host @"
╔══════════════════════════════════════════════════════════════════════════╗
║                    📊 APPLICATION STATUS DASHBOARD                       ║
║                      Real-Time Monitoring & Quick Access                 ║
╚══════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

    # Get statuses
    $frontendStatus = Get-ServiceStatus $config.FrontendUrl
    $healthStatus = Get-ServiceStatus $config.HealthUrl
    $diagStatus = Get-ServiceStatus $config.DiagUrl
    
    # Frontend
    Write-Host "🎨 FRONTEND" -ForegroundColor Yellow
    Write-Host "   URL: " -NoNewline
    Write-Host $config.FrontendUrl -ForegroundColor Cyan
    Write-Host "   Status: " -NoNewline
    if ($frontendStatus.Online) {
        Write-Host "✅ ONLINE" -ForegroundColor Green
    } else {
        Write-Host "⏳ STARTING..." -ForegroundColor Yellow
    }
    
    # Backend
    Write-Host "`n⚙️  BACKEND" -ForegroundColor Yellow
    Write-Host "   URL: " -NoNewline
    Write-Host $config.BackendUrl -ForegroundColor Cyan
    Write-Host "   Health: " -NoNewline
    if ($healthStatus.Online) {
        Write-Host "✅ HEALTHY" -ForegroundColor Green
    } else {
        Write-Host "⏳ STARTING..." -ForegroundColor Yellow
    }
    
    # Database
    Write-Host "`n💾 COSMOS DB" -ForegroundColor Yellow
    Write-Host "   Account: " -NoNewline
    Write-Host $config.CosmosId -ForegroundColor Cyan
    Write-Host "   Database: file-notes-db"
    Write-Host "   Container: files"
    
    # Storage
    Write-Host "`n📦 BLOB STORAGE" -ForegroundColor Yellow
    Write-Host "   Account: " -NoNewline
    Write-Host $config.StorageId -ForegroundColor Cyan
    Write-Host "   Container: files"
    
    # Environment
    Write-Host "`n🌍 ENVIRONMENT" -ForegroundColor Yellow
    Write-Host "   Resource Group: " -NoNewline
    Write-Host $config.ResourceGroup -ForegroundColor Cyan
    Write-Host "   Subscription: " -NoNewline
    Write-Host $config.Subscription -ForegroundColor Cyan
    Write-Host "   Region: eastus"
    
    Write-Host "`n"
    Write-Host ("─" * 76) -ForegroundColor Gray
    Write-Host ""
    
    # Quick Links
    Write-Host "🚀 QUICK ACCESS COMMANDS" -ForegroundColor Green
    Write-Host ""
    Write-Host @"
┌─ DEVELOPMENT ─────────────────────────────────────────────┐
│ Open Frontend:       explorer $config.FrontendUrl
│ Check Backend:       explorer $config.BackendUrl
│ View Diagnostics:    explorer $config.DiagUrl
│ Test Upload:         Invoke-WebRequest $config.HealthUrl
└───────────────────────────────────────────────────────────┘

┌─ AUTOMATION ──────────────────────────────────────────────┐
│ Full Deploy:         .\deploy.ps1 -Action deploy
│ Health Check:        .\deploy.ps1 -Action health
│ Quick Test:          .\deploy.ps1 -Action test
│ Auto Monitor:        .\monitor.ps1
└───────────────────────────────────────────────────────────┘

┌─ DEBUGGING ───────────────────────────────────────────────┐
│ Backend Logs:        .\logs.ps1 -App backend
│ Frontend Logs:       .\logs.ps1 -App frontend
│ Database Status:     .\status.ps1 -Resource cosmos
│ Storage Status:      .\status.ps1 -Resource storage
└───────────────────────────────────────────────────────────┘

┌─ TESTING ─────────────────────────────────────────────────┐
│ Test Upload:         Invoke-WebRequest -Uri "$($config.BackendUrl)/api/files" -UseBasicParsing
│ List Files:          Invoke-WebRequest -Uri "$($config.BackendUrl)/api/files?userId=test" -UseBasicParsing
│ Full Diagnostics:    Invoke-WebRequest -Uri "$config.DiagUrl" -UseBasicParsing
└───────────────────────────────────────────────────────────┘

"@ -ForegroundColor White

    Write-Host ("─" * 76) -ForegroundColor Gray
    
    Write-Host "`n⏰ Last Updated: " -NoNewline
    Write-Host (Get-Date).ToString("yyyy-MM-dd HH:mm:ss") -ForegroundColor Cyan
    Write-Host "`n🔄 Press Ctrl+C to exit, or wait to refresh..`n" -ForegroundColor Gray
}

# Show dashboard
Show-Dashboard

# Auto-refresh every 30 seconds
$refreshInterval = 30
$counter = 0

while ($true) {
    $counter++
    if ($counter -ge $refreshInterval) {
        Show-Dashboard
        $counter = 0
    }
    
    Start-Sleep -Seconds 1
}
