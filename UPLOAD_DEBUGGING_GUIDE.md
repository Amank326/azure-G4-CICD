# 📤 FILE UPLOAD DEBUGGING GUIDE

## 🔍 What Was Fixed

### Issue 1: Form Field Mismatch ✅ FIXED
**Problem:** Frontend was sending wrong field names to backend
- Frontend sent: `file`, `notes`
- Backend expected: `file`, `userId`, `description`, `tags`

**Solution:**
```javascript
// ✅ CORRECT FORM DATA
const formData = new FormData();
formData.append('file', file);
formData.append('userId', userId);              // Required
formData.append('description', notes);          // Maps notes → description
formData.append('tags', 'web-upload');          // Required
```

### Issue 2: Missing Logging ✅ FIXED
**Problem:** No visibility into what was failing
**Solution:** Added detailed logging at every step:
- Frontend: Logs API URL, form data, response status
- Backend: Logs validation, blob upload, cosmos save, timing

### Issue 3: Restrictive File Type Validation ✅ FIXED
**Problem:** Rejected valid file types
**Solution:** Extended allowed types and made validation lenient

---

## 🧪 How to Test File Upload

### Step 1: Open Browser Console
1. Go to https://file-manager-frontend-app.azurewebsites.net
2. Press `F12` to open Developer Tools
3. Go to **Console** tab

### Step 2: Upload a File
1. Select a file from your computer
2. Add optional description/notes
3. Click **Upload**

### Step 3: Check Browser Console

You should see logs like:
```
🔍 Uploading to: https://file-manager-backend-app.azurewebsites.net/api/files/upload
📦 Using API Config: {BASE_URL: "https://file-manager-backend-app.azurewebsites.net", ENDPOINTS: {...}}
📝 Form Data - userId: user_1703337... description: My file
📡 Response Status: 201
✅ Upload Success: {success: true, message: "File uploaded successfully", file: {...}}
```

### If Upload Fails

#### Error: "Failed to fetch"
1. Check browser console for exact error
2. Check Network tab → Click on upload request → Response tab
3. Look for error message from backend

#### Common Issues & Solutions

**Problem: "userId is required"**
- Cause: Frontend not sending userId field
- Fix: Check FileUpload.js - should auto-generate userId from localStorage

**Problem: "File type not allowed"**
- Cause: File MIME type not in allowed list
- Fix: Updated validation to accept more types and log warnings

**Problem: "Connection refused" / 503 error**
- Cause: Backend or Storage connection failed
- Fix: Check if backend app is running (`az webapp show --name file-manager-backend-app --resource-group file-manager-rg --query state`)

---

## 📋 Backend Logging

### Check Backend Logs
```bash
az webapp log tail --name file-manager-backend-app --resource-group file-manager-rg
```

### What to Look For

**Successful Upload:**
```
🔍 [UPLOAD START] userId: user_123, fileName: document.pdf, size: 1024
✅ [VALIDATION OK] file: document.pdf, size: 1024, type: application/pdf
📝 [BLOB UPLOAD] blobName: user_123/uuid-document.pdf
✅ [BLOB SUCCESS] blobUrl: https://storage.blob.core.windows.net/...
📊 [COSMOS SAVE] fileId: uuid
✨ [UPLOAD SUCCESS] id: uuid, duration: 2345ms
```

**Validation Error:**
```
❌ [METADATA ERROR] userId missing or invalid
```

**Connection Error:**
```
❌ [UPLOAD ERROR] error: connect ECONNREFUSED
```

---

## 🔧 Configuration Checklist

- ✅ Frontend sends correct form fields: userId, description, tags
- ✅ Backend validates and logs each step
- ✅ CORS configured for frontend origin
- ✅ Environment variables set: COSMOS_ENDPOINT, COSMOS_KEY, AZURE_STORAGE_CONNECTION_STRING
- ✅ Azure Storage Container exists: file-uploads
- ✅ Cosmos DB Container exists: files
- ✅ File type validation is lenient

---

## 📞 If Upload Still Fails

1. **Check Frontend Logs:**
   - Open DevTools → Console
   - Look for exact error message
   - Check Network tab → upload request → Response

2. **Check Backend Logs:**
   ```bash
   az webapp log tail --name file-manager-backend-app --resource-group file-manager-rg --lines 50
   ```

3. **Test Backend Directly:**
   ```bash
   # Health check
   curl https://file-manager-backend-app.azurewebsites.net/api/health
   
   # Test upload with sample file
   curl -X POST "https://file-manager-backend-app.azurewebsites.net/api/files/upload" \
     -F "file=@myfile.txt" \
     -F "userId=test123" \
     -F "description=Test" \
     -F "tags=test"
   ```

4. **Verify Environment Variables:**
   ```bash
   az webapp config appsettings list --name file-manager-backend-app --resource-group file-manager-rg
   ```

---

## 📈 Monitoring Upload Performance

Browser console shows:
```
Duration: 2345ms  # How long upload took
```

This helps identify if issue is:
- **< 1 second:** Frontend/Network issue
- **1-5 seconds:** Normal operation
- **> 10 seconds:** Blob Storage or Cosmos DB slow
- **Timeout:** Connection to Azure services failing

---

## 🚀 Next Steps if Still Issues

1. Check if Azure services are accessible
2. Verify storage account connection string
3. Verify Cosmos DB connection and permissions
4. Check firewall/network rules aren't blocking connections
5. Review Azure app service logs in Portal

Good luck! 🎉
