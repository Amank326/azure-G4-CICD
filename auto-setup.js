#!/usr/bin/env node

/**
 * 🤖 AUTOMATED AZURE SETUP SCRIPT
 * This script will automatically:
 * 1. Retrieve Cosmos DB credentials
 * 2. Retrieve Storage Account credentials  
 * 3. Set environment variables in App Service
 * 4. Restart the app
 * 5. Verify everything works
 */

const { execSync } = require('child_process');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, silent = false) {
  try {
    const result = execSync(command, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    }).trim();
    return result;
  } catch (error) {
    if (!silent) {
      log(colors.red, `❌ Command failed: ${command}`);
      log(colors.red, error.message);
    }
    return null;
  }
}

async function main() {
  log(colors.cyan, '\n═══════════════════════════════════════════════════════════');
  log(colors.cyan, '  🤖 AUTOMATED AZURE FILE MANAGER SETUP');
  log(colors.cyan, '═══════════════════════════════════════════════════════════\n');

  // Constants
  const SUBSCRIPTION_ID = 'ce176ab4-0474-47f5-bfe2-72e93937970f';
  const COSMOS_ACCOUNT = 'filemanagercosmos1234';
  const APP_SERVICE_NAME = 'file-manager-backend-app';
  const STORAGE_ACCOUNT_NAME = ''; // Will be found
  let RESOURCE_GROUP = 'file-manager-rg';

  try {
    // Step 1: Get Cosmos DB keys
    log(colors.yellow, '📍 Step 1: Retrieving Cosmos DB credentials...');
    
    let cosmosData = null;
    try {
      const cosmosJson = runCommand(
        `az cosmosdb list --subscription "${SUBSCRIPTION_ID}" --query "[?name=='${COSMOS_ACCOUNT}']" -o json`,
        true
      );
      if (cosmosJson) {
        cosmosData = JSON.parse(cosmosJson)[0];
        RESOURCE_GROUP = cosmosData.resourceGroup;
        log(colors.green, `✓ Cosmos DB found in resource group: ${RESOURCE_GROUP}`);
      }
    } catch (e) {
      log(colors.red, `❌ Could not parse Cosmos DB data`);
    }

    // Step 2: Get Cosmos DB keys
    log(colors.yellow, '📍 Step 2: Getting Cosmos DB keys...');
    
    let COSMOS_ENDPOINT = '';
    let COSMOS_KEY = '';
    
    try {
      const keysJson = runCommand(
        `az cosmosdb keys list --name "${COSMOS_ACCOUNT}" --resource-group "${RESOURCE_GROUP}" --type keys -o json`,
        true
      );
      
      if (keysJson) {
        const keys = JSON.parse(keysJson);
        COSMOS_KEY = keys.primaryMasterKey || keys.primaryKey;
        
        // Get endpoint
        const endpointJson = runCommand(
          `az cosmosdb show --name "${COSMOS_ACCOUNT}" --resource-group "${RESOURCE_GROUP}" -o json`,
          true
        );
        
        if (endpointJson) {
          const cosmosInfo = JSON.parse(endpointJson);
          COSMOS_ENDPOINT = cosmosInfo.documentEndpoint;
        }
        
        log(colors.green, '✓ Cosmos DB credentials retrieved');
        log(colors.green, `  - Endpoint: ${COSMOS_ENDPOINT.substring(0, 50)}...`);
        log(colors.green, `  - Key: ${COSMOS_KEY.substring(0, 20)}...`);
      }
    } catch (e) {
      log(colors.red, `❌ Failed to get Cosmos DB keys: ${e.message}`);
    }

    // Step 3: Get Storage Account connection string
    log(colors.yellow, '\n📍 Step 3: Retrieving Storage Account credentials...');
    
    let STORAGE_CONNECTION_STRING = '';
    
    try {
      // Find storage accounts
      const storageJson = runCommand(
        `az storage account list --resource-group "${RESOURCE_GROUP}" -o json`,
        true
      );
      
      if (storageJson) {
        const storageAccounts = JSON.parse(storageJson);
        if (storageAccounts.length > 0) {
          const storageAccount = storageAccounts[0];
          const storageName = storageAccount.name;
          
          // Get connection string
          const connStrJson = runCommand(
            `az storage account show-connection-string --name "${storageName}" --resource-group "${RESOURCE_GROUP}" -o json`,
            true
          );
          
          if (connStrJson) {
            const connInfo = JSON.parse(connStrJson);
            STORAGE_CONNECTION_STRING = connInfo.connectionString;
            log(colors.green, '✓ Storage Account credentials retrieved');
            log(colors.green, `  - Storage: ${storageName}`);
            log(colors.green, `  - Connection String: ${STORAGE_CONNECTION_STRING.substring(0, 50)}...`);
          }
        }
      }
    } catch (e) {
      log(colors.red, `❌ Failed to get Storage Account: ${e.message}`);
    }

    // Step 4: Set environment variables in App Service
    if (COSMOS_ENDPOINT && COSMOS_KEY && STORAGE_CONNECTION_STRING) {
      log(colors.yellow, '\n📍 Step 4: Setting environment variables in App Service...');
      
      const settings = [
        `COSMOS_ENDPOINT="${COSMOS_ENDPOINT}"`,
        `COSMOS_KEY="${COSMOS_KEY}"`,
        `AZURE_STORAGE_CONNECTION_STRING="${STORAGE_CONNECTION_STRING}"`,
        `CONTAINER_NAME="files"`,
        `COSMOS_DB_NAME="file-notes-db"`,
        `COSMOS_CONTAINER_NAME="files"`
      ].join(' ');
      
      try {
        runCommand(
          `az webapp config appsettings set --resource-group "${RESOURCE_GROUP}" --name "${APP_SERVICE_NAME}" --settings ${settings}`,
          false
        );
        log(colors.green, '✓ Environment variables set');
      } catch (e) {
        log(colors.red, `❌ Failed to set environment variables: ${e.message}`);
      }

      // Step 5: Restart App Service
      log(colors.yellow, '\n📍 Step 5: Restarting App Service...');
      
      try {
        runCommand(
          `az webapp restart --resource-group "${RESOURCE_GROUP}" --name "${APP_SERVICE_NAME}"`,
          false
        );
        log(colors.green, '✓ App Service restarted');
      } catch (e) {
        log(colors.red, `❌ Failed to restart App Service: ${e.message}`);
      }

      // Step 6: Wait for restart
      log(colors.yellow, '\n📍 Step 6: Waiting for app to fully restart (60 seconds)...');
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        process.stdout.write(`\r⏳ ${progress}s elapsed...`);
        if (progress >= 60) {
          clearInterval(interval);
          console.log('\n');
        }
      }, 5000);
      
      await new Promise(resolve => setTimeout(resolve, 60000));

      // Step 7: Verify setup
      log(colors.yellow, '📍 Step 7: Verifying setup...');
      
      try {
        const response = await fetch(
          'https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics'
        );
        const data = await response.json();
        
        if (data.environment) {
          const allSet = Object.values(data.environment).every(v => v === '✓');
          if (allSet) {
            log(colors.green, '✅ ALL ENVIRONMENT VARIABLES ARE SET!');
            log(colors.green, '\nVerification Details:');
            Object.entries(data.environment).forEach(([key, val]) => {
              log(colors.green, `  ✓ ${key}: ${val}`);
            });
            log(colors.green, '\n✅ SETUP COMPLETE! You can now upload files! 🚀');
          } else {
            log(colors.red, '❌ Some environment variables are not set');
            log(colors.red, JSON.stringify(data.environment, null, 2));
          }
        }
      } catch (e) {
        log(colors.red, `⚠️  Could not verify setup: ${e.message}`);
        log(colors.yellow, 'But settings have been applied. Wait 1-2 more minutes and check:');
        log(colors.cyan, 'https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics');
      }
    } else {
      log(colors.red, '\n❌ Could not retrieve all credentials. Aborting setup.');
      log(colors.yellow, 'Please check:');
      log(colors.yellow, `  - Cosmos DB Account: ${COSMOS_ACCOUNT}`);
      log(colors.yellow, `  - Resource Group: ${RESOURCE_GROUP}`);
      log(colors.yellow, `  - Storage Account exists in resource group`);
    }

  } catch (error) {
    log(colors.red, `\n❌ Setup failed: ${error.message}`);
    log(colors.red, error.stack);
  }

  log(colors.cyan, '\n═══════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  log(colors.red, `Fatal error: ${err.message}`);
  process.exit(1);
});
