# 🚀 Deploy Backend Using Azure App Services Extension

**Status:** Step-by-Step Deployment Guide  
**Time Required:** 15-20 minutes  
**Difficulty:** Easy (All via VS Code UI)

---

## 📍 Step 1: Open Azure Extension (2 minutes)

### In VS Code:
1. **Look at Left Sidebar** (Activity Bar)
2. **Click Azure Icon** (4th or 5th icon from top)
   - Icon looks like: **⊗** or **Azure** logo

### What You Should See:
```
AZURE
├── App Services
│   └── your-app-name (Running)
├── Resources  
├── Subscriptions
└── Help
```

---

## 🔐 Step 2: Sign In to Azure (2 minutes)

### If Not Already Signed In:
1. Click **"Sign in to Azure"** button
2. Browser window opens
3. Enter Azure credentials
4. Click "Continue"
5. VS Code shows **"✅ Successfully signed in"**

### If Already Signed In:
Skip to Step 3

---

## 📱 Step 3: View Your App Service (1 minute)

### In Azure Explorer:
1. **Click** "App Services" section
2. **You should see:**
   ```
   App Services
   └── your-app-name
       └── (Status icon - blue or green)
   ```

### What Status Means:
- 🟢 **Green/Blue circle** = Running
- ⚫ **Black/Gray circle** = Stopped
- 🔄 **Rotating icon** = Updating

---

## ⚙️ Step 4: Configure Application Settings (5 minutes)

### Method 1: Via Extension (Recommended)

**1. Right-click your App Service**
```
App Services
└── your-app-name (Right-click here)
```

**2. Select "Application Settings"**
```
Context Menu:
├── Open in Portal
├── Deploy to Web App
├── SSH
├── Stream Logs
├── Application Settings ← Click this
├── Start
├── Stop
├── Restart
└── Delete
```

**3. Add Environment Variables**

A settings editor opens. Add each line:

```
COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_KEY=your-primary-key
COSMOS_DB_NAME=FileManagementDB
COSMOS_CONTAINER_NAME=files
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
CONTAINER_NAME=file-uploads
NODE_ENV=production
PORT=8080
```

**4. Save**
- Changes save automatically to Azure
- Green checkmark appears

---

### Method 2: Via Azure Portal (Alternative)

**1. Right-click App Service**
**2. Select "Open in Portal"**
**3. In Azure Portal:**
   - Settings → Configuration
   - Click "New application setting"
   - Add each variable
   - Click "Save"

---

## 📦 Step 5: Deploy Docker Image (5 minutes)

### What You're Deploying:
```
Docker Image: arck326/backend:latest
Size: ~300 MB
Contains: Node.js + Express + Azure SDKs
```

### Deployment Steps:

**1. Right-click App Service**
```
App Services
└── your-app-name (Right-click)
```

**2. Select "Deploy to Web App"**
```
Context Menu Options appear:
├── Deploy to Web App ← Click this
```

**3. Choose Deployment Source**

Option A: **Docker Container**
```
Select: "Deploy image from ACR/Docker Hub"
Image: arck326/backend:latest
Registry: Docker Hub
```

Option B: **Local Code**
```
Select: "Deploy from workspace"
Choose: backend folder
```

**4. Confirm Deployment**
- Extension shows: **"Deploying..."**
- Progress bar appears
- Wait for: **"Deployment completed"**

---

## 📊 Step 6: Monitor Deployment (Real-time - 3 minutes)

### Stream Live Logs:

**1. Right-click App Service**
```
App Services
└── your-app-name (Right-click)
```

**2. Select "Stream Logs"**
```
Output panel opens showing:

2025-12-22 10:30:00 - Starting container...
2025-12-22 10:30:05 - Installing dependencies...
2025-12-22 10:30:15 - ✅ npm dependencies installed
2025-12-22 10:30:20 - Starting Express server...
2025-12-22 10:30:22 - ✅ Server running on port 8080
2025-12-22 10:30:25 - ✅ Connected to Cosmos DB
2025-12-22 10:30:26 - ✅ Connected to Blob Storage
```

### Watch for:
- ✅ **"Server running"** = Success!
- ✅ **"Connected to Azure"** = Database connected
- ❌ **"Error"** = Check error message
- ⏰ **Takes 30-60 seconds** = Normal

---

## ✅ Step 7: Verify Deployment (2 minutes)

### Test Health Endpoint:

**Option 1: Via VS Code**
1. In Output panel, find your API URL
2. Copy: `https://your-app.azurewebsites.net`
3. Open in browser with: `/health`
4. Should see:
```json
{
  "status": "healthy",
  "service": "File Management API",
  "timestamp": "2025-12-22T10:30:00.000Z",
  "uptime": 45.123
}
```

**Option 2: Via Command Line**
```powershell
curl https://your-app.azurewebsites.net/health
```

**Expected Response:**
```json
{ "status": "healthy" }
```

---

## 🧪 Step 8: Test APIs (2 minutes)

### Test Upload Endpoint:
```powershell
# Test file upload
curl -X POST https://your-app.azurewebsites.net/api/files/upload `
  -F "file=@test.pdf" `
  -F "userId=testuser" `
  -F "description=Test PDF"
```

### Expected Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fileName": "test.pdf",
  "fileSize": 102400,
  "uploadedAt": "2025-12-22T10:35:00.000Z",
  "blobUrl": "https://storage.blob.core.windows.net/..."
}
```

### Test List Endpoint:
```powershell
curl "https://your-app.azurewebsites.net/api/files?userId=testuser"
```

---

## 🔄 Step 9: Update/Redeploy (If Needed)

### For Code Changes:

**1. Right-click App Service**
**2. Select "Deploy to Web App"**
**3. Choose updated source**
**4. Wait for deployment**

### Quick Redeploy:
```powershell
# Push to GitHub
git add .
git commit -m "Update: <description>"
git push origin main

# GitHub Actions auto-builds and deploys
# Takes 5-10 minutes
```

---

## 📋 Common Actions

### View App Properties
```
Right-click → Properties
Shows: URL, location, status, pricing tier
```

### SSH into Container
```
Right-click → SSH
Opens terminal inside running container
Useful for debugging
```

### Stop App Service
```
Right-click → Stop
Puts app into stopped state
Good for testing or saving costs
```

### Restart App Service
```
Right-click → Restart
Applies settings without stopping
Takes 30 seconds
```

### View in Portal
```
Right-click → Open in Portal
Opens Azure Portal for advanced options
Full admin control
```

---

## 🎯 Quick Reference

### Right-Click Menu Options:

```
App Services
└── your-app-name
    ├── Open in Portal ..................... [Full admin panel]
    ├── Deploy to Web App ................. [Upload code/image]
    ├── SSH ............................... [Terminal access]
    ├── Stream Logs ....................... [Real-time logs]
    ├── Application Settings .............. [Config variables]
    ├── Deployment Slots .................. [Staging/testing]
    ├── Start ............................. [Start service]
    ├── Stop .............................. [Stop service]
    ├── Restart ........................... [Restart service]
    └── Delete ............................ [Remove service]
```

---

## ✨ Tips & Tricks

### 1. **Faster Settings Update**
```
Right-click → Application Settings
Edit in VS Code (faster than Portal)
Auto-saves to Azure
```

### 2. **Debug with SSH**
```
Right-click → SSH
Run commands directly in container
Test before scaling
```

### 3. **Watch Deployment Progress**
```
Open Stream Logs BEFORE Deploy
See logs as they happen
Catch errors immediately
```

### 4. **Rollback Quickly**
```
Deployment history visible in Portal
One-click rollback to previous version
No downtime
```

### 5. **Scale Automatically**
```
In Portal: Settings → Scale up
Choose higher tier if needed
Extension shows current tier
```

---

## 🚨 Troubleshooting

### Problem: "Cannot connect to Azure"
```
Solution:
1. Right-click Azure account
2. Select "Sign in again"
3. Follow login prompt
4. Refresh explorer
```

### Problem: Deployment fails
```
Check logs:
1. Right-click → Stream Logs
2. Look for red "Error" messages
3. Check environment variables set correctly
4. Verify credentials in settings
```

### Problem: App keeps restarting
```
Likely cause: Missing environment variable
Solution:
1. Right-click → Application Settings
2. Verify all COSMOS_* and AZURE_* variables set
3. No typos in variable names
4. Save and restart
```

### Problem: Can't connect to Cosmos DB
```
Check:
1. COSMOS_ENDPOINT format (needs :443/)
2. COSMOS_KEY is primary key (not secondary)
3. App Service firewall allows connections
4. Cosmos DB firewall allows App Service IP
```

---

## 📊 Deployment Status Flow

```
Your Backend Code
       ↓
Docker Image (arck326/backend:latest)
       ↓
Docker Hub (Pushed automatically)
       ↓
Right-click → Deploy to Web App
       ↓
Azure pulls image
       ↓
Container starts
       ↓
npm install (if local code)
       ↓
npm start / node src/index.js
       ↓
Connects to Azure services
       ↓
✅ Ready on port 8080 (Azure uses 8080, not 5000)
       ↓
https://your-app.azurewebsites.net LIVE
```

---

## ✅ Success Checklist

- [ ] Azure extension installed
- [ ] Signed in to Azure account
- [ ] App Service visible in explorer
- [ ] Environment variables configured
- [ ] Docker image deployed
- [ ] Health endpoint responding
- [ ] Can upload files
- [ ] Can list files
- [ ] Can delete files
- [ ] Real-time logs working

---

## 🎉 You're Done!

Your backend is now:
- ✅ **Deployed** to Azure Web App
- ✅ **Connected** to Cosmos DB
- ✅ **Connected** to Blob Storage
- ✅ **Monitored** with real-time logs
- ✅ **Manageable** via VS Code extension

**Your API URL:**
```
https://your-app.azurewebsites.net
```

---

## 📞 Need Help?

### Check Logs:
```
Right-click → Stream Logs
Shows real-time errors
```

### Test Endpoints:
```
Click link in logs or type URL directly
https://your-app.azurewebsites.net/health
```

### Access Portal:
```
Right-click → Open in Portal
Full admin access
Advanced settings
```

---

**Total Time:** 15-20 minutes  
**Difficulty:** Easy  
**Result:** Deployed production backend on Azure! 🚀

