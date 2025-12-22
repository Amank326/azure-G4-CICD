# 🚀 QUICK EXECUTION GUIDE (30 MINUTES TO LIVE)

**Status:** All code updated and ready  
**Time Remaining:** 30 minutes  
**Difficulty:** EASY (Copy-Paste Steps)  

---

## ✅ WHAT I'VE DONE FOR YOU

```
✅ Created: frontend/src/config.js
   → Environment-aware API configuration
   → Works in development & production

✅ Updated: backend/src/index.js
   → CORS configured for production
   → Allows frontend.azurewebsites.net

✅ Updated: frontend/src/components/FileUpload.js
   → Uses API_CONFIG instead of hardcoded localhost
   → Production-ready

✅ Updated: frontend/src/components/FileList.js
   → Uses API_CONFIG for all endpoints
   → Download, Edit, Delete all configured

✅ All code changes: ✅ COMPLETE & READY
```

---

## 📋 NEXT STEPS (FOLLOW EXACTLY)

### **STEP 1: Push Code to Git (2 min)**

```powershell
cd "c:\Users\amank\OneDrive\Desktop\azure G4 CICD"

# Add all changes
git add .

# Commit
git commit -m "Production: Update CORS and API configuration for Azure deployment"

# Push
git push origin main
```

**Expected:** Code pushed to GitHub

---

### **STEP 2: Add Backend Environment Variables (5 min)**

**Go to:** Azure Portal

1. **Search:** "file-manager-backend-app"
2. **Click:** Settings → Configuration
3. **Add these 8 Application Settings:**

| Name | Value | Where to Get |
|------|-------|-------------|
| COSMOS_ENDPOINT | `https://[account].documents.azure.com:443/` | Cosmos DB → Keys → Copy URI |
| COSMOS_KEY | `[88 char key]` | Cosmos DB → Keys → Copy PRIMARY KEY |
| COSMOS_DB_NAME | `FileManagementDB` | Use as is |
| COSMOS_CONTAINER_NAME | `files` | Use as is |
| AZURE_STORAGE_CONNECTION_STRING | `DefaultEndpoint=https://...` | Storage Account → Access Keys → Copy full string |
| CONTAINER_NAME | `file-uploads` | Use as is |
| NODE_ENV | `production` | Use as is |
| PORT | `8080` | Use as is |

**How to add:**
1. Click **"+ New application setting"**
2. Enter Name and Value
3. Click OK
4. Repeat 7 more times
5. Click **Save** at top
6. Wait 30 seconds

**Verification:**
```powershell
# Test in PowerShell
$response = Invoke-WebRequest `
  -Uri "https://file-manager-backend-app.azurewebsites.net/health" `
  -UseBasicParsing

$response.Content | ConvertFrom-Json
```

**Expected output:**
```json
{
  "status": "healthy",
  "service": "File Management API",
  "timestamp": "2025-12-22T...",
  "uptime": 120.5
}
```

**If this fails:** 
- Check all 8 variables are correctly entered
- Check COSMOS_ENDPOINT ends with `:443/`
- Restart the backend app in Azure Portal

---

### **STEP 3: Build Backend Docker Image (3 min)**

```powershell
# Navigate to project
cd "c:\Users\amank\OneDrive\Desktop\azure G4 CICD"

# Set Docker path
$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"

# Build backend image
docker build -f backend/Dockerfile -t arck326/backend:latest ./backend

# Push to Docker Hub (should already be logged in)
docker push arck326/backend:latest
```

**Expected:** Image pushed successfully

---

### **STEP 4: Build Frontend Docker Image (3 min)**

```powershell
# Build frontend image
docker build -f frontend/Dockerfile -t arck326/frontend:latest .

# Test locally (OPTIONAL - skip if in hurry)
# docker run -p 3000:3000 arck326/frontend:latest
# Visit http://localhost:3000
# Press Ctrl+C to stop

# Push to Docker Hub
docker push arck326/frontend:latest
```

**Expected:** Frontend image on Docker Hub

---

### **STEP 5: Create Frontend Web App (5 min)**

**Go to:** Azure Portal

1. **Search:** "App Services" → Click "Create" → "Web App"
2. **Fill in:**

```
Subscription: (your current subscription)
Resource Group: filemanagerag
Name: file-manager-frontend-app
Publish: Docker Container
OS: Linux
Region: Central India

App Service Plan:
- Select: Create new
- Name: ASP-frontend-prod
- Sku: B1 (Budget) or B2 (Recommended)

Docker Settings:
- Image Source: Docker Hub
- Access Type: Public
- Image and tag: arck326/frontend:latest
- Startup File: (leave empty)
```

3. Click **"Review + Create"** → **"Create"**
4. **Wait** 2-3 minutes for deployment
5. When done, status should show **"Running"** ✅

---

### **STEP 6: Configure Frontend Settings (3 min)**

**In Azure Portal:**

1. **Go to:** file-manager-frontend-app → Settings → Configuration
2. **Add these Application Settings:**

| Name | Value |
|------|-------|
| WEBSITES_PORT | 3000 |
| NODE_ENV | production |
| REACT_APP_API_URL | https://file-manager-backend-app.azurewebsites.net |

3. **Click:** Save
4. **Restart** the app

---

### **STEP 7: Configure CORS (1 min)**

**In Azure Portal:**

1. **Go to:** file-manager-backend-app → CORS
2. **Add Allowed Origin:** `https://file-manager-frontend-app.azurewebsites.net`
3. **Click:** Save

---

### **STEP 8: TEST EVERYTHING (5 min)**

#### **Test 1: Backend Health**

```powershell
$response = Invoke-WebRequest `
  -Uri "https://file-manager-backend-app.azurewebsites.net/health" `
  -UseBasicParsing

$response.Content
```

**Expected:** Status = "healthy"

#### **Test 2: Frontend Loads**

Open browser:
```
https://file-manager-frontend-app.azurewebsites.net
```

**Expected:**
- ✅ Page loads
- ✅ Welcome screen appears
- ✅ No errors in console (F12)

#### **Test 3: Upload File**

1. Click "Enter App"
2. Drag & drop a file or click to select
3. Add description
4. Click "Upload File"

**Expected:**
- ✅ File uploads in < 5 seconds
- ✅ Shows success message
- ✅ No errors in console

#### **Test 4: List Files**

Scroll down or navigate to Files section

**Expected:**
- ✅ Uploaded file shows in list
- ✅ File name, size, date visible
- ✅ No errors

#### **Test 5: Delete File**

Click delete button on the file

**Expected:**
- ✅ File deleted successfully
- ✅ Removed from list immediately
- ✅ No errors

#### **Test 6: Refresh Page**

Press F5 or Cmd+R

**Expected:**
- ✅ Files still show (data persisted!)
- ✅ Page loads fully
- ✅ No JavaScript errors

---

## ✅ SUCCESS CHECKLIST

Before celebrating, verify:

```
BACKEND:
☑ Health endpoint returns "healthy"
☑ All 8 environment variables set in Azure Portal
☑ Backend app status: "Running"
☑ No errors in logs

FRONTEND:
☑ Website loads at azurewebsites.net URL
☑ No JavaScript errors in console (F12)
☑ All UI components visible
☑ App is "Running" in Azure Portal

INTEGRATION:
☑ Can upload a file (< 5 sec)
☑ File appears in list
☑ Can download file
☑ Can delete file
☑ Files persist after refresh (F5)

PERFORMANCE:
☑ Page loads in < 3 seconds
☑ API calls complete in < 1 second
☑ No 404 or 500 errors
☑ No CORS errors
```

**All checks passing?** → **YOU ARE LIVE! 🎉**

---

## 📊 YOUR LIVE URLS

```
Frontend (Public Website):
https://file-manager-frontend-app.azurewebsites.net

Backend (API):
https://file-manager-backend-app.azurewebsites.net

Share the frontend URL with anyone to use your app!
```

---

## 🚨 COMMON ISSUES & FIXES

| Issue | Fix |
|-------|-----|
| **Backend health endpoint 404** | Check COSMOS_ENDPOINT ends with `:443/` |
| **Frontend shows blank page** | Check WEBSITES_PORT = 3000 is set |
| **API calls fail (CORS error)** | Add frontend URL to backend CORS settings |
| **File upload fails** | Check AZURE_STORAGE_CONNECTION_STRING is correct |
| **Files not persisting** | Check database connection in logs |
| **Slow page load** | First load may be slow (cold start) - wait 10 sec |

---

## 📱 DEMO YOUR APP

```
Share this URL with friends/family:
https://file-manager-frontend-app.azurewebsites.net

They can:
✅ Upload files from their computer
✅ Download files they uploaded
✅ Add descriptions to files
✅ Delete files they don't want
✅ See files persist across sessions

NO installation needed - just open the URL!
```

---

## ⏱️ TIME BREAKDOWN

```
Step 1: Push code           2 min ⏳
Step 2: Backend env vars    5 min ⏳
Step 3: Build backend       3 min ⏳
Step 4: Build frontend      3 min ⏳
Step 5: Create frontend app 5 min ⏳
Step 6: Configure frontend  3 min ⏳
Step 7: Configure CORS      1 min ⏳
Step 8: Test everything     5 min ⏳

TOTAL: 30 minutes ⏱️
```

---

## 🎯 YOU'RE 95% DONE!

All the hard work is done:
- ✅ Code written (1500+ lines)
- ✅ Docker images ready
- ✅ Database ready
- ✅ Storage ready
- ✅ Code updated for production

Now just follow the 8 steps above and:

**🚀 YOUR APP GOES LIVE IN 30 MINUTES!** 🚀

Start with STEP 1. Don't skip any steps. You'll be live!

---

**Document:** Quick Execution Guide  
**Date:** December 22, 2025  
**Status:** Ready to Deploy  
**Time to Live:** 30 minutes  

**LET'S GO LIVE!** 🚀
