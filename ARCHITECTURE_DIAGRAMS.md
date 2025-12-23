# Frontend-Backend Integration Architecture

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      PUBLIC INTERNET                            │
│            (HTTPS Secure Connection)                            │
└────────────────────┬──────────────────────────────────────────┘
                     │
                     ↓ HTTPS
    ┌────────────────────────────────────────┐
    │   FRONTEND - React Application         │
    │   https://file-manager-frontend...     │
    │   azurewebsites.net                    │
    ├────────────────────────────────────────┤
    │  ✅ App.js                             │
    │  ✅ HomePage.js                        │
    │  ✅ FileUpload.js                      │
    │  ✅ FileList.js                        │
    │  ✅ config.js (API_CONFIG)             │
    └────────────────┬───────────────────────┘
                     │
                     │ import API_CONFIG
                     │ use ENDPOINTS
                     ↓
    ┌────────────────────────────────────────┐
    │      API CONFIGURATION (config.js)     │
    ├────────────────────────────────────────┤
    │  BASE_URL:                             │
    │  https://file-manager-backend-app...   │
    │  .azurewebsites.net                    │
    │                                        │
    │  ENDPOINTS:                            │
    │  ✅ UPLOAD: /api/files/upload  (POST) │
    │  ✅ LIST: /api/files           (GET)  │
    │  ✅ GET: /api/files/{id}      (GET)   │
    │  ✅ PUT: /api/files/{id}      (PUT)   │
    │  ✅ DELETE: /api/files/{id}  (DELETE)│
    │  ✅ HEALTH: /health           (GET)   │
    └────────────────┬───────────────────────┘
                     │
                     │ fetch() with API_CONFIG
                     ↓ HTTP/HTTPS
    ┌────────────────────────────────────────┐
    │   BACKEND - Node.js Express API        │
    │   https://file-manager-backend-app...  │
    │   azurewebsites.net                    │
    ├────────────────────────────────────────┤
    │  ✅ PORT: 5000 (Docker)                │
    │  ✅ Routes: /api/files/*               │
    │  ✅ CORS: Enabled                      │
    │  ✅ Middleware: Express, Multer        │
    └────────────┬───────────────┬───────────┘
                 │               │
    ┌────────────↓──┐  ┌────────↓──────────┐
    │  Azure Blob   │  │  Cosmos DB        │
    │  Storage      │  │  (MongoDB API)    │
    ├───────────────┤  ├──────────────────┤
    │ ✅ File Data  │  │ ✅ Metadata      │
    │ ✅ Encrypted  │  │ ✅ Indexed       │
    │ ✅ CDN Ready  │  │ ✅ Replicated    │
    └───────────────┘  └──────────────────┘
```

---

## 🔄 API Call Flow

### 1. File Upload Flow
```
User selects file
        ↓
FileUpload.js handleSubmit()
        ↓
Get userId from localStorage
        ↓
Create FormData {
  file: <binary>,
  userId: 'user_...',
  description: 'notes',
  tags: 'web-upload'
}
        ↓
Get endpoint: API_CONFIG.ENDPOINTS.UPLOAD
        ↓
fetch(uploadUrl, { POST, FormData })
        ↓
Log: 🚀 FILE UPLOAD INITIATED
Log: 📤 Upload URL: ...
Log: 📦 File Info: ...
        ↓
Await response
        ↓
Log: 📡 Response Status: 201
        ↓
Parse JSON response
        ↓
Log: ✅ UPLOAD SUCCESS
        ↓
Display file in list
```

### 2. File List Flow
```
HomePage mounts
        ↓
useEffect calls fetchFiles()
        ↓
Get endpoint: API_CONFIG.ENDPOINTS.LIST
        ↓
fetch(listUrl, { GET })
        ↓
Log: 📂 Fetching files from: ...
Log: 📡 Files fetch - Status: 200
        ↓
Parse JSON response (array of files)
        ↓
Log: ✅ Files loaded successfully: N files
        ↓
setFiles(fileArray)
setRecentFiles(fileArray.slice(0, 6))
        ↓
Display files in grid
```

### 3. File Download Flow
```
User clicks Download
        ↓
FileList.js handleDownload(fileId)
        ↓
Get endpoint: API_CONFIG.ENDPOINTS.GET(fileId)
        ↓
Log: ⬇️ Downloading file: { fileId, fileName }
Log: 📥 Download URL: ...
        ↓
window.location.href = downloadUrl
        ↓
Browser downloads file
        ↓
File saved to Downloads folder
```

### 4. Error Handling Flow
```
API request fails
        ↓
if (!response.ok)
        ↓
Get error text
        ↓
Log: ❌ SERVER ERROR RESPONSE
Log: Status: 500
Log: Text: error message
        ↓
Parse error message
        ↓
throw new Error(message)
        ↓
catch block receives error
        ↓
Log: ❌ Upload Error:
Log: Message: ...
Log: Stack: ...
        ↓
setError(userFriendlyMessage)
        ↓
Display error to user
```

---

## 📊 Environment Detection Logic

```
Application starts
        ↓
config.js loads
        ↓
Check: process.env.REACT_APP_API_URL
        ↓
    ┌───Yes───→ Use env variable
    │
    No
    │
    └───Check: window.location.hostname
        │
        ├─→ localhost → http://localhost:5000
        ├─→ 127.0.0.1 → http://localhost:5000
        ├─→ 0.0.0.0   → http://localhost:5000
        │
        └─→ Other (production) → https://file-manager-backend-app...

Validate URL format
        ↓
    Valid? Yes → Remove trailing slash
    Valid? No  → Use production URL
        ↓
        ↓
Create API_CONFIG object
        ↓
Log: Configuration Summary
        ↓
Export API_CONFIG
        ↓
Components import and use
```

---

## 🔍 Request & Response Pattern

### Successful Request
```javascript
REQUEST:
fetch('https://file-manager-backend-app.azurewebsites.net/api/files/upload', {
  method: 'POST',
  body: FormData {
    file: <binary>,
    userId: 'user_1703337...',
    description: 'My file',
    tags: 'web-upload'
  },
  headers: {
    'Accept': 'application/json'
  }
})

RESPONSE (201 Created):
{
  "id": "uuid-xxxx-xxxx",
  "name": "document.pdf",
  "fileSize": 2048,
  "userId": "user_1703337...",
  "description": "My file",
  "tags": "web-upload",
  "uploadedAt": "2025-12-23T10:30:00Z",
  "blobUrl": "https://storage.blob.core.windows.net/files/...",
  "success": true
}

CONSOLE LOG:
✅ UPLOAD SUCCESS
   File ID: uuid-xxxx-xxxx
   Duration: 2345 ms
```

### Error Response
```javascript
ERROR REQUEST:
fetch('https://file-manager-backend-app.azurewebsites.net/api/files/upload', {
  // ... request data ...
})

ERROR RESPONSE (413 Payload Too Large):
{
  "error": "File too large",
  "maxSize": "100MB",
  "received": "250MB",
  "status": 413
}

CONSOLE ERROR:
❌ UPLOAD ERROR DETAILS:
   Message: Upload failed: 413 Payload Too Large
   Status: 413
   API URL: https://file-manager-backend-app.azurewebsites.net/api/files/upload
```

---

## 🔐 Security Flow

```
Request Sent to HTTPS
        ↓
SSL/TLS Encryption
        ↓
Browser validates certificate
        ↓
Request reaches backend
        ↓
Backend checks CORS origin
        ↓
    ✅ Origin: https://file-manager-frontend-app
    ✅ Method: Allowed (POST, GET, PUT, DELETE)
    ✅ Headers: Allowed
        ↓
Request processed
        ↓
Response includes CORS headers:
{
  'access-control-allow-origin': 'https://file-manager-frontend-app',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE',
  'access-control-allow-credentials': 'true'
}
        ↓
Browser validates CORS headers
        ↓
Application receives response
```

---

## 📈 Logging Levels

```
┌─────────────────────────────────────────┐
│         CONSOLE LOGGING TREE            │
├─────────────────────────────────────────┤
│                                         │
│ App Startup (config.js)                │
│ ├─ 🔧 API Configuration Summary        │
│ │  ├─ Hostname: ...                   │
│ │  ├─ Protocol: https:                │
│ │  └─ Base URL: ...                   │
│ │                                     │
│ ├─ ✅ API Endpoints configured        │
│ │  ├─ UPLOAD: ...                     │
│ │  ├─ LIST: ...                       │
│ │  └─ ...                             │
│ │                                     │
│ └─ ℹ️  Using existing User ID: ...    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ File Operations                        │
│ ├─ Upload                              │
│ │  ├─ 🚀 FILE UPLOAD INITIATED        │
│ │  ├─ 📤 Upload URL: ...              │
│ │  ├─ 📦 File Info: ...               │
│ │  ├─ 👤 User ID: ...                 │
│ │  ├─ 📡 Response Status: 201         │
│ │  └─ ✅ UPLOAD SUCCESS               │
│ │                                     │
│ ├─ File List                           │
│ │  ├─ 📂 Fetching files from: ...     │
│ │  ├─ 📡 Files fetch - Status: 200   │
│ │  └─ ✅ Files loaded: 5 files        │
│ │                                     │
│ ├─ Download                            │
│ │  ├─ ⬇️ Downloading file: ...         │
│ │  └─ 📥 Download URL: ...            │
│ │                                     │
│ └─ Delete                              │
│    ├─ 🗑️ Deleting file: ...          │
│    └─ ✅ File deleted                 │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ Error Cases                            │
│ ├─ Network Error                       │
│ │  ├─ ❌ Error fetching files:        │
│ │  ├─ Message: Failed to fetch        │
│ │  └─ Stack: ...                      │
│ │                                     │
│ ├─ HTTP Error                          │
│ │  ├─ ❌ SERVER ERROR RESPONSE        │
│ │  ├─ Status: 502                     │
│ │  └─ Text: Bad Gateway               │
│ │                                     │
│ └─ CORS Error                          │
│    ├─ ❌ CORS Error                    │
│    └─ Check: access-control-allow-... │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🧪 Testing Flowchart

```
Start Testing
    │
    ├─→ Open DevTools (F12)
    │   │
    │   └─→ Go to Console tab
    │       │
    │       ├─→ Check: console.log outputs
    │       │   ├─ ✅ API Configuration Summary
    │       │   ├─ ✅ API Endpoints configured
    │       │   └─ ✅ Backend Status
    │       │
    │       ├─→ Go to Network tab
    │       │   │
    │       │   └─→ Perform action (upload)
    │       │       ├─ Check: Request URL
    │       │       │  ├─ Should be: https://file-manager-backend...
    │       │        ├─ Check: Request Method
    │       │        │  ├─ Should be: POST
    │       │        │
    │       │        ├─ Check: Response Status
    │       │        │  ├─ Should be: 201 Created
    │       │        │
    │       │        └─ Check: Response Headers
    │       │           ├─ access-control-allow-origin
    │       │           ├─ content-type: application/json
    │       │           └─ ...
    │       │
    │       └─→ Go to Application tab
    │           ├─ Check: localStorage
    │           │  └─ userId: user_1703337...
    │           │
    │           └─ Check: Cookies
    │
    └─→ Test Actions
        ├─→ Upload File
        │   ├─ Console: 🚀 FILE UPLOAD INITIATED
        │   ├─ Console: ✅ UPLOAD SUCCESS
        │   └─ UI: File appears in list
        │
        ├─→ List Files
        │   ├─ Console: 📂 Fetching files
        │   ├─ Console: ✅ Files loaded
        │   └─ UI: Files displayed
        │
        ├─→ Download File
        │   ├─ Console: ⬇️ Downloading file
        │   └─ File: Downloaded to local drive
        │
        └─→ Delete File
            ├─ Console: 🗑️ Deleting file
            ├─ Console: ✅ File deleted
            └─ UI: File removed from list
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│             Development Machine                 │
│  (Local: http://localhost:3000)                │
├─────────────────────────────────────────────────┤
│                                                 │
│  npm run build                                  │
│    ↓                                            │
│  Frontend build (optimized)                     │
│    ↓                                            │
│  docker build -t arck326/frontend:latest .    │
│    ↓                                            │
│  Docker image created                           │
│    ↓                                            │
│  docker push arck326/frontend:latest           │
│    ↓                                            │
│  Image pushed to Docker Hub                     │
│                                                 │
└─────────────────────┬──────────────────────────┘
                      │
                      ↓
        ┌──────────────────────────────┐
        │   Docker Hub Registry        │
        │  arck326/frontend:latest     │
        └──────────────┬───────────────┘
                       │
                       ↓
        ┌──────────────────────────────────────┐
        │   Azure App Service                  │
        │   file-manager-frontend-app          │
        │                                      │
        │   Pulls latest Docker image          │
        │   Restarts container                 │
        │   Routes traffic: port 80 → 3000     │
        │                                      │
        │   https://file-manager-frontend-app │
        │   .azurewebsites.net                 │
        └──────────────────────────────────────┘
                       │
                       ↓ HTTPS
        ┌──────────────────────────────────────┐
        │   Public Internet Users              │
        │                                      │
        │   Access application at:             │
        │   https://file-manager-frontend-app  │
        │   .azurewebsites.net                 │
        └──────────────────────────────────────┘
```

---

## 📋 Component Responsibility Matrix

| Component | Responsibility | API Calls | Logging |
|-----------|-----------------|-----------|---------|
| **config.js** | API configuration | None | Startup details |
| **App.js** | Main app, userId setup | None | userId generation |
| **HomePage.js** | File list & stats | GET /api/files | File fetch logs |
| **FileUpload.js** | File upload | POST /api/files/upload | Upload logs |
| **FileList.js** | File operations | GET, PUT, DELETE | Operation logs |

---

## ✨ Summary

This architecture ensures:
```
✅ Clean separation of concerns
✅ Centralized configuration
✅ Automatic environment detection
✅ Comprehensive error handling
✅ Detailed logging for debugging
✅ Production-ready security
✅ Scalable and maintainable
✅ Enterprise-grade quality
```

---

**Architecture Document:** 23 December 2025  
**Status:** ✅ COMPLETE  
**Quality:** Enterprise-Grade
