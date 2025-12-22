#!/bin/bash
# Complete API Testing and Diagnostics Script

echo "🔍 File Upload API Diagnostics"
echo "================================"

API_URL="https://file-manager-backend-app.azurewebsites.net"
UPLOAD_ENDPOINT="$API_URL/api/files/upload"

echo ""
echo "📍 Testing API Endpoints:"
echo "API Base: $API_URL"
echo "Upload Endpoint: $UPLOAD_ENDPOINT"

# Test 1: Health Check
echo ""
echo "1️⃣ Testing Health Check..."
curl -s -w "\nStatus: %{http_code}\n" -X GET "$API_URL/api/health"

# Test 2: CORS Preflight
echo ""
echo "2️⃣ Testing CORS Preflight..."
curl -s -w "\nStatus: %{http_code}\n" -X OPTIONS "$UPLOAD_ENDPOINT" \
  -H "Origin: https://file-manager-frontend-app.azurewebsites.net" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"

# Test 3: Test Upload with Sample File
echo ""
echo "3️⃣ Testing File Upload..."
echo "Test content" > test.txt
curl -s -w "\nStatus: %{http_code}\n" -X POST "$UPLOAD_ENDPOINT" \
  -F "file=@test.txt" \
  -F "userId=test-user-$(date +%s)" \
  -F "description=Test upload from curl" \
  -F "tags=test"
rm test.txt

echo ""
echo "✅ Diagnostics Complete"
