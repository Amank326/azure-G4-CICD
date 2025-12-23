#!/bin/bash
# Production Verification Checklist & Testing Script
# Run this after deploying to verify everything is working

set -e

echo "════════════════════════════════════════════════════════════════"
echo "🔍 Azure File Manager - Production Verification"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local description=$2
    local expected_code=$3
    
    echo -n "🧪 Testing: $description ... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "$expected_code" ] || [ "$response" = "000" ]; then
        # 000 means connection error, which we'll handle separately
        if [ "$response" = "000" ]; then
            echo -e "${RED}✗ FAILED${NC} (Connection timeout)"
            ((FAILED++))
            return 1
        else
            echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
            ((PASSED++))
            return 0
        fi
    else
        echo -e "${RED}✗ FAILED${NC} (Expected $expected_code, got $response)"
        ((FAILED++))
        return 1
    fi
}

# Function to test CORS headers
test_cors() {
    local url=$1
    local origin=$2
    
    echo ""
    echo -e "${BLUE}🔐 CORS Preflight Test${NC}"
    echo "URL: $url"
    echo "Origin: $origin"
    echo ""
    
    response=$(curl -i -X OPTIONS "$url" \
        -H "Origin: $origin" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" 2>&1)
    
    # Check for required CORS headers
    if echo "$response" | grep -q "Access-Control-Allow-Origin"; then
        echo -e "${GREEN}✓ Access-Control-Allow-Origin header present${NC}"
        echo "  $(echo "$response" | grep "Access-Control-Allow-Origin" | head -1)"
        ((PASSED++))
    else
        echo -e "${RED}✗ Access-Control-Allow-Origin header missing${NC}"
        ((FAILED++))
    fi
    
    if echo "$response" | grep -q "Access-Control-Allow-Methods"; then
        echo -e "${GREEN}✓ Access-Control-Allow-Methods header present${NC}"
        echo "  $(echo "$response" | grep "Access-Control-Allow-Methods" | head -1)"
        ((PASSED++))
    else
        echo -e "${RED}✗ Access-Control-Allow-Methods header missing${NC}"
        ((FAILED++))
    fi
    
    if echo "$response" | grep -q "Access-Control-Allow-Headers"; then
        echo -e "${GREEN}✓ Access-Control-Allow-Headers header present${NC}"
        echo "  $(echo "$response" | grep "Access-Control-Allow-Headers" | head -1)"
        ((PASSED++))
    else
        echo -e "${RED}✗ Access-Control-Allow-Headers header missing${NC}"
        ((FAILED++))
    fi
}

# ════════════════════════════════════════════════════════════════
# LOCAL TESTING (Development)
# ════════════════════════════════════════════════════════════════

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🏠 LOCAL DEVELOPMENT TESTS (http://localhost)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Test local frontend
test_endpoint "http://localhost:3000" "Frontend (localhost:3000)" "200"

# Test local backend
test_endpoint "http://localhost:5000/health" "Backend Health (localhost:5000)" "200"

# Test local API endpoint
test_endpoint "http://localhost:5000/api/files" "API List Endpoint" "200"

# Test CORS locally
test_cors "http://localhost:5000/api/files/upload" "http://localhost:3000"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🌐 PRODUCTION AZURE TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Test production frontend
test_endpoint "https://file-manager-frontend-app.azurewebsites.net" "Frontend (Azure)" "200"

# Test production backend
test_endpoint "https://file-manager-backend-app.azurewebsites.net/health" "Backend Health (Azure)" "200"

# Test production API endpoint
test_endpoint "https://file-manager-backend-app.azurewebsites.net/api/files" "API List Endpoint (Azure)" "200"

# Test CORS on production
test_cors "https://file-manager-backend-app.azurewebsites.net/api/files/upload" \
    "https://file-manager-frontend-app.azurewebsites.net"

# ════════════════════════════════════════════════════════════════
# ENVIRONMENT CONFIGURATION CHECKS
# ════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}⚙️  ENVIRONMENT CONFIGURATION CHECKS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Check frontend .env files
echo -n "✓ Checking frontend/.env.production ... "
if [ -f "frontend/.env.production" ]; then
    if grep -q "REACT_APP_API_BASE_URL=https://file-manager-backend-app.azurewebsites.net" frontend/.env.production; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}FAIL${NC} (Wrong API URL)"
        ((FAILED++))
    fi
else
    echo -e "${RED}MISSING${NC}"
    ((FAILED++))
fi

echo -n "✓ Checking frontend/.env.development ... "
if [ -f "frontend/.env.development" ]; then
    if grep -q "REACT_APP_API_BASE_URL=http://localhost:5000" frontend/.env.development; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}FAIL${NC} (Wrong API URL)"
        ((FAILED++))
    fi
else
    echo -e "${RED}MISSING${NC}"
    ((FAILED++))
fi

echo -n "✓ Checking backend/.env exists ... "
if [ -f "backend/.env" ]; then
    if grep -q "COSMOS_ENDPOINT" backend/.env && grep -q "AZURE_STORAGE_CONNECTION_STRING" backend/.env; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}FAIL${NC} (Missing Azure credentials)"
        ((FAILED++))
    fi
else
    echo -e "${RED}MISSING${NC} (Create from .env.example)"
    ((FAILED++))
fi

# ════════════════════════════════════════════════════════════════
# CODE CONFIGURATION CHECKS
# ════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📝 CODE CONFIGURATION CHECKS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -n "✓ Checking CORS configuration in backend/src/index.js ... "
if grep -q "file-manager-frontend-app.azurewebsites.net" backend/src/index.js; then
    echo -e "${GREEN}PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}FAIL${NC} (Frontend origin not in CORS allowedOrigins)"
    ((FAILED++))
fi

echo -n "✓ Checking OPTIONS middleware in backend/src/index.js ... "
if grep -q "app.options" backend/src/index.js; then
    echo -e "${GREEN}PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}FAIL${NC} (OPTIONS handler missing)"
    ((FAILED++))
fi

echo -n "✓ Checking API config in frontend/src/config.js ... "
if grep -q "REACT_APP_API_BASE_URL" frontend/src/config.js; then
    echo -e "${GREEN}PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}FAIL${NC} (Environment variable check missing)"
    ((FAILED++))
fi

# ════════════════════════════════════════════════════════════════
# SUMMARY
# ════════════════════════════════════════════════════════════════

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📊 TEST SUMMARY"
echo "════════════════════════════════════════════════════════════════"
echo -e "Passed: ${GREEN}${PASSED}${NC}"
echo -e "Failed: ${RED}${FAILED}${NC}"
echo "Total:  $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "Your production deployment is ready:"
    echo "  Frontend: https://file-manager-frontend-app.azurewebsites.net"
    echo "  Backend:  https://file-manager-backend-app.azurewebsites.net"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
    echo ""
    echo "Please review the failures above and fix them."
    echo ""
    exit 1
fi
