# 🚀 COMPLETE DEPLOYMENT - STEP BY STEP (EXECUTABLE)

**Status:** Ready to Deploy  
**Time:** 30 minutes  
**Result:** Live Public Website  

---

## 📋 BEFORE YOU START - PREPARE THESE VALUES

Go to Azure Portal and copy these values. You'll need them:

### **From Cosmos DB:**
```
Azure Portal → Cosmos DB → Keys

Copy these:
VALUE_1 = COSMOS_ENDPOINT (labeled as "URI")
VALUE_2 = COSMOS_KEY (labeled as "PRIMARY KEY")
```

### **From Storage Account:**
```
Azure Portal → Storage Account → Access Keys

Copy this:
VALUE_3 = AZURE_STORAGE_CONNECTION_STRING (full "Connection string")
```

Save them in a text file. You'll need these 3 values below.

---

## ✅ EXECUTION STEPS (COPY-PASTE READY)

### **STEP 1: Push Code to Git (2 min)**

**Run in Terminal:**

```powershell
cd "c:\Users\amank\OneDrive\Desktop\azure G4 CICD"

git add .

git commit -m "Deploy: Production ready code for Azure"

git push origin main
```

**Expected:** Green success message. ✅

---

### **STEP 2: Add Backend Environment Variables (5 min)**

**You need to do this in Azure Portal (I'll guide you):**

1. **Open:** [Azure Portal](https://portal.azure.com)
2. **Search:** "file-manager-backend-app"
3. **Click:** Settings → Configuration
4. **Click:** "Application Settings" tab
5. **Click:** "+ New application setting" (do this 8 times)

**Add these 8 settings:**

```
Setting 1:
Name: COSMOS_ENDPOINT
Value: [PASTE VALUE_1 from above - the URI]

Setting 2:
Name: COSMOS_KEY
Value: [PASTE VALUE_2 from above - the PRIMARY KEY]

Setting 3:
Name: COSMOS_DB_NAME
Value: FileManagementDB

Setting 4:
Name: COSMOS_CONTAINER_NAME
Value: files

Setting 5:
Name: AZURE_STORAGE_CONNECTION_STRING
Value: [PASTE VALUE_3 from above - full connection string]

Setting 6:
Name: CONTAINER_NAME
Value: file-uploads

Setting 7:
Name: NODE_ENV
Value: production

Setting 8:
Name: PORT
Value: 8080
```

6. **Click:** Save (button at top)
7. **Wait:** 30 seconds
8. **Click:** Restart button
9. **Wait:** 2 minutes

**Verify:** Go to [Health Check](https://file-manager-backend-app.azurewebsites.net/health) - should show "healthy" ✅

---

### **STEP 3: Build & Push Backend Docker Image (3 min)**

**Run in Terminal:**

```powershell
cd "c:\Users\amank\OneDrive\Desktop\azure G4 CICD"

$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"

docker build -f backend/Dockerfile -t arck326/backend:latest ./backend

docker push arck326/backend:latest
```

**Expected:** 
- Build message shows "Successfully tagged"
- Push shows "Pushed" with layer info ✅

---

### **STEP 4: Build & Push Frontend Docker Image (3 min)**

**Run in Terminal:**

```powershell
docker build -f frontend/Dockerfile -t arck326/frontend:latest .

docker push arck326/frontend:latest
```

**Expected:**
- Build shows "Successfully tagged"
- Push shows "Pushed" ✅

---

### **STEP 5: Create Frontend Web App in Azure Portal (5 min)**

**You do this in Azure Portal:**

1. **Open:** [Azure Portal](https://portal.azure.com)
2. **Search:** "App Services"
3. **Click:** "+ Create" button
4. **Select:** "Web App"

**Fill Form:**

```
Subscription: (your subscription)
Resource Group: filemanagerag
Name: file-manager-frontend-app
Publish: Docker Container
OS: Linux
Region: Central India

App Service Plan:
  Click "Create new"
  Name: ASP-frontend-prod
  Sku: B2
  Click OK

Docker:
  Image Source: Docker Hub
  Access Type: Public
  Image and tag: arck326/frontend:latest
```

5. **Click:** "Review + Create"
6. **Click:** "Create"
7. **Wait:** 2-3 minutes for deployment
8. **Verify:** Status shows "Running" ✅

---

### **STEP 6: Configure Frontend App Settings (3 min)**

**In Azure Portal:**

1. **Search:** "file-manager-frontend-app"
2. **Click:** Settings → Configuration
3. **Click:** "+ New application setting" (3 times)

**Add these 3 settings:**

```
Setting 1:
Name: WEBSITES_PORT
Value: 3000

Setting 2:
Name: NODE_ENV
Value: production

Setting 3:
Name: REACT_APP_API_URL
Value: https://file-manager-backend-app.azurewebsites.net
```

4. **Click:** Save
5. **Restart** the app
6. **Wait:** 2 minutes ✅

---

### **STEP 7: Configure CORS in Backend (2 min)**

**In Azure Portal:**

1. **Search:** "file-manager-backend-app"
2. **Click:** CORS (in left menu)
3. **Enter:** `https://file-manager-frontend-app.azurewebsites.net`
4. **Click:** Add
5. **Click:** Save ✅

---

### **STEP 8: Test Everything (5 min)**

**Test 1: Health Check**

```powershell
Invoke-WebRequest `
  -Uri "https://file-manager-backend-app.azurewebsites.net/health" `
  -UseBasicParsing | Select-Object StatusCode
```

**Expected:** StatusCode = 200 ✅

**Test 2: Open Frontend**

Open browser and visit:
```
https://file-manager-frontend-app.azurewebsites.net
```

**Expected:** Welcome screen appears ✅

**Test 3: Upload a File**

1. Click "Enter App"
2. Drag a file or click to select
3. Click "Upload"

**Expected:** File uploads in < 5 seconds ✅

**Test 4: Refresh Page**

Press F5

**Expected:** File still shows (data persisted) ✅

---

## 🎉 YOU'RE LIVE!

### **Your Public Website:**

```
https://file-manager-frontend-app.azurewebsites.net
```

**Share this URL with anyone!** They can:
- Upload files
- Download files
- Delete files
- See their files
- All without installing anything!

---

## 📊 Status

```
✅ Backend: file-manager-backend-app.azurewebsites.net
✅ Frontend: file-manager-frontend-app.azurewebsites.net
✅ Database: Connected
✅ Storage: Connected
✅ HTTPS: Enabled everywhere
✅ Public Access: YES
✅ Status: LIVE! 🎉
```

---

## 🚀 SUMMARY OF ALL STEPS

| Step | Action | Time | Status |
|------|--------|------|--------|
| 1 | Push code to Git | 2 min | Terminal command |
| 2 | Add backend env vars | 5 min | Azure Portal clicks |
| 3 | Build backend docker | 3 min | Terminal command |
| 4 | Build frontend docker | 3 min | Terminal command |
| 5 | Create frontend app | 5 min | Azure Portal clicks |
| 6 | Config frontend | 3 min | Azure Portal clicks |
| 7 | Config CORS | 2 min | Azure Portal clicks |
| 8 | Test everything | 5 min | Browser testing |
| **TOTAL** | | **30 min** | **LIVE!** ✅ |

---

**NEXT ACTION: Start with STEP 1 above!**
