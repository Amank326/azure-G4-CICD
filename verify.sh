#!/bin/bash
# 🔍 Verification Script - Check all systems

echo "════════════════════════════════════════════════════════════"
echo "  🔍 SYSTEM VERIFICATION SCRIPT"
echo "════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
passed=0
failed=0

# Function to check status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ $1${NC}"
        ((failed++))
    fi
}

echo "📊 CHECKING BACKEND SERVICE..."
echo "─────────────────────────────────────────────────────────────"

# Check backend health
response=$(curl -s https://file-manager-backend-app.azurewebsites.net/health)
if echo "$response" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Backend is online${NC}"
    echo "   Response: $response"
    ((passed++))
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    ((failed++))
fi

echo ""
echo "📊 CHECKING FRONTEND SERVICE..."
echo "─────────────────────────────────────────────────────────────"

# Check frontend
response=$(curl -s -I https://file-manager-frontend-app.azurewebsites.net | head -1)
if echo "$response" | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ Frontend is online${NC}"
    echo "   Response: $response"
    ((passed++))
else
    echo -e "${RED}❌ Frontend check failed${NC}"
    ((failed++))
fi

echo ""
echo "📊 CHECKING CORS CONFIGURATION..."
echo "─────────────────────────────────────────────────────────────"

# Check CORS headers
response=$(curl -s -I -X OPTIONS \
  https://file-manager-backend-app.azurewebsites.net/api/files/upload \
  -H "Origin: https://file-manager-frontend-app.azurewebsites.net" | grep -i "access-control-allow-origin")

if [ ! -z "$response" ]; then
    echo -e "${GREEN}✅ CORS headers present${NC}"
    echo "   $response"
    ((passed++))
else
    echo -e "${RED}❌ CORS headers missing${NC}"
    ((failed++))
fi

echo ""
echo "📊 CHECKING AZURE RESOURCES..."
echo "─────────────────────────────────────────────────────────────"

# Check if Azure CLI is available
command -v az &> /dev/null
if [ $? -eq 0 ]; then
    # Check backend app service state
    state=$(az webapp show --name file-manager-backend-app \
      --resource-group file-manager-rg --query "state" -o tsv 2>/dev/null)
    
    if [ "$state" == "Running" ]; then
        echo -e "${GREEN}✅ Backend App Service is Running${NC}"
        ((passed++))
    else
        echo -e "${YELLOW}⚠️  Backend App Service state: $state${NC}"
    fi
    
    # Check frontend app service state
    state=$(az webapp show --name file-manager-frontend-app \
      --resource-group file-manager-rg --query "state" -o tsv 2>/dev/null)
    
    if [ "$state" == "Running" ]; then
        echo -e "${GREEN}✅ Frontend App Service is Running${NC}"
        ((passed++))
    else
        echo -e "${YELLOW}⚠️  Frontend App Service state: $state${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Azure CLI not available, skipping resource checks${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  📋 SUMMARY"
echo "════════════════════════════════════════════════════════════"
echo ""
echo -e "✅ Passed: ${GREEN}$passed${NC}"
echo -e "❌ Failed: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! System is ready.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please review.${NC}"
    exit 1
fi
