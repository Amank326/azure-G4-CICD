Write-Host 'Restarting Backend App Service...' -ForegroundColor Cyan
az webapp restart --name file-manager-backend-app --resource-group file-manager-rg

Write-Host 'Waiting 10 seconds for restart...' 
Start-Sleep -Seconds 10

Write-Host 'Checking health endpoint...' -ForegroundColor Yellow
\ = 0
while(\ -lt 10) {
    try {
        \ = Invoke-WebRequest -Uri 'https://file-manager-backend-app.azurewebsites.net/health' -TimeoutSec 5 -ErrorAction Stop
        Write-Host '✅ BACKEND IS RESPONDING!' -ForegroundColor Green
        Write-Host \"Status Code: \\" 
        Write-Host \"Response: \\"
        break
    } catch {
        \++
        Write-Host \"Attempt \/10: Still warming up... (waiting 5s)\"
        Start-Sleep -Seconds 5
    }
}

if(\ -eq 10) {
    Write-Host '❌ Backend still not responding. Trying alternative health check...' -ForegroundColor Red
    Invoke-WebRequest -Uri 'https://file-manager-backend-app.azurewebsites.net' -TimeoutSec 5 | Select-Object -Property StatusCode, StatusDescription
}
