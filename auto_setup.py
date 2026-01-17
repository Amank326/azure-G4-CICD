#!/usr/bin/env python3
"""
🤖 Fully Automated Azure Setup Script
Automatically configures all environment variables and restarts the app
"""

import subprocess
import json
import time
import sys
from urllib.request import urlopen
from urllib.error import URLError

class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_header(msg):
    print(f"{Colors.CYAN}{'='*60}{Colors.RESET}")
    print(f"{Colors.CYAN}  {msg}{Colors.RESET}")
    print(f"{Colors.CYAN}{'='*60}{Colors.RESET}\n")

def print_step(step, msg):
    print(f"{Colors.YELLOW}📍 Step {step}: {msg}{Colors.RESET}")

def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"{Colors.RED}❌ {msg}{Colors.RESET}")

def run_command(cmd, silent=False):
    """Run Azure CLI command and return output"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode != 0:
            if not silent:
                print_error(f"Command failed: {cmd}")
                print_error(result.stderr)
            return None
        return result.stdout.strip()
    except Exception as e:
        if not silent:
            print_error(f"Error running command: {e}")
        return None

def main():
    print_header("🤖 AUTOMATED AZURE FILE MANAGER SETUP")
    
    # Configuration
    SUBSCRIPTION_ID = "ce176ab4-0474-47f5-bfe2-72e93937970f"
    COSMOS_ACCOUNT = "filemanagercosmos1234"
    APP_SERVICE_NAME = "file-manager-backend-app"
    RESOURCE_GROUP = "file-manager-rg"
    
    print("Starting automated setup...\n")
    
    # ========================================
    # STEP 1: Get Cosmos DB Info
    # ========================================
    print_step(1, "Retrieving Cosmos DB credentials")
    
    cosmos_info_json = run_command(
        f'az cosmosdb show --name {COSMOS_ACCOUNT} --resource-group {RESOURCE_GROUP} -o json'
    )
    
    if not cosmos_info_json:
        print_error("Could not get Cosmos DB info")
        return False
    
    try:
        cosmos_info = json.loads(cosmos_info_json)
        COSMOS_ENDPOINT = cosmos_info['documentEndpoint']
        print_success(f"Cosmos DB Endpoint: {COSMOS_ENDPOINT[:50]}...")
    except Exception as e:
        print_error(f"Could not parse Cosmos DB info: {e}")
        return False
    
    # Get Cosmos DB keys
    keys_json = run_command(
        f'az cosmosdb keys list --name {COSMOS_ACCOUNT} --resource-group {RESOURCE_GROUP} --type keys -o json'
    )
    
    if not keys_json:
        print_error("Could not get Cosmos DB keys")
        return False
    
    try:
        keys_info = json.loads(keys_json)
        COSMOS_KEY = keys_info.get('primaryMasterKey') or keys_info.get('primaryKey')
        print_success(f"Cosmos DB Key: {COSMOS_KEY[:20]}...")
    except Exception as e:
        print_error(f"Could not parse Cosmos DB keys: {e}")
        return False
    
    # ========================================
    # STEP 2: Get Storage Account Info
    # ========================================
    print_step(2, "Retrieving Storage Account credentials")
    
    storage_list_json = run_command(
        f'az storage account list --resource-group {RESOURCE_GROUP} -o json'
    )
    
    if not storage_list_json:
        print_error("Could not list Storage Accounts")
        return False
    
    try:
        storage_accounts = json.loads(storage_list_json)
        if not storage_accounts:
            print_error("No Storage Accounts found in resource group")
            return False
        
        storage_account = storage_accounts[0]
        STORAGE_NAME = storage_account['name']
        print_success(f"Storage Account: {STORAGE_NAME}")
    except Exception as e:
        print_error(f"Could not parse Storage Accounts: {e}")
        return False
    
    # Get Storage Connection String
    storage_conn_json = run_command(
        f'az storage account show-connection-string --name {STORAGE_NAME} --resource-group {RESOURCE_GROUP} -o json'
    )
    
    if not storage_conn_json:
        print_error("Could not get Storage Connection String")
        return False
    
    try:
        storage_conn_info = json.loads(storage_conn_json)
        STORAGE_CONNECTION_STRING = storage_conn_info['connectionString']
        print_success(f"Storage Connection String: {STORAGE_CONNECTION_STRING[:50]}...")
    except Exception as e:
        print_error(f"Could not parse Storage Connection String: {e}")
        return False
    
    # ========================================
    # STEP 3: Set Environment Variables
    # ========================================
    print_step(3, "Setting environment variables in App Service")
    
    # Build the settings command
    settings_cmd = (
        f'az webapp config appsettings set '
        f'--resource-group {RESOURCE_GROUP} '
        f'--name {APP_SERVICE_NAME} '
        f'--settings '
        f'COSMOS_ENDPOINT="{COSMOS_ENDPOINT}" '
        f'COSMOS_KEY="{COSMOS_KEY}" '
        f'AZURE_STORAGE_CONNECTION_STRING="{STORAGE_CONNECTION_STRING}" '
        f'CONTAINER_NAME="files" '
        f'COSMOS_DB_NAME="file-notes-db" '
        f'COSMOS_CONTAINER_NAME="files"'
    )
    
    result = run_command(settings_cmd)
    if not result:
        print_error("Could not set environment variables")
        return False
    
    print_success("Environment variables set successfully")
    
    # ========================================
    # STEP 4: Restart App Service
    # ========================================
    print_step(4, "Restarting App Service")
    
    result = run_command(
        f'az webapp restart --resource-group {RESOURCE_GROUP} --name {APP_SERVICE_NAME}'
    )
    
    if not result and result is not None:
        print_error("Could not restart App Service")
        return False
    
    print_success("App Service restarting...")
    
    # ========================================
    # STEP 5: Wait and Verify
    # ========================================
    print_step(5, "Waiting for app to restart and verifying setup (60 seconds)")
    
    for i in range(0, 60, 5):
        sys.stdout.write(f"\r⏳ {i} seconds elapsed...")
        sys.stdout.flush()
        time.sleep(5)
    
    print("\r✓ Waiting complete                       ")
    print()
    
    print(f"{Colors.YELLOW}🔍 Verifying setup...{Colors.RESET}")
    
    max_attempts = 5
    for attempt in range(max_attempts):
        try:
            response = urlopen('https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics', timeout=5)
            data_json = response.read().decode('utf-8')
            data = json.loads(data_json)
            
            if 'environment' in data:
                env = data['environment']
                all_set = all(v == '✓' for v in env.values())
                
                if all_set:
                    print(f"\n{Colors.GREEN}{'='*60}{Colors.RESET}")
                    print(f"{Colors.GREEN}✅  SETUP COMPLETE! SUCCESS!{Colors.RESET}")
                    print(f"{Colors.GREEN}{'='*60}{Colors.RESET}\n")
                    
                    print(f"{Colors.GREEN}📊 Verification Results:{Colors.RESET}")
                    for key, val in env.items():
                        print(f"  ✓ {key}: {val}")
                    
                    print(f"\n{Colors.GREEN}🎉 Your backend is now fully configured!{Colors.RESET}")
                    print(f"{Colors.GREEN}🚀 You can now upload files without errors!{Colors.RESET}")
                    print(f"\n{Colors.CYAN}🧪 Test it:{Colors.RESET}")
                    print(f"   1. Go to: https://file-manager-frontend-app.azurewebsites.net")
                    print(f"   2. Select a file and upload")
                    print(f"   3. File should upload successfully! ✅\n")
                    
                    print(f"{Colors.CYAN}{'='*60}{Colors.RESET}\n")
                    return True
        except Exception as e:
            if attempt < max_attempts - 1:
                print(f"⏳ Checking again... (Attempt {attempt+1}/{max_attempts})")
                time.sleep(10)
    
    print(f"\n{Colors.YELLOW}⚠️  Could not fully verify setup, but settings have been applied!{Colors.RESET}")
    print(f"{Colors.YELLOW}⏳ Wait 2-3 more minutes and check manually:{Colors.RESET}")
    print(f"{Colors.CYAN}   https://file-manager-backend-app.azurewebsites.net/api/files/diagnostics{Colors.RESET}\n")
    
    return True

if __name__ == '__main__':
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print_error(f"Fatal error: {e}")
        sys.exit(1)
