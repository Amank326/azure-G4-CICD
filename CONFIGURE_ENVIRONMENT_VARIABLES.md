# ⚙️ CONFIGURE ENVIRONMENT VARIABLES - Step-by-Step Guide

**Time Required:** 5 minutes  
**Difficulty:** Easy  
**Status:** CRITICAL - Must do this now!

---

## 🎯 Why This is Critical

Your backend **cannot work** without these variables:
```
❌ Without COSMOS_ENDPOINT → Cannot connect to database
❌ Without COSMOS_KEY → Cannot authenticate to database
❌ Without AZURE_STORAGE_CONNECTION_STRING → Cannot upload files
❌ Without other settings → Backend crashes on startup
```

---

## 📍 Step 1: Open Azure Portal

1. **Go to:** https://portal.azure.com
2. **Login** with your Azure account
3. **Search for:** "file-manager-backend-app"
4. **Click** on your Web App resource

---

## ⚙️ Step 2: Navigate to Configuration

```
In the Azure Portal:
1. Left sidebar → Settings (scroll down)
2. Click: "Configuration"
3. You'll see: "Application settings" tab
4. Current: Should be mostly empty or have default settings
```

---

## ➕ Step 3: Add Application Settings

### **Method: Add Each Setting**

**Click "+ New application setting"** for each of these:

---

### **Setting #1: COSMOS_ENDPOINT**

```
Name:  COSMOS_ENDPOINT
Value: https://your-cosmosdb-account.documents.azure.com:443/

⚠️  IMPORTANT:
- Replace "your-cosmosdb-account" with your actual account name
- Must include :443/
- Must include https://
- Must end with /

Example:
https://filemanager-db.documents.azure.com:443/
```

**Where to get this:**
```
1. Go to your Cosmos DB in Azure Portal
2. Keys section
3. Copy: "URI" field
4. Should look like: https://xyz.documents.azure.com:443/
```

---

### **Setting #2: COSMOS_KEY**

```
Name:  COSMOS_KEY
Value: <your-cosmos-db-primary-key>

⚠️  IMPORTANT:
- This is your PRIMARY KEY (not secondary)
- About 88 characters long
- Look like: AbCdEfGhIjKlMnOpQrStUvWxYz... (long string)
```

**Where to get this:**
```
1. Go to your Cosmos DB in Azure Portal
2. Keys section
3. Copy: "PRIMARY KEY" field
4. Paste in Value field
```

---

### **Setting #3: COSMOS_DB_NAME**

```
Name:  COSMOS_DB_NAME
Value: FileManagementDB

⚠️  Must match your database name exactly
    Case sensitive!
```

---

### **Setting #4: COSMOS_CONTAINER_NAME**

```
Name:  COSMOS_CONTAINER_NAME
Value: files

⚠️  Must match your container name exactly
    Case sensitive!
```

---

### **Setting #5: AZURE_STORAGE_CONNECTION_STRING**

```
Name:  AZURE_STORAGE_CONNECTION_STRING
Value: DefaultEndpointsProtocol=https;AccountName=your...;...

⚠️  IMPORTANT:
- Long string, copy exactly
- Should NOT be split across lines
- Paste entire string
```

**Where to get this:**
```
1. Go to your Storage Account in Azure Portal
2. Security + networking → Access keys
3. Copy: "Connection string" for key1
4. Should start with: DefaultEndpointsProtocol=https;
5. Paste entire string in Value field
```

---

### **Setting #6: CONTAINER_NAME**

```
Name:  CONTAINER_NAME
Value: file-uploads

⚠️  Must match your blob container name exactly
    Case sensitive!
```

---

### **Setting #7: NODE_ENV**

```
Name:  NODE_ENV
Value: production

⚠️  For Azure Web App, always use: production
```

---

### **Setting #8: PORT**

```
Name:  PORT
Value: 8080

⚠️  Azure Web App uses port 8080
    NOT 5000 (that's for local development)
    This is fixed by Azure
```

---

## ✅ Step 4: Verify All Settings Are Added

**In Configuration page, you should see:**

```
Application settings (8 total):
✅ COSMOS_ENDPOINT ..................... [Value shown]
✅ COSMOS_KEY .......................... [Masked for security]
✅ COSMOS_DB_NAME ...................... [FileManagementDB]
✅ COSMOS_CONTAINER_NAME ............... [files]
✅ AZURE_STORAGE_CONNECTION_STRING .... [Masked for security]
✅ CONTAINER_NAME ...................... [file-uploads]
✅ NODE_ENV ............................ [production]
✅ PORT ............................... [8080]
```

---

## 💾 Step 5: Save Configuration

```
1. Top bar: Click "Save" button
2. Dialog appears: "Application setting will be updated"
3. Click "Continue" button
4. Wait for: "Successfully updated application settings"
   (Takes ~10-30 seconds)
5. Notification appears: Green checkmark ✅
```

---

## 🔄 Step 6: Restart Web App

```
1. Top bar: Click "Restart" button
2. Confirmation dialog appears
3. Click "Yes" to restart
4. Status shows: "Stopped" (briefly)
5. Status shows: "Starting"
6. Status shows: "Running" (~30 seconds)
```

---

## 🧪 Step 7: Test Health Endpoint (1 minute)

**After restart completes:**

### **In Browser:**
```
Go to: https://file-manager-backend-app.azurewebsites.net/health

Expected Response:
{
  "status": "healthy",
  "service": "File Management API",
  "timestamp": "2025-12-22T10:30:00.000Z",
  "uptime": 45.123
}
```

### **If you see "healthy":**
✅ **SUCCESS!** Everything is configured correctly!

### **If you see error:**
```
Check logs: Log stream → scroll down
Look for errors:
- "Cannot connect to Cosmos DB" → Check COSMOS_ENDPOINT
- "Authentication failed" → Check COSMOS_KEY
- "Cannot connect to Storage" → Check connection string
```

---

## 📊 Step 8: Monitor Logs (Real-time)

**While testing, watch the logs:**

```
1. Left sidebar → Monitoring
2. Click: "Log stream"
3. Watch output for these messages:

2025-12-22 10:30:00 - Starting server...
2025-12-22 10:30:05 - Loading environment variables...
2025-12-22 10:30:10 - Connecting to Cosmos DB...
2025-12-22 10:30:15 - ✅ Connected to Cosmos DB
2025-12-22 10:30:20 - Connecting to Blob Storage...
2025-12-22 10:30:25 - ✅ Connected to Blob Storage
2025-12-22 10:30:30 - ✅ Server is running on port 8080
```

If you see these messages: **Everything is working!** 🎉

---

## 🧮 Quick Copy-Paste Template

**Use this to organize your values before entering:**

```
COSMOS_ENDPOINT=
COSMOS_KEY=
COSMOS_DB_NAME=FileManagementDB
COSMOS_CONTAINER_NAME=files
AZURE_STORAGE_CONNECTION_STRING=
CONTAINER_NAME=file-uploads
NODE_ENV=production
PORT=8080
```

**How to fill:**
1. Copy template above
2. Get values from Azure Portal (Cosmos DB & Storage Account)
3. Paste values into template
4. Then paste each line into Azure Portal Configuration

---

## 🎯 Values Location Reference

| Setting | Found In | Section |
|---------|----------|---------|
| COSMOS_ENDPOINT | Cosmos DB | Keys → URI |
| COSMOS_KEY | Cosmos DB | Keys → PRIMARY KEY |
| COSMOS_DB_NAME | You created it | FileManagementDB |
| COSMOS_CONTAINER_NAME | You created it | files |
| AZURE_STORAGE_CONNECTION_STRING | Storage Account | Access Keys → Connection String |
| CONTAINER_NAME | You created it | file-uploads |
| NODE_ENV | Fixed value | production |
| PORT | Fixed value | 8080 |

---

## ⚠️ Common Mistakes

### **Mistake 1: Wrong COSMOS_ENDPOINT**
```
❌ Wrong: https://myaccount.documents.azure.com/
✅ Right: https://myaccount.documents.azure.com:443/
          Must include :443/
```

### **Mistake 2: Using Secondary Key**
```
❌ Wrong: Using SECONDARY KEY
✅ Right: Use PRIMARY KEY
          Primary key is in same Keys section
```

### **Mistake 3: Port number**
```
❌ Wrong: PORT=5000 (that's for local dev)
✅ Right: PORT=8080 (Azure standard)
```

### **Mistake 4: Missing connection string parts**
```
❌ Wrong: Copying partial string
✅ Right: Copy ENTIRE string
          Should be ~150+ characters
```

### **Mistake 5: Case sensitivity**
```
❌ Wrong: COSMOS_endpoint (lowercase)
✅ Right: COSMOS_ENDPOINT (uppercase)
          Environment variable names are case-sensitive!
```

---

## ✅ Checklist Before Testing

- [ ] 8 environment variables added
- [ ] All values copied correctly
- [ ] "Save" button clicked
- [ ] "Continue" clicked
- [ ] Web app shows "Running"
- [ ] Waited for restart to complete

---

## 🚀 What Happens After Configuration

```
1. Environment variables saved to Azure
2. Web app restarts
3. Container pulls environment variables
4. Backend connects to:
   - Cosmos DB (database)
   - Blob Storage (files)
5. Server starts listening on port 8080
6. Ready to receive API requests
7. /health endpoint responds with status
```

---

## 📞 If Something Goes Wrong

### **Scenario 1: Health endpoint returns error**
```
Check logs:
1. Log stream → Look for "Error"
2. Check which service failed:
   - Cosmos DB → Check ENDPOINT and KEY
   - Blob Storage → Check connection string
   - Database not found → Check database name
   - Container not found → Check container name
```

### **Scenario 2: Web app keeps restarting**
```
Likely: Missing or wrong environment variable
Solution:
1. Check all 8 variables are added
2. Check no typos in variable names
3. Check values are correct
4. Save and restart again
```

### **Scenario 3: "Connection string invalid"**
```
Problem: Azure_STORAGE_CONNECTION_STRING is wrong
Solution:
1. Delete the setting
2. Go to Storage Account → Access Keys
3. Copy fresh connection string
4. Add back to Azure Configuration
5. Save and restart
```

---

## ✨ Success Indicators

After completing these steps, you'll see:

```
✅ Health endpoint responds with "healthy"
✅ API info endpoint shows endpoints list
✅ Logs show successful connections
✅ No errors in log stream
✅ Web app status shows "Running"
```

---

## 🎉 You're Done!

Once health endpoint returns "healthy", your backend is:
```
✅ Connected to Cosmos DB
✅ Connected to Blob Storage
✅ Ready to receive requests
✅ Ready for API testing
```

---

## 📊 Next Steps

After completing configuration:

1. **Test Upload Endpoint** (5 min)
   ```
   POST https://file-manager-backend-app.azurewebsites.net/api/files/upload
   ```

2. **Test List Endpoint** (2 min)
   ```
   GET https://file-manager-backend-app.azurewebsites.net/api/files?userId=test
   ```

3. **Test Delete Endpoint** (2 min)
   ```
   DELETE https://file-manager-backend-app.azurewebsites.net/api/files/:id?userId=test
   ```

---

**Estimated Time:** 5 minutes  
**Difficulty:** Very Easy  
**Result:** Fully functional backend API! 🚀
