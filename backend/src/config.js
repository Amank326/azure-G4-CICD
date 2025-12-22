/**
 * Azure Services Configuration
 * 
 * This file initializes and exports Azure Cosmos DB and Blob Storage clients.
 * It uses environment variables for credentials (no hardcoding).
 * 
 * Environment Variables Needed:
 * - COSMOS_ENDPOINT: Azure Cosmos DB endpoint URL
 * - COSMOS_KEY: Azure Cosmos DB primary key
 * - COSMOS_DB_NAME: Database name (e.g., "file-notes-db")
 * - COSMOS_CONTAINER_NAME: Container name (e.g., "files")
 * - AZURE_STORAGE_CONNECTION_STRING: Blob Storage connection string
 * - CONTAINER_NAME: Blob container name (e.g., "files")
 */

const { CosmosClient } = require("@azure/cosmos");
const { BlobServiceClient } = require("@azure/storage-blob");

// ========================================
// COSMOS DB CLIENT INITIALIZATION
// ========================================

const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
const cosmosKey = process.env.COSMOS_KEY;
const dbName = process.env.COSMOS_DB_NAME || "file-notes-db";
const containerName = process.env.COSMOS_CONTAINER_NAME || "files";

// Initialize Cosmos DB Client
const cosmosClient = new CosmosClient({
  endpoint: cosmosEndpoint,
  key: cosmosKey,
});

// Reference to database and container (don't create here, should exist)
const database = cosmosClient.database(dbName);
const container = database.container(containerName);

// ========================================
// BLOB STORAGE CLIENT INITIALIZATION
// ========================================

const blobConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobContainerName = process.env.CONTAINER_NAME || "files";

// Initialize Blob Service Client
const blobServiceClient = BlobServiceClient.fromConnectionString(
  blobConnectionString
);

// Reference to blob container
const blobContainer = blobServiceClient.getContainerClient(blobContainerName);

// ========================================
// VERIFY CONNECTIONS (Optional - for debugging)
// ========================================

async function verifyConnections() {
  try {
    console.log("Verifying Azure connections...");
    
    // Test Cosmos DB
    const { resources: databases } = await cosmosClient.databases.readAll().fetchAll();
    console.log("✅ Cosmos DB connected successfully");
    
    // Test Blob Storage
    const properties = await blobContainer.getProperties();
    console.log("✅ Blob Storage connected successfully");
    
    return true;
  } catch (error) {
    console.error("❌ Connection verification failed:", error.message);
    // Don't throw - let the app start but log the issue
  }
}

// ========================================
// EXPORTS
// ========================================

module.exports = {
  cosmosClient,
  database,
  container,
  blobServiceClient,
  blobContainer,
  verifyConnections,
};
