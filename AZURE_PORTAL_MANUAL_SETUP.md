# 🖱️ **Azure Portal - Manual Setup Guide**

## **QUICK STEPS (5 minutes)**

---

## **📍 Step 1: Get Cosmos DB Credentials**

1. Open: https://portal.azure.com
2. Search bar → Type "Cosmos DB" → Click your database
3. Left sidebar → Click **"Keys"**
4. Copy these values:
   - **URI** → Save as `COSMOS_ENDPOINT` 
     - Example: `https://mydb.documents.azure.com:443/`
   - **Primary Key** → Save as `COSMOS_KEY`
     - Example: `abcd1234efgh5678...`

---

## **📍 Step 2: Get Storage Account Credentials**

1. Search bar → Type "Storage Accounts" → Click your storage account
2. Left sidebar → Click **"Access keys"**
3. Copy this value:
   - **Connection string** (under key1) → Save as `AZURE_STORAGE_CONNECTION_STRING`
     - Example: `DefaultEndpointsProtocol=https;AccountName=mystg;AccountKey=...;EndpointSuffix=core.windows.net`

---

## **📍 Step 3: Set Environment Variables in App Service**

1. Search bar → Type "App Services" → Click **"file-manager-backend-app"**

2. Left sidebar → Click **"Configuration"**

3. Under "Application settings" tab, click **"+ New application setting"**

4. **Add Setting 1: COSMOS_ENDPOINT**
   - Name: `COSMOS_ENDPOINT`
   - Value: Paste the URI from Step 1
   - Click **OK**

5. **Add Setting 2: COSMOS_KEY**
   - Name: `COSMOS_KEY`
   - Value: Paste the Primary Key from Step 1
   - Click **OK**

6. **Add Setting 3: AZURE_STORAGE_CONNECTION_STRING**
   - Name: `AZURE_STORAGE_CONNECTION_STRING`
   - Value: Paste the Connection string from Step 2
   - Click **OK**

7. **Add Setting 4: CONTAINER_NAME**
   - Name: `CONTAINER_NAME`
   - Value: `files`
   - Click **OK**

8. **Add Setting 5: COSMOS_DB_NAME**
   - Name: `COSMOS_DB_NAME`
   - Value: `file-notes-db`
   - Click **OK**

9. **Add Setting 6: COSMOS_CONTAINER_NAME**
   - Name: `COSMOS_CONTAINER_NAME`
   - Value: `files`
   - Click **OK**

---

## **📍 Step 4: Save and Restart**

1. Click **"Save"** button at the top
2. App Service will restart automatically (takes 1-2 minutes)
3. Wait for it to fully restart

---

## **✅ Verify Settings Were Applied**

After restart:

1. Search bar → "App Services" → "file-manager-backend-app"
2. Left sidebar → "Configuration"
3. Scroll down in "Application settings" tab
4. You should see all 6 settings you just added:
   - ✓ COSMOS_ENDPOINT
   - ✓ COSMOS_KEY
   - ✓ AZURE_STORAGE_CONNECTION_STRING
   - ✓ CONTAINER_NAME
   - ✓ COSMOS_DB_NAME
   - ✓ COSMOS_CONTAINER_NAME

---

## **🧪 Test the Fix**

### **Test 1: Diagnostics**
Open browser → Go to:
```
https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics
```

Should show JSON with all environment variables showing "✓"

### **Test 2: Health Check**
Open browser → Go to:
```
https://file-manager-backend-app.azurewebsites.net/health
```

Should show:
```json
{"status": "healthy", "service": "File Management API"}
```

### **Test 3: File Upload**
1. Go to: https://file-manager-frontend-app.azurewebsites.net
2. Select a file to upload
3. Should succeed with console logs ✅

---

## **🚨 If Settings Don't Appear**

Try these steps:
1. Close browser completely
2. Open new browser window
3. Go to: https://portal.azure.com
4. Refresh the page (Ctrl+R or Cmd+R)
5. Navigate back to App Service → Configuration

---

## **⏱️ App Service Restart Time**

After clicking "Save":
- **1-2 minutes**: Standard restart time
- **Up to 5 minutes**: In rare cases

If still seeing "Application Error" after 5 minutes:
- Right-click the app → "Restart"
- Wait another 2 minutes

---

## **💡 Pro Tips**

- **Copy-paste carefully**: Make sure you copy the ENTIRE value, no extra spaces
- **Container names**: Must be all lowercase, no special characters
- **Check spellings**: Azure is case-sensitive for variable names
- **Test one at a time**: Set one variable, verify it works, then add the next

---

**Once all environment variables are set correctly and app has restarted, your backend will be fully operational! ✅**
