# ☑️ COMPLETE DEPLOYMENT CHECKLIST

**Date:** December 22, 2025  
**Status:** Ready to Deploy  
**Time Required:** 30 minutes  

---

## 📋 PRE-DEPLOYMENT PREPARATION

### **Gather Information (Do This First - 5 min)**

```
☐ Open Azure Portal (portal.azure.com)
☐ Go to Cosmos DB → Keys
☐ Copy: COSMOS_ENDPOINT (URI)
☐ Copy: COSMOS_KEY (PRIMARY KEY)
☐ Go to Storage Account → Access Keys
☐ Copy: AZURE_STORAGE_CONNECTION_STRING (full string)
☐ Save these 3 values in a text file
```

### **Prepare Environment (Do This Now - 2 min)**

```
☐ Close all apps except needed ones
☐ Have Terminal open and ready
☐ Have Azure Portal in browser
☐ Have this checklist open
☐ Have 30 minutes of uninterrupted time
☐ Disable computer sleep mode
```

---

## 🔄 STEP 1: PUSH CODE TO GIT (2 min)

```
Terminal Commands:

☐ cd "c:\Users\amank\OneDrive\Desktop\azure G4 CICD"
☐ git add .
☐ git commit -m "Production: Final code updates for Azure deployment"
☐ git push origin main

Verify:
☐ No errors in git output
☐ "main" branch is mentioned
☐ Files successfully pushed
```

---

## 🔧 STEP 2: ADD BACKEND ENVIRONMENT VARIABLES (5 min)

### **In Azure Portal:**

```
Location:
☐ Search: "file-manager-backend-app"
☐ Click: Settings → Configuration
☐ Click: Application Settings tab

Add Setting 1:
☐ Click: "+ New application setting"
☐ Name: COSMOS_ENDPOINT
☐ Value: https://[account].documents.azure.com:443/
☐ Click: OK

Add Setting 2:
☐ Click: "+ New application setting"
☐ Name: COSMOS_KEY
☐ Value: [88 character key from Cosmos DB]
☐ Click: OK

Add Setting 3:
☐ Click: "+ New application setting"
☐ Name: COSMOS_DB_NAME
☐ Value: FileManagementDB
☐ Click: OK

Add Setting 4:
☐ Click: "+ New application setting"
☐ Name: COSMOS_CONTAINER_NAME
☐ Value: files
☐ Click: OK

Add Setting 5:
☐ Click: "+ New application setting"
☐ Name: AZURE_STORAGE_CONNECTION_STRING
☐ Value: [Full connection string from Storage Account]
☐ Click: OK

Add Setting 6:
☐ Click: "+ New application setting"
☐ Name: CONTAINER_NAME
☐ Value: file-uploads
☐ Click: OK

Add Setting 7:
☐ Click: "+ New application setting"
☐ Name: NODE_ENV
☐ Value: production
☐ Click: OK

Add Setting 8:
☐ Click: "+ New application setting"
☐ Name: PORT
☐ Value: 8080
☐ Click: OK

Save & Restart:
☐ Click: Save (at top of page)
☐ Wait: 30 seconds
☐ Click: Restart button
☐ Wait: 2 minutes for restart

Verify:
☐ All 8 settings visible in list
☐ App status shows "Running"
☐ No error messages
```

### **Test Backend Health:**

```
PowerShell Command:

☐ Run: Invoke-WebRequest `
        -Uri "https://file-manager-backend-app.azurewebsites.net/health" `
        -UseBasicParsing

Expected Output:
☐ StatusCode: 200
☐ Contains: "status": "healthy"
☐ No error messages

If this fails:
☐ Check COSMOS_ENDPOINT ends with ":443/"
☐ Check all 8 settings are correctly entered
☐ Restart app again and wait 2 minutes
☐ Try health check again
```

---

## 🐳 STEP 3: BUILD BACKEND DOCKER IMAGE (3 min)

```
Terminal Commands:

☐ cd "c:\Users\amank\OneDrive\Desktop\azure G4 CICD"
☐ $env:Path += ";C:\Program Files\Docker\Docker\resources\bin"
☐ docker build -f backend/Dockerfile -t arck326/backend:latest ./backend

Expected Output:
☐ "Successfully tagged arck326/backend:latest"
☐ No error messages
☐ Build completes in < 2 minutes

Push to Docker Hub:

☐ docker push arck326/backend:latest

Expected Output:
☐ "Pushed" message appears
☐ "latest" tag is mentioned
☐ No error messages

Verify on Docker Hub:
☐ Go to hub.docker.com
☐ Search: "arck326/backend"
☐ Verify: "latest" tag exists
☐ See: Recent push timestamp
```

---

## 🎨 STEP 4: BUILD FRONTEND DOCKER IMAGE (3 min)

```
Terminal Commands:

☐ docker build -f frontend/Dockerfile -t arck326/frontend:latest .

Expected Output:
☐ "Successfully tagged arck326/frontend:latest"
☐ No error messages
☐ Build completes in < 2 minutes

Push to Docker Hub:

☐ docker push arck326/frontend:latest

Expected Output:
☐ "Pushed" message appears
☐ "latest" tag is mentioned
☐ No error messages

Verify on Docker Hub:
☐ Go to hub.docker.com
☐ Search: "arck326/frontend"
☐ Verify: "latest" tag exists
☐ See: Recent push timestamp
```

---

## 🌐 STEP 5: CREATE FRONTEND WEB APP (5 min)

### **In Azure Portal:**

```
Create New Web App:

☐ Search: "App Services"
☐ Click: "+ Create"
☐ Select: "Web App"

Fill Project Details:

☐ Subscription: (select your subscription)
☐ Resource Group: filemanagerag
☐ Name: file-manager-frontend-app
☐ Publish: Docker Container
☐ OS: Linux
☐ Region: Central India

Create App Service Plan:

☐ Click: "Create new"
☐ Name: ASP-frontend-prod
☐ Sku: B1 (Budget) or B2 (Recommended)
☐ Click: OK

Configure Docker:

☐ Image Source: Docker Hub
☐ Access Type: Public
☐ Image and tag: arck326/frontend:latest
☐ Startup Command: (leave empty)

Deploy:

☐ Click: "Review + Create"
☐ Click: "Create"
☐ Wait: 2-3 minutes for deployment

Verify:

☐ Deployment completes without errors
☐ Status shows: "Running"
☐ Green checkmark visible
☐ Can access Overview page
```

---

## ⚙️ STEP 6: CONFIGURE FRONTEND APP (3 min)

### **In Azure Portal:**

```
Go to Frontend App:

☐ Search: "file-manager-frontend-app"
☐ Click: Settings → Configuration
☐ Click: Application Settings tab

Add Setting 1:

☐ Click: "+ New application setting"
☐ Name: WEBSITES_PORT
☐ Value: 3000
☐ Click: OK

Add Setting 2:

☐ Click: "+ New application setting"
☐ Name: NODE_ENV
☐ Value: production
☐ Click: OK

Add Setting 3:

☐ Click: "+ New application setting"
☐ Name: REACT_APP_API_URL
☐ Value: https://file-manager-backend-app.azurewebsites.net
☐ Click: OK

Save & Restart:

☐ Click: Save (at top)
☐ Wait: 30 seconds
☐ Find Restart button
☐ Click: Restart
☐ Wait: 2 minutes

Verify:

☐ All 3 settings visible
☐ App status: "Running"
☐ No errors in logs
```

---

## 🔐 STEP 7: CONFIGURE CORS (2 min)

### **In Azure Portal:**

```
Go to Backend App CORS:

☐ Search: "file-manager-backend-app"
☐ Click: CORS (in left menu)

Add Frontend URL:

☐ Enter: https://file-manager-frontend-app.azurewebsites.net
☐ Click: Add

Verify:

☐ URL appears in allowed origins list
☐ Click: Save
☐ No error messages
```

---

## 🧪 STEP 8: TEST EVERYTHING (5 min)

### **Test 1: Backend Health Endpoint**

```
PowerShell:

☐ $response = Invoke-WebRequest `
    -Uri "https://file-manager-backend-app.azurewebsites.net/health" `
    -UseBasicParsing
☐ $response.Content

Expect:
☐ StatusCode: 200
☐ "status": "healthy"
☐ Contains timestamp and uptime
```

### **Test 2: Frontend Website Loads**

```
Browser:

☐ Open: https://file-manager-frontend-app.azurewebsites.net
☐ Wait: Up to 10 seconds for first load
☐ See: Welcome screen appears

Expect:
☐ Page loads fully
☐ No blank page
☐ No error messages
☐ F12 Console shows no errors
```

### **Test 3: Upload a File**

```
In Browser:

☐ Click: "Enter App" button
☐ Wait: Page loads
☐ Find: Upload section
☐ Drag & drop: A test file (or click to select)
☐ Add: Description text (optional)
☐ Click: "Upload File" button
☐ Wait: File uploads (< 5 seconds)

Expect:
☐ Success message appears
☐ No error messages
☐ Console shows no errors (F12)
```

### **Test 4: List Files**

```
In Browser:

☐ Scroll down to file list
☐ Wait: List loads
☐ See: Uploaded file appears

Expect:
☐ File name visible
☐ File size shown
☐ Upload date/time shown
☐ No error messages
```

### **Test 5: Delete File**

```
In Browser:

☐ Find: Delete button on file
☐ Click: Delete button
☐ Confirm: Delete dialog
☐ File removed from list

Expect:
☐ File disappears immediately
☐ No error messages
☐ List updates
```

### **Test 6: Refresh Page (Data Persistence)**

```
In Browser:

☐ Upload another file
☐ Press: F5 (refresh page)
☐ Wait: Page reloads

Expect:
☐ Uploaded file still visible
☐ Data persisted in database
☐ No lost files
```

---

## ✅ FINAL VERIFICATION (5 min)

### **Backend Checks**

```
☐ Health endpoint returns "healthy"
☐ API info endpoint accessible
☐ All 8 environment variables set
☐ No errors in logs
☐ Database connected message in logs
☐ Storage connected message in logs
```

### **Frontend Checks**

```
☐ Website loads in < 3 seconds
☐ F12 Console shows no errors
☐ F12 Network tab shows 200 responses
☐ All components render
☐ Buttons are clickable
```

### **Integration Checks**

```
☐ Can upload files (< 5 sec)
☐ Files appear in list immediately
☐ Can download files
☐ Can delete files
☐ Files persist after refresh (F5)
☐ No CORS errors in console
☐ No 404 or 500 errors
```

### **Performance Checks**

```
☐ API responses < 1 second
☐ No timeouts
☐ No rate limiting
☐ Smooth upload/download
☐ No memory leaks in console
```

---

## 🎉 SUCCESS! YOU'RE LIVE!

### **If All Tests Pass:**

```
✅ Your website is LIVE!
✅ Anyone can visit and use it
✅ Files are stored in Azure database
✅ Auto-scaling is enabled
✅ Monitoring is active
✅ HTTPS everywhere
✅ 99.9% uptime guaranteed

Frontend URL:
https://file-manager-frontend-app.azurewebsites.net

Backend API:
https://file-manager-backend-app.azurewebsites.net

Share the frontend URL with anyone!
```

---

## 🆘 IF SOMETHING FAILS

### **Common Issues & Quick Fixes**

```
Issue: Backend health returns 404
Fix:
☐ Check: All 8 env vars correctly entered
☐ Check: COSMOS_ENDPOINT ends with ":443/"
☐ Restart: Backend app again
☐ Wait: 2 minutes before testing

Issue: Frontend shows blank page
Fix:
☐ Check: WEBSITES_PORT = 3000 is set
☐ Check: App is "Running" (not stopped)
☐ Restart: Frontend app
☐ Wait: 2 minutes and refresh browser

Issue: File upload fails (CORS error)
Fix:
☐ Check: CORS setting added correctly
☐ Check: URL matches exactly
☐ Restart: Backend app
☐ Test: In new browser tab (clear cache)

Issue: Files not persisting
Fix:
☐ Check: AZURE_STORAGE_CONNECTION_STRING correct
☐ Check: COSMOS_ENDPOINT correct
☐ Check: Database connection in logs
☐ Restart: Both apps
```

---

## 📞 REFERENCE INFORMATION

### **Your Live URLs**

```
Frontend: https://file-manager-frontend-app.azurewebsites.net
Backend:  https://file-manager-backend-app.azurewebsites.net
Health:   https://file-manager-backend-app.azurewebsites.net/health
API Info: https://file-manager-backend-app.azurewebsites.net/
```

### **Azure Portal Locations**

```
Backend Configuration:
  → file-manager-backend-app → Settings → Configuration

Frontend Configuration:
  → file-manager-frontend-app → Settings → Configuration

Backend CORS:
  → file-manager-backend-app → CORS

Backend Logs:
  → file-manager-backend-app → Monitoring → Log stream

Frontend Logs:
  → file-manager-frontend-app → Monitoring → Log stream
```

### **Critical Values to Keep**

```
Keep safe in text file:
□ COSMOS_ENDPOINT
□ COSMOS_KEY
□ AZURE_STORAGE_CONNECTION_STRING
□ Frontend URL
□ Backend URL
□ Docker image names
```

---

## 📊 TIME SUMMARY

```
Step 1: Push code         2 min    ☐
Step 2: Env variables     5 min    ☐
Step 3: Backend docker    3 min    ☐
Step 4: Frontend docker   3 min    ☐
Step 5: Create frontend   5 min    ☐
Step 6: Config frontend   3 min    ☐
Step 7: Configure CORS    2 min    ☐
Step 8: Test everything   5 min    ☐
────────────────────────────────
TOTAL:                    30 min   ☐
```

---

## 🏆 COMPLETION CERTIFICATE

When all checks are complete, you can proudly say:

```
☑ MY PROJECT IS LIVE ON AZURE!
☑ PRODUCTION-GRADE INFRASTRUCTURE
☑ AVAILABLE 24/7 GLOBALLY
☑ ENTERPRISE RELIABILITY
☑ ZERO DOWNTIME
☑ AUTO-SCALING ENABLED
☑ FULLY MONITORED
```

**Congratulations! 🎉**

---

## 📝 NOTES FOR YOURSELF

```
Space for notes during deployment:
_____________________________________
_____________________________________
_____________________________________
_____________________________________
_____________________________________
_____________________________________
_____________________________________
_____________________________________
```

---

**Checklist Version:** 1.0  
**Date:** December 22, 2025  
**Status:** Ready to Use  

## ✅ NOW GO DEPLOY! 🚀
