# 🎯 **ACTION PLAN - FIX THE APPLICATION ERROR (5 MINUTES)**

## **🔴 CURRENT ISSUE**
```
❌ https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics
   Returns: "Application Error"
```

**ROOT CAUSE:** Environment variables NOT set in Azure App Service

---

## **✅ SOLUTION - CHOOSE ONE OPTION**

### **⏱️ FASTEST: Option 1 - PowerShell Script (2 minutes) 🟦**

```powershell
# 1. Open PowerShell as Administrator
# 2. Navigate to project folder:

cd "C:\Users\amank\OneDrive\Desktop\azure G4 CICD"

# 3. Run the setup script:

.\setup-env-vars.ps1

# 4. When prompted, paste these values (get from Azure Portal):
#    - COSMOS_ENDPOINT
#    - COSMOS_KEY
#    - AZURE_STORAGE_CONNECTION_STRING
#    - CONTAINER_NAME (or press Enter for "files")

# Script will:
# ✓ Set all environment variables
# ✓ Restart App Service
# ✓ Done! (1-2 minutes for app to restart)
```

---

### **⚡ Option 2 - Azure CLI (3 minutes)**

```bash
# 1. Run these commands in Terminal/Command Prompt:

az login

# 2. Set each environment variable:

az webapp config appsettings set --resource-group file-manager-rg --name file-manager-backend-app --settings COSMOS_ENDPOINT="https://YOUR_COSMOS_ACCOUNT.documents.azure.com:443/"

az webapp config appsettings set --resource-group file-manager-rg --name file-manager-backend-app --settings COSMOS_KEY="YOUR_COSMOS_KEY"

az webapp config appsettings set --resource-group file-manager-rg --name file-manager-backend-app --settings AZURE_STORAGE_CONNECTION_STRING="YOUR_STORAGE_CONNECTION_STRING"

az webapp config appsettings set --resource-group file-manager-rg --name file-manager-backend-app --settings CONTAINER_NAME="files"

az webapp config appsettings set --resource-group file-manager-rg --name file-manager-backend-app --settings COSMOS_DB_NAME="file-notes-db"

az webapp config appsettings set --resource-group file-manager-rg --name file-manager-backend-app --settings COSMOS_CONTAINER_NAME="files"

# 3. Restart app:

az webapp restart --resource-group file-manager-rg --name file-manager-backend-app
```

---

### **🖱️ Option 3 - Azure Portal (5 minutes, Manual)**

See: [AZURE_PORTAL_MANUAL_SETUP.md](AZURE_PORTAL_MANUAL_SETUP.md)

**Quick summary:**
1. Go to Azure Portal
2. App Services → file-manager-backend-app → Configuration
3. Click "+ New application setting" 6 times and add:
   - COSMOS_ENDPOINT
   - COSMOS_KEY
   - AZURE_STORAGE_CONNECTION_STRING
   - CONTAINER_NAME
   - COSMOS_DB_NAME
   - COSMOS_CONTAINER_NAME
4. Click Save
5. Wait 1-2 minutes for restart

---

## **📍 WHERE TO GET THE VALUES**

### **From Azure Cosmos DB:**
1. Go to: https://portal.azure.com
2. Search "Cosmos DB" → Click your database
3. Left sidebar → "Keys"
4. Copy:
   - `URI` → `COSMOS_ENDPOINT` value
   - `Primary Key` → `COSMOS_KEY` value

### **From Azure Storage Account:**
1. Search "Storage Accounts" → Click your account
2. Left sidebar → "Access keys"
3. Copy:
   - `Connection string` → `AZURE_STORAGE_CONNECTION_STRING` value

---

## **✅ VERIFY THE FIX (After setup)**

After choosing one option and waiting 1-2 minutes for restart:

### **Test 1: Open this URL in browser**
```
https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics
```

Should show JSON (NOT "Application Error"):
```json
{
  "status": "diagnostics",
  "environment": {
    "COSMOS_ENDPOINT": "✓",
    "COSMOS_KEY": "✓",
    "AZURE_STORAGE_CONNECTION_STRING": "✓",
    "CONTAINER_NAME": "✓"
  },
  "azureServices": {
    "blobStorage": {
      "status": "connected"
    },
    "cosmosDB": {
      "status": "connected"
    }
  }
}
```

### **Test 2: Open this URL**
```
https://file-manager-backend-app.azurewebsites.net/health
```

Should show:
```json
{"status": "healthy", "service": "File Management API"}
```

### **Test 3: Upload a file**
1. Go to: https://file-manager-frontend-app.azurewebsites.net
2. Select any file and upload
3. Should succeed ✅

---

## **❓ COMMON ISSUES & FIXES**

| Issue | Solution |
|-------|----------|
| "Resource group not found" | Check spelling: `az group list` |
| "Can't find app" | Check name: `az webapp list --resource-group YOUR-GROUP` |
| Still showing "Application Error" after setup | Wait 2-3 more minutes OR restart manually in Portal |
| Portal shows empty after clicking Save | Refresh page (Ctrl+R) |
| Values don't match what I set | Close all browser windows and re-open |

---

## **🚀 RECOMMENDED: PowerShell Script (Easiest)**

The `setup-env-vars.ps1` script is **the easiest** because it:
✅ Prompts you for values (less copy-paste errors)
✅ Automatically sets all variables at once
✅ Automatically restarts the app
✅ Takes only 2 minutes

**Just run it and follow the prompts!**

---

## **📋 NEXT STEPS AFTER VERIFICATION**

Once you confirm all tests pass (✓ diagnostics, ✓ health, ✓ upload):

1. ✅ The "Application Error" is gone
2. ✅ File upload works with retry mechanism
3. ✅ Backend is fully operational
4. ✅ All fixes from previous deployment are active

---

## **⏱️ TOTAL TIME**

- PowerShell Script: **2 minutes**
- Azure CLI: **3 minutes**
- Manual Portal: **5 minutes**
- App Restart Time: **1-2 minutes**
- Verification: **1 minute**

**Total: 5-10 minutes maximum**

---

## **🎯 YOU'RE ALMOST DONE!**

Just need to set these 6 environment variables in Azure App Service, and your backend will be fully working! 

**Choose Option 1 (PowerShell) for fastest results.** ⚡

