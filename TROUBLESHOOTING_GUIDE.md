# 🔧 **TROUBLESHOOTING GUIDE - "Error uploading file: Failed to fetch"**

## 📋 **समस्या का विश्लेषण**

आपको "Error uploading file: Failed to fetch" error मिल रहा है। यह error तब होता है जब:

1. ❌ Backend API respond नहीं कर रहा
2. ❌ Network connectivity issue है
3. ❌ CORS configuration गलत है  
4. ❌ Backend URL incorrect है
5. ❌ Backend service down है

---

## 🔍 **Step-by-Step Debugging**

### **Step 1: Backend Status Check करें**

**Browser Console में जाएं (F12) और यह URLs check करें:**

```javascript
// Health check
fetch('https://file-manager-backend-app.azurewebsites.net/health')
  .then(r => r.json())
  .then(d => console.log('✅ Health:', d))
  .catch(e => console.error('❌ Error:', e))

// Diagnostics (नया endpoint)
fetch('https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics')
  .then(r => r.json())
  .then(d => console.log('📊 Diagnostics:', d))
  .catch(e => console.error('❌ Error:', e))

// Debug info
fetch('https://file-manager-backend-app.azurewebsites.net/debug')
  .then(r => r.json())
  .then(d => console.log('🔧 Debug:', d))
  .catch(e => console.error('❌ Error:', e))
```

### **Step 2: Check Frontend Configuration**

**Browser Console में:**

```javascript
import API_CONFIG from './src/config'
console.log('📍 API Config:', API_CONFIG)
console.log('📤 Upload URL:', API_CONFIG.ENDPOINTS.UPLOAD)
console.log('🏥 Health URL:', API_CONFIG.ENDPOINTS.HEALTH)
```

### **Step 3: Backend Logs Check करें**

**Azure Portal से:**

1. Azure App Service > Logs > Log stream खोलें
2. File upload करने की कोशिश करें
3. Logs में error message देखें

**या Terminal में (अगर locally run कर रहे हैं):**

```bash
cd backend
npm start
# Upload करते समय logs देखें
```

---

## ✅ **सामान्य समाधान**

### **समाधान 1: Backend को Restart करें**

**Azure Portal में:**

1. App Service खोलें
2. "Restart" button दबाएं
3. 2-3 मिनट wait करें
4. फिर से upload करें

### **समाधान 2: Environment Variables Verify करें**

**Backend में `.env` file check करें:**

```bash
# Required variables:
COSMOS_ENDPOINT=https://filemanagercosmos1234.documents.azure.com:443/
COSMOS_KEY=<your-cosmos-key>
AZURE_STORAGE_CONNECTION_STRING=<your-storage-connection-string>
CONTAINER_NAME=files
NODE_ENV=production
PORT=5000
```

**सभी variables set हैं?** ✓

### **समाधान 3: CORS Headers Check करें**

**Browser Developer Tools > Network tab में:**

1. File upload करें
2. Upload request को देखें
3. Response headers में ये होने चाहिए:

```
Access-Control-Allow-Origin: https://file-manager-frontend-app.azurewebsites.net
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, Accept
```

**अगर ये नहीं दिख रहे तो:**
- Backend का CORS configuration ठीक नहीं है
- या Backend respond नहीं कर रहा

### **समाधान 4: Network Console Logs देखें**

**Browser Console में:**

```javascript
// यह automatically run होगा
// देखें: कौन से endpoints working हैं?
API_CONFIG.getBackendStatus()
  .then(status => console.log('Status:', status))
```

---

## 🚀 **सही तरीका से Deploy करें**

### **1. Backend Deploy करें**

```bash
cd backend
npm install
npm start
```

**या Docker से:**

```bash
docker build -t backend .
docker run -p 5000:5000 --env-file .env backend
```

### **2. Frontend Configuration चेक करें**

```bash
cd frontend
# Production URL set हो?
echo "REACT_APP_API_BASE_URL=https://file-manager-backend-app.azurewebsites.net"
npm build
npm start
```

### **3. Backend Endpoints Test करें**

```bash
# Health check
curl https://file-manager-backend-app.azurewebsites.net/health

# Diagnostics
curl https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics

# Debug info
curl https://file-manager-backend-app.azurewebsites.net/debug
```

---

## 📊 **नई Features (Auto-Retry और Health Check)**

अब आपके पास **automatic retry mechanism** है:

✅ **Automatic Retries** - Upload fail होने पर 3 attempts करेगा (exponential backoff)
✅ **Health Check** - Upload से पहले backend check करेगा  
✅ **Better Error Messages** - Exact problem बताएगा
✅ **Backend Status Component** - Real-time backend status दिखाएगा
✅ **Diagnostics Endpoint** - पूरी system information देगा

---

## 🎯 **Quick Checklist**

- [ ] Backend URL accessible है? (browser में खोलकर देखें)
- [ ] All environment variables set हैं?
- [ ] CORS configuration में frontend URL है?
- [ ] Backend service running है?
- [ ] Network connectivity ठीक है?
- [ ] Browser console में detailed errors दिख रहे हैं?
- [ ] Latest code deployed है?

---

## 📞 **Additional Help**

अगर यह काम नहीं करता, तो:

1. **Azure Portal में Resource Status check करें**
   - App Service > Health check
   - Cosmos DB > Overview > Status
   - Storage Account > Status

2. **Browser Console में copy करें और debug करें:**

```javascript
// Auto-diagnostic script
(async () => {
  const api = 'https://file-manager-backend-app.azurewebsites.net';
  console.log('🔍 Running diagnostics...\n');
  
  try {
    const health = await fetch(`${api}/health`).then(r => r.json());
    console.log('✅ Health:', health);
  } catch(e) { console.error('❌ Health failed:', e.message); }
  
  try {
    const diag = await fetch(`${api}/api/files/diagnostics`).then(r => r.json());
    console.log('✅ Diagnostics:', diag);
  } catch(e) { console.error('❌ Diagnostics failed:', e.message); }
  
  try {
    const debug = await fetch(`${api}/debug`).then(r => r.json());
    console.log('✅ Debug:', debug);
  } catch(e) { console.error('❌ Debug failed:', e.message); }
})();
```

3. **Azure CLI से check करें:**

```bash
# Backend status
az app service show --name file-manager-backend-app --resource-group <resource-group>

# Logs देखें
az webapp log tail --name file-manager-backend-app --resource-group <resource-group>
```

---

**अगर यह guide से समस्या solve नहीं हुई, तो browser console से सभी errors screenshot करके share करें!**

