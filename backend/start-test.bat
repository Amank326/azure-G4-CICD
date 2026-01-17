@echo off
cd "C:\Users\amank\OneDrive\Desktop\azure G4 CICD\backend"

REM Set environment variables
set COSMOS_ENDPOINT=https://filemanagercosmos1234.documents.azure.com:443/
set COSMOS_KEY=test_key
set AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=test;AccountKey=test;
set CONTAINER_NAME=files
set PORT=5000
set NODE_ENV=production

REM Start the app with timeout
echo Starting backend server...
timeout /t 5
node src/index.js
