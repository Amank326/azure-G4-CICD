#!/usr/bin/env pwsh
<#
═══════════════════════════════════════════════════════════════
🔥 AUTO-HEALER: Continuous Monitoring & Auto-Fix
═══════════════════════════════════════════════════════════════
Runs continuously, checks app health every 5 minutes
If something breaks, automatically fixes and alerts
#>

param(
    [int]$IntervalSeconds = 300,
    [bool]$AutoFix = $true
)

$config = @{
    SubscriptionId = "ce176ab4-0474-47f5-bfe2-72e93937970f"
    ResourceGroup = "file-manager-rg"
    BackendApp = "file-manager-backend-app"
    HealthUrl = "https://file-manager-backend-app.azurewebsites.net/health"
    DiagnosticsUrl = "https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics"
    UploadUrl = "https://file-manager-backend-app.azurewebsites.net/api/files"
}

$lastStatus = @{}
$healCount = 0

function Get-Timestamp {
    return (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
}

function Log-Event {
    param([string]$Level, [string]$Message)
    $timestamp = Get-Timestamp
    $icon = switch($Level) {
        "INFO" { "ℹ️ " }
        "OK" { "✅" }
        "WARN" { "⚠️ " }
        "ERROR" { "❌" }
        "HEAL" { "🔧" }
        default { "• " }
    }
    Write-Host "[$timestamp] $icon $Message" -ForegroundColor $(switch($Level) {
        "OK" { "Green" }
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "HEAL" { "Cyan" }
        default { "White" }
    })
}

function Test-Endpoint {
    param([string]$Url, [string]$Name)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $status = $true
        $content = $response.Content
    } catch {
        $status = $false
        $content = $_.Exception.Message
    }
    
    return @{ Status = $status; Content = $content; Name = $Name }
}

function Auto-Heal {
    param([string]$Issue)
    
    if (-not $AutoFix) { return }
    
    Log-Event "HEAL" "Auto-healing: $Issue"
    $healCount++
    
    try {
        # Restart app
        $subscriptionId = $config.SubscriptionId
        $rg = $config.ResourceGroup
        $app = $config.BackendApp
        
        $restartUrl = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$rg/providers/Microsoft.Web/sites/$app/restart?api-version=2021-02-01"
        
        try {
            $token = (az account get-access-token --query accessToken -o tsv 2>$null)
            Invoke-RestMethod -Uri $restartUrl -Method POST -Headers @{ Authorization = "Bearer $token" } -ContentLength 0 -ErrorAction SilentlyContinue
        } catch {
            curl -s -X POST -H "Content-Length: 0" $restartUrl 2>&1 | Out-Null
        }
        
        Log-Event "HEAL" "Restart command sent (Heal #$healCount)"
    } catch {
        Log-Event "ERROR" "Heal failed: $($_.Exception.Message)"
    }
}

function Monitor-Loop {
    Log-Event "INFO" "Starting Auto-Healer (Check every ${IntervalSeconds}s)"
    Log-Event "INFO" "Auto-Fix: $(if($AutoFix) { 'ENABLED ✅' } else { 'DISABLED' })"
    
    Write-Host "`n" + ("=" * 60) + "`n"
    
    while ($true) {
        $timestamp = Get-Timestamp
        Write-Host "[$timestamp] 🔍 CHECKING..." -ForegroundColor Cyan
        
        # Test health
        $health = Test-Endpoint $config.HealthUrl "Health"
        if ($health.Status) {
            Log-Event "OK" "Health: Healthy"
        } else {
            Log-Event "ERROR" "Health: DOWN - $($health.Content)"
            Auto-Heal "Health endpoint down"
        }
        
        # Test diagnostics
        $diag = Test-Endpoint $config.DiagnosticsUrl "Diagnostics"
        if ($diag.Status) {
            Log-Event "OK" "Diagnostics: OK"
            # Check if all env vars are set
            try {
                $json = $diag.Content | ConvertFrom-Json
                if ($json.environment) {
                    $missing = @()
                    @("COSMOS_ENDPOINT", "COSMOS_KEY", "AZURE_STORAGE_CONNECTION_STRING", "CONTAINER_NAME") | ForEach-Object {
                        if ($json.environment.$_ -match "✗") {
                            $missing += $_
                        }
                    }
                    if ($missing.Count -gt 0) {
                        Log-Event "WARN" "Missing env vars: $($missing -join ', ')"
                        Auto-Heal "Missing environment variables"
                    }
                }
            } catch {}
        } else {
            Log-Event "ERROR" "Diagnostics: FAIL"
        }
        
        # Test upload endpoint
        $upload = Test-Endpoint $config.UploadUrl "Upload"
        if ($upload.Status) {
            Log-Event "OK" "Upload endpoint: Responding"
        } else {
            Log-Event "WARN" "Upload: Not responding yet"
        }
        
        Write-Host "`n⏳ Next check in $IntervalSeconds seconds..." -ForegroundColor Gray
        Write-Host "📊 Heals performed: $healCount`n" -ForegroundColor Cyan
        Write-Host ("=" * 60) + "`n"
        
        Start-Sleep -Seconds $IntervalSeconds
    }
}

# ═══════════════════════════════════════════════════════════════
# START
# ═══════════════════════════════════════════════════════════════

Write-Host @"
╔═══════════════════════════════════════════════════════════════╗
║  🔥 AUTO-HEALER - CONTINUOUS MONITORING                      ║
║  Watches app health 24/7 and auto-fixes issues               ║
╚═══════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

Log-Event "INFO" "Configuration loaded"
Log-Event "INFO" "Backend: $($config.BackendApp)"
Log-Event "INFO" "Check interval: $($IntervalSeconds)s"

Monitor-Loop
