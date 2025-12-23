# API Connection Troubleshooting & Testing Guide

## 🚨 Quick Diagnostics

### Step 1: Check if Frontend is Loading
```
✅ Open: https://file-manager-frontend-app.azurewebsites.net
   Expected: See file upload interface
```

### Step 2: Check Browser Console (F12)
```
Should see:
✅ API Configuration Summary:
   Hostname: file-manager-frontend-app.azurewebsites.net
   Base URL: https://file-manager-backend-app.azurewebsites.net
   Environment: production
```

### Step 3: Test Backend Health
```javascript
// Paste in browser console (F12):
fetch('https://file-manager-backend-app.azurewebsites.net/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend Status:', d))
  .catch(e => console.error('❌ Backend Error:', e));

// Expected output:
// ✅ Backend Status: { status: 'ok', timestamp: '...' }
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Failed to fetch" when uploading

**Diagnosis:**
```javascript
// Check API configuration
console.log('Upload URL:', API_CONFIG.ENDPOINTS.UPLOAD);
// Should show: https://file-manager-backend-app.azurewebsites.net/api/files/upload
```

**Solutions:**

a) **Hard Refresh Frontend**
   - Press: `Ctrl+Shift+Delete` (or Cmd+Shift+Delete on Mac)
   - Go to: https://file-manager-frontend-app.azurewebsites.net
   - Try upload again

b) **Check Backend Status**
   ```bash
   # In terminal/PowerShell:
   curl https://file-manager-backend-app.azurewebsites.net/health
   # Should return: 200 OK
   ```

c) **Restart Backend Service**
   ```bash
   az webapp restart --name file-manager-backend-app --resource-group file-manager-rg
   ```

d) **Check Browser Console for CORS Error**
   - F12 → Console tab
   - Look for: "Access to fetch blocked by CORS policy"
   - If found, restart backend and check CORS config

---

### Issue 2: Files not appearing in list

**Diagnosis:**
```javascript
// Check if files are fetching
fetch('https://file-manager-backend-app.azurewebsites.net/api/files')
  .then(r => r.json())
  .then(d => console.log('Files:', d))
  .catch(e => console.error('Error:', e));
```

**Solutions:**

a) **Check userId in localStorage**
   ```javascript
   // In browser console:
   console.log('UserId:', localStorage.getItem('userId'));
   // Should show: user_1703337...
   ```

b) **Force Reload Files**
   ```javascript
   // Close and reopen the app, or press F5 (refresh)
   ```

c) **Check Network Requests**
   - F12 → Network tab
   - Refresh page
   - Look for request to `/api/files`
   - Click it and check Response tab

---

### Issue 3: 502 Bad Gateway

**This means backend is down**

**Solutions:**

a) **Check Backend Logs**
   ```bash
   az webapp log tail --name file-manager-backend-app --resource-group file-manager-rg
   ```

b) **Restart Backend**
   ```bash
   az webapp restart --name file-manager-backend-app --resource-group file-manager-rg
   ```

c) **Check App Service Status**
   ```bash
   az webapp show --name file-manager-backend-app --resource-group file-manager-rg \
     --query "{state: state, defaultHostName: defaultHostName}"
   ```

d) **Check Docker Container**
   ```bash
   # Check if container is running
   docker ps | grep backend
   
   # If not running, check logs
   docker logs backend-container-name
   ```

---

### Issue 4: CORS Error

**Error Message:**
```
Access to fetch at 'https://file-manager-backend-app.azurewebsites.net/api/files/upload'
from origin 'https://file-manager-frontend-app.azurewebsites.net' 
has been blocked by CORS policy
```

**Solutions:**

a) **Clear Browser Cache**
   - F12 → Network tab
   - Check "Disable cache"
   - Refresh page

b) **Check CORS Headers (Network Tab)**
   - F12 → Network tab
   - Click any API request
   - Go to Response Headers
   - Should see:
     ```
     access-control-allow-origin: https://file-manager-frontend-app.azurewebsites.net
     access-control-allow-methods: GET, POST, PUT, DELETE
     ```

c) **Restart Backend Service**
   ```bash
   az webapp restart --name file-manager-backend-app --resource-group file-manager-rg
   ```

d) **Check Backend CORS Config**
   ```bash
   # Check backend/src/index.js for cors() configuration
   cat backend/src/index.js | grep -A5 "cors("
   ```

---

### Issue 5: 413 Payload Too Large

**This means file is too big**

**Solutions:**

a) **Reduce File Size**
   - Upload smaller file
   - Compress PDF/images before upload
   - Split large files

b) **Check Backend Limit**
   ```bash
   # In backend/src/index.js, look for:
   // app.use(express.json({ limit: '100mb' }));
   # Default is usually 100MB
   ```

c) **Increase Limit (if needed)**
   - Edit backend/src/index.js
   - Change limit value
   - Rebuild Docker image
   - Redeploy to Azure

---

### Issue 6: 404 Not Found

**This means API endpoint path is wrong**

**Solutions:**

a) **Check API Endpoint Configuration**
   ```javascript
   // In browser console:
   console.log('Endpoints:');
   console.log('  Upload:', API_CONFIG.ENDPOINTS.UPLOAD);
   console.log('  List:', API_CONFIG.ENDPOINTS.LIST);
   
   // All should start with:
   // https://file-manager-backend-app.azurewebsites.net/api/...
   ```

b) **Verify Backend Routes**
   ```bash
   # Check backend route definitions
   cat backend/src/routes/files.js | grep "router\."
   # Should show POST /upload, GET /, etc.
   ```

c) **Check for Trailing Slashes**
   ```javascript
   // Check in config.js:
   // URLs should NOT have trailing slash:
   // ❌ https://file-manager-backend-app.azurewebsites.net/
   // ✅ https://file-manager-backend-app.azurewebsites.net
   ```

---

## 🧪 API Testing Commands

### Test 1: Health Check
```bash
# PowerShell:
Invoke-WebRequest -Uri "https://file-manager-backend-app.azurewebsites.net/health" -Method Get

# Bash/curl:
curl -X GET https://file-manager-backend-app.azurewebsites.net/health
```

**Expected:** Status 200, body: `{ "status": "ok" }`

---

### Test 2: Get All Files
```bash
# PowerShell:
$headers = @{
    'Content-Type' = 'application/json'
    'Accept' = 'application/json'
}
Invoke-WebRequest -Uri "https://file-manager-backend-app.azurewebsites.net/api/files" `
    -Method Get -Headers $headers

# Bash/curl:
curl -X GET https://file-manager-backend-app.azurewebsites.net/api/files \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

**Expected:** Status 200, array of files

---

### Test 3: Upload File
```bash
# PowerShell:
$file = Get-Item "C:\path\to\file.pdf"
$form = @{
    file = $file
    userId = "user_test"
    description = "Test file"
    tags = "test"
}
Invoke-WebRequest -Uri "https://file-manager-backend-app.azurewebsites.net/api/files/upload" `
    -Method Post -Form $form

# Bash/curl:
curl -X POST https://file-manager-backend-app.azurewebsites.net/api/files/upload \
  -F "file=@/path/to/file.pdf" \
  -F "userId=user_test" \
  -F "description=Test file" \
  -F "tags=test"
```

**Expected:** Status 201, returns file object with id and blobUrl

---

### Test 4: Check Frontend Connection
```javascript
// In browser console (F12):

// Test 1: Check config
console.log('API Config:', API_CONFIG);

// Test 2: Test health endpoint
fetch('https://file-manager-backend-app.azurewebsites.net/health')
  .then(r => r.json())
  .then(d => console.log('✅ Health:', d))
  .catch(e => console.error('❌ Health Error:', e));

// Test 3: Get files list
fetch('https://file-manager-backend-app.azurewebsites.net/api/files')
  .then(r => r.json())
  .then(d => console.log('✅ Files:', d))
  .catch(e => console.error('❌ Files Error:', e));

// Test 4: Check userId
console.log('UserId:', localStorage.getItem('userId'));
```

---

## 📊 Network Tab Analysis

### How to Use Network Tab
1. Open DevTools: F12
2. Click **Network** tab
3. Perform an action (upload, download, etc.)
4. Find the request (e.g., upload, files, etc.)
5. Click it to see details:

### What to Check

| Item | Expected Value | What if Wrong |
|------|---|---|
| **Status Code** | 200, 201 | Check Error Logs |
| **Method** | POST, GET, DELETE | Check API Config |
| **URL** | https://file-manager-backend-app.azurewebsites.net/... | Check config.js |
| **Request Headers** | Content-Type: application/json | Check request setup |
| **Response Headers** | access-control-allow-origin | Check CORS config |
| **Response Body** | JSON with file data | Check backend logs |
| **Duration** | < 5 seconds | Check network/backend |

---

## 🔧 Advanced Debugging

### Enable Detailed Logging
```javascript
// Add to browser console:

// 1. Check all API_CONFIG details
console.table(API_CONFIG);

// 2. Log a test API call
const testFetch = async () => {
  console.log('🔍 Testing API call to:', API_CONFIG.ENDPOINTS.LIST);
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.LIST);
    console.log('Response status:', response.status);
    console.log('Response headers:', {
      'content-type': response.headers.get('content-type'),
      'cors': response.headers.get('access-control-allow-origin'),
    });
    const data = await response.json();
    console.log('Response data:', data);
  } catch (err) {
    console.error('Error:', err);
  }
};
testFetch();

// 3. Check localStorage
console.log('LocalStorage:');
for (let key in localStorage) {
  console.log(`  ${key}:`, localStorage[key]);
}
```

### Check Server Logs
```bash
# View real-time logs from backend
az webapp log tail --name file-manager-backend-app --resource-group file-manager-rg

# Check specific errors
az webapp log show --name file-manager-backend-app --resource-group file-manager-rg | grep -i error
```

### Monitor Network Requests
```bash
# From terminal, monitor all requests:
# (This requires backend logging on request level)

# Check if CORS headers are being sent
curl -v https://file-manager-backend-app.azurewebsites.net/health 2>&1 | grep -i "access-control"
```

---

## ✅ Success Indicators

### You'll know it's working when:

1. **Browser Console Shows:**
   ```
   ✅ API Configuration Summary:
   ✅ API Endpoints configured:
   ✅ Backend Status: { status: 'ok' }
   ```

2. **Upload Works:**
   ```
   🚀 FILE UPLOAD INITIATED
   ✅ UPLOAD SUCCESS
   ```

3. **Files Appear:**
   ```
   ✅ Files loaded successfully: 5 files
   ```

4. **Network Tab Shows:**
   - Status: 200, 201, etc.
   - CORS headers present
   - Response time < 5 seconds

---

## 📞 When to Restart Services

**Restart Frontend When:**
- Changing API URLs
- Updating config.js
- Clearing browser cache doesn't help
- Deploying new version

```bash
az webapp restart --name file-manager-frontend-app --resource-group file-manager-rg
```

**Restart Backend When:**
- Getting 502 Bad Gateway
- CORS errors appear
- Files stop uploading suddenly
- Tests fail after deploying

```bash
az webapp restart --name file-manager-backend-app --resource-group file-manager-rg
```

---

## 📋 Checklist Before Deployment

- [ ] config.js uses production URL: `https://file-manager-backend-app.azurewebsites.net`
- [ ] All components import API_CONFIG from config.js
- [ ] No hardcoded localhost URLs in code
- [ ] CORS configured on backend
- [ ] Environment variables set correctly
- [ ] Frontend build runs without errors
- [ ] Backend health endpoint responds
- [ ] Test upload succeeds
- [ ] Files appear in list
- [ ] Network requests show correct URLs
- [ ] No CORS errors in console
- [ ] Production deployment complete

---

**Last Updated:** 23 December 2025  
**API Version:** v1  
**Status:** Production Ready ✅
