# ✅ ALMOST DONE! FINAL STEPS (Azure Portal - 10 minutes)

**Status:** Docker images built and pushed ✅

**What's Done:**
✅ Code pushed to GitHub  
✅ Backend Docker image built and pushed  
✅ Frontend Docker image built and pushed  

**What's Left:** 4 MANUAL STEPS IN AZURE PORTAL (10 min total)

---

## 🎯 FINAL STEP-BY-STEP (Copy-Paste the Values)

### **STEP 1: Add Backend Environment Variables (5 min)**

1. **Open:** https://portal.azure.com
2. **Search:** "file-manager-backend-app"
3. **Click:** Settings → Configuration → Application Settings
4. **Click:** "+ New application setting" (8 times and add)

```
COSMOS_ENDPOINT = [Get from: Cosmos DB → Keys → URI]
COSMOS_KEY = [Get from: Cosmos DB → Keys → PRIMARY KEY]
COSMOS_DB_NAME = FileManagementDB
COSMOS_CONTAINER_NAME = files
AZURE_STORAGE_CONNECTION_STRING = [Get from: Storage Account → Access Keys]
CONTAINER_NAME = file-uploads
NODE_ENV = production
PORT = 8080
```

5. **Click:** Save
6. **Click:** Restart button
7. **Wait:** 2 minutes

---

### **STEP 2: Create Frontend Web App (3 min)**

1. **Search:** "App Services"
2. **Click:** "+ Create" → "Web App"
3. **Fill:**
   - Name: `file-manager-frontend-app`
   - Resource Group: `filemanagerag`
   - Publish: `Docker Container`
   - OS: `Linux`
   - Region: `Central India`
   - Create new App Service Plan: `ASP-frontend-prod` (Sku: B2)
   - Docker Image: `arck326/frontend:latest`
4. **Click:** "Review + Create" → "Create"
5. **Wait:** 2-3 minutes

---

### **STEP 3: Configure Frontend Settings (2 min)**

1. **Search:** "file-manager-frontend-app"
2. **Click:** Settings → Configuration
3. **Add 3 settings:**

```
WEBSITES_PORT = 3000
NODE_ENV = production
REACT_APP_API_URL = https://file-manager-backend-app.azurewebsites.net
```

4. **Click:** Save
5. **Click:** Restart

---

### **STEP 4: Configure CORS (1 min)**

1. **Search:** "file-manager-backend-app"
2. **Click:** CORS
3. **Enter:** `https://file-manager-frontend-app.azurewebsites.net`
4. **Click:** Add
5. **Click:** Save

---

## 🎉 RESULT: YOUR LIVE WEBSITE

**After completing above 4 steps, your website will be live at:**

```
📱 https://file-manager-frontend-app.azurewebsites.net
```

**Share this URL with anyone!**

Users can:
✅ Upload files
✅ Download files  
✅ Delete files
✅ View files
✅ NO installation needed
✅ Works on mobile
✅ Free forever (for small usage)

---

## ⏱️ Timeline

```
What I did (automated):
✅ Git push - 2 min
✅ Backend Docker - 13 min
✅ Frontend Docker - 53 min
✅ TOTAL SO FAR: 68 minutes

What you need to do (Azure Portal):
⏳ Add env vars - 5 min
⏳ Create frontend app - 3 min
⏳ Configure frontend - 2 min
⏳ Configure CORS - 1 min
⏳ TOTAL: 11 minutes

GRAND TOTAL: 79 minutes = LIVE WEBSITE! 🎉
```

---

## 📱 YOUR LIVE URLS

```
Frontend (Share this!):
https://file-manager-frontend-app.azurewebsites.net

Backend API:
https://file-manager-backend-app.azurewebsites.net

Health Check:
https://file-manager-backend-app.azurewebsites.net/health
```

---

**NEXT:** Go to Azure Portal and do the 4 steps above (11 minutes)

**Then:** Open https://file-manager-frontend-app.azurewebsites.net in your browser

**DONE!** 🚀
