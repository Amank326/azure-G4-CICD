# 🚀 Deploy Frontend as Public Website (Azure Static Web Apps)

**Status:** Ready to Deploy  
**Time Required:** 15 minutes  
**Difficulty:** Easy  
**Cost:** FREE (Azure Static Web Apps - Free Tier)  

---

## 📋 What We'll Do

Deploy your React frontend to **Azure Static Web Apps** - perfect for public websites!

```
Your Local Machine (Development)
              ↓
         Push to GitHub
              ↓
   Azure Static Web Apps (Auto Deploy)
              ↓
    Live Public Website! 🎉
   mysite.azurestaticapps.net
```

---

## ✅ Prerequisites (Check These)

- [ ] GitHub account (free at github.com)
- [ ] Azure account (already have)
- [ ] Frontend code ready (you do ✅)
- [ ] Backend deployed and working (you do ✅)
- [ ] VS Code open (recommended)

---

## 🎯 Option A: Azure Static Web Apps (RECOMMENDED)

### **Why This Option?**
```
✅ FREE tier available
✅ Auto-deploy from GitHub (CI/CD)
✅ HTTPS free
✅ Perfect for React apps
✅ Integrates with backend API
✅ Professional domain
✅ Built-in monitoring
```

### **Step 1: Create GitHub Repository (2 min)**

1. Go to **github.com** → Sign in
2. Click **"+" → New repository**
3. Fill in:
   ```
   Repository name: azure-file-manager
   Description: File Manager App
   Public: YES (to make website accessible)
   Initialize: NO (we have code already)
   ```
4. Click **Create repository**

### **Step 2: Push Your Code to GitHub (3 min)**

Run these commands in terminal:

```powershell
# Go to your project folder
cd "c:\Users\amank\OneDrive\Desktop\azure G4 CICD"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - File Manager App"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/azure-file-manager.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**🎯 After this step:** Your code is on GitHub!

### **Step 3: Create Azure Static Web App (5 min)**

1. **Open Azure Portal:**
   - Go to **portal.azure.com**
   - Sign in with your Azure account

2. **Search for "Static Web Apps"**
   - Click on "Static Web Apps"
   - Click **"Create"**

3. **Fill in these details:**
   ```
   Project Details:
   - Resource Group: (same as backend - filemanagerag)
   - Name: file-manager-frontend
   - Plan Type: Free
   - Region: Central India (same as backend)
   
   Deployment Details:
   - Source: GitHub
   - Organization: (Click "Sign in with GitHub" if needed)
   - Repository: azure-file-manager
   - Branch: main
   - Build Presets: React
   - App location: frontend
   - API location: (leave empty)
   - Output location: build
   ```

4. **Click "Review + Create" → Create**

5. **Wait for deployment** (2-3 minutes)

### **Step 4: Configure Backend API Connection (2 min)**

Your frontend needs to know where the backend is!

1. **Go to your Static Web App** in Azure Portal
2. **Click "Configuration"** (under Settings)
3. **Add Application Settings:**
   ```
   Name: REACT_APP_API_URL
   Value: https://file-manager-backend-app.azurewebsites.net
   ```
   *(This is your backend URL from earlier)*

4. Click **Save**

### **Step 5: Update Frontend to Use Backend URL (2 min)**

Create a file: `frontend/src/config.js`

```javascript
// Config for API endpoint
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default API_URL;
```

Then update your API calls in components:

**In `frontend/src/components/FileUpload.js`:**
```javascript
import API_URL from '../config';

// Replace http://localhost:5000 with API_URL
const response = await fetch(`${API_URL}/api/files/upload`, {
  // ... rest of code
});
```

**In `frontend/src/components/FileList.js`:**
```javascript
import API_URL from '../config';

// Replace http://localhost:5000 with API_URL
fetch(`${API_URL}/api/files?userId=${userId}`)
  // ... rest of code
```

### **Step 6: Push Updated Code to GitHub (1 min)**

```powershell
git add .
git commit -m "Update API configuration for production"
git push
```

**Azure will automatically redeploy!** (Wait 2-3 minutes)

### **Step 7: Get Your Live Website URL (1 min)**

1. **Go to Azure Portal → Static Web Apps → file-manager-frontend**
2. **Copy the URL** from "Overview" section
   ```
   It will look like:
   https://xxxxxxxxxxxxxx.azurestaticapps.net
   ```

3. **Visit it in browser!** 🎉

---

## 🎯 Option B: Docker + Azure App Service (ALTERNATIVE)

If you want to host frontend in Docker on App Service:

### **Step 1: Create Frontend Dockerfile**

Create: `frontend/Dockerfile`

```dockerfile
# Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

### **Step 2: Build and Push to Docker Hub**

```powershell
docker build -t arck326/frontend:latest frontend/
docker push arck326/frontend:latest
```

### **Step 3: Create Web App for Frontend**

Similar to backend, but:
```
Name: file-manager-frontend-app
Image: arck326/frontend:latest
Port: 3000
```

**This is more manual than Static Web Apps.** Not recommended unless you specifically need Docker.

---

## 📊 Comparison: Which Option?

| Feature | Static Web Apps | Docker + App Service |
|---------|-----------------|----------------------|
| **Cost** | FREE ✅ | Pay per GB/month |
| **Setup Time** | 15 min ✅ | 30 min |
| **Automatic Deploy** | YES ✅ | NO (manual) |
| **HTTPS** | FREE ✅ | FREE |
| **Best For** | Production websites ✅ | Complex apps |
| **CI/CD** | Built-in ✅ | Manual |
| **Custom Domain** | YES ($) | YES ($) |

**👉 USE STATIC WEB APPS!** (Option A is best)

---

## 🚀 Quick Deployment Checklist

### **For Option A (Recommended):**

- [ ] **Create GitHub Account** (2 min)
  - Go to github.com, sign up, verify email

- [ ] **Create GitHub Repository** (2 min)
  - New repo named "azure-file-manager"

- [ ] **Push Code to GitHub** (3 min)
  ```
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/azure-file-manager.git
  git push -u origin main
  ```

- [ ] **Create Static Web App** (5 min)
  - Azure Portal → Static Web Apps → Create
  - Connect GitHub repository
  - Select "React" preset
  - App location: frontend
  - Output location: build

- [ ] **Configure API Connection** (2 min)
  - Add REACT_APP_API_URL setting
  - Value: https://file-manager-backend-app.azurewebsites.net

- [ ] **Update Frontend Code** (2 min)
  - Create config.js
  - Update API calls to use config
  - Push to GitHub

- [ ] **Verify Deployment** (1 min)
  - Wait for auto-deploy
  - Visit your Static Web App URL
  - Test upload/download

**Total Time: 15 minutes** ⏱️

---

## 🧪 Testing Your Live Website

After deployment, test these:

### **Test 1: Website Loads**
```
Visit: https://your-static-web-app-url.azurestaticapps.net
Expected: Welcome screen appears
```

### **Test 2: Backend Connection**
```
Try: Upload a file
Expected: File uploads to backend successfully
```

### **Test 3: List Files**
```
Expected: Can see uploaded files
```

### **Test 4: Delete File**
```
Try: Delete a file
Expected: File is removed
```

### **If Tests Fail:**

1. **Check browser console** (F12 → Console)
   - Look for API errors
   - Check if CORS is blocking

2. **Check logs in Azure Portal**
   - Static Web App → Monitoring → Function app logs
   - Backend App → Log stream

3. **Verify API URL**
   - Make sure REACT_APP_API_URL is set correctly
   - Should be: `https://file-manager-backend-app.azurewebsites.net`

---

## 🌐 Custom Domain (Optional - Later)

After it's working, you can add your own domain:

1. **Buy domain** (godaddy.com, namecheap.com, etc.)
2. **In Static Web App → Custom domains → Add**
3. **Point DNS to Azure**

Cost: $10-15/year for domain

---

## 🎉 SUCCESS! You Now Have:

```
✅ Backend API running on:
   https://file-manager-backend-app.azurewebsites.net

✅ Frontend Website running on:
   https://your-site.azurestaticapps.net

✅ Full-stack application LIVE on Azure! 🚀

✅ Auto-deploy on every GitHub push
✅ HTTPS everywhere
✅ Zero downtime deployments
✅ Professional infrastructure
```

---

## 📱 Share Your Website!

Once deployed, share the URL with anyone:
```
Hey! Check out my file manager: https://your-site.azurestaticapps.net
```

They can:
- Upload files from their computer
- Download files they uploaded
- See real-time file management
- Everything works instantly! ⚡

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Site not loading | Check Static Web App status in Azure Portal |
| Files can't upload | Verify REACT_APP_API_URL in Static Web App settings |
| CORS error | Add CORS headers to backend API |
| Takes too long to load | First request may be slow (cold start) |
| Backend connection fails | Check backend is running and env vars are set |

---

## 📚 Next Steps After Going Live

1. **Monitor performance**
   - Static Web Apps → Monitoring → Metrics
   - Check response times and errors

2. **Add custom domain** (optional)
   - Professional look: mycompany.com

3. **Set up backups** (optional)
   - Cosmos DB → Point-in-time restore
   - Blob Storage → Soft delete

4. **Enable analytics** (optional)
   - Azure Monitor → Application Insights

---

## 🏁 Final Summary

```
Current Status:
✅ Backend deployed on Azure Web App (file-manager-backend-app)
✅ Frontend ready to deploy
✅ Database and storage ready

Next Step:
👉 DEPLOY FRONTEND USING AZURE STATIC WEB APPS

Time Required: 15 minutes
Difficulty: Easy
Cost: FREE
Result: LIVE PUBLIC WEBSITE! 🎉
```

---

**Ready to go live? Follow Option A above!** 🚀

Document: Frontend Deployment Guide  
Date: December 22, 2025  
Next File: Follow steps in this document  
