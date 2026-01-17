#!/usr/bin/env pwsh
<#
Quick reference and one-page cheatsheet
#>

$output = @"
╔═══════════════════════════════════════════════════════════════╗
║                   🚀 QUICK REFERENCE CARD                     ║
╚═══════════════════════════════════════════════════════════════╝"@

Write-Host $output -ForegroundColor Cyan

$content = @"

📍 PROJECT LOCATION
   C:\Users\amank\OneDrive\Desktop\azure G4 CICD

🌐 FRONTEND URL
   https://file-manager-frontend-app.azurewebsites.net

⚙️  BACKEND URL  
   https://file-manager-backend-app.azurewebsites.net

═══════════════════════════════════════════════════════════════

🎯 MAIN COMMANDS (Copy & Paste These)

┌─ DEPLOY & TEST ────────────────────────────────────────────┐

1️⃣ FULL DEPLOY (Push + Restart + Test)
   .\deploy.ps1 -Action deploy

2️⃣ QUICK HEALTH CHECK
   .\deploy.ps1 -Action health

3️⃣ TEST UPLOAD ENDPOINT
   .\deploy.ps1 -Action test

4️⃣ SHOW STATUS DASHBOARD
   .\deploy.ps1 -Action dashboard

└────────────────────────────────────────────────────────────┘

┌─ MONITORING ───────────────────────────────────────────────┐

5️⃣ START 24/7 AUTO-HEALER (Every 5 min)
   .\monitor.ps1

6️⃣ START WITH CUSTOM INTERVAL (Every 60 sec)
   .\monitor.ps1 -IntervalSeconds 60

└────────────────────────────────────────────────────────────┘

┌─ LIVE DASHBOARD ───────────────────────────────────────────┐

7️⃣ SHOW LIVE STATUS DASHBOARD
   .\dashboard.ps1

└────────────────────────────────────────────────────────────┘

┌─ MANUAL TESTING ───────────────────────────────────────────┐

8️⃣ CHECK HEALTH (PowerShell)
   Invoke-WebRequest https://file-manager-backend-app.azurewebsites.net/health -UseBasicParsing

9️⃣ CHECK DIAGNOSTICS
   Invoke-WebRequest https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics -UseBasicParsing

🔟 OPEN FRONTEND (Browser)
   explorer https://file-manager-frontend-app.azurewebsites.net

1️⃣1️⃣ OPEN BACKEND (Browser)
   explorer https://file-manager-backend-app.azurewebsites.net

└────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

⏱️  TYPICAL WORKFLOW

┌─ Step 1: Deploy Everything ────────────────────────────────┐
   .\deploy.ps1 -Action deploy
   ⏳ Wait: 2-3 minutes (Azure restart)

└────────────────────────────────────────────────────────────┘

┌─ Step 2: Check Status ─────────────────────────────────────┐
   .\deploy.ps1 -Action health
   ✅ Should show: Health: ✅ HEALTHY

└────────────────────────────────────────────────────────────┘

┌─ Step 3: Test Upload ──────────────────────────────────────┐
   Open: https://file-manager-frontend-app.azurewebsites.net
   Upload a file → Should work! ✅

└────────────────────────────────────────────────────────────┘

┌─ Step 4: Start Monitoring ─────────────────────────────────┐
   .\monitor.ps1
   Runs forever checking every 5 minutes

└────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

✅ WHAT'S FIXED

Problem:  Backend crash → "Application Error"
Cause:    Entry point too heavy (index.js)
Solution: Changed to lightweight server.js
Result:   Instant startup, file upload works ✅

═══════════════════════════════════════════════════════════════

📊 WHAT'S AUTOMATED

Deploy:    .\deploy.ps1 -Action deploy        [ONE COMMAND]
Monitor:   .\monitor.ps1                      [CONTINUOUS]
Dashboard: .\dashboard.ps1                    [LIVE STATUS]
Health:    .\deploy.ps1 -Action health        [INSTANT]
Test:      .\deploy.ps1 -Action test          [QUICK]

═══════════════════════════════════════════════════════════════

🆘 TROUBLESHOOTING

Problem:     App not responding
Solution 1:  Wait 2-3 minutes (restart in progress)
Solution 2:  .\deploy.ps1 -Action deploy
Solution 3:  .\monitor.ps1 (auto-fixes)

Problem:     Still seeing errors
Solution:    Invoke-WebRequest https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics -UseBasicParsing
             (Check which env vars are missing)

Problem:     Monitor script stopped
Solution:    .\monitor.ps1 (restart it)

═══════════════════════════════════════════════════════════════

⚡ AUTOMATION BENEFITS

Before:  Manual deploy, no monitoring, manual fixes
After:   One command, 24/7 monitoring, auto-healing

═══════════════════════════════════════════════════════════════

🎯 YOU'RE READY! START HERE:

   .\deploy.ps1 -Action deploy

Then in 2-3 minutes:

   explorer https://file-manager-frontend-app.azurewebsites.net

Upload a file - should work! ✅

═══════════════════════════════════════════════════════════════

Questions? Check the READY_TO_TEST.md for full details!

" -ForegroundColor Cyan

# If run directly, open the main documentation
Write-Host "`nOpening documentation..." -ForegroundColor Yellow
explorer ".\READY_TO_TEST.md" -ErrorAction SilentlyContinue
