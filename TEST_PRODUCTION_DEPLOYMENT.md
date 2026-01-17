# 🧪 **Production Deployment Testing Guide**

## **📌 Status**
- ✅ Code changes committed to GitHub
- ✅ Push triggered to main branch
- ⏳ GitHub Actions workflow should be running (5-10 minutes)
- ⏳ Azure App Services should auto-deploy

---

## **🔍 Step 1: Verify GitHub Actions Deployment (Now)**

**Check deployment status:**
1. Go to: https://github.com/Amank326/azure-G4-CICD/actions
2. Look for the latest workflow run
3. Check status: 🟠 In Progress, 🟢 Success, or 🔴 Failed

**Expected workflow:** "Deploy Node.js to Azure App Service"

---

## **✅ Step 2: Wait for Deployment to Complete**

**Typical timeline:**
```
T+0 min   → Push to GitHub
T+1 min   → Actions workflow starts
T+3 min   → Backend deployment
T+5 min   → Frontend deployment  
T+8 min   → Complete ✅
```

**Check Azure App Services:**
1. Go to Azure Portal: https://portal.azure.com
2. Search for "file-manager-backend-app"
3. Check Application is running and healthy

---

## **🧪 Step 3: Test Backend Diagnostics**

**In browser console, run:**

```javascript
// Test 1: Health Check
fetch('https://file-manager-backend-app.azurewebsites.net/health')
  .then(r => r.json())
  .then(d => console.log('✅ Health:', d))
  .catch(e => console.error('❌ Error:', e.message))
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-17T10:30:00.000Z"
}
```

---

```javascript
// Test 2: Diagnostics Endpoint
fetch('https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics')
  .then(r => r.json())
  .then(d => console.log('✅ Diagnostics:', d))
  .catch(e => console.error('❌ Error:', e.message))
```

**Expected Response:**
```json
{
  "blobStorage": "connected",
  "cosmosDB": "connected",
  "cors": ["https://file-manager-frontend-app.azurewebsites.net", ...],
  "environment": {
    "COSMOS_ENDPOINT": "✓",
    "COSMOS_KEY": "✓",
    "AZURE_STORAGE_CONNECTION_STRING": "✓",
    "CONTAINER_NAME": "✓"
  }
}
```

---

## **📤 Step 4: Test File Upload (THE MAIN FIX)**

**Location:** https://file-manager-frontend-app.azurewebsites.net

**Steps:**
1. Open the Cloud File Manager app
2. Open **Browser Console** (Press `F12` → Console tab)
3. Click "Click to upload or drag files here"
4. Select a test file (any size < 10MB)
5. Watch the console for retry logs

**Expected Console Output:**
```
═══════════════════════════════════════
🚀 FILE UPLOAD INITIATED
Upload URL: https://file-manager-backend-app.azurewebsites.net/api/files/upload
File: test.pdf (Size: 1.2MB)
User ID: user_1234567890
═══════════════════════════════════════

🔍 Backend Health Check (5s timeout)...
✅ Backend is healthy!

🚀 Starting upload with retry mechanism...
📤 Attempt 1/3...
✅ Response received: 200 OK
Total time: 2.34s

✅ FILE UPLOADED SUCCESSFULLY
File saved to Blob Storage and metadata in Cosmos DB
```

**If retry happens (network issue):**
```
📤 Attempt 1/3...
⚠️ Attempt 1 failed: Failed to fetch
⏳ Retrying in 1000ms...

📤 Attempt 2/3...
✅ Response received: 200 OK
```

---

## **❌ If Upload Still Fails**

### **Check 1: Is backend running?**
```javascript
fetch('https://file-manager-backend-app.azurewebsites.net/health')
  .then(r => r.text())
  .then(d => console.log(d))
  .catch(e => console.error('❌ Backend NOT RESPONDING:', e.message))
```

### **Check 2: Are environment variables set?**
```javascript
fetch('https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics')
  .then(r => r.json())
  .then(d => {
    console.log('Environment Status:');
    console.log('COSMOS_ENDPOINT:', d.environment.COSMOS_ENDPOINT);
    console.log('COSMOS_KEY:', d.environment.COSMOS_KEY);
    console.log('STORAGE:', d.environment.AZURE_STORAGE_CONNECTION_STRING);
    console.log('CONTAINER:', d.environment.CONTAINER_NAME);
  })
```

### **Check 3: Azure Services Connected?**
```javascript
fetch('https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics')
  .then(r => r.json())
  .then(d => {
    console.log('Blob Storage:', d.blobStorage);
    console.log('Cosmos DB:', d.cosmosDB);
  })
```

### **Check 4: CORS Issue?**
Look for error: `"Access to XMLHttpRequest has been blocked by CORS policy"`

If you see this, the frontend URL is not in the allowedOrigins list. Check:
```javascript
fetch('https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics')
  .then(r => r.json())
  .then(d => console.log('CORS Origins:', d.cors))
```

Must include: `"https://file-manager-frontend-app.azurewebsites.net"`

---

## **🔧 Troubleshooting Checklist**

- [ ] Deployment workflow completed successfully on GitHub Actions
- [ ] Backend health endpoint responds with 200 OK
- [ ] Frontend health endpoint responds with 200 OK
- [ ] All 4 environment variables show as "✓" in diagnostics
- [ ] Blob Storage shows "connected"
- [ ] Cosmos DB shows "connected"
- [ ] CORS origins include frontend URL
- [ ] File upload attempt shows console logs
- [ ] No "Failed to fetch" error (or shows clear retry messages)

---

## **📊 Real-Time Monitoring**

**Add this to your frontend to monitor backend:**

```javascript
setInterval(async () => {
  try {
    const response = await fetch('https://file-manager-backend-app.azurewebsites.net/health');
    console.log('🟢 Backend is healthy');
  } catch (error) {
    console.log('🔴 Backend is down:', error.message);
  }
}, 30000); // Check every 30 seconds
```

---

## **Expected Fix Behavior**

### **Before Fixes:**
- Click upload → "Failed to fetch" immediately
- No retry logic
- No health check
- Generic error message

### **After Fixes:**
- Click upload → Automatic health check
- Upload starts → Real-time console logs
- Network issue? → Automatic retry (1s delay, then 2s, then 4s)
- After 3 retries → Clear error with actionable message
- Success → "✅ FILE UPLOADED SUCCESSFULLY"

---

## **Need Help?**

If tests fail, provide:
1. Screenshot of error modal
2. Browser console output (F12 → Console)
3. Backend diagnostics response
4. GitHub Actions workflow status

