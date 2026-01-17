#!/bin/bash

# 🔧 Azure App Service Environment Variable Setup Script
# This script sets all required environment variables for the backend App Service

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Azure App Service Environment Variables Setup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Configuration
RESOURCE_GROUP="file-manager-rg"  # Change if different
APP_NAME="file-manager-backend-app"

# Get these from your Azure Cosmos DB and Storage Account
# You'll need to replace these with actual values
read -p "Enter COSMOS_ENDPOINT (https://...): " COSMOS_ENDPOINT
read -p "Enter COSMOS_KEY: " COSMOS_KEY
read -p "Enter AZURE_STORAGE_CONNECTION_STRING: " STORAGE_STRING
read -p "Enter CONTAINER_NAME (default: files): " CONTAINER_NAME
CONTAINER_NAME=${CONTAINER_NAME:-"files"}

echo -e "\n${YELLOW}Setting environment variables in App Service: ${APP_NAME}${NC}"

# Set each variable
echo -e "${YELLOW}1. Setting COSMOS_ENDPOINT...${NC}"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings COSMOS_ENDPOINT="$COSMOS_ENDPOINT"

echo -e "${YELLOW}2. Setting COSMOS_KEY...${NC}"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings COSMOS_KEY="$COSMOS_KEY"

echo -e "${YELLOW}3. Setting AZURE_STORAGE_CONNECTION_STRING...${NC}"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings AZURE_STORAGE_CONNECTION_STRING="$STORAGE_STRING"

echo -e "${YELLOW}4. Setting CONTAINER_NAME...${NC}"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings CONTAINER_NAME="$CONTAINER_NAME"

echo -e "\n${YELLOW}5. Setting COSMOS_DB_NAME...${NC}"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings COSMOS_DB_NAME="file-notes-db"

echo -e "\n${YELLOW}6. Setting COSMOS_CONTAINER_NAME...${NC}"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings COSMOS_CONTAINER_NAME="files"

echo -e "\n${YELLOW}7. Restarting App Service to apply changes...${NC}"
az webapp restart \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME

echo -e "\n${GREEN}✅ Environment variables set successfully!${NC}"
echo -e "${GREEN}✅ App Service restarted.${NC}"
echo -e "\n${BLUE}Verify by checking: https://${APP_NAME}.azurewebsites.net/api/files/diagnostics${NC}"
