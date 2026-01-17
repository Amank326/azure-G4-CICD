# 🚨 **APPLICATION ERROR - ROOT CAUSE & SOLUTION**

## **🔴 Problem**
```
❌ https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics
   Response: "Application Error"
```

---

## **🔍 Root Cause**
Environment variables are **NOT SET** in Azure App Service!

The backend needs these to run:
- ✗ `COSMOS_ENDPOINT` - Azure Cosmos DB connection
- ✗ `COSMOS_KEY` - Cosmos DB authentication
- ✗ `AZURE_STORAGE_CONNECTION_STRING` - Blob Storage connection
- ✗ `CONTAINER_NAME` - Blob container name

---

## **✅ SOLUTION (2 Steps)**

### **Step 1: Get Your Azure Credentials**

**For Cosmos DB:**
1. Go to: https://portal.azure.com
2. Search for "Cosmos DB" → Click your database
3. Left sidebar → "Keys"
4. Copy:
   - `URI` → This is `COSMOS_ENDPOINT`
   - `Primary Key` → This is `COSMOS_KEY`

**For Blob Storage:**
1. Go to: https://portal.azure.com
2. Search for "Storage Account" → Click your account
3. Left sidebar → "Access keys"
4. Copy:
   - `Connection string` → This is `AZURE_STORAGE_CONNECTION_STRING`

---

### **Step 2: Run the Setup Script**

#### **Option A: Using PowerShell (Windows) 🟦**

```powershell
# 1. Open PowerShell as Administrator
# 2. Run this script:

cd "C:\Users\amank\OneDrive\Desktop\azure G4 CICD"
.\setup-env-vars.ps1

# The script will prompt you for:
# - COSMOS_ENDPOINT
# - COSMOS_KEY
# - AZURE_STORAGE_CONNECTION_STRING
# - CONTAINER_NAME (press Enter for default 'files')
```

#### **Option B: Using Azure CLI (All Platforms) 🌍**

```bash
# 1. Open Terminal/Command Prompt
# 2. Login to Azure:

az login

# 3. Run these commands:

az webapp config appsettings set \
  --resource-group file-manager-rg \
  --name file-manager-backend-app \
  --settings COSMOS_ENDPOINT="https://your-cosmos-account.documents.azure.com:443/"

az webapp config appsettings set \
  --resource-group file-manager-rg \
  --name file-manager-backend-app \
  --settings COSMOS_KEY="your-primary-key"

az webapp config appsettings set \
  --resource-group file-manager-rg \
  --name file-manager-backend-app \
  --settings AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"

az webapp config appsettings set \
  --resource-group file-manager-rg \
  --name file-manager-backend-app \
  --settings CONTAINER_NAME="files"

# 4. Restart the app:

az webapp restart \
  --resource-group file-manager-rg \
  --name file-manager-backend-app
```

#### **Option C: Using Azure Portal 🖱️ (Manual)**

1. Go to: https://portal.azure.com
2. Search for "App Services" → Click "file-manager-backend-app"
3. Left sidebar → "Configuration"
4. Click "+ New application setting"
5. Add each setting:

| Name | Value |
|------|-------|
| `COSMOS_ENDPOINT` | `https://your-account.documents.azure.com:443/` |
| `COSMOS_KEY` | Your primary key from Cosmos DB |
| `AZURE_STORAGE_CONNECTION_STRING` | Your connection string |
| `CONTAINER_NAME` | `files` |
| `COSMOS_DB_NAME` | `file-notes-db` |
| `COSMOS_CONTAINER_NAME` | `files` |

6. Click "Save" button at top
7. App Service will restart automatically

---

## **✅ Verify the Fix**

### **Test 1: Check Diagnostics Endpoint**

Open browser console and run:
```javascript
fetch('https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Expected Response:**
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
      "status": "connected",
      "hasContainer": true
    },
    "cosmosDB": {
      "status": "connected",
      "hasContainer": true
    }
  }
}
```

### **Test 2: Check Health Endpoint**

```javascript
fetch('https://file-manager-backend-app.azurewebsites.net/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "File Management API"
}
```

### **Test 3: Upload a File**

1. Go to: https://file-manager-frontend-app.azurewebsites.net
2. Click "Click to upload or drag files here"
3. Select a file
4. Should see console logs and file upload successful ✅

---

## **❓ How to Find Your Resource Group Name**

If you don't know your resource group:

```bash
# List all resource groups:
az group list --output table

# List app services in a resource group:
az webapp list --resource-group YOUR-RESOURCE-GROUP --output table
```

---

## **🐛 Troubleshooting**

### **"Resource group not found"**
- Check exact spelling: `az group list`
- Use the name from the output

### **"App not found"**
- Verify app name: `az webapp list --resource-group YOUR-GROUP`
- Should be: `file-manager-backend-app`

### **"Invalid COSMOS_ENDPOINT"**
- Must start with: `https://`
- Must end with: `:443/`
- Example: `https://myaccount.documents.azure.com:443/`

### **"After setting vars, still getting 'Application Error'"**
- Wait 1-2 minutes for app to fully restart
- Try refreshing the page
- Check app logs: Portal → App Service → "Log stream"

### **Can't see the settings I set**
- Portal → App Service → Configuration
- Scroll down → Check "Application settings" section
- If not there, the command failed. Check error message.

---

## **📝 Environment Variables Cheat Sheet**

| Variable | Source | Example |
|----------|--------|---------|
| `COSMOS_ENDPOINT` | Cosmos DB Keys page, copy "URI" | `https://mydb.documents.azure.com:443/` |
| `COSMOS_KEY` | Cosmos DB Keys page, copy "Primary Key" | `abcd1234...` |
| `AZURE_STORAGE_CONNECTION_STRING` | Storage Account Access keys | `DefaultEndpointsProtocol=https;...` |
| `CONTAINER_NAME` | Your blob container name | `files` |
| `COSMOS_DB_NAME` | Your database name (usually) | `file-notes-db` |
| `COSMOS_CONTAINER_NAME` | Your container name (usually) | `files` |

---

## **🎯 After Setup - Expected Workflow**

```
User uploads file
    ↓
Frontend checks /health (OK ✓)
    ↓
Frontend uploads to /api/files/upload
    ↓
Backend stores in Blob Storage ✓
    ↓
Backend saves metadata to Cosmos DB ✓
    ↓
"✅ FILE UPLOADED SUCCESSFULLY"
```

---

## **📊 Quick Checklist**

- [ ] Got COSMOS_ENDPOINT from Cosmos DB Keys page
- [ ] Got COSMOS_KEY from Cosmos DB Keys page
- [ ] Got AZURE_STORAGE_CONNECTION_STRING from Storage Account Access Keys
- [ ] Ran setup script OR manually set environment variables
- [ ] Restarted App Service (or waited 1-2 minutes)
- [ ] Tested `/health` endpoint - returns 200 OK
- [ ] Tested `/api/files/diagnostics` - shows all environment vars as "✓"
- [ ] Tested file upload - succeeds without "Failed to fetch" error

---

**Once all environment variables are set and app restarted, the "Application Error" will be gone and file upload will work! ✅**
